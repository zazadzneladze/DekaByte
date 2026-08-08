import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/public/reveal";
import { SectionLabel } from "@/components/public/section-label";
import { Button } from "@/components/ui/button";
import {
  aboutIntro,
  aboutPrinciples,
  processSteps,
  whyDekabyte,
} from "@/config/content";
import { whatsappDefaultMessage, whatsappHref } from "@/config/site";
import { TrackedAnchor } from "@/lib/meta-pixel";

export const metadata: Metadata = {
  title: "ჩვენს შესახებ",
  description:
    "DekaByte — ციფრული სტუდიო საქართველოში. ვებსაიტები, Web Applications, Android და UI/UX.",
};

export default function AboutPage() {
  const wa = whatsappHref(whatsappDefaultMessage);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="page-gradient pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionLabel>სტუდიო</SectionLabel>
          <h1 className="text-display max-w-3xl text-3xl font-semibold text-foreground sm:text-5xl">
            {aboutIntro.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {aboutIntro.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/contact" />}>
              პროექტის დაწყება
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/work" />}>
              ნამუშევრები
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mb-12 max-w-2xl">
          <SectionLabel>პრინციპები</SectionLabel>
          <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
            როგორ ვფიქრობთ პროდუქტზე
          </h2>
        </Reveal>
        <ul className="grid gap-10 sm:grid-cols-2">
          {aboutPrinciples.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delayMs={i * 50}
              className="border-t border-border pt-6"
            >
              <p className="mb-3 font-mono text-xs tracking-wider text-electric/80">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section-band">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="mb-12 max-w-2xl">
            <SectionLabel>პროცესი</SectionLabel>
            <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
              იდეიდან გაშვებამდე
            </h2>
            <p className="mt-4 text-muted-foreground">
              ოთხი გამჭვირვალე ეტაპი — ყოველ ჯერზე პროექტის მასშტაბზე მორგებული.
            </p>
          </Reveal>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delayMs={index * 60}
                className="flex flex-col gap-3"
              >
                <span className="font-mono text-sm font-medium text-electric">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mb-12 max-w-2xl">
          <SectionLabel>განსხვავება</SectionLabel>
          <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
            რატომ DekaByte
          </h2>
        </Reveal>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {whyDekabyte.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delayMs={i * 40}
              className="border-t border-border pt-6"
            >
              <h3 className="font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="relative overflow-hidden cta-band">
        <div
          aria-hidden
          className="cta-band-glow pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgb(37_99_235/0.22)_0%,transparent_50%)]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <h2 className="text-display text-3xl font-semibold sm:text-4xl">
              მზად ხართ შემდეგი ნაბიჯისთვის?
            </h2>
            <p className="mt-3 text-ink-muted">
              მოკლედ აღწერეთ იდეა — ერთად განვსაზღვრავთ მოცულობას, ვადას და
              ბიუჯეტს.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="cta-band-button"
              render={<Link href="/contact" />}
            >
              კონტაქტი
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-surface hover:bg-white/10 hover:text-surface"
              render={
                <TrackedAnchor
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="whatsapp_click"
                />
              }
            >
              WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-surface hover:bg-white/10 hover:text-surface"
              render={<Link href="/estimate" />}
            >
              ბიუჯეტი
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
