import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactForm } from "@/app/(public)/contact/contact-form";
import { MetaViewEvent, TrackedAnchor } from "@/lib/meta-pixel";
import {
  getPublicSiteSettings,
} from "@/db/queries";
import { mailtoHref, telHref, whatsappHref } from "@/config/site";

export const metadata: Metadata = {
  title: "კონტაქტი",
  description:
    "დაგვიკავშირდით პროექტის განსახილველად — DekaByte კონტაქტის ფორმა.",
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  const tel = telHref(settings.phoneE164);
  const wa = whatsappHref();
  const mail = mailtoHref(settings.email);

  return (
    <div
      data-hide-mobile-contact
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <MetaViewEvent event="contact_view" params={{ page: "contact" }} />

      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          კონტაქტი
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          მოკლედ აღწერეთ პროექტი — შეტყობინება ინახება ჩვენს სისტემაში და
          მალე დაგიკავშირდებით.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <Suspense
          fallback={
            <p className="text-muted-foreground">ფორმა იტვირთება…</p>
          }
        >
          <ContactForm />
        </Suspense>

        <aside className="flex flex-col gap-6 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div>
            <h2 className="text-sm font-semibold text-foreground">ტელეფონი</h2>
            <TrackedAnchor
              href={tel}
              event="phone_click"
              className="mt-2 inline-block text-muted-foreground transition-colors hover:text-foreground"
            >
              {settings.phoneDisplay}
            </TrackedAnchor>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">WhatsApp</h2>
            <TrackedAnchor
              href={wa}
              event="whatsapp_click"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-muted-foreground transition-colors hover:text-foreground"
            >
              WhatsApp-ში მოწერა
            </TrackedAnchor>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">ელფოსტა</h2>
            <a
              href={mail}
              className="mt-2 inline-block text-muted-foreground transition-colors hover:text-foreground"
            >
              {settings.email}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
