"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  removePushSubscription,
  savePushSubscription,
} from "@/actions/push";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

type Props = {
  vapidPublicKey: string | null;
};

export function AdminPushControls({ vapidPublicKey }: Props) {
  const supported = pushSupported();
  const [permission, setPermission] = useState<NotificationPermission | "unknown">(
    () =>
      typeof Notification !== "undefined" ? Notification.permission : "unknown",
  );
  const [subscribed, setSubscribed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [deferredPrompt, setDeferredPrompt] = useState<{
    prompt: () => Promise<void>;
  } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as { prompt: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", onBip);

    let cancelled = false;
    void (async () => {
      if (!supported || !vapidPublicKey) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        if (!cancelled) {
          setSubscribed(Boolean(sub));
          setPermission(Notification.permission);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("beforeinstallprompt", onBip);
    };
  }, [supported, vapidPublicKey]);

  function enablePush() {
    if (!vapidPublicKey) {
      toast.error("VAPID გასაღებები არ არის კონფიგურირებული");
      return;
    }
    startTransition(async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);
        if (permissionResult !== "granted") {
          toast.error("ნებართვა უარყოფილია");
          return;
        }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
        const json = sub.toJSON();
        const result = await savePushSubscription({
          endpoint: json.endpoint,
          keys: json.keys,
        });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        setSubscribed(true);
        toast.success("ნოტიფიკაციები ჩართულია");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "ნოტიფიკაციების ჩართვა ვერ მოხერხდა",
        );
      }
    });
  }

  function disablePush() {
    startTransition(async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await removePushSubscription(sub.endpoint);
          await sub.unsubscribe();
        }
        setSubscribed(false);
        toast.success("ნოტიფიკაციები გამორთულია");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "გამორთვა ვერ მოხერხდა",
        );
      }
    });
  }

  if (!ready && !deferredPrompt) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {deferredPrompt ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            void deferredPrompt.prompt();
            setDeferredPrompt(null);
          }}
        >
          აპის ინსტალაცია
        </Button>
      ) : null}
      {supported && vapidPublicKey ? (
        subscribed ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={disablePush}
          >
            ნოტიფიკაციების გამორთვა
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={pending || permission === "denied"}
            onClick={enablePush}
          >
            ნოტიფიკაციების ჩართვა
          </Button>
        )
      ) : null}
    </div>
  );
}
