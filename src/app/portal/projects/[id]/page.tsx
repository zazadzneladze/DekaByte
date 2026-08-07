import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, FileText, MessageSquare, Receipt } from "lucide-react";
import { auth } from "@/lib/auth";
import { portalGetProject } from "@/db/queries";
import { clientProjectStatusLabel } from "@/config/client-portal";
import { PortalChat } from "@/components/portal/chat";
import {
  PortalAdminPreviewBanner,
  PortalInvoiceList,
} from "@/components/portal/portal-invoices";
import { ProgressBar, ProgressRing } from "@/components/portal/progress";
import { ProjectStages } from "@/components/portal/project-stages";
import { MacBrowserFrame } from "@/components/public/mac-browser-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "client") {
    redirect("/portal/login");
  }
  if (session.user.needsOnboarding) {
    redirect("/portal/onboarding");
  }

  const { id } = await params;
  const project = await portalGetProject(id, session.user.email);
  if (!project) notFound();

  const screenshots = project.assets.filter((a) => a.kind === "screenshot");
  const documents = project.assets.filter((a) => a.kind !== "screenshot");
  const visibleInvoices = project.invoices.filter((i) => i.status !== "draft");
  const isAdminPreview = Boolean(session.user.isAdmin);

  return (
    <div className="space-y-8 pb-4">
      {isAdminPreview ? (
        <PortalAdminPreviewBanner adminClientUrl={`/admin/clients/${project.id}`} />
      ) : null}

      <div className="space-y-5">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          render={<Link href="/portal" />}
        >
          <ArrowLeft data-icon="inline-start" />
          პროექტები
        </Button>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted-blue/20 shadow-[0_1px_2px_rgb(18_21_26/0.04)]">
          <div className="flex flex-wrap items-start gap-5 p-5 sm:p-6">
            <ProgressRing value={project.progressPercent} size={92} stroke={7} />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-display text-xl font-semibold tracking-tight text-graphite sm:text-2xl">
                  {project.title}
                </h1>
                <Badge variant="secondary">
                  {clientProjectStatusLabel(project.status)}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">პროგრესი</span>
                  <span className="font-semibold tabular-nums text-graphite">
                    {project.progressPercent}%
                  </span>
                </div>
                <ProgressBar value={project.progressPercent} className="h-2.5" />
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight">სტადიები</h2>
          <ProjectStages status={project.status} />
        </section>
      </div>

      {screenshots.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">სქრინშოტები</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {screenshots.map((asset) => (
              <a
                key={asset.id}
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="block transition-opacity hover:opacity-95"
              >
                <MacBrowserFrame title={project.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="aspect-video w-full object-cover object-top"
                  />
                </MacBrowserFrame>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <FileText className="size-4 text-electric" />
          დოკუმენტები
        </h2>
        {documents.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/80 bg-card/50 px-5 py-8 text-center text-sm text-muted-foreground">
            დოკუმენტები ჯერ არ არის
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border/80 bg-card">
            {documents.map((asset) => (
              <li key={asset.id}>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium transition-colors hover:bg-secondary/50"
                >
                  <span className="truncate">{asset.filename}</span>
                  <span className="shrink-0 text-xs font-medium text-electric">
                    გახსნა
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Receipt className="size-4 text-electric" />
          ინვოისები
        </h2>
        <PortalInvoiceList invoices={visibleInvoices} />
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <MessageSquare className="size-4 text-electric" />
          შეტყობინებები
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card p-4">
          <PortalChat
            embedded
            projectId={project.id}
            messages={project.messages}
            displayName={session.user.displayName}
          />
        </div>
      </section>
    </div>
  );
}
