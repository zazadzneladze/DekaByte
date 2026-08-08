import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  image?: string | null;
  label: string;
  href?: string;
  className?: string;
  size?: number;
  badgeCount?: number;
};

export function UserAvatar({
  image,
  label,
  href,
  className,
  size = 36,
  badgeCount = 0,
}: UserAvatarProps) {
  const initial = (label.trim().charAt(0) || "?").toUpperCase();
  const showBadge = badgeCount > 0;
  const badgeLabel = badgeCount > 99 ? "99+" : String(badgeCount);

  const inner = (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
      title={label}
      aria-label={
        showBadge ? `${label} · ${badgeCount} შეტყობინება` : label
      }
    >
      <span className="relative inline-flex size-full overflow-hidden rounded-full bg-secondary ring-1 ring-border">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes={`${size}px`}
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs font-semibold text-graphite">
            {initial}
          </span>
        )}
      </span>
      {showBadge ? (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-electric px-1 text-micro-sm font-semibold text-white ring-2 ring-card">
          {badgeLabel}
        </span>
      ) : null}
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="transition-opacity hover:opacity-90">
      {inner}
    </Link>
  );
}
