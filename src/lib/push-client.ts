/** Client-side Web Push helpers (no server imports). */

export function urlBase64ToUint8Array(base64String: string) {
  const trimmed = base64String.trim();
  const padding = "=".repeat((4 - (trimmed.length % 4)) % 4);
  const base64 = (trimmed + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function isBraveLike() {
  const nav = navigator as Navigator & {
    brave?: { isBrave?: () => Promise<boolean> };
  };
  return Boolean(nav.brave) || /Brave/i.test(navigator.userAgent);
}

export function pushErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const lower = raw.toLowerCase();
  if (
    lower.includes("push service") ||
    lower.includes("push server") ||
    (err instanceof DOMException && err.name === "AbortError")
  ) {
    if (isBraveLike()) {
      return "Brave-ში ჩართე: Settings → Privacy → Use Google services for push messaging";
    }
    return "ბრაუზერის push სერვისი ვერ მუშაობს. სცადე Chrome/Edge, ან განაახლე ნებართვა საიტისთვის";
  }
  if (lower.includes("permission")) {
    return "ნებართვა უარყოფილია";
  }
  return raw || "ნოტიფიკაციების ჩართვა ვერ მოხერხდა";
}

export async function waitForActiveWorker(reg: ServiceWorkerRegistration) {
  if (reg.active) return reg;
  const worker = reg.installing || reg.waiting;
  if (!worker) {
    return navigator.serviceWorker.ready;
  }
  await new Promise<void>((resolve, reject) => {
    const onState = () => {
      if (worker.state === "activated") {
        worker.removeEventListener("statechange", onState);
        resolve();
      } else if (worker.state === "redundant") {
        worker.removeEventListener("statechange", onState);
        reject(new Error("Service worker ვერ გააქტიურდა"));
      }
    };
    worker.addEventListener("statechange", onState);
    onState();
  });
  return reg;
}

export async function unregisterLegacyRootWorkers() {
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

export async function subscribePush(
  reg: ServiceWorkerRegistration,
  vapidPublicKey: string,
) {
  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    try {
      await existing.unsubscribe();
    } catch {
      /* ignore stale sub */
    }
  }

  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
  try {
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  } catch (first) {
    await new Promise((r) => setTimeout(r, 400));
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    }).catch(() => {
      throw first;
    });
  }
}

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function ensurePushSubscription(
  reg: ServiceWorkerRegistration,
  vapidPublicKey: string,
): Promise<PushSubscription | null> {
  if (Notification.permission !== "granted") return null;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await subscribePush(reg, vapidPublicKey);
  }
  return sub;
}
