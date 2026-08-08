"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { MailIcon, MessageCircleIcon, PhoneIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mailtoHref, telHref, whatsappDefaultMessage, whatsappHref } from "@/config/site";
import { trackMetaEvent } from "@/lib/meta-pixel";

const DISMISS_KEY = "dekabyte-mobile-contact-dismissed";
const DISMISS_EVENT = "dekabyte-mobile-contact";

function subscribeDismiss(onChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onChange);
  return () => window.removeEventListener(DISMISS_EVENT, onChange);
}

function getDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export type MobileContactBarSettings = {
  phoneE164: string;
  email: string;
};

type MobileContactBarProps = {
  settings: MobileContactBarSettings;
};

export function MobileContactBar({ settings }: MobileContactBarProps) {
  const pathname = usePathname();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const dismissed = useSyncExternalStore(
    subscribeDismiss,
    getDismissed,
    () => true,
  );
  const [hiddenByPage, setHiddenByPage] = useState(false);

  useEffect(() => {
    const check = () => {
      setHiddenByPage(
        Boolean(document.querySelector("[data-hide-mobile-contact]")),
      );
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-hide-mobile-contact"],
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [pathname]);

  const onAdmin = pathname.startsWith("/admin");
  if (!isClient || onAdmin || dismissed || hiddenByPage) return null;

  const tel = telHref(settings.phoneE164);
  const mail = mailtoHref(settings.email);
  const wa = whatsappHref(whatsappDefaultMessage);

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-30 md:hidden"
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="pointer-events-auto mx-auto flex w-[min(22rem,calc(100%-1.5rem))] items-center gap-1 rounded-xl border border-border bg-card/95 p-1.5 shadow-lift backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          className="touch-target flex-1"
          render={
            <a
              href={tel}
              aria-label="დარეკვა"
              onClick={() => trackMetaEvent("phone_click")}
            />
          }
        >
          <PhoneIcon aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="touch-target flex-1"
          render={
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              onClick={() => trackMetaEvent("whatsapp_click")}
            />
          }
        >
          <MessageCircleIcon aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="touch-target flex-1"
          render={<a href={mail} aria-label="ელფოსტა" />}
        >
          <MailIcon aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="touch-target"
          aria-label="დახურვა"
          onClick={dismiss}
        >
          <XIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
