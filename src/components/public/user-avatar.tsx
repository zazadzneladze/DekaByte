import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  image?: string | null;
  label: string;
  href?: string;
  className?: string;
  size?: number;
};

export function UserAvatar({
  image,
  label,
  href,
  className,
  size = 36,
}: UserAvatarProps) {
  const initial = (label.trim().charAt(0) || "?").toUpperCase();
  const inner = (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-border bg-secondary",
        className,
      )}
      style={{ width: size, height: size }}
      title={label}
      aria-label={label}
    >
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
  );

  if (!href) return inner;

  return (
    <Link href={href} className="transition-opacity hover:opacity-90">
      {inner}
    </Link>
  );
}
