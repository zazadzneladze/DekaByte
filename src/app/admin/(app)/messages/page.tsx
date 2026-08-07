import { Suspense } from "react";
import Link from "next/link";
import { adminGetLeads, adminListMessageThreads } from "@/db/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ka-GE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminMessagesPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <AdminMessagesContent />
    </Suspense>
  );
}

async function AdminMessagesContent() {
  const [threads, allLeads] = await Promise.all([
    adminListMessageThreads(),
    adminGetLeads(),
  ]);
  const freshLeads = allLeads.filter((l) => l.status === "new");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium tracking-[0.16em] text-electric uppercase">
          Inbox
        </p>
        <h1 className="text-display text-2xl font-semibold tracking-tight">
          შეტყობინებები
        </h1>
        <p className="text-sm text-muted-foreground">
          პორტალის ჩატი და ახალი ლიდები ერთ ადგილას
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight">პორტალის ჩატი</h2>
          <Badge variant="secondary">
            {threads.reduce((s, t) => s + t.unreadCount, 0)} წაუკითხავი
          </Badge>
        </div>
        {threads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
            კლიენტის შეტყობინებები ჯერ არ არის
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {threads.map((thread) => (
              <li key={thread.projectId}>
                <Link
                  href={`/admin/clients/${thread.projectId}#messages`}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{thread.projectTitle}</p>
                      {thread.unreadCount > 0 ? (
                        <Badge>{thread.unreadCount}</Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {thread.clientEmail} · {thread.lastBody}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(thread.lastMessageAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight">ახალი ლიდები</h2>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/admin/leads" />}
          >
            ყველა ლიდი
          </Button>
        </div>
        {freshLeads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
            ახალი ლიდები არ არის
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {freshLeads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.projectType}
                      {lead.message ? ` · ${lead.message.slice(0, 80)}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
