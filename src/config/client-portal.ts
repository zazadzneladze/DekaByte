export type ClientProjectStatus =
  | "upcoming"
  | "in_progress"
  | "review"
  | "done"
  | "archived";

export type ClientInvoiceStatus = "draft" | "sent" | "paid";

export type ClientAssetKind = "screenshot" | "document" | "other";

export const CLIENT_PROJECT_STATUSES = [
  { id: "upcoming" as const, label: "მომავალი" },
  { id: "in_progress" as const, label: "მიმდინარე" },
  { id: "review" as const, label: "განხილვა" },
  { id: "done" as const, label: "დასრულებული" },
  { id: "archived" as const, label: "არქივი" },
] satisfies { id: ClientProjectStatus; label: string }[];

export const CLIENT_INVOICE_STATUSES = [
  { id: "draft" as const, label: "დრაფტი" },
  { id: "sent" as const, label: "გაგზავნილი" },
  { id: "paid" as const, label: "გადახდილი" },
] satisfies { id: ClientInvoiceStatus; label: string }[];

export const CLIENT_ASSET_KINDS = [
  { id: "screenshot" as const, label: "სქრინშოტი" },
  { id: "document" as const, label: "დოკუმენტი" },
  { id: "other" as const, label: "სხვა" },
] as const;

export function clientProjectStatusLabel(status: ClientProjectStatus) {
  return (
    CLIENT_PROJECT_STATUSES.find((s) => s.id === status)?.label ?? status
  );
}

export function clientInvoiceStatusLabel(status: ClientInvoiceStatus) {
  return (
    CLIENT_INVOICE_STATUSES.find((s) => s.id === status)?.label ?? status
  );
}
