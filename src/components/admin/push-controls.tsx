"use client";

import {
  removePushSubscription,
  savePushSubscription,
} from "@/actions/push";
import { WebPushControls } from "@/components/shared/web-push-controls";

type Props = {
  vapidPublicKey: string | null;
};

export function AdminPushControls({ vapidPublicKey }: Props) {
  return (
    <WebPushControls
      vapidPublicKey={vapidPublicKey}
      swUrl="/admin/sw.js"
      scope="/admin/"
      unregisterLegacy
      showEnableBanner
      onSave={async (payload) => {
        const result = await savePushSubscription(payload);
        return result.ok
          ? { ok: true }
          : { ok: false, error: result.error };
      }}
      onRemove={async (endpoint) => {
        const result = await removePushSubscription(endpoint);
        return result.ok
          ? { ok: true }
          : { ok: false, error: result.error };
      }}
    />
  );
}
