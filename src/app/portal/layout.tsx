import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { getPublicSiteSettings } from "@/db/queries";
import { Logo } from "@/components/public/logo";
import { UserAvatar } from "@/components/public/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "კლიენტის პორტალი",
  robots: { index: false, follow: false },
};

async function PortalShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();
  const settings = await getPublicSiteSettings();

  if (!session?.user || session.user.role !== "client") {
    return (
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    );
  }

  const label =
    session.user.displayName || session.user.email || "პროფილი";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_90%_70%_at_100%_-10%,rgb(219_234_254/0.7)_0%,transparent_55%),linear-gradient(180deg,rgb(245_246_248)_0%,transparent_100%)]"
      />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6">
          <Logo href="/" size="sm" className="mr-1" src={settings.logoUrl} />
          <nav className="flex flex-1 flex-wrap items-center gap-0.5">
            <Link
              href="/portal"
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              )}
            >
              პროექტები
            </Link>
            <Link
              href="/portal/profile"
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              )}
            >
              პროფილი
            </Link>
            {session.user.isAdmin ? (
              <Link
                href="/admin"
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                )}
              >
                Admin
              </Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <UserAvatar
              image={session.user.image}
              label={label}
              href="/portal/profile"
              size={32}
            />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/portal/login" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                title="გასვლა"
                aria-label="გასვლა"
              >
                <LogOut />
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {children}
      </main>
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
