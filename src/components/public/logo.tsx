import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Destination — public home by default. */
  href?: string;
  size?: "sm" | "md" | "lg";
};

const HEIGHT = { sm: 28, md: 36, lg: 52 } as const;

/**
 * Brand lockup from `/public/brand/logo-dark.png`.
 * Graphite chip blends the artwork's black plate into light UI.
 */
export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  const h = HEIGHT[size];
  const w = Math.round(h * (757 / 188));

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-lg bg-ink px-2 py-1 transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="DekaByte — მთავარი"
    >
      <Image
        src="/brand/logo-dark.png"
        alt="DekaByte Digital Product Studio"
        width={w}
        height={h}
        className="w-auto max-w-[min(11.5rem,52vw)] object-contain object-left"
        style={{ height: h }}
        priority
      />
    </Link>
  );
}
