import Image from "next/image";
import Link from "next/link";

import { HeroVisual } from "@/components/public/hero-visual";
import { MacBrowserFrame } from "@/components/public/mac-browser-frame";
import { Reveal } from "@/components/public/reveal";
import { SectionLabel } from "@/components/public/section-label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/config/categories";
import {
  faqItems,
  processSteps,
  servicesContent,
  whyDekabyte,
} from "@/config/content";
import { whatsappDefaultMessage, whatsappHref } from "@/config/site";
import { getFeaturedProjects, getPublishedProjects, getPublicSiteSettings } from "@/db/queries";
import { TrackedAnchor } from "@/lib/meta-pixel";

export default async function HomePage() {
  const settings = await getPublicSiteSettings();
  let featured = await getFeaturedProjects();
  if (featured.length === 0) {
    featured = (await getPublishedProjects()).slice(0, 3);
  } else {
    featured = featured.slice(0, 3);
  }

  const wa = whatsappHref(whatsappDefaultMessage);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="hero-gradient pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black_15%,transparent_72%)] opacity-30 dark:opacity-20"
        />
        <div
          aria-hidden="true"
          className="studio-grain pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto grid min-h-[calc(100svh-var(--header-height))] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-6 lg:gap-7">
            <SectionLabel className="animate-fade-up mb-0">
              ციფრული სტუდიო
            </SectionLabel>
            <p className="animate-fade-up text-display text-hero-brand font-bold tracking-tight text-foreground">
              Deka<span className="text-electric">Byte</span>
            </p>
            <div
              aria-hidden="true"
              className="animate-fade-up h-px w-16 bg-electric/70"
            />
            <h1 className="animate-fade-up-delay max-w-xl text-hero-subhead font-semibold leading-snug text-foreground sm:text-2xl">
              ვებსაიტები, Android აპლიკაციები და ციფრული სისტემები
              ბიზნესისთვის
            </h1>
            <p className="animate-fade-up-delay-2 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              ვქმნით სწრაფ, თანამედროვე პროდუქტებს — იდეიდან დიზაინამდე,
              დეველოპმენტიდან გაშვებამდე.
            </p>
            <div className="animate-fade-up-delay-2 flex flex-wrap gap-3 pt-1">
              <Button size="lg" render={<Link href="/contact" />}>
                პროექტის დაწყება
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/work" />}
              >
                ნამუშევრების ნახვა
              </Button>
            </div>
          </div>
          <HeroVisual mode={settings.heroVisual} className="animate-fade-in" />
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>პორტფოლიო</SectionLabel>
            <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
              რჩეული ნამუშევრები
            </h2>
            <p className="mt-4 text-muted-foreground">
              რეალური პროდუქტები — არა დემო შაბლონები.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/work" />}>
            ყველა ნამუშევარი
          </Button>
        </Reveal>

        {featured.length === 0 ? (
          <p className="border-t border-border pt-6 text-muted-foreground">
            რჩეული პროექტები მალე გამოჩნდება.
          </p>
        ) : (
          <ul className="grid gap-12 lg:gap-16">
            {featured.map((project, index) => {
              const cover =
                project.coverImageUrl ?? project.images[0]?.url ?? null;
              const alt =
                project.coverImageAlt ||
                project.images[0]?.alt ||
                project.title;
              const isLead = index === 0;

              return (
                <Reveal as="li" key={project.id} delayMs={index * 60}>
                  <Link
                    href={`/work/${project.slug}`}
                    className={
                      isLead
                        ? "group grid gap-7 lg:grid-cols-[1.4fr_1fr] lg:gap-12"
                        : "group grid gap-5 sm:grid-cols-[15rem_1fr] sm:gap-8"
                    }
                  >
                    <MacBrowserFrame title={project.title}>
                      <div
                        className={
                          isLead
                            ? "relative aspect-[16/10] overflow-hidden bg-secondary"
                            : "relative aspect-[4/3] overflow-hidden bg-secondary sm:aspect-[5/4]"
                        }
                      >
                        {cover ? (
                          <Image
                            src={cover}
                            alt={alt}
                            fill
                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            sizes={
                              isLead
                                ? "(max-width: 1024px) 100vw, 58vw"
                                : "(max-width: 640px) 100vw, 15rem"
                            }
                            priority={isLead}
                            fetchPriority={isLead ? "high" : undefined}
                          />
                        ) : null}
                      </div>
                    </MacBrowserFrame>
                    <div className="flex flex-col justify-center gap-3">
                      <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-electric uppercase">
                        {categoryLabel(project.category)}
                      </p>
                      <h3
                        className={
                          isLead
                            ? "text-display text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl"
                            : "text-xl font-semibold tracking-tight text-foreground"
                        }
                      >
                        {project.title}
                      </h3>
                      <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {project.shortDescription}
                      </p>
                      <span className="mt-1 text-sm font-medium text-foreground transition-colors group-hover:text-electric">
                        დეტალურად →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        )}
      </section>

      {/* Services */}
      <section className="section-band">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="mb-12 max-w-2xl">
            <SectionLabel>რას ვაკეთებთ</SectionLabel>
            <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
              მომსახურებები
            </h2>
            <p className="mt-4 text-muted-foreground">
              პროდუქტები, რომლებიც ემსახურება ბიზნეს პროცესს — არა დეკორაციას.
            </p>
          </Reveal>
          <ul className="grid gap-10 sm:grid-cols-2">
            {servicesContent.map((service, i) => (
              <Reveal as="li" key={service.id} delayMs={i * 50} className="border-t border-border pt-6">
                <p className="mb-3 font-mono text-xs tracking-wider text-electric/80">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10">
            <Button variant="outline" render={<Link href="/services" />}>
              ყველა მომსახურება
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Budget teaser */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="flex flex-col gap-6 rounded-2xl bg-secondary/70 px-6 py-10 ring-1 ring-border/50 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="max-w-xl">
            <SectionLabel>ბიუჯეტი</SectionLabel>
            <h2 className="text-display text-2xl font-semibold text-foreground sm:text-3xl">
              გაიგე პროექტის საწყისი ბიუჯეტი
            </h2>
            <p className="mt-3 text-muted-foreground">
              სწრაფი კალკულატორი საწყისი შეფასებისთვის — საბოლოო ღირებულება
              ზუსტდება განხილვის შემდეგ.
            </p>
          </div>
          <Button size="lg" render={<Link href="/estimate" />}>
            ბიუჯეტის დათვლა
          </Button>
        </Reveal>
      </section>

      {/* Work process */}
      <section className="section-band">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="mb-12 max-w-2xl">
            <SectionLabel>პროცესი</SectionLabel>
            <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
              როგორ ვმუშაობთ
            </h2>
            <p className="mt-4 text-muted-foreground">
              გამჭვირვალე გზა იდეიდან გაშვებამდე.
            </p>
          </Reveal>
          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((step, index) => (
              <Reveal as="li" key={step.title} delayMs={index * 70} className="relative flex flex-col gap-3">
                <span className="font-mono text-sm font-medium text-electric">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10">
            <Button variant="outline" render={<Link href="/about" />}>
              მეტი სტუდიოს შესახებ
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Why DEKABYTE */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mb-12 max-w-2xl">
          <SectionLabel>განსხვავება</SectionLabel>
          <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
            რატომ DekaByte
          </h2>
          <p className="mt-4 text-muted-foreground">
            ინდივიდუალური მიდგომა და გამართული ციფრული პროდუქტები.
          </p>
        </Reveal>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {whyDekabyte.map((item, i) => (
            <Reveal as="li" key={item.title} delayMs={i * 50} className="border-t border-border pt-6">
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

      {/* FAQ */}
      <section className="section-band">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="mb-10 max-w-2xl">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-display text-3xl font-semibold text-foreground sm:text-4xl">
              ხშირად დასმული კითხვები
            </h2>
            <p className="mt-4 text-muted-foreground">
              მოკლე პასუხები პროცესზე, ვადებსა და მხარდაჭერაზე.
            </p>
          </Reveal>
          <Reveal>
            <Accordion>
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA — dark studio band */}
      <section className="relative overflow-hidden cta-band">
        <div
          aria-hidden="true"
          className="cta-band-glow pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-24">
          <Reveal className="max-w-xl">
            <h2 className="text-display text-3xl font-semibold sm:text-4xl">
              გაქვს პროექტის იდეა?
            </h2>
            <p className="mt-3 text-ink-muted">
              მოგვწერეთ მოკლე აღწერა — ერთად განვსაზღვრავთ შემდეგ ნაბიჯებს.
            </p>
          </Reveal>
          <Reveal className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="cta-band-button"
              render={<Link href="/contact" />}
            >
              პროექტის დაწყება
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
              WhatsApp-ში მოწერა
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
