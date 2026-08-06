import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, FileText, Receipt } from "lucide-react";
import { auth } from "@/lib/auth";
import { portalGetProject } from "@/db/queries";
import {
  clientInvoiceStatusLabel,
  clientProjectStatusLabel,
} from "@/config/client-portal";
import { PortalChat } from "@/components/portal/chat";
import { ProgressBar, ProgressRing } from "@/components/portal/progress";
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

  return (
    <div className="space-y-10">
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

        <div className="flex flex-wrap items-start gap-5 rounded-2xl border border-border/80 bg-card/90 p-5 sm:p-6">
          <ProgressRing value={project.progressPercent} size={88} stroke={7} />
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
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            დოკუმენტები ჯერ არ არის
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {documents.map((asset) => (
              <li key={asset.id}>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/50"
                >
                  <span className="truncate">{asset.filename}</span>
                  <span className="shrink-0 text-xs text-electric">გახსნა</span>
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
        {visibleInvoices.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            ინვოისები ჯერ არ არის
          </p>
        ) : (
          <ul className="space-y-2">
            {visibleInvoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {inv.title} · {inv.amountGel} ₾
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {clientInvoiceStatusLabel(inv.status)}
                  </p>
                </div>
                {inv.pdfUrl ? (
                  <a
                    href={inv.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-electric underline-offset-2 hover:underline"
                  >
                    PDF
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <PortalChat
        projectId={project.id}
        messages={project.messages}
        displayName={session.user.displayName}
      />
    </div>
  );
}
