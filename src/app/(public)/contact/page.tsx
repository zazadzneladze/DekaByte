import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactForm } from "@/app/(public)/contact/contact-form";
import { SectionLabel } from "@/components/public/section-label";
import { MetaViewEvent, TrackedAnchor } from "@/lib/meta-pixel";
import { getPublicSiteSettings } from "@/db/queries";
import {
  mailtoHref,
  telHref,
  whatsappDefaultMessage,
  whatsappHref,
} from "@/config/site";

export const metadata: Metadata = {
  title: "კონტაქტი",
  description:
    "დაგვიკავშირდით პროექტის განსახილველად — DekaByte კონტაქტის ფორმა.",
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  const tel = telHref(settings.phoneE164);
  const wa = whatsappHref(whatsappDefaultMessage);
  const mail = mailtoHref(settings.email);

  return (
    <div
      data-hide-mobile-contact
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <MetaViewEvent event="contact_view" params={{ page: "contact" }} />

      <div className="mb-12 max-w-2xl">
        <SectionLabel>დაგვიკავშირდით</SectionLabel>
        <h1 className="text-display text-3xl font-semibold text-foreground sm:text-5xl">
          კონტაქტი
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          მოკლედ აღწერეთ პროექტი — შეტყობინება ინახება ჩვენს სისტემაში და მალე
          დაგიკავშირდებით.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <Suspense
          fallback={<p className="text-muted-foreground">ფორმა იტვირთება…</p>}
        >
          <ContactForm />
        </Suspense>

        <aside className="flex flex-col gap-8 rounded-2xl bg-ink px-6 py-8 text-surface lg:self-start">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              ტელეფონი
            </p>
            <TrackedAnchor
              href={tel}
              event="phone_click"
              className="mt-2 inline-block text-lg text-surface transition-opacity hover:opacity-80"
            >
              {settings.phoneDisplay}
            </TrackedAnchor>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              WhatsApp
            </p>
            <TrackedAnchor
              href={wa}
              event="whatsapp_click"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-surface transition-opacity hover:opacity-80"
            >
              WhatsApp-ში მოწერა
            </TrackedAnchor>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              ელფოსტა
            </p>
            <a
              href={mail}
              className="mt-2 inline-block break-all text-surface transition-opacity hover:opacity-80"
            >
              {settings.email}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
