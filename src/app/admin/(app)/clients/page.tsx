import { Suspense } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { adminListClientProjects } from "@/db/queries";
import {
  CLIENT_PROJECT_STATUSES,
  clientProjectStatusLabel,
  type ClientProjectStatus,
} from "@/config/client-portal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default function AdminClientsPage(props: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <AdminClientsContent {...props} />
    </Suspense>
  );
}

async function AdminClientsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();
  const status = params.status as ClientProjectStatus | "all" | undefined;
  const all = await adminListClientProjects();

  const filtered = all.filter((project) => {
    if (status && status !== "all" && project.status !== status) return false;
    if (!q) return true;
    return (
      project.title.toLowerCase().includes(q) ||
      project.clientEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        eyebrow="კლიენტის პორტალი"
        title="კლიენტის პროექტები"
        description={`${filtered.length} / ${all.length} · invite, სტადიები, ინვოისები`}
        actions={
          <Button render={<Link href="/admin/clients/new" />}>
            <Plus data-icon="inline-start" />
            ახალი პროექტი
          </Button>
        }
      />

      <Card className="border-border/80 shadow-sm">
        <CardContent className="pt-4">
          <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="ძიება სათაურით ან ელფოსტით"
                className="h-9 pl-8"
              />
            </div>
            <select
              name="status"
              defaultValue={status ?? "all"}
              className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="all">ყველა სტადია</option>
              {CLIENT_PROJECT_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" className="shrink-0">
              ფილტრი
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">პროექტები</CardTitle>
          <CardDescription>
            საჯარო პორტფოლიო ცალკეა —{" "}
            <Link href="/admin/projects" className="text-primary hover:underline">
              პორტფოლიო
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              პროექტები არ მოიძებნა
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">სათაური</th>
                    <th className="px-4 py-2.5 font-medium">კლიენტი</th>
                    <th className="px-4 py-2.5 font-medium">სტადია</th>
                    <th className="px-4 py-2.5 font-medium">%</th>
                    <th className="px-4 py-2.5 font-medium">განახლება</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/clients/${project.id}`}
                          className="font-medium text-foreground underline-offset-2 hover:text-primary hover:underline"
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                        {project.clientEmail}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">
                          {clientProjectStatusLabel(project.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">
                        {project.progressPercent}%
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Intl.DateTimeFormat("ka-GE", {
                          dateStyle: "medium",
                        }).format(project.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
