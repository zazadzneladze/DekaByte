import { Suspense } from "react";
import Link from "next/link";
import { adminListClientProjects } from "@/db/queries";
import {
  CLIENT_PROJECT_STATUSES,
  clientProjectStatusLabel,
  type ClientProjectStatus,
} from "@/config/client-portal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            კლიენტის პროექტები
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} / {all.length} · პორტალის invite + სტადიები
          </p>
        </div>
        <Button render={<Link href="/admin/clients/new" />}>
          ახალი პროექტი
        </Button>
      </div>

      <p className="rounded-xl border border-border/80 bg-card px-4 py-3 text-sm text-muted-foreground">
        სტადიები: მომავალი → მიმდინარე → განხილვა → დასრულებული. საჯარო პორტფოლიო
        ცალკეა —{" "}
        <Link
          href="/admin/projects"
          className="font-medium text-electric underline-offset-2 hover:underline"
        >
          პორტფოლიო
        </Link>
        .
      </p>

      <form className="grid gap-2 rounded-xl border border-border bg-card p-3 sm:grid-cols-[1fr_auto_auto]">
        <Input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="ძიება სათაურით ან ელფოსტით"
        />
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="all">ყველა სტადია</option>
          {CLIENT_PROJECT_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          ფილტრი
        </Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">სათაური</th>
              <th className="px-3 py-2 font-medium">კლიენტი</th>
              <th className="px-3 py-2 font-medium">სტადია</th>
              <th className="px-3 py-2 font-medium">%</th>
              <th className="px-3 py-2 font-medium">განახლება</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr
                key={project.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-3 py-2.5">
                  <Link
                    href={`/admin/clients/${project.id}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {project.clientEmail}
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant="secondary">
                    {clientProjectStatusLabel(project.status)}
                  </Badge>
                </td>
                <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                  {project.progressPercent}%
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {new Intl.DateTimeFormat("ka-GE", {
                    dateStyle: "medium",
                  }).format(project.updatedAt)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  პროექტები არ მოიძებნა
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
