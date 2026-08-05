import { Suspense } from "react";
import Link from "next/link";
import { adminGetDashboardStats } from "@/db/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LeadStatus } from "@/config/categories";

const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "ახალი",
  read: "წაკითხული",
  contacted: "დაკავშირებული",
  archived: "დაარქივებული",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ka-GE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const stats = await adminGetDashboardStats();

  const cards = [
    { label: "პროექტები", value: stats.totalProjects },
    { label: "გამოქვეყნებული", value: stats.publishedProjects },
    { label: "დრაფტები", value: stats.draftProjects },
    { label: "რჩეულები", value: stats.featuredProjects },
    { label: "ახალი ლიდები", value: stats.newLeads },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">დაფა</h1>
          <p className="text-sm text-muted-foreground">
            პროექტებისა და ლიდების მიმოხილვა
          </p>
        </div>
        <Button render={<Link href="/admin/projects/new" />}>
          პროექტის დამატება
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <div className="text-xs text-muted-foreground">{card.label}</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">ბოლო ლიდები</h2>
          <Link
            href="/admin/leads"
            className="text-sm text-primary hover:underline"
          >
            ყველა
          </Link>
        </div>

        {stats.recentLeads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            ლიდები ჯერ არ არის.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {stats.recentLeads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {lead.name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {lead.projectType} · {formatDate(lead.createdAt)}
                    </div>
                  </div>
                  <Badge
                    variant={lead.status === "new" ? "default" : "secondary"}
                  >
                    {LEAD_STATUS_LABEL[lead.status]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
