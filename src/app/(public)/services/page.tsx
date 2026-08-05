import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { servicesContent } from "@/config/content";

export const metadata: Metadata = {
  title: "მომსახურებები",
  description:
    "ვებსაიტები, Web Applications, Android აპლიკაციები და UI/UX დიზაინი — DekaByte.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          მომსახურებები
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          ვქმნით ციფრულ პროდუქტებს, რომლებიც ემსახურება კონკრეტულ ბიზნეს
          ამოცანას — იდეიდან გაშვებამდე.
        </p>
      </div>

      <ul className="flex flex-col gap-14">
        {servicesContent.map((service, index) => (
          <li
            key={service.id}
            id={service.id}
            className="scroll-mt-[calc(var(--header-height)+1rem)] border-t border-border pt-8"
          >
            <div className="grid gap-6 lg:grid-cols-[12rem_1fr] lg:gap-10">
              <p className="text-sm font-medium text-electric">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {service.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {service.examples.map((example) => (
                    <li
                      key={example}
                      className="border-l-2 border-muted-blue pl-3 text-sm text-foreground"
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

      <div className="mt-16 flex flex-col gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold text-foreground">
            რომელი მიმართულება გჭირდებათ?
          </h2>
          <p className="mt-2 text-muted-foreground">
            მოგვწერეთ მოკლედ — ან გაიგეთ საწყისი ბიუჯეტი კალკულატორით.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button render={<Link href="/contact" />}>პროექტის დაწყება</Button>
          <Button variant="outline" render={<Link href="/estimate" />}>
            ბიუჯეტის დათვლა
          </Button>
        </div>
      </div>
    </div>
  );
}
