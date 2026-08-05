import { notFound } from "next/navigation";
import { Suspense } from "react";
import { adminGetProject } from "@/db/queries";
import { ProjectForm } from "@/components/admin/project-form";

export async function generateStaticParams() {
  return [{ id: "__preview__" }];
}

async function EditProjectContent({ id }: { id: string }) {
  const project = await adminGetProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          რედაქტირება: {project.title}
        </h1>
        <p className="text-sm text-muted-foreground">/{project.slug}</p>
      </div>
      <ProjectForm key={project.id} mode="edit" project={project} />
    </div>
  );
}

async function EditProjectLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProjectContent id={id} />;
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}>
      <EditProjectLoader params={params} />
    </Suspense>
  );
}
