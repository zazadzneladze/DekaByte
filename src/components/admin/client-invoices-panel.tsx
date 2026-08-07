"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteClientInvoice,
  generateClientInvoice,
  updateClientInvoice,
} from "@/actions/clients";
import {
  CLIENT_INVOICE_STATUSES,
  clientInvoiceStatusLabel,
  type ClientInvoiceStatus,
} from "@/config/client-portal";
import {
  INVOICE_CURRENCIES,
  INVOICE_PAYMENT_STAGES,
  INVOICE_NUMBER_PREFIX,
  computeInvoiceTotals,
  formatMoney,
  getInvoiceBankProfile,
  INVOICE_BANK_OPTIONS,
  type InvoiceBankConfig,
  type InvoiceBankId,
  type InvoiceCurrency,
  type InvoiceLineItem,
} from "@/config/invoice";
import { buildInvoiceTemplateHtml } from "@/lib/invoice-template-html";
import {
  clampSignatureTransform,
  type InvoiceSignatureTransform,
} from "@/lib/invoice-signature";
import { ClientUserSignatureUpload } from "@/components/admin/client-user-signature-upload";
import { InvoiceSignatureTransformControls } from "@/components/admin/invoice-signature-transform-controls";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Invoice = {
  id: string;
  invoiceNumber: string;
  title: string;
  amountGel: number;
  netGel: number;
  status: ClientInvoiceStatus;
  paymentStage: string;
  currency: string;
  recipientName: string | null;
  pdfUrl: string | null;
  dueDate: Date | null;
  issuedAt: Date;
};

type Prefill = {
  projectTitle: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientEmail: string;
};

type SupplierSignatureSettings = {
  url: string | null;
  transform: InvoiceSignatureTransform;
};

type ClientSignatureSettings = {
  clientUserId: string | null;
  url: string | null;
  transform: InvoiceSignatureTransform;
};

type Props = {
  projectId: string;
  invoices: Invoice[];
  prefill: Prefill;
  supplierSignature: SupplierSignatureSettings;
  clientSignature: ClientSignatureSettings;
  bankConfig: InvoiceBankConfig;
  embedded?: boolean;
};

function emptyLine(): InvoiceLineItem {
  return { description: "", qty: 1, unitPrice: 0 };
}

function toDateInput(d: Date | null | undefined) {
  if (!d) return "";
  const iso = new Date(d).toISOString();
  return iso.slice(0, 10);
}

const selectClass =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm shadow-xs";

const fieldGrid = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12";

function FormSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/70 bg-muted/15 p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </p>
        {action}
      </div>
      {children}
    </section>
  );
}

