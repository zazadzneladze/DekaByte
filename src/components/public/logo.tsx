import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const DEFAULT_LOGO_SRC = "/brand/logo.png";

type LogoProps = {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  /** Blob / CDN URL from site settings; falls back to static brand file. */
  src?: string | null;
};

const HEIGHT = { sm: 30, md: 40, lg: 56 } as const;

/**
 * Transparent brand lockup — no forced dark plate behind it.
 */
export function Logo({
  className,
  href = "/",
  size = "md",
  src,
}: LogoProps) {
  const h = HEIGHT[size];
  const w = Math.round(h * 4);
  const imageSrc = src?.trim() || DEFAULT_LOGO_SRC;
  const remote = imageSrc.startsWith("http");

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-85",
        className,
      )}
      aria-label="DekaByte — მთავარი"
    >
      <Image
        src={imageSrc}
        alt="DekaByte Digital Product Studio"
        width={w}
        height={h}
        className="w-auto max-w-[min(12rem,55vw)] object-contain object-left"
        style={{ height: h }}
        priority
        unoptimized={remote}
      />
    </Link>
  );
}
