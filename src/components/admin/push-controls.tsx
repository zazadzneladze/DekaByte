"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff, Download } from "lucide-react";
import { toast } from "sonner";
import {
  removePushSubscription,
  savePushSubscription,
} from "@/actions/push";
import { Button } from "@/components/ui/button";

const SW_URL = "/admin/sw.js";

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

async function unregisterLegacyRootWorkers() {
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs.map(async (reg) => {
      const script = reg.active?.scriptURL || reg.installing?.scriptURL || "";
      if (script.endsWith("/sw.js") && !script.includes("/admin/")) {
        await reg.unregister();
      }
    }),
  );
}

type Props = {
  vapidPublicKey: string | null;
};

export function AdminPushControls({ vapidPublicKey }: Props) {
  const supported = pushSupported();
  const [permission, setPermission] = useState<
    NotificationPermission | "unknown"
  >(() =>
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
      if (!supported) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        await unregisterLegacyRootWorkers();
        if (vapidPublicKey) {
          const reg = await navigator.serviceWorker.register(SW_URL, {
            scope: "/admin",
          });
          const sub = await reg.pushManager.getSubscription();
          if (!cancelled) {
            setSubscribed(Boolean(sub));
            setPermission(Notification.permission);
          }
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
        await unregisterLegacyRootWorkers();
        const reg = await navigator.serviceWorker.register(SW_URL, {
          scope: "/admin",
        });
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
          err instanceof Error
            ? err.message
            : "ნოტიფიკაციების ჩართვა ვერ მოხერხდა",
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
    <div className="flex items-center gap-1">
      {deferredPrompt ? (
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          title="აპის ინსტალაცია"
          aria-label="აპის ინსტალაცია"
          onClick={() => {
            void deferredPrompt.prompt();
            setDeferredPrompt(null);
          }}
        >
          <Download />
        </Button>
      ) : null}
      {supported && vapidPublicKey ? (
        subscribed ? (
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={pending}
            title="ნოტიფიკაციების გამორთვა"
            aria-label="ნოტიფიკაციების გამორთვა"
            aria-pressed={true}
            onClick={disablePush}
          >
            <BellOff />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon-sm"
            variant={permission === "denied" ? "outline" : "secondary"}
            disabled={pending || permission === "denied"}
            title={
              permission === "denied"
                ? "ნოტიფიკაციები დაბლოკილია ბრაუზერში"
                : "ნოტიფიკაციების ჩართვა"
            }
            aria-label="ნოტიფიკაციების ჩართვა"
            aria-pressed={false}
            onClick={enablePush}
          >
            <Bell />
          </Button>
        )
      ) : null}
    </div>
  );
}
