import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { adminGetLead } from "@/db/queries";
import type { LeadStatus } from "@/config/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadStatusButtons } from "@/components/admin/lead-status-buttons";

const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "ახალი",
  read: "წაკითხული",
  contacted: "დაკავშირებული",
  archived: "დაარქივებული",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ka-GE", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function whatsappLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export async function generateStaticParams() {
  return [{ id: "__preview__" }];
}

async function LeadDetail({ id }: { id: string }) {
  const lead = await adminGetLead(id);
  if (!lead) notFound();

  const prefilled = `გამარჯობა ${lead.name}, DekaByte-დან ვწერთ თქვენს მოთხოვნასთან (${lead.projectType}) დაკავშირებით.`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            render={<Link href="/admin/leads" />}
          >
            ← ლიდები
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(lead.createdAt)}
          </p>
        </div>
        <Badge variant={lead.status === "new" ? "default" : "secondary"}>
          {LEAD_STATUS_LABEL[lead.status]}
        </Badge>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <Field label="პროექტის ტიპი" value={lead.projectType} />
        <Field
          label="სასურველი საკონტაქტო"
          value={lead.preferredContactMethod ?? "—"}
        />
        <Field label="წყარო" value={lead.source} />
        <div>
          <div className="text-xs text-muted-foreground">შეტყობინება</div>
          <p className="mt-1 whitespace-pre-wrap text-sm">{lead.message}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {lead.phone ? (
          <>
            <Button
              variant="outline"
              render={<a href={`tel:${normalizePhone(lead.phone)}`} />}
            >
              დარეკვა
            </Button>
            <Button
              variant="outline"
              render={
                <a
                  href={whatsappLink(lead.phone, prefilled)}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              WhatsApp
            </Button>
          </>
        ) : null}
        {lead.email ? (
          <Button
            variant="outline"
            render={
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(`DekaByte — ${lead.projectType}`)}&body=${encodeURIComponent(prefilled)}`}
              />
            }
          >
            ელფოსტა
          </Button>
        ) : null}
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">სტატუსის შეცვლა</h2>
        <LeadStatusButtons leadId={lead.id} status={lead.status} />
      </section>
    </div>
  );
}

async function LeadDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LeadDetail id={id} />;
}

export default function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}>
      <LeadDetailLoader params={params} />
    </Suspense>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}
