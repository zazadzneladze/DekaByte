import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MacBrowserFrameProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  /** When true, frame fills parent and content uses aspect ratio inside. */
  fill?: boolean;
};

/**
 * macOS-style browser chrome (traffic lights + title bar) around screenshots.
 */
export function MacBrowserFrame({
  children,
  title = "Safari",
  className,
  fill,
}: MacBrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-[#1c1c1e] shadow-lift ring-1 ring-black/5",
        fill && "flex h-full flex-col",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#2c2c2e] px-3 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57] ring-1 ring-black/10" />
          <span className="size-2.5 rounded-full bg-[#febc2e] ring-1 ring-black/10" />
          <span className="size-2.5 rounded-full bg-[#28c840] ring-1 ring-black/10" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-[70%] flex-1 justify-center">
          <span className="truncate rounded-md bg-black/25 px-3 py-0.5 text-center text-micro font-medium tracking-wide text-white/70">
            {title}
          </span>
        </div>
        <div className="w-[42px]" aria-hidden />
      </div>
      <div className={cn("relative bg-secondary", fill && "min-h-0 flex-1")}>
        {children}
      </div>
    </div>
  );
}
