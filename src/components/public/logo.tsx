import Link from "next/link";

import { cn } from "@/lib/utils";

type DbMonogramProps = {
  className?: string;
  title?: string;
  onDark?: boolean;
};

/** Small replaceable DB monogram — swap SVG paths to rebrand. */
export function DbMonogram({
  className,
  title = "DekaByte",
  onDark = false,
}: DbMonogramProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      className={cn("size-8 shrink-0", className)}
    >
      <rect
        width="32"
        height="32"
        rx="8"
        fill={onDark ? "#F5F6F8" : "#12151A"}
      />
      <path
        d="M8.2 8.5h6.1c3.55 0 5.85 2.15 5.85 5.35 0 3.25-2.35 5.4-5.9 5.4H11.1V23.5H8.2V8.5Zm2.9 2.45v6.05h2.95c1.95 0 3.1-1.05 3.1-3 0-1.95-1.15-3.05-3.1-3.05H11.1Z"
        fill={onDark ? "#12151A" : "#F5F6F8"}
      />
      <path
        d="M21.35 14.15c1.05-.55 1.75-1.6 1.75-2.95 0-2.2-1.7-3.55-4.35-3.55h-3.05v2.45h2.7c1.2 0 1.85.55 1.85 1.4 0 .9-.7 1.45-1.9 1.45h-2.65v2.4h2.75c1.35 0 2.15.6 2.15 1.6 0 .95-.75 1.55-2.05 1.55h-2.85V23.5h3.2c2.95 0 4.85-1.45 4.85-3.7 0-1.55-.85-2.65-2.4-3.2Z"
        fill="#60A5FA"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  onDark?: boolean;
};

export function Logo({
  className,
  markClassName,
  showWordmark = true,
  onDark = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-80",
        onDark ? "text-surface" : "text-graphite",
        className,
      )}
    >
      <DbMonogram className={markClassName} onDark={onDark} />
      {showWordmark ? (
        <span className="text-[1.05rem] font-semibold tracking-tight">
          DekaByte
        </span>
      ) : null}
    </Link>
  );
}
