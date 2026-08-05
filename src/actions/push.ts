"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { requireAdminSession } from "@/lib/session";
import { isWebPushConfigured } from "@/lib/push";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type PushActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function savePushSubscription(
  raw: unknown,
): Promise<PushActionResult> {
  const admin = await requireAdminSession();
  if (!isWebPushConfigured()) {
    return { ok: false, error: "Web Push არ არის კონფიგურირებული" };
  }

  const parsed = subscriptionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "არასწორი subscription" };
  }

  const db = getDb();
  const existing = await db.query.pushSubscriptions.findFirst({
    where: eq(pushSubscriptions.endpoint, parsed.data.endpoint),
  });

  if (existing) {
    await db
      .update(pushSubscriptions)
      .set({
        adminUserId: admin.id,
        p256dh: parsed.data.keys.p256dh,
        auth: parsed.data.keys.auth,
      })
      .where(eq(pushSubscriptions.id, existing.id));
  } else {
    await db.insert(pushSubscriptions).values({
      adminUserId: admin.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
    });
  }

  return { ok: true };
}

export async function removePushSubscription(
  endpoint: string,
): Promise<PushActionResult> {
  await requireAdminSession();
  const db = getDb();
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
  return { ok: true };
}
