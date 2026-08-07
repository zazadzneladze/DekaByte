import {
  CLIENT_PROJECT_STATUSES,
  type ClientProjectStatus,
} from "@/config/client-portal";
import { cn } from "@/lib/utils";

const VISIBLE_STAGES = CLIENT_PROJECT_STATUSES.filter(
  (s) => s.id !== "archived",
);

type ProjectStagesProps = {
  status: ClientProjectStatus;
  className?: string;
  compact?: boolean;
};

/**
 * Visual pipeline of client-project stages for the portal cabinet.
 */
export function ProjectStages({
  status,
  className,
  compact = false,
}: ProjectStagesProps) {
  const activeId = status === "archived" ? "done" : status;
  const activeIndex = Math.max(
    0,
    VISIBLE_STAGES.findIndex((s) => s.id === activeId),
  );

  return (
    <ol
      className={cn(
        "grid gap-2",
        compact
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-4",
        className,
      )}
      aria-label="პროექტის სტადიები"
    >
      {VISIBLE_STAGES.map((stage, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex;
        return (
          <li
            key={stage.id}
            className={cn(
              "relative rounded-xl border px-3 py-2.5 transition-colors",
              current && "border-electric/40 bg-muted-blue/60",
              done && !current && "border-border bg-secondary/60",
              !done && !current && "border-dashed border-border/80 bg-card/40",
            )}
          >
            <p
              className={cn(
                "font-mono text-[0.65rem] tracking-wider uppercase",
                current ? "text-electric" : "text-muted-foreground",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <p
              className={cn(
                "mt-1 text-sm font-medium tracking-tight",
                current ? "text-graphite" : "text-muted-foreground",
              )}
            >
              {stage.label}
            </p>
            {current ? (
              <p className="mt-0.5 text-[0.7rem] text-electric">აქტიური</p>
            ) : done ? (
              <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                გავლილი
              </p>
            ) : (
              <p className="mt-0.5 text-[0.7rem] text-muted-foreground/70">
                შემდეგი
              </p>
            )}
          </li>
        );
      })}
      {status === "archived" ? (
        <li className="rounded-xl border border-border bg-secondary/50 px-3 py-2.5 sm:col-span-4">
          <p className="text-sm font-medium text-muted-foreground">არქივი</p>
        </li>
      ) : null}
    </ol>
  );
}
