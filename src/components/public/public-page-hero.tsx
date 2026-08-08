import { cn } from "@/lib/utils";

type PublicPageHeroProps = {
  label: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

/** Shared marketing page header with theme-aware gradient. */
export function PublicPageHero({
  label,
  title,
  description,
  children,
  className,
}: PublicPageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="page-gradient pointer-events-none absolute inset-0"
      />
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20",
          className,
        )}
      >
        <p className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-electric uppercase">
          {label}
        </p>
        <h1 className="text-display max-w-3xl text-3xl font-semibold text-foreground sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
