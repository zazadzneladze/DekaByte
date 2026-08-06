"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createClientProject,
  updateClientProject,
  deleteClientProject,
} from "@/actions/clients";
import {
  CLIENT_PROJECT_STATUSES,
  defaultProgressForStatus,
  type ClientProjectStatus,
} from "@/config/client-portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  mode: "create" | "edit";
  projectId?: string;
  initial?: {
    title: string;
    status: ClientProjectStatus;
    progressPercent: number;
    clientEmail: string;
    notes: string;
  };
};

export function ClientProjectForm({ mode, projectId, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState<ClientProjectStatus>(
    initial?.status ?? "upcoming",
  );
  const [progressPercent, setProgressPercent] = useState(
    initial?.progressPercent ?? defaultProgressForStatus("upcoming"),
  );
  const [clientEmail, setClientEmail] = useState(initial?.clientEmail ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function onStatusChange(next: ClientProjectStatus) {
    setStatus(next);
    setProgressPercent(defaultProgressForStatus(next));
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        title,
        status,
        progressPercent,
        clientEmail,
        notes,
      };
      const result =
        mode === "create"
          ? await createClientProject(payload)
          : await updateClientProject(projectId!, payload);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(mode === "create" ? "პროექტი შეიქმნა" : "შენახულია");
      if (mode === "create" && result.data?.id) {
        router.push(`/admin/clients/${result.data.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function remove() {
    if (!projectId) return;
    if (!window.confirm("ნამდვილად წავშალოთ ეს კლიენტის პროექტი?")) return;
    startTransition(async () => {
      const result = await deleteClientProject(projectId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("წაშლილია");
      router.push("/admin/clients");
    });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[0_1px_2px_rgb(18_21_26/0.04)]">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title">სათაური</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="clientEmail">კლიენტის ელფოსტა (invite)</Label>
          <Input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">სტადია</Label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as ClientProjectStatus)
            }
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {CLIENT_PROJECT_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="progress">გაკეთებული %</Label>
            <span className="text-sm font-semibold tabular-nums text-electric">
              {progressPercent}%
            </span>
          </div>
          <input
            id="progress"
            type="range"
            min={0}
            max={100}
            step={1}
            value={progressPercent}
            onChange={(e) => setProgressPercent(Number(e.target.value))}
            className="w-full accent-[var(--electric)]"
          />
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-electric transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="notes">შიდა შენიშვნები</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={pending} onClick={submit}>
          {pending ? "ინახება…" : "შენახვა"}
        </Button>
        {mode === "edit" ? (
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={remove}
          >
            წაშლა
          </Button>
        ) : null}
      </div>
    </div>
  );
}
