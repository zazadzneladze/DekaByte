import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/public/section-label";
import { Button } from "@/components/ui/button";
import { servicesContent } from "@/config/content";

export const metadata: Metadata = {
  title: "მომსახურებები",
  description:
    "ვებსაიტები, Web Applications, Android აპლიკაციები და UI/UX დიზაინი — DekaByte.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-16 max-w-2xl">
        <SectionLabel>რას ვაკეთებთ</SectionLabel>
        <h1 className="text-display text-3xl font-semibold text-foreground sm:text-5xl">
          მომსახურებები
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          ვქმნით ციფრულ პროდუქტებს, რომლებიც ემსახურება კონკრეტულ ბიზნეს
          ამოცანას — იდეიდან გაშვებამდე.
        </p>
      </div>

      <ul className="flex flex-col gap-16">
        {servicesContent.map((service, index) => (
          <li
            key={service.id}
            id={service.id}
            className="scroll-mt-[calc(var(--header-height)+1rem)] border-t border-border pt-10"
          >
            <div className="grid gap-6 lg:grid-cols-[10rem_1fr] lg:gap-12">
              <p className="font-mono text-sm font-medium text-electric">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="text-display text-2xl font-semibold text-foreground sm:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {service.examples.map((example) => (
                    <li
                      key={example}
                      className="border-l-2 border-electric/30 pl-4 text-sm text-foreground"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative mt-20 overflow-hidden rounded-2xl cta-band px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 flex flex-col gap-5">
        <div aria-hidden className="cta-band-glow pointer-events-none absolute inset-0" />
        <div className="relative max-w-xl">
          <h2 className="text-display text-xl font-semibold sm:text-2xl">
            რომელი მიმართულება გჭირდებათ?
          </h2>
          <p className="mt-2 text-ink-muted">
            მოგვწერეთ მოკლედ — ან გაიგეთ საწყისი ბიუჯეტი კალკულატორით.
          </p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Button
            className="cta-band-button"
            render={<Link href="/contact" />}
          >
            პროექტის დაწყება
          </Button>
          <Button
            variant="outline"
            className="border-white/25 bg-transparent text-surface hover:bg-white/10 hover:text-surface"
            render={<Link href="/estimate" />}
          >
            ბიუჯეტის დათვლა
          </Button>
        </div>
      </div>
    </div>
  );
}
