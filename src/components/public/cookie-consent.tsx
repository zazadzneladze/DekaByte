"use client";

import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  getMetaPixelId,
  loadMetaPixel,
  readMetaConsent,
  subscribeMetaConsent,
  writeMetaConsent,
  type MetaConsentValue,
} from "@/lib/meta-pixel";

export function CookieConsent() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const consent = useSyncExternalStore(
    subscribeMetaConsent,
    readMetaConsent,
    () => "denied" as MetaConsentValue | null,
  );

  useEffect(() => {
    if (consent !== "granted") return;
    const pixelId = getMetaPixelId();
    if (pixelId) loadMetaPixel(pixelId);
  }, [consent]);

  if (!isClient || consent !== null) return null;

  // Don't interrupt visitors when Meta Pixel is not configured yet.
  if (!getMetaPixelId()) return null;

  return (
    <div
      role="dialog"
      aria-label="ქუქიების თანხმობა"
      className="fixed inset-x-0 z-50 px-3"
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-lift sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          ვიყენებთ ანალიტიკურ ქუქიებს (Meta Pixel) საიტის გაუმჯობესებისთვის.
          შეგიძლიათ დაეთანხმოთ ან უარყოთ.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => writeMetaConsent("denied")}
          >
            უარყოფა
          </Button>
          <Button size="sm" onClick={() => writeMetaConsent("granted")}>
            თანხმობა
          </Button>
        </div>
      </div>
    </div>
  );
}
