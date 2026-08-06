import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adminGetClientProject,
  adminGetClientUserByEmail,
} from "@/db/queries";
import { clientProjectStatusLabel } from "@/config/client-portal";
import { ClientProjectForm } from "@/components/admin/client-project-form";
import {
  ClientAssetsPanel,
  ClientChatPanel,
  ClientInvoicesPanel,
} from "@/components/admin/client-project-panels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminClientProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await adminGetClientProject(id);
  if (!project) notFound();

  const clientUser = await adminGetClientUserByEmail(project.clientEmail);

  return (
    <div className="space-y-6">
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
          <p className="text-sm text-muted-foreground">
            {project.clientEmail}
            {clientUser?.displayName
              ? ` · ${clientUser.displayName}`
              : " · სახელი ჯერ არ დაყენებულა"}
          </p>
        </div>
        <Button variant="outline" render={<Link href="/admin/clients" />}>
          სია
        </Button>
      </div>

      <ClientProjectForm
        mode="edit"
        projectId={project.id}
        initial={{
          title: project.title,
          status: project.status,
          progressPercent: project.progressPercent,
          clientEmail: project.clientEmail,
          notes: project.notes,
        }}
      />

      <ClientAssetsPanel projectId={project.id} assets={project.assets} />
      <ClientChatPanel
        projectId={project.id}
        messages={project.messages}
        clientDisplayName={clientUser?.displayName}
      />
      <ClientInvoicesPanel projectId={project.id} invoices={project.invoices} />
    </div>
  );
}
