"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateLeadStatus } from "@/actions/leads";
import type { LeadStatus } from "@/config/categories";

const ACTIONS: { status: LeadStatus; label: string }[] = [
  { status: "read", label: "წაკითხული" },
  { status: "contacted", label: "დაკავშირებული" },
  { status: "archived", label: "არქივი" },
  { status: "new", label: "ახალი" },
];

export function LeadStatusButtons({
  leadId,
  status,
  compact = false,
}: {
  leadId: string;
  status: LeadStatus;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(next: LeadStatus) {
    if (next === status) return;
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("სტატუსი განახლდა");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      {ACTIONS.filter((action) => action.status !== status).map((action) => (
        <Button
          key={action.status}
          type="button"
          size={compact ? "xs" : "sm"}
          variant="outline"
          disabled={pending}
          onClick={() => setStatus(action.status)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
