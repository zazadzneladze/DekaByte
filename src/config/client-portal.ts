export type ClientProjectStatus =
  | "upcoming"
  | "in_progress"
  | "review"
  | "done"
  | "archived";

export type ClientInvoiceStatus = "draft" | "sent" | "paid";

export type ClientAssetKind = "screenshot" | "document" | "other";

export const CLIENT_PROJECT_STATUSES = [
  { id: "upcoming" as const, label: "ბრიფი" },
  { id: "in_progress" as const, label: "განვითარება" },
  { id: "review" as const, label: "რევიუ" },
  { id: "done" as const, label: "გაშვებული" },
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

/** Sensible defaults when admin sets status without touching the slider. */
export function defaultProgressForStatus(status: ClientProjectStatus) {
  switch (status) {
    case "upcoming":
      return 8;
    case "in_progress":
      return 45;
    case "review":
      return 78;
    case "done":
      return 100;
    case "archived":
      return 100;
    default:
      return 0;
  }
}

export function clientInvoiceStatusLabel(status: ClientInvoiceStatus) {
  return (
    CLIENT_INVOICE_STATUSES.find((s) => s.id === status)?.label ?? status
  );
}
