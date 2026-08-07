"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/portal", label: "პროექტები", exact: true },
  { href: "/portal/profile", label: "პროფილი" },
] as const;

export function PortalNav({ showAdminLink }: { showAdminLink?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-wrap items-center gap-0.5">
      {LINKS.map((link) => {
        const active =
          "exact" in link && link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-sm transition-colors",
              active
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      {showAdminLink ? (
        <Link
          href="/admin"
          className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Admin
        </Link>
      ) : null}
    </nav>
  );
}
