import Link from "next/link";

import { Logo } from "@/components/public/logo";
import { TrackedAnchor } from "@/lib/meta-pixel";
import { mailtoHref, telHref, whatsappHref } from "@/config/site";
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
  { href: "/estimate", label: "ბიუჯეტი" },
  { href: "/contact", label: "კონტაქტი" },
] as const;

export function SiteFooter({ settings, className }: SiteFooterProps) {
  const year = 2026;
  const wa = whatsappHref();
  const tel = telHref(settings.phoneE164);
  const mail = mailtoHref(settings.email);

  return (
    <footer
      className={cn("border-t border-border bg-surface", className)}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {settings.brandName} — ვებსაიტები, Web Applications, ადმინ
            სისტემები და Android აპლიკაციები.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">ნავიგაცია</p>
          <ul className="flex flex-col gap-2">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">კონტაქტი</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <TrackedAnchor
                href={tel}
                event="phone_click"
                className="text-muted-foreground transition-colors hover:text-foreground"
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
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                WhatsApp
              </TrackedAnchor>
            </li>
            <li>
              <a
                href={mail}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {settings.brandName}
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              კონფიდენციალურობა
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              პირობები
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
