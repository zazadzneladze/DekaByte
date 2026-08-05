import { cn } from "@/lib/utils";

type HeroCompositionProps = {
  className?: string;
};

/**
 * Layered studio product visual: public web panel, admin fragment, Android frame.
 * Structural UI chrome only — no fabricated metrics.
 */
export function HeroComposition({ className }: HeroCompositionProps) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[5/4] w-full max-w-xl select-none",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(ellipse_at_30%_20%,#dbeafe_0%,transparent_55%),radial-gradient(ellipse_at_80%_70%,#eef1f5_0%,transparent_50%)]" />

      {/* Web panel */}
      <div className="animate-float absolute top-[6%] left-[4%] z-10 w-[72%] overflow-hidden rounded-xl border border-border bg-surface shadow-lift">
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

      {/* Admin fragment */}
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

      {/* Android frame */}
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
    </div>
  );
}
