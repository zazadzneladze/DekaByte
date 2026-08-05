"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  deleteProject,
  duplicateProject,
  publishProject,
  setProjectFeatured,
  unpublishProject,
} from "@/actions/projects";
import type { Project } from "@/types";

export function ProjectRowActions({ project }: { project: Project }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(
    action: () => Promise<{ ok: boolean; error?: string; data?: { id: string } }>,
    successMessage: string,
    onSuccess?: (data?: { id: string }) => void,
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error ?? "შეცდომა");
        return;
      }
      toast.success(successMessage);
      onSuccess?.(result.data);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        size="xs"
        variant="outline"
        render={<Link href={`/admin/projects/${project.id}/edit`} />}
      >
        რედაქტირება
      </Button>
      <Button
        size="xs"
        variant="outline"
        disabled={pending}
        onClick={() =>
          run(
            () =>
              project.status === "published"
                ? unpublishProject(project.id)
                : publishProject(project.id),
            project.status === "published"
              ? "გამოუქვეყნდა"
              : "გამოქვეყნდა",
          )
        }
      >
        {project.status === "published" ? "დრაფტი" : "გამოქვეყნება"}
      </Button>
      <Button
        size="xs"
        variant="outline"
        disabled={pending}
        onClick={() =>
          run(
            () => setProjectFeatured(project.id, !project.featured),
            project.featured ? "რჩეულიდან ამოღებულია" : "რჩეულად მონიშნულია",
          )
        }
      >
        {project.featured ? "რჩეული −" : "რჩეული +"}
      </Button>
      <Button
        size="xs"
        variant="outline"
        disabled={pending}
        onClick={() =>
          run(
            () => duplicateProject(project.id),
            "ასლი შეიქმნა",
            (data) => {
              if (data?.id) {
                router.push(`/admin/projects/${data.id}/edit`);
              }
            },
          )
        }
      >
        ასლი
      </Button>
      <Button
        size="xs"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`წავშალოთ „${project.title}“?`)) return;
          run(() => deleteProject(project.id), "პროექტი წაიშალა");
        }}
      >
        წაშლა
      </Button>
    </div>
  );
}
