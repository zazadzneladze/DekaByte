"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { userIsAdmin } from "@/lib/session";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { LEAD_STATUSES, type LeadStatus } from "@/config/categories";

export type LeadActionResult =
  | { ok: true }
  | { ok: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || !userIsAdmin(session.user)) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<LeadActionResult> {
  await requireAdmin();

  if (!LEAD_STATUSES.includes(status)) {
    return { ok: false, error: "არასწორი სტატუსი" };
  }

  const db = getDb();
  const existing = await db.query.leads.findFirst({
    where: eq(leads.id, id),
    columns: { id: true },
  });

  if (!existing) {
    return { ok: false, error: "ლიდი ვერ მოიძებნა" };
  }

  await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, id));

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");

  return { ok: true };
}
