import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { userIsAdmin } from "@/lib/session";
import { adminGetSiteSettings } from "@/db/queries";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminPushControls } from "@/components/admin/push-controls";
import { Logo } from "@/components/public/logo";
import { UserAvatar } from "@/components/public/user-avatar";
import { Button } from "@/components/ui/button";

async function AdminAppShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();

  if (!session?.user || !userIsAdmin(session.user)) {
    redirect("/admin/login");
  }

  const settings = await adminGetSiteSettings();
  const label =
    session.user.displayName || session.user.email || "ადმინი";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgb(219_234_254/0.55)_0%,transparent_55%)]"
      />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5 sm:px-6">
          <Logo href="/" size="sm" className="mr-1" src={settings?.logoUrl} />
          <AdminNav />
          <div className="ml-auto flex items-center gap-2">
            <AdminPushControls
              vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null}
            />
            <UserAvatar
              image={session.user.image}
              label={label}
              href="/admin/settings"
              size={32}
            />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
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
      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}

export default function AdminAppLayout({
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
      <AdminAppShell>{children}</AdminAppShell>
    </Suspense>
  );
}
