"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  PROJECT_CATEGORIES,
  categoryLabel,
  type ProjectCategoryId,
} from "@/config/categories";
import { MacBrowserFrame } from "@/components/public/mac-browser-frame";
import { cn } from "@/lib/utils";

export type WorkListItem = {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategoryId;
  shortDescription: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
};

type WorkFiltersProps = {
  projects: WorkListItem[];
};

function isCategoryId(value: string): value is ProjectCategoryId {
  return PROJECT_CATEGORIES.some((c) => c.id === value);
}

export function WorkFilters({ projects }: WorkFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("category") ?? "all";
  const active: ProjectCategoryId | "all" =
    raw === "all" || isCategoryId(raw) ? (raw as ProjectCategoryId | "all") : "all";

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.category === active);
  }, [projects, active]);

  function setCategory(next: ProjectCategoryId | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") {
      params.delete("category");
    } else {
      params.set("category", next);
    }
    const qs = params.toString();
    router.replace(qs ? `/work?${qs}` : "/work", { scroll: false });
  }

  return (
    <div className="flex flex-col gap-12">
      <div
        role="tablist"
        aria-label="კატეგორიის ფილტრი"
        className="flex flex-wrap gap-2"
      >
        <FilterChip
          active={active === "all"}
          onClick={() => setCategory("all")}
        >
          ყველა
        </FilterChip>
        {PROJECT_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.id}
            active={active === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="border-t border-border pt-6 text-muted-foreground">
          ამ კატეგორიაში გამოქვეყნებული პროექტები ჯერ არ არის.
        </p>
      ) : (
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {filtered.map((project) => {
            const cover = project.coverImageUrl ?? project.imageUrl;
            const alt =
              project.coverImageAlt || project.imageAlt || project.title;

            return (
              <li key={project.id}>
                <Link
                  href={`/work/${project.slug}`}
                  className="group flex flex-col gap-4"
                >
                  <MacBrowserFrame title={project.title}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={alt}
                          fill
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>
                  </MacBrowserFrame>
                  <div className="flex flex-col gap-2">
                    <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-electric uppercase">
                      {categoryLabel(project.category)}
                    </p>
                    <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-electric">
                      {project.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.shortDescription}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-graphite bg-graphite text-surface"
          : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
