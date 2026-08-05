import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/config/categories";
import {
  getAdjacentPublishedProjects,
  getPublishedProjectBySlug,
  getPublishedProjects,
} from "@/db/queries";
import { MetaViewEvent } from "@/lib/meta-pixel";
import { JsonLdScript, projectJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  if (projects.length === 0) {
    // Cache Components require at least one param at build time.
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
  const cover = project.coverImageUrl;
  const gallery = project.images;

  return (
    <article className="pb-16 lg:pb-24">
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
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-sm font-medium text-electric">
            {categoryLabel(project.category)}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {project.shortDescription}
          </p>
          {(project.liveUrl || project.externalUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
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
        <div className="mx-auto mt-0 max-w-6xl sm:mt-8 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden bg-secondary sm:rounded-xl">
            <Image
              src={cover}
              alt={project.coverImageAlt || project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_18rem] lg:gap-16 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10">
          {project.overview ? (
            <section>
              <h2 className="text-xl font-semibold text-foreground">მიმოხილვა</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {project.overview}
              </p>
            </section>
          ) : null}

          {project.challenge ? (
            <section>
              <h2 className="text-xl font-semibold text-foreground">გამოწვევა</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {project.challenge}
              </p>
            </section>
          ) : null}

          {project.solution ? (
            <section>
              <h2 className="text-xl font-semibold text-foreground">გადაწყვეტა</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {project.solution}
              </p>
            </section>
          ) : null}

          {project.features.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-foreground">ფუნქციები</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {gallery.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-foreground">გალერეა</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {gallery.map((image) => (
                  <li key={image.id} className="flex flex-col gap-2">
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      <Image
                        src={image.url}
                        alt={image.alt || project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    {image.caption ? (
                      <p className="text-sm text-muted-foreground">
                        {image.caption}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
          {project.technologies.length > 0 ? (
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                ტექნოლოგიები
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-foreground">
              მსგავსი პროექტი გჭირდება?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              მოგვწერეთ — განვიხილავთ მოთხოვნებს და შემდეგ ნაბიჯებს.
            </p>
            <Button className="mt-4 w-full" render={<Link href="/contact" />}>
              პროექტის დაწყება
            </Button>
          </div>
        </aside>
      </div>

      <nav
        aria-label="მეზობელი პროექტები"
        className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-border px-4 pt-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8"
      >
        {prev ? (
          <Link
            href={`/work/${prev.slug}`}
            className="group max-w-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="block text-xs uppercase tracking-wide">წინა</span>
            <span className="mt-1 block font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
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
            <span className="block text-xs uppercase tracking-wide">შემდეგი</span>
            <span className="mt-1 block font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
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
