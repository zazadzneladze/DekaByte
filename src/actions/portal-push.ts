"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { clientPushSubscriptions } from "@/db/schema";
import { requireClientSession } from "@/lib/session";
import { isWebPushConfigured } from "@/lib/push";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type PortalPushActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveClientPushSubscription(
  raw: unknown,
): Promise<PortalPushActionResult> {
  const user = await requireClientSession();
  if (!isWebPushConfigured()) {
    return { ok: false, error: "Web Push არ არის კონფიგურირებული" };
  }

  const parsed = subscriptionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "არასწორი subscription" };
  }

  const db = getDb();
  const existing = await db.query.clientPushSubscriptions.findFirst({
    where: eq(clientPushSubscriptions.endpoint, parsed.data.endpoint),
  });

  if (existing) {
    await db
      .update(clientPushSubscriptions)
      .set({
        clientUserId: user.id,
        p256dh: parsed.data.keys.p256dh,
        auth: parsed.data.keys.auth,
      })
      .where(eq(clientPushSubscriptions.id, existing.id));
  } else {
    await db.insert(clientPushSubscriptions).values({
      clientUserId: user.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
    });
  }

  return { ok: true };
}

export async function removeClientPushSubscription(
  endpoint: string,
): Promise<PortalPushActionResult> {
  await requireClientSession();
  const db = getDb();
  await db
    .delete(clientPushSubscriptions)
    .where(eq(clientPushSubscriptions.endpoint, endpoint));
  return { ok: true };
}
