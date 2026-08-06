import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "კლიენტის პორტალი",
  robots: { index: false, follow: false },
};

async function PortalShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();

  if (!session?.user || session.user.role !== "client") {
    return (
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-2.5">
          <Link href="/portal" className="mr-2 text-sm font-semibold tracking-tight">
            DekaByte პორტალი
          </Link>
          <nav className="flex flex-1 flex-wrap items-center gap-1">
            <Link
              href="/portal"
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              )}
            >
              პროექტები
            </Link>
            <Link
              href="/portal/profile"
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              )}
            >
              პროფილი
            </Link>
            {session.user.isAdmin ? (
              <Link
                href="/admin"
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                )}
              >
                Admin
              </Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {session.user.displayName || session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/portal/login" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                გასვლა
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          იტვირთება…
        </div>
      }
    >
      <PortalShell>{children}</PortalShell>
    </Suspense>
  );
}
