"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { sendClientMessage } from "@/actions/portal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  authorRole: "admin" | "client";
  authorEmail: string;
  body: string;
  createdAt: Date;
};

export function PortalChat({
  projectId,
  messages,
  displayName,
}: {
  projectId: string;
  messages: Message[];
  displayName?: string | null;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">შეტყობინებები</h2>
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg bg-secondary/40 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">ჯერ ცარიელია</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={
                m.authorRole === "client"
                  ? "ml-6 rounded-lg bg-primary/10 p-2 text-sm"
                  : "mr-6 rounded-lg bg-card p-2 text-sm ring-1 ring-border"
              }
            >
              <p className="mb-1 text-xs text-muted-foreground">
                {m.authorRole === "client"
                  ? displayName || "თქვენ"
                  : "DekaByte"}{" "}
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
        placeholder="დაწერეთ შეტყობინება…"
      />
      <Button
        type="button"
        disabled={pending || !body.trim()}
        onClick={() => {
          startTransition(async () => {
            const result = await sendClientMessage({ projectId, body });
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
