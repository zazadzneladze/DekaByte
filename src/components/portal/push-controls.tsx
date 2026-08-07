"use client";

import {
  removeClientPushSubscription,
  saveClientPushSubscription,
} from "@/actions/portal-push";
import { WebPushControls } from "@/components/shared/web-push-controls";

type Props = {
  vapidPublicKey: string | null;
};

export function PortalPushControls({ vapidPublicKey }: Props) {
  return (
    <WebPushControls
      vapidPublicKey={vapidPublicKey}
      swUrl="/portal/sw.js"
      scope="/portal/"
      showEnableBanner
      onSave={async (payload) => {
        const result = await saveClientPushSubscription(payload);
        return result.ok
          ? { ok: true }
          : { ok: false, error: result.error };
      }}
      onRemove={async (endpoint) => {
        const result = await removeClientPushSubscription(endpoint);
        return result.ok
          ? { ok: true }
          : { ok: false, error: result.error };
      }}
    />
  );
}
