import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { portalGetProject } from "@/db/queries";
import {
  clientInvoiceStatusLabel,
  clientProjectStatusLabel,
} from "@/config/client-portal";
import { PortalChat } from "@/components/portal/chat";
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              {project.title}
            </h1>
            <Badge variant="secondary">
              {clientProjectStatusLabel(project.status)}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/portal" />}>
          უკან
        </Button>
      </div>

      {screenshots.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">სქრინშოტები</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {screenshots.map((asset) => (
              <a
                key={asset.id}
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-lg ring-1 ring-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="aspect-video w-full object-cover"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">დოკუმენტები</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">დოკუმენტები ჯერ არ არის</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((asset) => (
              <li key={asset.id}>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium underline-offset-2 hover:underline"
                >
                  {asset.filename}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">ინვოისები</h2>
        {visibleInvoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">ინვოისები ჯერ არ არის</p>
        ) : (
          <ul className="space-y-2">
            {visibleInvoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
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
                    className="underline-offset-2 hover:underline"
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
