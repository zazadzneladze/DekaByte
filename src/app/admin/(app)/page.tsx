import { Suspense } from "react";
import Link from "next/link";
import {
  Briefcase,
  Inbox,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";
import { adminGetDashboardStats } from "@/db/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-xl bg-muted/60" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/60" />
        ))}
      </div>
    </div>
  );
}

async function AdminDashboardContent() {
  const stats = await adminGetDashboardStats();

  const statCards = [
    {
      label: "კლიენტის პროექტები",
      value: stats.clientProjects,
      hint: `${stats.activeClientProjects} აქტიური`,
      href: "/admin/clients",
    },
    {
      label: "პორტფოლიო",
      value: stats.publishedProjects,
      hint: `${stats.draftProjects} დრაფტი`,
      href: "/admin/projects",
    },
    {
      label: "წაუკითხავი ჩატი",
      value: stats.unreadMessages,
      hint: "პორტალი",
      href: "/admin/messages",
      highlight: stats.unreadMessages > 0,
    },
    {
      label: "ახალი ლიდები",
      value: stats.newLeads,
      hint: "კონტაქტი",
      href: "/admin/leads?status=new",
      highlight: stats.newLeads > 0,
    },
  ];

  const quickActions = [
    { href: "/admin/clients/new", label: "კლიენტის პროექტი", icon: Users },
    { href: "/admin/projects/new", label: "პორტფოლიო", icon: Briefcase },
    { href: "/admin/messages", label: "Inbox", icon: MessageSquare },
    { href: "/admin/leads", label: "ლიდები", icon: Inbox },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Overview"
        title="დაფა"
        description="პორტფოლიო, კლიენტის პორტალი, ჩატი და ლიდები — ერთიანი მიმოხილვა"
        showBreadcrumbs={false}
        actions={
          <Button render={<Link href="/admin/clients/new" />}>
            <Plus data-icon="inline-start" />
            ახალი კლიენტი
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="group block">
            <Card
              className={
                card.highlight
                  ? "border-primary/30 bg-primary/5 shadow-sm transition-colors group-hover:bg-primary/10"
                  : "border-border/80 shadow-sm transition-colors group-hover:bg-muted/30"
              }
            >
              <CardHeader className="pb-1">
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">{card.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto justify-start gap-2 px-3 py-2.5"
              render={<Link href={action.href} />}
            >
              <Icon className="size-4 shrink-0 text-primary" />
              {action.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">ბოლო ჩატები</h2>
            <Link href="/admin/messages" className="text-sm text-primary hover:underline">
              Inbox
            </Link>
          </div>
          {stats.recentThreads.length === 0 ? (
            <Card className="border-dashed shadow-none">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                ჩატის შეტყობინებები ჯერ არ არის
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden border-border/80 py-0 shadow-sm">
              <ul className="divide-y divide-border">
                {stats.recentThreads.map((thread) => (
                  <li key={thread.projectId}>
                    <Link
                      href={`/admin/clients/${thread.projectId}#chat`}
                      className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {thread.projectTitle}
                          </p>
                          {thread.unreadCount > 0 ? (
                            <Badge variant="default">{thread.unreadCount}</Badge>
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {thread.clientEmail}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDate(thread.lastMessageAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">ბოლო ლიდები</h2>
            <Link href="/admin/leads" className="text-sm text-primary hover:underline">
              ყველა
            </Link>
          </div>
          {stats.recentLeads.length === 0 ? (
            <Card className="border-dashed shadow-none">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                ლიდები ჯერ არ არის
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden border-border/80 py-0 shadow-sm">
              <ul className="divide-y divide-border">
                {stats.recentLeads.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{lead.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {lead.projectType} · {formatDate(lead.createdAt)}
                        </p>
                      </div>
                      <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                        {LEAD_STATUS_LABEL[lead.status]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
