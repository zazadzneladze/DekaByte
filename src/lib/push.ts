import "server-only";
import webpush from "web-push";
import {
  deletePushSubscriptionByEndpoint,
  listPushSubscriptions,
} from "@/db/queries";

function vapidConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT,
  );
}

function configureWebPush() {
  if (!vapidConfigured()) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  return true;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendAdminPush(payload: PushPayload) {
  if (!configureWebPush()) return { sent: 0, skipped: true as const };

  const subs = await listPushSubscriptions();
  if (subs.length === 0) return { sent: 0, skipped: false as const };

  let sent = 0;
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
        sent += 1;
      } catch (error) {
        const status =
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          typeof (error as { statusCode?: unknown }).statusCode === "number"
            ? (error as { statusCode: number }).statusCode
            : null;
        if (status === 404 || status === 410) {
          await deletePushSubscriptionByEndpoint(sub.endpoint);
        } else {
          console.error("[push] send failed", error);
        }
      }
    }),
  );

  return { sent, skipped: false as const };
}

export function isWebPushConfigured() {
  return vapidConfigured();
}
