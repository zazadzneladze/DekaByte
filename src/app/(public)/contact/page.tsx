import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactForm } from "@/app/(public)/contact/contact-form";
import { PublicPageHero } from "@/components/public/public-page-hero";
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
    <>
      <MetaViewEvent event="contact_view" params={{ page: "contact" }} />
      <div data-hide-mobile-contact>
        <PublicPageHero
          label="დაგვიკავშირდით"
          title="კონტაქტი"
          description="მოკლედ აღწერეთ პროექტი — შეტყობინება ინახება ჩვენს სისტემაში და მალე დაგიკავშირდებით."
        />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <Suspense
              fallback={
                <p className="text-muted-foreground">ფორმა იტვირთება…</p>
              }
            >
              <ContactForm />
            </Suspense>

            <aside className="cta-band flex flex-col gap-8 rounded-2xl px-6 py-8 lg:self-start">
              <div>
                <p className="text-micro font-semibold tracking-[0.14em] text-ink-muted uppercase">
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
                <p className="text-micro font-semibold tracking-[0.14em] text-ink-muted uppercase">
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
                <p className="text-micro font-semibold tracking-[0.14em] text-ink-muted uppercase">
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
      </div>
    </>
  );
}
