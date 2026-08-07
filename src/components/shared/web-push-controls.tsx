"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, Download, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ensurePushSubscription,
  pushErrorMessage,
  pushSupported,
  subscribePush,
  unregisterLegacyRootWorkers,
  waitForActiveWorker,
  type PushSubscriptionPayload,
} from "@/lib/push-client";
import { cn } from "@/lib/utils";

const PUSH_ON =
  "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400";
const PUSH_OFF =
  "border-red-500/40 bg-red-500/15 text-red-700 hover:bg-red-500/25 dark:text-red-400";

type Props = {
  vapidPublicKey: string | null;
  swUrl: string;
  scope: string;
  unregisterLegacy?: boolean;
  onSave: (payload: PushSubscriptionPayload) => Promise<{ ok: boolean; error?: string }>;
  onRemove: (endpoint: string) => Promise<{ ok: boolean; error?: string }>;
  showEnableBanner?: boolean;
};

async function registerServiceWorker(
  swUrl: string,
  scope: string,
  unregisterLegacy: boolean,
) {
  if (unregisterLegacy) {
    await unregisterLegacyRootWorkers();
  }
  const reg = await navigator.serviceWorker.register(swUrl, { scope });
  await waitForActiveWorker(reg);
  return navigator.serviceWorker.ready;
}

export function WebPushControls({
  vapidPublicKey,
  swUrl,
  scope,
  unregisterLegacy = false,
  onSave,
  onRemove,
  showEnableBanner = true,
}: Props) {
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
  const [bannerDismissed, setBannerDismissed] = useState(false);

  async function persistSubscription(
    reg: ServiceWorkerRegistration,
    vapidKey: string,
    requestPermission: boolean,
  ) {
    if (requestPermission) {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      if (permissionResult !== "granted") {
        toast.error("ნებართვა უარყოფილია");
        return false;
      }
    }

    const sub = await (requestPermission
      ? subscribePush(reg, vapidKey)
      : ensurePushSubscription(reg, vapidKey));
    if (!sub) return false;

    const json = sub.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      toast.error("ბრაუზერმა არასრული subscription დააბრუნა");
      return false;
    }

    const result = await onSave({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    });
    if (!result.ok) {
      toast.error(result.error ?? "შენახვა ვერ მოხერხდა");
      return false;
    }
    setSubscribed(true);
    return true;
  }

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
        const reg = await registerServiceWorker(swUrl, scope, unregisterLegacy);
        if (Notification.permission === "granted") {
          const synced = await persistSubscription(reg, vapidPublicKey, false);
          if (!cancelled && synced) {
            setSubscribed(true);
            setPermission("granted");
          }
        } else if (await reg.pushManager.getSubscription()) {
          if (!cancelled) setSubscribed(true);
        }
        if (!cancelled) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount sync only
  }, [supported, vapidPublicKey, swUrl, scope, unregisterLegacy]);

  function enablePush() {
    if (!vapidPublicKey) {
      toast.error("VAPID გასაღებები არ არის კონფიგურირებული");
      return;
    }
    startTransition(async () => {
      try {
        const reg = await registerServiceWorker(swUrl, scope, unregisterLegacy);
        const ok = await persistSubscription(reg, vapidPublicKey, true);
        if (ok) toast.success("ნოტიფიკაციები ჩართულია");
      } catch (err) {
        toast.error(pushErrorMessage(err));
      }
    });
  }

  function disablePush() {
    startTransition(async () => {
      try {
        const reg = await registerServiceWorker(swUrl, scope, unregisterLegacy);
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await onRemove(sub.endpoint);
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

  const showBanner =
    showEnableBanner &&
    ready &&
    supported &&
    vapidPublicKey &&
    !subscribed &&
    permission === "default" &&
    !bannerDismissed;

  return (
    <div className="flex flex-col items-end gap-2">
      {showBanner ? (
        <div className="absolute right-4 top-full z-50 mt-2 flex max-w-[min(100vw-2rem,20rem)] items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-2 text-xs shadow-md sm:relative sm:right-auto sm:top-auto sm:mt-0">
          <span className="flex-1 text-muted-foreground">
            ჩართე push — ახალი შეტყობინებები მოგივა
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() => enablePush()}
          >
            ჩართვა
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="დახურვა"
            onClick={() => setBannerDismissed(true)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : null}

      <div className="relative flex items-center gap-1">
        {!ready ? (
          <div className="size-7 shrink-0 rounded-lg bg-muted/60 animate-pulse" aria-hidden />
        ) : null}
        {ready && deferredPrompt ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
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
        {ready && supported && vapidPublicKey ? (
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={pending || permission === "denied"}
            title={
              permission === "denied"
                ? "ნოტიფიკაციები დაბლოკილია ბრაუზერში"
                : subscribed
                  ? "ნოტიფიკაციები ჩართულია — გამორთვა"
                  : "ნოტიფიკაციების ჩართვა"
            }
            aria-label={
              subscribed ? "ნოტიფიკაციების გამორთვა" : "ნოტიფიკაციების ჩართვა"
            }
            aria-pressed={subscribed}
            className={cn(subscribed ? PUSH_ON : PUSH_OFF)}
            onClick={() => (subscribed ? disablePush() : enablePush())}
          >
            <Bell className={cn("size-4", subscribed && "fill-current")} />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
