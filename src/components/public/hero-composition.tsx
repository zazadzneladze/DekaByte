import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroCompositionProps = {
  className?: string;
  /** Optional real project shot — elevates trust over abstract chrome */
  showcase?: {
    src: string;
    alt: string;
    title: string;
  } | null;
};

/**
 * Layered studio product visual: real work when available,
 * otherwise web + admin + Android chrome.
 */
export function HeroComposition({ className, showcase }: HeroCompositionProps) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[5/4] w-full max-w-xl select-none",
        className,
      )}
      aria-hidden={showcase ? undefined : true}
    >
      <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(ellipse_at_28%_18%,rgb(219_234_254/0.9)_0%,transparent_52%),radial-gradient(ellipse_at_85%_75%,rgb(238_241_245/0.95)_0%,transparent_48%)]" />
      <div className="pointer-events-none absolute inset-4 rounded-[1.35rem] ring-1 ring-graphite/5" />

      {showcase ? (
        <>
          <div className="animate-float absolute top-[5%] left-[3%] z-10 w-[78%] overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-lift">
            <div className="flex items-center gap-1.5 border-b border-border bg-off-white/90 px-3 py-2">
              <span className="size-2 rounded-full bg-[#ff5f57]" />
              <span className="size-2 rounded-full bg-[#febc2e]" />
              <span className="size-2 rounded-full bg-[#28c840]" />
              <span className="ml-2 truncate text-[0.65rem] font-medium tracking-wide text-slate">
                {showcase.title}
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-secondary">
              <Image
                src={showcase.src}
                alt={showcase.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 80vw, 420px"
                priority
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="animate-float-delayed absolute top-[22%] right-[1%] z-20 w-[42%] overflow-hidden rounded-xl border border-border bg-surface/95 shadow-lift backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
              <span className="text-[0.6rem] font-semibold tracking-wide text-graphite">
                Admin
              </span>
              <span className="rounded bg-muted-blue px-1.5 py-0.5 text-[0.55rem] font-medium text-electric">
                CMS
              </span>
            </div>
            <div className="flex flex-col gap-1.5 p-2">
              <div className="h-1.5 w-2/3 rounded bg-secondary" />
              <div className="h-8 rounded-md border border-border bg-off-white" />
              <div className="h-8 rounded-md border border-border bg-off-white" />
            </div>
          </div>

          <div className="animate-float absolute right-[10%] bottom-[1%] z-30 w-[26%] min-w-[5.25rem] overflow-hidden rounded-[1.1rem] border-[3px] border-graphite bg-surface shadow-lift">
            <div className="mx-auto mt-1.5 h-1 w-7 rounded-full bg-graphite/25" />
            <div className="relative mx-1.5 mt-2 aspect-[9/14] overflow-hidden rounded-md bg-off-white">
              <Image
                src={showcase.src}
                alt=""
                fill
                className="object-cover object-top opacity-90"
                sizes="120px"
                aria-hidden
              />
            </div>
            <div className="mx-auto my-1.5 h-1 w-9 rounded-full bg-graphite/20" />
          </div>
        </>
      ) : (
        <>
          <div className="animate-float absolute top-[6%] left-[4%] z-10 w-[72%] overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
            <div className="flex items-center gap-1.5 border-b border-border bg-off-white px-3 py-2">
              <span className="size-2 rounded-full bg-[#E2E5EA]" />
              <span className="size-2 rounded-full bg-[#E2E5EA]" />
              <span className="size-2 rounded-full bg-[#E2E5EA]" />
              <span className="ml-2 h-2 w-[42%] rounded bg-secondary" />
            </div>
            <div className="grid gap-3 p-3 sm:p-4">
              <div className="h-2.5 w-1/3 rounded bg-electric/20" />
              <div className="h-8 w-2/3 rounded-md bg-graphite/90" />
              <div className="h-2 w-4/5 rounded bg-secondary" />
              <div className="h-2 w-3/5 rounded bg-secondary" />
              <div className="mt-1 flex gap-2">
                <div className="h-7 w-20 rounded-lg bg-electric" />
                <div className="h-7 w-16 rounded-lg border border-border bg-surface" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="h-14 rounded-lg border border-border bg-off-white" />
                <div className="h-14 rounded-lg border border-border bg-off-white" />
                <div className="h-14 rounded-lg border border-border bg-off-white" />
              </div>
            </div>
          </div>

          <div className="animate-float-delayed absolute top-[18%] right-[2%] z-20 w-[46%] overflow-hidden rounded-xl border border-border bg-surface shadow-lift">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-[0.65rem] font-semibold tracking-wide text-graphite">
                Admin
              </span>
              <span className="rounded bg-muted-blue px-1.5 py-0.5 text-[0.6rem] font-medium text-electric">
                CMS
              </span>
            </div>
            <div className="flex">
              <div className="flex w-8 flex-col gap-2 border-r border-border bg-off-white p-2">
                <span className="h-1.5 w-full rounded bg-electric/40" />
                <span className="h-1.5 w-full rounded bg-border" />
                <span className="h-1.5 w-full rounded bg-border" />
                <span className="h-1.5 w-full rounded bg-border" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-2.5">
                <div className="h-2 w-1/2 rounded bg-secondary" />
                <div className="rounded-md border border-border p-2">
                  <div className="mb-1.5 h-1.5 w-2/3 rounded bg-graphite/20" />
                  <div className="h-1.5 w-full rounded bg-secondary" />
                  <div className="mt-1 h-1.5 w-4/5 rounded bg-secondary" />
                </div>
                <div className="rounded-md border border-border p-2">
                  <div className="mb-1.5 h-1.5 w-1/2 rounded bg-graphite/20" />
                  <div className="h-1.5 w-full rounded bg-secondary" />
                </div>
              </div>
            </div>
          </div>

          <div className="animate-float absolute right-[12%] bottom-[2%] z-30 w-[28%] min-w-[5.5rem] overflow-hidden rounded-[1.15rem] border-[3px] border-graphite bg-surface shadow-lift">
            <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-graphite/25" />
            <div className="flex flex-col gap-2 p-2.5 pt-3">
              <div className="h-2 w-1/2 rounded bg-electric/30" />
              <div className="h-10 rounded-lg bg-off-white" />
              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-8 rounded-md border border-border bg-surface" />
                <div className="h-8 rounded-md border border-border bg-surface" />
              </div>
              <div className="h-2 w-full rounded bg-secondary" />
              <div className="h-2 w-3/4 rounded bg-secondary" />
              <div className="mt-1 h-6 rounded-md bg-electric" />
            </div>
            <div className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-graphite/20" />
          </div>
        </>
      )}
    </div>
  );
}
