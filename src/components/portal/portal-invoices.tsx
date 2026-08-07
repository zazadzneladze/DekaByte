import Link from "next/link";
import { Download, ExternalLink, Shield } from "lucide-react";
import {
  clientInvoiceStatusLabel,
  type ClientInvoiceStatus,
} from "@/config/client-portal";
import {
  formatMoney,
  type InvoiceCurrency,
} from "@/config/invoice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Invoice = {
  id: string;
  invoiceNumber: string | null;
  title: string;
  amountGel: number;
  netGel: number | null;
  status: ClientInvoiceStatus;
  currency: string | null;
  dueDate: Date | null;
  paymentStage: string | null;
  pdfUrl: string | null;
};

function invoiceStatusVariant(
  status: ClientInvoiceStatus,
): "default" | "secondary" | "outline" {
  switch (status) {
    case "paid":
      return "default";
    case "sent":
      return "secondary";
    default:
      return "outline";
  }
}

export function PortalInvoiceList({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border/80 bg-card/50 px-5 py-8 text-center text-sm text-muted-foreground">
        ინვოისები ჯერ არ არის
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {invoices.map((inv) => {
        const currency = (inv.currency || "GEL") as InvoiceCurrency;
        const net = inv.netGel ?? inv.amountGel;
        const dueLabel = inv.dueDate
          ? new Intl.DateTimeFormat("ka-GE", { dateStyle: "medium" }).format(
              new Date(inv.dueDate),
            )
          : null;

        return (
          <li
            key={inv.id}
            className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_2px_rgb(18_21_26/0.04)] transition-all hover:border-electric/20 hover:shadow-[0_8px_24px_rgb(18_21_26/0.06)]"
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold tracking-tight text-foreground">
                    {inv.invoiceNumber ?? inv.title}
                  </p>
                  <Badge variant={invoiceStatusVariant(inv.status)}>
                    {clientInvoiceStatusLabel(inv.status)}
                  </Badge>
                </div>
                <p className="text-2xl font-semibold tabular-nums tracking-tight text-graphite">
                  {formatMoney(net, currency)}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {inv.paymentStage ? <span>{inv.paymentStage}</span> : null}
                  {dueLabel ? <span>ვადა: {dueLabel}</span> : null}
                </div>
              </div>

              {inv.pdfUrl ? (
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    render={
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    <ExternalLink data-icon="inline-start" />
                    ნახვა
                  </Button>
                  <Button
                    size="sm"
                    render={
                      <a href={inv.pdfUrl} download rel="noreferrer" />
                    }
                  >
                    <Download data-icon="inline-start" />
                    PDF
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">PDF მალე</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function PortalAdminPreviewBanner({
  adminClientUrl,
}: {
  adminClientUrl: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        "dark:border-amber-900/50 dark:bg-amber-950/30",
      )}
    >
      <div className="flex items-start gap-3">
        <Shield className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
            ადმინის ხედი — კლიენტის პორტალი
          </p>
          <p className="text-xs text-amber-800/80 dark:text-amber-200/70">
            ხედავ იმავე გვერდს, რასაც კლიენტი. რედაქტირება ადმინ პანელიდან.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 border-amber-300/80 bg-white/80 hover:bg-white dark:border-amber-800 dark:bg-transparent"
        render={<Link href={adminClientUrl} />}
      >
        ადმინ პროექტი
      </Button>
    </div>
  );
}
