import Image from "next/image";
import Link from "next/link";

import { HeroComposition } from "@/components/public/hero-composition";
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
import { whatsappHref } from "@/config/site";
import { getFeaturedProjects } from "@/db/queries";
import { TrackedAnchor } from "@/lib/meta-pixel";

export default async function HomePage() {
  const featured = await getFeaturedProjects();
  const wa = whatsappHref();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#dbeafe_0%,transparent_45%),linear-gradient(180deg,#f7f8fa_0%,#ffffff_100%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:py-20">
          <div className="animate-fade-up flex flex-col gap-6">
            <p className="text-3xl font-bold tracking-tight text-graphite sm:text-4xl lg:text-5xl">
              DekaByte
            </p>
            <h1 className="max-w-xl text-xl font-semibold leading-snug text-foreground sm:text-2xl">
              ვებსაიტები, Android აპლიკაციები და ციფრული სისტემები
              ბიზნესისთვის
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              DekaByte ქმნის სწრაფ, თანამედროვე და მომხმარებელზე მორგებულ
              ციფრულ პროდუქტებს — იდეიდან დიზაინამდე, დეველოპმენტიდან
              გაშვებამდე.
            </p>
            <div className="flex flex-wrap gap-3">
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
          <HeroComposition className="animate-fade-in" />
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              რჩეული ნამუშევრები
            </h2>
            <p className="mt-3 text-muted-foreground">
              შერჩეული პროექტები ჩვენი პორტფოლიოდან.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/work" />}>
            ყველა ნამუშევარი
          </Button>
        </div>

        {featured.length === 0 ? (
          <p className="border-t border-border pt-6 text-muted-foreground">
            რჩეული პროექტები მალე გამოჩნდება.
          </p>
        ) : (
          <ul className="grid gap-8 lg:gap-10">
            {featured.map((project, index) => {
              const cover =
                project.coverImageUrl ?? project.images[0]?.url ?? null;
              const alt =
                project.coverImageAlt ||
                project.images[0]?.alt ||
                project.title;
              const isLead = index === 0;

              return (
                <li key={project.id}>
                  <Link
                    href={`/work/${project.slug}`}
                    className={
                      isLead
                        ? "group grid gap-6 border-t border-border pt-6 lg:grid-cols-[1.35fr_1fr] lg:gap-10"
                        : "group grid gap-4 border-t border-border pt-6 sm:grid-cols-[14rem_1fr] sm:gap-6"
                    }
                  >
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
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes={
                            isLead
                              ? "(max-width: 1024px) 100vw, 60vw"
                              : "(max-width: 640px) 100vw, 14rem"
                          }
                          priority={isLead}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <p className="text-sm font-medium text-electric">
                        {categoryLabel(project.category)}
                      </p>
                      <h3
                        className={
                          isLead
                            ? "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                            : "text-xl font-semibold text-foreground"
                        }
                      >
                        {project.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {project.shortDescription}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Services */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              მომსახურებები
            </h2>
            <p className="mt-3 text-muted-foreground">
              პროდუქტები, რომლებიც ემსახურება ბიზნეს პროცესს — არა დეკორაციას.
            </p>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2">
            {servicesContent.map((service) => (
              <li key={service.id} className="border-t border-border pt-5">
                <h3 className="text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button variant="outline" render={<Link href="/services" />}>
              ყველა მომსახურება
            </Button>
          </div>
        </div>
      </section>

      {/* Budget teaser */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-5 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              გაიგე პროექტის საწყისი ბიუჯეტი
            </h2>
            <p className="mt-3 text-muted-foreground">
              სწრაფი კალკულატორი საწყისი სავარაუდო შეფასებისთვის — საბოლოო
              ღირებულება ზუსტდება დეტალური განხილვის შემდეგ.
            </p>
          </div>
          <Button size="lg" render={<Link href="/estimate" />}>
            ბიუჯეტის დათვლა
          </Button>
        </div>
      </section>

      {/* Work process */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              როგორ ვმუშაობთ
            </h2>
            <p className="mt-3 text-muted-foreground">
              გამჭვირვალე პროცესი იდეიდან გაშვებამდე.
            </p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-electric">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why DEKABYTE */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            რატომ DEKABYTE
          </h2>
          <p className="mt-3 text-muted-foreground">
            ინდივიდუალური მიდგომა და გამართული ციფრული პროდუქტები.
          </p>
        </div>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {whyDekabyte.map((item) => (
            <li key={item.title}>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              ხშირად დასმული კითხვები
            </h2>
            <p className="mt-3 text-muted-foreground">
              მოკლე პასუხები პროცესზე, ვადებსა და მხარდაჭერაზე.
            </p>
          </div>
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
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-off-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              გაქვს პროექტის იდეა?
            </h2>
            <p className="mt-2 text-muted-foreground">
              მოგვწერეთ მოკლე აღწერა — ერთად განვსაზღვრავთ შემდეგ ნაბიჯებს.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/contact" />}>
              პროექტის დაწყება
            </Button>
            <Button
              size="lg"
              variant="outline"
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
          </div>
        </div>
      </section>
    </>
  );
}
