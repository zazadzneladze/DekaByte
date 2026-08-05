import { and, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { leadRateLimits } from "@/db/schema";

const MAX_ATTEMPTS_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;

/** Returns true when the hashed IP is still under the hourly lead limit. */
export async function checkLeadRateLimit(ipHash: string): Promise<boolean> {
  const db = getDb();
  const since = new Date(Date.now() - WINDOW_MS);

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(leadRateLimits)
    .where(
      and(
        eq(leadRateLimits.ipHash, ipHash),
        gte(leadRateLimits.createdAt, since),
      ),
    );

  return (row?.count ?? 0) < MAX_ATTEMPTS_PER_HOUR;
}

/** Persist a lead submission attempt for rate limiting. */
export async function recordLeadAttempt(ipHash: string): Promise<void> {
  const db = getDb();
  await db.insert(leadRateLimits).values({ ipHash });
}
