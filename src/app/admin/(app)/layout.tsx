import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth, signOut } from "@/lib/auth";
import { userIsAdmin } from "@/lib/session";
import {
  adminGetLeads,
  adminGetSiteSettings,
  adminGetInboxBadgeCount,
  adminListMessageThreads,
} from "@/db/queries";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

async function AdminAppShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();

  if (!session?.user || !userIsAdmin(session.user)) {
    redirect("/admin/login");
  }

  const [settings, inbox, threads, allLeads] = await Promise.all([
    adminGetSiteSettings(),
    adminGetInboxBadgeCount(),
    adminListMessageThreads(),
    adminGetLeads(),
  ]);

  const label = session.user.displayName || session.user.email || "ადმინი";
  const notificationThreads = threads
    .filter((t) => t.unreadCount > 0)
    .slice(0, 5)
    .map((t) => ({
      projectId: t.projectId,
      projectTitle: t.projectTitle,
      clientEmail: t.clientEmail,
      lastBody: t.lastBody,
      unreadCount: t.unreadCount,
    }));
  const notificationLeads = allLeads
    .filter((l) => l.status === "new")
    .slice(0, 5)
    .map((l) => ({
      id: l.id,
      name: l.name,
      projectType: l.projectType,
    }));

  return (
    <AdminShell
      logoUrl={settings?.logoUrl ?? null}
      userLabel={label}
      userImage={session.user.image}
      inboxCount={inbox.total}
      unreadMessages={inbox.unreadMessages}
      newLeads={inbox.newLeads}
      notificationThreads={notificationThreads}
      notificationLeads={notificationLeads}
      vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null}
      signOutButton={
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
      }
    >
      {children}
    </AdminShell>
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
