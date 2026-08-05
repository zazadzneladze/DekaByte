import Link from "next/link";
import { LockIcon } from "lucide-react";

import { Logo } from "@/components/public/logo";
import { TrackedAnchor } from "@/lib/meta-pixel";
import { mailtoHref, telHref, whatsappDefaultMessage, whatsappHref } from "@/config/site";
import { cn } from "@/lib/utils";

export type SiteFooterSettings = {
  brandName: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  email: string;
};

type SiteFooterProps = {
  settings: SiteFooterSettings;
  className?: string;
};

const FOOTER_NAV = [
  { href: "/work", label: "ნამუშევრები" },
  { href: "/services", label: "მომსახურებები" },
  { href: "/about", label: "ჩვენს შესახებ" },
  { href: "/estimate", label: "ბიუჯეტი" },
  { href: "/contact", label: "კონტაქტი" },
] as const;

export function SiteFooter({ settings, className }: SiteFooterProps) {
  const year = 2026;
  const wa = whatsappHref(whatsappDefaultMessage);
  const tel = telHref(settings.phoneE164);
  const mail = mailtoHref(settings.email);

  return (
    <footer className={cn("bg-ink text-surface", className)}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.35fr_1fr_1fr] lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4">
          <Logo onDark />
          <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
            {settings.brandName} — ვებსაიტები, Web Applications, ადმინ
            სისტემები და Android აპლიკაციები.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-ink-muted uppercase">
            ნავიგაცია
          </p>
          <ul className="flex flex-col gap-2.5">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-surface/80 transition-colors hover:text-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-ink-muted uppercase">
            კონტაქტი
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <TrackedAnchor
                href={tel}
                event="phone_click"
                className="text-surface/80 transition-colors hover:text-surface"
              >
                {settings.phoneDisplay}
              </TrackedAnchor>
            </li>
            <li>
              <TrackedAnchor
                href={wa}
                event="whatsapp_click"
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface/80 transition-colors hover:text-surface"
              >
                WhatsApp
              </TrackedAnchor>
            </li>
            <li>
              <a
                href={mail}
                className="text-surface/80 transition-colors hover:text-surface"
              >
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {settings.brandName}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-surface">
              კონფიდენციალურობა
            </Link>
            <Link href="/terms" className="transition-colors hover:text-surface">
              პირობები
            </Link>
            <Link
              href="/portal/login"
              title="კლიენტის პანელი"
              aria-label="კლიენტის პანელი"
              className="inline-flex items-center gap-1.5 text-ink-muted/80 transition-colors hover:text-surface"
            >
              <LockIcon className="size-3.5" aria-hidden />
              <span className="sr-only sm:not-sr-only sm:inline">
                კლიენტის პანელი
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
