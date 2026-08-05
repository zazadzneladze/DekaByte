import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProjectGallery } from "@/components/public/project-gallery";
import { MacBrowserFrame } from "@/components/public/mac-browser-frame";
import { SectionLabel } from "@/components/public/section-label";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/config/categories";
import {
  whatsappHref,
  whatsappProjectMessage,
} from "@/config/site";
import {
  getAdjacentPublishedProjects,
  getPublishedProjectBySlug,
  getPublishedProjects,
  getRelatedPublishedProjects,
} from "@/db/queries";
import { MetaViewEvent, TrackedAnchor } from "@/lib/meta-pixel";
import { JsonLdScript, projectJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  if (projects.length === 0) {
    return [{ slug: "__preview__" }];
  }
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return { title: "პროექტი ვერ მოიძებნა" };
  }

  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.shortDescription,
    openGraph: {
      title: project.seoTitle || project.title,
      description: project.seoDescription || project.shortDescription,
      ...(project.coverImageUrl
        ? { images: [{ url: project.coverImageUrl }] }
        : {}),
    },
  };
}

async function ProjectDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = await getAdjacentPublishedProjects(slug);
  const related = await getRelatedPublishedProjects(
    slug,
    project.category,
    3,
  );
  const cover = project.coverImageUrl;
  const gallery = project.images;
  const wa = whatsappHref(whatsappProjectMessage(project.title));

  return (
    <article className="pb-20 lg:pb-28">
      <JsonLdScript
        data={projectJsonLd({
          title: project.title,
          shortDescription: project.shortDescription,
          slug: project.slug,
          coverImageUrl: project.coverImageUrl,
        })}
      />
      <MetaViewEvent
        event="project_view"
        params={{
          content_name: project.slug,
          content_category: project.category,
        }}
      />

      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-electric uppercase">
            {categoryLabel(project.category)}
          </p>
          <h1 className="text-display mt-4 max-w-3xl text-3xl font-semibold text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {project.shortDescription}
          </p>
          {(project.liveUrl || project.externalUrl) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <Button
                  variant="outline"
                  render={
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  ცოცხალი ვერსია
                </Button>
              ) : null}
              {project.externalUrl ? (
                <Button
                  variant="outline"
                  render={
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  დამატებითი ბმული
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </header>

      {cover ? (
        <div className="mx-auto max-w-6xl sm:mt-10 sm:px-6 lg:px-8">
          <MacBrowserFrame title={project.title} className="shadow-lift">
            <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
              <Image
                src={cover}
                alt={project.coverImageAlt || project.title}
                fill
                priority
                fetchPriority="high"
                className="object-cover object-top"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
            </div>
          </MacBrowserFrame>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_17rem] lg:gap-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-12">
          {project.overview ? (
            <section>
              <SectionLabel>მიმოხილვა</SectionLabel>
              <h2 className="sr-only">მიმოხილვა</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.overview}
              </p>
            </section>
          ) : null}

          {project.challenge ? (
            <section>
              <SectionLabel>გამოწვევა</SectionLabel>
              <h2 className="sr-only">გამოწვევა</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.challenge}
              </p>
            </section>
          ) : null}

          {project.solution ? (
            <section>
              <SectionLabel>გადაწყვეტა</SectionLabel>
              <h2 className="sr-only">გადაწყვეტა</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.solution}
              </p>
            </section>
          ) : null}

          {project.features.length > 0 ? (
            <section>
              <SectionLabel>ფუნქციები</SectionLabel>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                რა შედის პროდუქტში
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-l-2 border-electric/30 pl-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {gallery.length > 0 ? (
            <ProjectGallery images={gallery} projectTitle={project.title} />
          ) : null}
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
          {project.technologies.length > 0 ? (
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
                ტექნოლოგიები
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-2xl bg-ink px-5 py-6 text-surface">
            <h2 className="text-lg font-semibold tracking-tight">
              მსგავსი პროექტი გჭირდება?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              მოგვწერეთ — განვიხილავთ მოთხოვნებს და შემდეგ ნაბიჯებს.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button
                className="w-full bg-surface text-ink hover:bg-surface/90"
                render={<Link href="/contact" />}
              >
                პროექტის დაწყება
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/25 bg-transparent text-surface hover:bg-white/10 hover:text-surface"
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
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mx-auto max-w-6xl border-t border-border px-4 py-14 sm:px-6 lg:px-8">
          <SectionLabel>მსგავსი</SectionLabel>
          <h2 className="text-display mb-8 text-2xl font-semibold text-foreground sm:text-3xl">
            იგივე მიმართულება
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => {
              const img =
                item.coverImageUrl ?? item.images[0]?.url ?? null;
              const alt =
                item.coverImageAlt || item.images[0]?.alt || item.title;
              return (
                <li key={item.id}>
                  <Link
                    href={`/work/${item.slug}`}
                    className="group flex flex-col gap-3"
                  >
                    <MacBrowserFrame title={item.title}>
                      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                        {img ? (
                          <Image
                            src={img}
                            alt={alt}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        ) : null}
                      </div>
                    </MacBrowserFrame>
                    <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-electric uppercase">
                      {categoryLabel(item.category)}
                    </p>
                    <h3 className="font-semibold tracking-tight text-foreground group-hover:text-electric">
                      {item.title}
                    </h3>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <nav
        aria-label="მეზობელი პროექტები"
        className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-border px-4 pt-10 pb-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8"
      >
        {prev ? (
          <Link
            href={`/work/${prev.slug}`}
            className="group max-w-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="block text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
              წინა
            </span>
            <span className="mt-1 block text-base font-medium text-foreground group-hover:text-electric">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="group max-w-sm text-right text-sm text-muted-foreground transition-colors hover:text-foreground sm:ml-auto"
          >
            <span className="block text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
              შემდეგი
            </span>
            <span className="mt-1 block text-base font-medium text-foreground group-hover:text-electric">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}

export default function ProjectDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">
          იტვირთება…
        </div>
      }
    >
      <ProjectDetailContent {...props} />
    </Suspense>
  );
}
