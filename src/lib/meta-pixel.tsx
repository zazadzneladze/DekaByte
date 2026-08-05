"use client";

import {
  useEffect,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

export const META_CONSENT_KEY = "dekabyte-consent";
export const META_CONSENT_EVENT = "dekabyte-consent-change";

export type MetaConsentValue = "granted" | "denied";

export type MetaEventName =
  | "project_view"
  | "contact_view"
  | "form_success"
  | "whatsapp_click"
  | "phone_click"
  | "estimate_complete";

/** Non-PII custom event params only. */
export type MetaEventParams = Record<
  string,
  string | number | boolean | undefined
>;

type FbqFn = ((...args: unknown[]) => void) & {
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

function getFbq(): FbqFn | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { fbq?: FbqFn }).fbq;
}

export function readMetaConsent(): MetaConsentValue | null {
  try {
    const value = localStorage.getItem(META_CONSENT_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeMetaConsent(value: MetaConsentValue) {
  try {
    localStorage.setItem(META_CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(META_CONSENT_EVENT));
}

export function subscribeMetaConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(META_CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(META_CONSENT_EVENT, onChange);
  };
}

export function hasMetaConsent(): boolean {
  return readMetaConsent() === "granted";
}

export function getMetaPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id || undefined;
}

/** Strip accidental PII-shaped keys before any Pixel call. */
function sanitizeParams(params?: MetaEventParams): Record<string, string | number | boolean> {
  if (!params) return {};
  const blocked = /email|phone|tel|name|message|ip|address|user/i;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (blocked.test(key)) continue;
    out[key] = value;
  }
  return out;
}

export function loadMetaPixel(pixelId: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { fbq?: FbqFn; _fbq?: unknown };
  if (typeof w.fbq === "function") return;

  const fbq = ((...args: unknown[]) => {
    (fbq.queue ??= []).push(args);
  }) as FbqFn;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  w.fbq = fbq;
  w._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
}

/**
 * Fire a custom Meta Pixel event only when consent is granted and a pixel ID exists.
 * Never pass PII (name, email, phone, message, IP).
 */
export function trackMetaEvent(event: MetaEventName, params?: MetaEventParams) {
  if (typeof window === "undefined") return;
  if (!hasMetaConsent()) return;
  if (!getMetaPixelId()) return;

  const fbq = getFbq();
  if (typeof fbq !== "function") return;

  fbq("trackCustom", event, sanitizeParams(params));
}

type MetaViewEventProps = {
  event: MetaEventName;
  params?: MetaEventParams;
};

/** Fires once on mount (e.g. project_view, contact_view). */
export function MetaViewEvent({ event, params }: MetaViewEventProps) {
  useEffect(() => {
    trackMetaEvent(event, params);
    // Intentionally once per mount for this event+params snapshot
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only analytics
  }, []);

  return null;
}

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: Extract<MetaEventName, "whatsapp_click" | "phone_click">;
  /** Optional when used as Button `render` — Base UI injects children. */
  children?: ReactNode;
};

export function TrackedAnchor({
  event,
  children,
  onClick,
  ...props
}: TrackedAnchorProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    trackMetaEvent(event);
    onClick?.(e);
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
