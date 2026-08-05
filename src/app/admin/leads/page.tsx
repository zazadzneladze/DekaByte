import { Suspense } from "react";
import Link from "next/link";
import { adminGetLeads } from "@/db/queries";
import { LEAD_STATUSES, type LeadStatus } from "@/config/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadStatusButtons } from "@/components/admin/lead-status-buttons";

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

export default function AdminLeadsPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <AdminLeadsContent {...props} />
    </Suspense>
  );
}

async function AdminLeadsContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();
  const status = params.status as LeadStatus | "all" | undefined;

  const all = await adminGetLeads();
  const filtered = all.filter((lead) => {
    if (status && status !== "all" && lead.status !== status) return false;
    if (!q) return true;
    const haystack = [
      lead.name,
      lead.email ?? "",
      lead.phone ?? "",
      lead.projectType,
      lead.message,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">ლიდები</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} / {all.length}
        </p>
      </div>

      <form className="grid gap-2 rounded-xl border border-border bg-card p-3 sm:grid-cols-[1fr_auto_auto]">
        <Input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="ძიება სახელით, ტელეფონით, ელფოსტით…"
        />
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="all">ყველა სტატუსი</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          ფილტრი
        </Button>
      </form>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          ლიდები ვერ მოიძებნა.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {filtered.map((lead) => (
            <li
              key={lead.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link href={`/admin/leads/${lead.id}`} className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium hover:underline">
                    {lead.name}
                  </span>
                  <Badge
                    variant={lead.status === "new" ? "default" : "secondary"}
                  >
                    {LEAD_STATUS_LABEL[lead.status]}
                  </Badge>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  {lead.projectType} · {formatDate(lead.createdAt)}
                  {lead.phone ? ` · ${lead.phone}` : ""}
                  {lead.email ? ` · ${lead.email}` : ""}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {lead.message}
                </p>
              </Link>
              <LeadStatusButtons leadId={lead.id} status={lead.status} compact />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
