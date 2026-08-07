import "server-only";
import webpush from "web-push";
import {
  deleteClientPushSubscriptionByEndpoint,
  deletePushSubscriptionByEndpoint,
  listClientPushSubscriptions,
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
  /** Groups/replaces related notifications in the OS tray */
  tag?: string;
};

/** One-line preview for push bodies (OS truncates aggressively). */
export function pushPreview(text: string, max = 96) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, Math.max(1, max - 1))}…`;
}

async function deliverPush(
  subs: { endpoint: string; p256dh: string; auth: string }[],
  payload: PushPayload,
  onStale: (endpoint: string) => Promise<void>,
) {
  if (!configureWebPush()) return { sent: 0, skipped: true as const };
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
          await onStale(sub.endpoint);
        } else {
          console.error("[push] send failed", error);
        }
      }
    }),
  );

  return { sent, skipped: false as const };
}

export async function sendAdminPush(payload: PushPayload) {
  const subs = await listPushSubscriptions();
  return deliverPush(subs, payload, deletePushSubscriptionByEndpoint);
}

export async function sendClientPush(
  clientUserId: string,
  payload: PushPayload,
) {
  const subs = await listClientPushSubscriptions(clientUserId);
  return deliverPush(subs, payload, deleteClientPushSubscriptionByEndpoint);
}

export async function notifyClientUserPush(
  clientUserId: string | null | undefined,
  payload: PushPayload,
) {
  if (!clientUserId) return { sent: 0, skipped: true as const };
  return sendClientPush(clientUserId, payload);
}

export function isWebPushConfigured() {
  return vapidConfigured();
}
