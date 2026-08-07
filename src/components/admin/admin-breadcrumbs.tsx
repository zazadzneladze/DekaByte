"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENTS: Record<string, string> = {
  admin: "ადმინი",
  projects: "პორტფოლიო",
  clients: "კლიენტები",
  messages: "შეტყობინებები",
  leads: "ლიდები",
  settings: "პარამეტრები",
  new: "ახალი",
  edit: "რედაქტირება",
};

function labelForSegment(segment: string, index: number, parts: string[]) {
  if (SEGMENTS[segment]) return SEGMENTS[segment];
  if (index === parts.length - 1 && parts[index - 1] === "clients") {
    return "პროექტი";
  }
  if (index === parts.length - 1 && parts[index - 1] === "leads") {
    return "ლიდი";
  }
  if (index === parts.length - 1 && parts[index - 1] === "projects") {
    return "პროექტი";
  }
  return segment.slice(0, 8) + "…";
}

export function AdminBreadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  if (pathname === "/admin") return null;

  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "admin") return null;

  const crumbs = parts.map((part, index) => {
    const href = "/" + parts.slice(0, index + 1).join("/");
    const isLast = index === parts.length - 1;
    return {
      href,
      label: labelForSegment(part, index, parts),
      isLast,
    };
  });

  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex flex-wrap items-center gap-1 text-xs text-muted-foreground", className)}
    >
      <Link href="/admin" className="transition-colors hover:text-foreground">
        დაფა
      </Link>
      {crumbs.slice(1).map((crumb) => (
        <span key={crumb.href} className="inline-flex items-center gap-1">
          <ChevronRight className="size-3 opacity-50" aria-hidden />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