function CompactField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function ClientInvoicesPanel({
  projectId,
  invoices,
  prefill,
  supplierSignature,
  clientSignature,
  bankConfig,
  embedded = false,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<ClientInvoiceStatus>("draft");
  const [paymentStage, setPaymentStage] = useState<string>(
    INVOICE_PAYMENT_STAGES[0],
  );
  const [currency, setCurrency] = useState<InvoiceCurrency>("GEL");
  const [bankId, setBankId] = useState<InvoiceBankId>("bog");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [contractRef, setContractRef] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recipientName, setRecipientName] = useState(prefill.recipientName);
  const [recipientPersonalId, setRecipientPersonalId] = useState("");
  const [recipientAddress, setRecipientAddress] = useState(
    prefill.recipientAddress,
  );
  const [recipientPhone, setRecipientPhone] = useState(prefill.recipientPhone);
  const [recipientIsCompany, setRecipientIsCompany] = useState(false);
  const [recipientContactPerson, setRecipientContactPerson] = useState("");
  const [recipientEmail, setRecipientEmail] = useState(prefill.recipientEmail);
  const [discountGel, setDiscountGel] = useState("0");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [includeSupplierSignature, setIncludeSupplierSignature] = useState(
    Boolean(supplierSignature.url),
  );
  const [clientSignatureUrl, setClientSignatureUrl] = useState<string | null>(
    clientSignature.url,
  );
  const [clientSignatureTransform, setClientSignatureTransform] =
    useState<InvoiceSignatureTransform>(
      clampSignatureTransform(clientSignature.transform),
    );
  const [lines, setLines] = useState<InvoiceLineItem[]>([
    { description: prefill.projectTitle, qty: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    setClientSignatureUrl(clientSignature.url);
    setClientSignatureTransform(
      clampSignatureTransform(clientSignature.transform),
    );
  }, [clientSignature.url, clientSignature.clientUserId, clientSignature.transform]);

  const totals = useMemo(
    () =>
      computeInvoiceTotals(
        lines,
        {
          discountGel: Number(discountGel) || 0,
          discountPercent: Number(discountPercent) || 0,
        },
        { withholdIncomeTax: recipientIsCompany },
      ),
    [lines, discountGel, discountPercent, recipientIsCompany],
  );

  function onDiscountPercentChange(value: string) {
    setDiscountPercent(value);
    const pct = Number(value) || 0;
    const sub = lines.reduce(
      (sum, row) => sum + Math.round(row.qty * row.unitPrice),
      0,
    );
    if (pct > 0) {
      setDiscountGel(String(Math.round((sub * pct) / 100)));
    } else {
      setDiscountGel("0");
    }
  }

  function onDiscountGelChange(value: string) {
    setDiscountGel(value);
    setDiscountPercent("0");
  }

  const bankProfile = useMemo(
    () => getInvoiceBankProfile(bankConfig, bankId),
    [bankConfig, bankId],
  );

  const previewInvoiceNumber =
    invoiceNumber.trim() || `${INVOICE_NUMBER_PREFIX}-PREVIEW-0001`;

  const previewHtml = useMemo(
    () =>
      buildInvoiceTemplateHtml({
        invoiceNumber: previewInvoiceNumber,
        issuedAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
        projectTitle: prefill.projectTitle,
        paymentStage: paymentStage || "—",
        currency,
        contractRef,
        recipientName: recipientName || "—",
        recipientPersonalId,
        recipientAddress,
        recipientIsCompany,
        recipientContactPerson,
        recipientPhone,
        recipientEmail,
        lineItems: lines.filter((l) => l.description.trim()),
        subtotal: totals.subtotal,
        discount: totals.discount,
        discountPercent: totals.discountPercent,
        gross: totals.gross,
        taxWithheld: totals.taxWithheld,
        net: totals.net,
        withholdIncomeTax: totals.withholdIncomeTax,
        bankProfile,
        logoSrc: "/brand/invoice-mark.png",
        supplierSignatureSrc:
          includeSupplierSignature && supplierSignature.url
            ? supplierSignature.url
            : undefined,
        clientSignatureSrc: clientSignatureUrl ?? undefined,
        supplierSignatureTransform: clampSignatureTransform(
          supplierSignature.transform,
        ),
        clientSignatureTransform: clampSignatureTransform(clientSignatureTransform),
      }),
    [
      previewInvoiceNumber,
      dueDate,
      status,
      prefill.projectTitle,
      paymentStage,
      currency,
      contractRef,
      recipientName,
      recipientPersonalId,
      recipientAddress,
      recipientIsCompany,
      recipientContactPerson,
      recipientPhone,
      recipientEmail,
      lines,
      totals,
      includeSupplierSignature,
      supplierSignature,
      clientSignatureUrl,
      clientSignatureTransform,
      bankProfile,
    ],
  );

  function generate() {
    startTransition(async () => {
      const result = await generateClientInvoice({
        projectId,
        invoiceNumber: invoiceNumber.trim() || undefined,
        status,
        paymentStage,
        currency,
        bankId,
        contractRef,
        dueDate: dueDate ? new Date(dueDate) : null,
        recipientName,
        recipientPersonalId,
        recipientAddress,
        recipientPhone,
        recipientIsCompany,
        recipientContactPerson: recipientIsCompany
          ? recipientContactPerson
          : "",
        recipientEmail,
        lineItems: lines,
        discountGel: Number(discountGel) || 0,
        discountPercent: Number(discountPercent) || 0,
        includeSupplierSignature,
        clientSignatureUrl,
        clientSignatureTransform,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("ინვოისის PDF მზადაა");
      setLines([{ description: prefill.projectTitle, qty: 1, unitPrice: 0 }]);
      setDiscountGel("0");
      setDiscountPercent("0");
      setInvoiceNumber("");
      setContractRef("");
      setRecipientPersonalId("");
      setRecipientContactPerson("");
      setRecipientIsCompany(false);
      setIncludeSupplierSignature(Boolean(supplierSignature.url));
      setStatus("draft");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/80 shadow-sm">
        {!embedded ? (
          <CardHeader className="border-b border-border/60">
            <CardTitle>ახალი ინვოისი</CardTitle>
            <CardDescription>
              {prefill.projectTitle} · PDF გენერირდება Word შაბლონის მიხედვით
            </CardDescription>
          </CardHeader>
        ) : null}
        <CardContent className={embedded ? "pt-5" : "pt-4"}>
          {embedded ? (
            <p className="mb-4 text-sm text-muted-foreground">
              ახალი ინვოისი · {prefill.projectTitle}
            </p>
          ) : null}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:items-stretch">
            <div className="flex flex-col gap-4">
              <FormSection title="ინვოისი">
                <div className={fieldGrid}>
                  <CompactField label="ინვოისის №" className="min-w-0 lg:col-span-4">
                    <Input
                      className="h-9 font-mono tabular-nums"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder={`${INVOICE_NUMBER_PREFIX}-${new Date().getFullYear()}-0001`}
                    />
                  </CompactField>
                  <CompactField label="გადახდის ვადა" className="min-w-0 lg:col-span-4">
                    <Input
                      type="date"
                      className="h-9"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </CompactField>
                  <CompactField label="სტატუსი" className="min-w-0 lg:col-span-4">
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as ClientInvoiceStatus)
                      }
                      className={selectClass}
                    >
                      {CLIENT_INVOICE_STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </CompactField>
                  <CompactField label="ეტაპი" className="min-w-0 lg:col-span-4">
                    <Input
                      className="h-9"
                      list="payment-stages"
                      value={paymentStage}
                      onChange={(e) => setPaymentStage(e.target.value)}
                    />
                    <datalist id="payment-stages">
                      {INVOICE_PAYMENT_STAGES.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </CompactField>
                  <CompactField label="ვალუტა" className="min-w-0 lg:col-span-4">
                    <select
                      value={currency}
                      onChange={(e) =>
                        setCurrency(e.target.value as InvoiceCurrency)
                      }
                      className={selectClass}
                    >
                      {INVOICE_CURRENCIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </CompactField>
                  <CompactField label="ბანკი" className="min-w-0 lg:col-span-4">
                    <select
                      value={bankId}
                      onChange={(e) =>
                        setBankId(e.target.value as InvoiceBankId)
                      }
                      className={selectClass}
                    >
                      {INVOICE_BANK_OPTIONS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </CompactField>
                  <CompactField
                    label="ხელშეკრულება / შეკვეთა №"
                    className="min-w-0 lg:col-span-12"
                  >
                    <Textarea
                      value={contractRef}
                      onChange={(e) => setContractRef(e.target.value)}
                      placeholder="№ / თარიღი"
                      rows={2}
                      className="min-h-0 resize-none text-sm leading-snug"
                    />
                  </CompactField>
                </div>
                {!invoiceNumber.trim() ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    № ცარიელი → ავტომატური ნომერი გენერაციისას
                  </p>
                ) : null}
              </FormSection>

              <FormSection title="დამკვეთი">
                <div className={cn(fieldGrid, "items-start")}>
                  <CompactField label="სახელი" className="min-w-0 sm:col-span-2 lg:col-span-6">
                    <Input
                      className="h-9"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </CompactField>
                  <CompactField label="პ/ნ / ID" className="min-w-0 lg:col-span-3">
                    <Input
                      className="h-9"
                      value={recipientPersonalId}
                      onChange={(e) => setRecipientPersonalId(e.target.value)}
                    />
                  </CompactField>
                  <CompactField label="ტელეფონი" className="min-w-0 lg:col-span-3">
                    <Input
                      className="h-9"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                  </CompactField>
                  <CompactField label="ელფოსტა" className="min-w-0 sm:col-span-2 lg:col-span-6">
                    <Input
                      className="h-9"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </CompactField>
                  <CompactField label="მისამართი" className="min-w-0 sm:col-span-2 lg:col-span-6">
                    <Input
                      className="h-9"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </CompactField>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
                  <Checkbox
                    checked={recipientIsCompany}
                    onCheckedChange={(v) => {
                      const on = v === true;
                      setRecipientIsCompany(on);
                      if (!on) setRecipientContactPerson("");
                    }}
                    id="recipient-is-company"
                  />
                  <Label htmlFor="recipient-is-company" className="cursor-pointer text-sm">
                    კომპანია
                  </Label>
                </div>
                {recipientIsCompany ? (
                  <CompactField label="საკონტაქტო პირი" className="mt-3 max-w-md">
                    <Input
                      className="h-9"
                      value={recipientContactPerson}
                      onChange={(e) => setRecipientContactPerson(e.target.value)}
                      placeholder="სახელი, გვარი"
                    />
                  </CompactField>
                ) : null}
              </FormSection>

              <FormSection
                title="ხაზები"
                action={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setLines((prev) => [...prev, emptyLine()])}
                  >
                    + ხაზი
                  </Button>
                }
              >
                <div className="hidden gap-2 px-2 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase sm:grid sm:grid-cols-12">
                  <span className="col-span-7">აღწერა</span>
                  <span className="col-span-2 text-center">რ-ბა</span>
                  <span className="col-span-2 text-center">ფასი</span>
                  <span className="col-span-1" />
                </div>
                <div className="flex flex-col gap-2">
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-2 rounded-lg border border-border/60 bg-background/80 p-2 sm:grid-cols-12 sm:items-center"
                    >
                      <Input
                        className="h-9 min-w-0 sm:col-span-7"
                        placeholder="აღწერა"
                        value={line.description}
                        onChange={(e) => {
                          const next = [...lines];
                          next[index] = { ...line, description: e.target.value };
                          setLines(next);
                        }}
                      />
                      <Input
                        className="h-9 min-w-0 sm:col-span-2"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="რ-ბა"
                        value={line.qty}
                        onChange={(e) => {
                          const next = [...lines];
                          next[index] = { ...line, qty: Number(e.target.value) || 0 };
                          setLines(next);
                        }}
                      />
                      <Input
                        className="h-9 min-w-0 sm:col-span-2"
                        type="number"
                        min={0}
                        step="1"
                        placeholder="ფასი"
                        value={line.unitPrice}
                        onChange={(e) => {
                          const next = [...lines];
                          next[index] = {
                            ...line,
                            unitPrice: Number(e.target.value) || 0,
                          };
                          setLines(next);
                        }}
                      />
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="shrink-0 sm:col-span-1 sm:justify-self-end"
                        disabled={lines.length <= 1}
                        onClick={() =>
                          setLines((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </FormSection>

              <FormSection title="ჯამები">
                <div className={fieldGrid}>
                  <CompactField label="ფასდაკლება %" className="min-w-0 lg:col-span-3">
                    <Input
                      className="h-9"
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={discountPercent}
                      onChange={(e) => onDiscountPercentChange(e.target.value)}
                    />
                  </CompactField>
                  <CompactField label={`ფასდაკლება ${currency}`} className="min-w-0 lg:col-span-3">
                    <Input
                      className="h-9"
                      type="number"
                      min={0}
                      value={discountGel}
                      onChange={(e) => onDiscountGelChange(e.target.value)}
                    />
                  </CompactField>
                  <div className="flex min-w-0 flex-col justify-center gap-1.5 rounded-lg border border-border/70 bg-background/90 px-3 py-2.5 text-sm lg:col-span-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">ქვეჯამი</span>
                      <span className="tabular-nums">{formatMoney(totals.subtotal, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-1.5">
                      <span className="font-medium">ჩასარიცხი</span>
                      <span className="font-semibold tabular-nums text-primary">
                        {formatMoney(totals.net, currency)}
                      </span>
                    </div>
                    {totals.withholdIncomeTax ? (
                      <p className="text-xs text-muted-foreground">
                        საშემოსავლო 20%: {formatMoney(totals.taxWithheld, currency)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </FormSection>

              <Collapsible className="rounded-xl border border-border/70 bg-muted/15 px-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/70 bg-muted/20 px-3 py-2 text-sm font-medium hover:bg-muted/40">
                  ხელმოწერები
                  <ChevronDown className="size-4 transition-transform [[data-panel-open]_&]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-3 pt-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border/70 bg-card p-3">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="include-supplier-signature"
                          checked={includeSupplierSignature}
                          disabled={!supplierSignature.url}
                          onCheckedChange={(checked) =>
                            setIncludeSupplierSignature(checked === true)
                          }
                        />
                        <div>
                          <Label htmlFor="include-supplier-signature" className="cursor-pointer text-sm">
                            ჩემი ხელმოწერა
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            <Link href="/admin/settings" className="text-primary hover:underline">
                              პარამეტრები
                            </Link>
                          </p>
                        </div>
                      </div>
                      {includeSupplierSignature && supplierSignature.url ? (
                        <InvoiceSignatureTransformControls
                          imageUrl={supplierSignature.url}
                          transform={clampSignatureTransform(supplierSignature.transform)}
                          readOnly
                          compact
                        />
                      ) : null}
                    </div>
                    <ClientUserSignatureUpload
                      key={clientSignature.clientUserId ?? prefill.recipientEmail}
                      projectId={projectId}
                      clientUserId={clientSignature.clientUserId}
                      clientEmail={prefill.recipientEmail}
                      label="დამკვეთი"
                      initialTransform={clampSignatureTransform(
                        clientSignature.transform,
                      )}
                      value={clientSignatureUrl}
                      onChange={setClientSignatureUrl}
                      transform={clientSignatureTransform}
                      onTransformChange={setClientSignatureTransform}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button
                type="button"
                size="lg"
                className="w-full sm:w-auto"
                disabled={
                  pending ||
                  !recipientName.trim() ||
                  !paymentStage.trim() ||
                  lines.every((l) => !l.description.trim())
                }
                onClick={generate}
              >
                {pending ? "გენერირდება…" : "PDF გენერაცია"}
              </Button>
            </div>

            <div className="flex min-h-0 flex-col xl:sticky xl:top-4 xl:h-[calc(100vh-6rem)]">
              <p className="mb-2 shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                პრევიუ
                {invoiceNumber.trim() ? (
                  <span className="ml-2 font-mono normal-case text-foreground/80">
                    · {previewInvoiceNumber}
                  </span>
                ) : null}
              </p>
              <iframe
                title="ინვოისის პრევიუ"
                srcDoc={previewHtml}
                className="min-h-[28rem] w-full flex-1 rounded-xl border border-border bg-white shadow-sm xl:min-h-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">გაცემული ინვოისები</CardTitle>
          <CardDescription>
            {invoices.length === 0
              ? "ჯერ არ არის"
              : `${invoices.length} ჩანაწერი`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">ინვოისები ჯერ არ არის</p>
          ) : (
            invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/15 px-3 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium tabular-nums">
                    {inv.invoiceNumber}
                    <span className="mx-1.5 text-muted-foreground">·</span>
                    {inv.netGel ?? inv.amountGel} {inv.currency || "GEL"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {clientInvoiceStatusLabel(inv.status)}
                    {inv.paymentStage ? ` · ${inv.paymentStage}` : ""}
                    {inv.recipientName ? ` · ${inv.recipientName}` : ""}
                    {inv.dueDate ? ` · ${toDateInput(inv.dueDate)}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {inv.pdfUrl ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      render={
                        <a href={inv.pdfUrl} target="_blank" rel="noreferrer" />
                      }
                    >
                      PDF
                    </Button>
                  ) : null}
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
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
