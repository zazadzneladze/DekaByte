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
 * Uses light Safari-style chrome so project shots read clearly on any page theme.
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
        "overflow-hidden rounded-xl border border-border/80 bg-white shadow-lift ring-1 ring-black/[0.04]",
        fill && "flex h-full flex-col",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-black/[0.06] bg-[#ececec] px-3 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57] ring-1 ring-black/10" />
          <span className="size-2.5 rounded-full bg-[#febc2e] ring-1 ring-black/10" />
          <span className="size-2.5 rounded-full bg-[#28c840] ring-1 ring-black/10" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-[70%] flex-1 justify-center">
          <span className="truncate rounded-md bg-white px-3 py-0.5 text-center text-micro font-medium tracking-wide text-foreground/55 shadow-sm ring-1 ring-black/[0.06]">
            {title}
          </span>
        </div>
        <div className="w-[42px]" aria-hidden />
      </div>
      <div className={cn("relative bg-white", fill && "min-h-0 flex-1")}>
        {children}
      </div>
    </div>
  );
}
