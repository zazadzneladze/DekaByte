"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addClientAsset,
  deleteClientAsset,
  markClientProjectMessagesRead,
  sendAdminClientMessage,
} from "@/actions/clients";
import {
  CLIENT_ASSET_KINDS,
  type ClientAssetKind,
} from "@/config/client-portal";
import { ClientFileUploader } from "@/components/portal/file-uploader";
import { Button } from "@/components/ui/button";
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

export function ClientAssetsPanel({
  projectId,
  assets,
  embedded = false,
}: {
  projectId: string;
  assets: Asset[];
  embedded?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState<ClientAssetKind>("document");

  return (
    <section
      className={
        embedded
          ? "flex flex-col gap-3"
          : "flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
      }
    >
        <div className="flex flex-wrap items-end justify-between gap-3">
        {embedded ? (
          <p className="text-sm text-muted-foreground">
            ატვირთე PDF, სკრინშოტი ან სხვა ფაილი
          </p>
        ) : (
          <h2 className="text-sm font-semibold">ფაილები</h2>
        )}
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
  embedded = false,
}: {
  projectId: string;
  messages: Message[];
  clientDisplayName?: string | null;
  embedded?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    void markClientProjectMessagesRead(projectId);
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#messages") return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [projectId]);

  return (
    <section
      id="messages"
      ref={sectionRef}
      className={
        embedded
          ? "scroll-mt-24 flex flex-col gap-3"
          : "scroll-mt-24 flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
      }
    >
      {!embedded ? <h2 className="text-sm font-semibold">შეტყობინებები</h2> : null}
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
