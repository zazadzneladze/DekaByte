import { Suspense } from "react";
import Link from "next/link";
import { adminGetProjects } from "@/db/queries";
import {
  PROJECT_CATEGORIES,
  categoryLabel,
  type ProjectCategoryId,
  type ProjectStatus,
} from "@/config/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectRowActions } from "@/components/admin/project-row-actions";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  category?: string;
}>;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ka-GE", { dateStyle: "medium" }).format(date);
}

export default function AdminProjectsPage(props: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <AdminProjectsContent {...props} />
    </Suspense>
  );
}

async function AdminProjectsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();
  const status = params.status as ProjectStatus | "all" | undefined;
  const category = params.category as ProjectCategoryId | "all" | undefined;

  const all = await adminGetProjects();

  const filtered = all.filter((project) => {
    if (status && status !== "all" && project.status !== status) return false;
    if (category && category !== "all" && project.category !== category) {
      return false;
    }
    if (!q) return true;
    return (
      project.title.toLowerCase().includes(q) ||
      project.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">პროექტები</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} / {all.length}
          </p>
        </div>
        <Button render={<Link href="/admin/projects/new" />}>
          პროექტის დამატება
        </Button>
      </div>

      <form className="grid gap-2 rounded-xl border border-border bg-card p-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="ძიება სათაურით ან slug-ით"
        />
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="all">ყველა სტატუსი</option>
          <option value="draft">დრაფტი</option>
          <option value="published">გამოქვეყნებული</option>
        </select>
        <select
          name="category"
          defaultValue={category ?? "all"}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="all">ყველა კატეგორია</option>
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          ფილტრი
        </Button>
      </form>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          პროექტები ვერ მოიძებნა.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">სათაური</th>
                <th className="px-3 py-2 font-medium">კატეგორია</th>
                <th className="px-3 py-2 font-medium">სტატუსი</th>
                <th className="px-3 py-2 font-medium">დალაგება</th>
                <th className="px-3 py-2 font-medium">განახლება</th>
                <th className="px-3 py-2 font-medium">მოქმედებები</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((project) => (
                <tr key={project.id} className="align-middle">
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {project.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      /{project.slug}
                      {project.featured ? " · რჩეული" : ""}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {categoryLabel(project.category)}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge
                      variant={
                        project.status === "published" ? "default" : "secondary"
                      }
                    >
                      {project.status === "published"
                        ? "გამოქვეყნებული"
                        : "დრაფტი"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                    {project.sortOrder}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {formatDate(project.updatedAt)}
                  </td>
                  <td className="px-3 py-2.5">
                    <ProjectRowActions project={project} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
