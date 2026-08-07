import { slugify } from "@/lib/security";

/** Blob pathname: `{projectSlug}_{date}_{invoiceNumber}.pdf` */
export function invoicePdfPathname(
  projectId: string,
  projectTitle: string,
  invoiceNumber: string,
  issuedAt: Date,
): string {
  const date = issuedAt.toISOString().slice(0, 10);
  const slug = slugify(projectTitle).slice(0, 48) || "project";
  const safeNumber = invoiceNumber.replace(/[^\w-]+/g, "-");
  return `client-invoices/${projectId}/${slug}_${date}_${safeNumber}.pdf`;
}
