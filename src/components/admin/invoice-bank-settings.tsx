"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateInvoiceBankConfig } from "@/actions/settings";
import {
  INVOICE_BANK_OPTIONS,
  type InvoiceBankConfig,
  type InvoiceBankId,
} from "@/config/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  initial: InvoiceBankConfig;
};

function BankFields({
  bankId,
  profile,
  onChange,
}: {
  bankId: InvoiceBankId;
  profile: InvoiceBankConfig[InvoiceBankId];
  onChange: (next: InvoiceBankConfig[InvoiceBankId]) => void;
}) {
  const prefix = bankId;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${prefix}-bankName`}>ბანკი</Label>
        <Input
          id={`${prefix}-bankName`}
          value={profile.bankName}
          onChange={(e) => onChange({ ...profile, bankName: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}-swift`}>SWIFT / BIC</Label>
        <Input
          id={`${prefix}-swift`}
          value={profile.swift}
          onChange={(e) => onChange({ ...profile, swift: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}-accountNumber`}>ანგარიშის ნომერი</Label>
        <Input
          id={`${prefix}-accountNumber`}
          value={profile.accountNumber}
          onChange={(e) =>
            onChange({ ...profile, accountNumber: e.target.value })
          }
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${prefix}-ibanGel`}>IBAN (GEL)</Label>
        <Input
          id={`${prefix}-ibanGel`}
          value={profile.ibanGel}
          onChange={(e) => onChange({ ...profile, ibanGel: e.target.value })}
          placeholder="GE…"
        />
      </div>
    </div>
  );
}

export function InvoiceBankSettings({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [config, setConfig] = useState<InvoiceBankConfig>(initial);
  const [activeBank, setActiveBank] = useState<InvoiceBankId>("bog");

  function save() {
    startTransition(async () => {
      const result = await updateInvoiceBankConfig(config);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("საბანკო რეკვიზიტები შენახულია");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          ინვოისის საბანკო რეკვიზიტები
        </h2>
        <p className="text-sm text-muted-foreground">
          ორი პროფილი — ინვოისზე აირჩევთ საქართველოს ბანკს ან TBC-ს
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INVOICE_BANK_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setActiveBank(option.id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              activeBank === option.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <BankFields
        bankId={activeBank}
        profile={config[activeBank]}
        onChange={(next) =>
          setConfig((current) => ({ ...current, [activeBank]: next }))
        }
      />

      <Button type="button" disabled={pending} onClick={save}>
        {pending ? "ინახება…" : "შენახვა"}
      </Button>
    </div>
  );
}
