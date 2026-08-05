import type { Metadata } from "next";
import { Suspense } from "react";

import {
  WorkFilters,
  type WorkListItem,
} from "@/app/(public)/work/work-filters";
import { SectionLabel } from "@/components/public/section-label";
import { getPublishedProjects } from "@/db/queries";

export const metadata: Metadata = {
  title: "ნამუშევრები",
  description:
    "DekaByte-ის გამოქვეყნებული პროექტები — ვებსაიტები, Web Applications, Android და UI/UX.",
};

export default async function WorkPage() {
  const rows = await getPublishedProjects();
  const projects: WorkListItem[] = rows.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    shortDescription: p.shortDescription,
    coverImageUrl: p.coverImageUrl,
    coverImageAlt: p.coverImageAlt,
    imageUrl: p.images[0]?.url ?? null,
    imageAlt: p.images[0]?.alt ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-12 max-w-2xl">
        <SectionLabel>პორტფოლიო</SectionLabel>
        <h1 className="text-display text-3xl font-semibold text-foreground sm:text-5xl">
          ნამუშევრები
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          შერჩეული ციფრული პროდუქტები — კატეგორიით გაფილტვრით.
        </p>
      </div>

      <Suspense fallback={<p className="text-muted-foreground">იტვირთება…</p>}>
        <WorkFilters projects={projects} />
      </Suspense>
    </div>
  );
}
