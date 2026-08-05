"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addClientAsset,
  createClientInvoice,
  deleteClientAsset,
  deleteClientInvoice,
  sendAdminClientMessage,
  updateClientInvoice,
} from "@/actions/clients";
import {
  CLIENT_ASSET_KINDS,
  CLIENT_INVOICE_STATUSES,
  clientInvoiceStatusLabel,
  type ClientAssetKind,
  type ClientInvoiceStatus,
} from "@/config/client-portal";
import { ClientFileUploader } from "@/components/portal/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Asset = {
  id: string;
  filename: string;
  url: string;
  mime: string;
  kind: ClientAssetKind;
  createdAt: Date;
};

type Message = {
  id: string;
  authorRole: "admin" | "client";
  authorEmail: string;
  body: string;
  createdAt: Date;
};

type Invoice = {
  id: string;
  title: string;
  amountGel: number;
  status: ClientInvoiceStatus;
  pdfUrl: string | null;
  dueDate: Date | null;
};

export function ClientAssetsPanel({
  projectId,
  assets,
}: {
  projectId: string;
  assets: Asset[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState<ClientAssetKind>("document");

  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-sm font-semibold">ფაილები</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as ClientAssetKind)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {CLIENT_ASSET_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
          <ClientFileUploader
            projectId={projectId}
            purpose="client-asset"
            onUploaded={async (file) => {
              const result = await addClientAsset({
                projectId,
                filename: file.filename,
                mime: file.mime,
                size: file.size,
                kind,
                url: file.url,
                pathname: file.pathname,
              });
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              router.refresh();
            }}
          />
        </div>
      </div>
      {assets.length === 0 ? (
        <p className="text-sm text-muted-foreground">ფაილები ჯერ არ არის</p>
      ) : (
        <ul className="divide-y divide-border">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
            >
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline-offset-2 hover:underline"
              >
                {asset.filename}
              </a>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await deleteClientAsset(asset.id);
                    if (!result.ok) toast.error(result.error);
                    else {
                      toast.success("წაშლილია");
                      router.refresh();
                    }
                  });
                }}
              >
                წაშლა
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ClientChatPanel({
  projectId,
  messages,
  clientDisplayName,
}: {
  projectId: string;
  messages: Message[];
  clientDisplayName?: string | null;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">შეტყობინებები</h2>
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg bg-secondary/40 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">ჯერ ცარიელია</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={
                m.authorRole === "admin"
                  ? "ml-6 rounded-lg bg-card p-2 text-sm ring-1 ring-border"
                  : "mr-6 rounded-lg bg-primary/10 p-2 text-sm"
              }
            >
              <p className="mb-1 text-xs text-muted-foreground">
                {m.authorRole === "admin"
                  ? "ადმინი"
                  : clientDisplayName || m.authorEmail}{" "}
                ·{" "}
                {new Intl.DateTimeFormat("ka-GE", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(m.createdAt))}
              </p>
              <p className="whitespace-pre-wrap">{m.body}</p>
            </div>
          ))
        )}
      </div>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="პასუხი კლიენტს…"
      />
      <Button
        type="button"
        disabled={pending || !body.trim()}
        onClick={() => {
          startTransition(async () => {
            const result = await sendAdminClientMessage({ projectId, body });
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            setBody("");
            router.refresh();
          });
        }}
      >
        გაგზავნა
      </Button>
    </section>
  );
}

export function ClientInvoicesPanel({
  projectId,
  invoices,
}: {
  projectId: string;
  invoices: Invoice[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [amountGel, setAmountGel] = useState("");
  const [status, setStatus] = useState<ClientInvoiceStatus>("draft");
  const [pdf, setPdf] = useState<{ url: string; pathname: string } | null>(
    null,
  );

  function create() {
    startTransition(async () => {
      const result = await createClientInvoice({
        projectId,
        title,
        amountGel: Number(amountGel),
        status,
        pdfUrl: pdf?.url ?? null,
        pdfPathname: pdf?.pathname ?? null,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setTitle("");
      setAmountGel("");
      setStatus("draft");
      setPdf(null);
      toast.success("ინვოისი დაემატა");
      router.refresh();
    });
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">ინვოისები</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>სათაური</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>თანხა (₾)</Label>
          <Input
            type="number"
            min={0}
            value={amountGel}
            onChange={(e) => setAmountGel(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>სტატუსი</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ClientInvoiceStatus)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {CLIENT_INVOICE_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>PDF</Label>
          <ClientFileUploader
            projectId={projectId}
            purpose="client-invoice"
            accept="application/pdf"
            label={pdf ? "PDF შეცვლა" : "PDF ატვირთვა"}
            onUploaded={(file) => {
              setPdf({ url: file.url, pathname: file.pathname });
            }}
          />
          {pdf ? (
            <p className="text-xs text-muted-foreground">PDF მზადაა</p>
          ) : null}
        </div>
      </div>
      <Button type="button" disabled={pending} onClick={create}>
        ინვოისის დამატება
      </Button>

      {invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground">ინვოისები ჯერ არ არის</p>
      ) : (
        <ul className="divide-y divide-border">
          {invoices.map((inv) => (
            <li
              key={inv.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
            >
              <div>
                <p className="font-medium">
                  {inv.title} · {inv.amountGel} ₾
                </p>
                <p className="text-xs text-muted-foreground">
                  {clientInvoiceStatusLabel(inv.status)}
                  {inv.pdfUrl ? (
                    <>
                      {" · "}
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        PDF
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {CLIENT_INVOICE_STATUSES.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
                    size="sm"
                    variant={inv.status === s.id ? "default" : "outline"}
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        const result = await updateClientInvoice({
                          id: inv.id,
                          status: s.id,
                        });
                        if (!result.ok) toast.error(result.error);
                        else router.refresh();
                      });
                    }}
                  >
                    {s.label}
                  </Button>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => {
                    if (!window.confirm("წავშალოთ ინვოისი?")) return;
                    startTransition(async () => {
                      const result = await deleteClientInvoice(inv.id);
                      if (!result.ok) toast.error(result.error);
                      else {
                        toast.success("წაშლილია");
                        router.refresh();
                      }
                    });
                  }}
                >
                  წაშლა
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
