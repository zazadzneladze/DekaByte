import { notFound } from "next/navigation";
import {
  adminGetClientProject,
  adminGetClientUserByEmail,
  adminGetSiteSettings,
} from "@/db/queries";
import { clampSignatureTransform } from "@/lib/invoice-signature";
import { mergeInvoiceBankConfig } from "@/config/invoice";
import { ClientProjectWorkspace } from "@/components/admin/client-project-workspace";

/** Chromium PDF generation needs headroom on Vercel (pack download + render). */
export const maxDuration = 120;

export default async function AdminClientProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await adminGetClientProject(id);
  if (!project) notFound();

  const [clientUser, siteSettings] = await Promise.all([
    adminGetClientUserByEmail(project.clientEmail),
    adminGetSiteSettings(),
  ]);

  const supplierSignature = {
    url: siteSettings?.invoiceSupplierSignatureUrl ?? null,
    transform: clampSignatureTransform(
      siteSettings?.invoiceSupplierSignatureTransform,
    ),
  };
  const clientSignature = {
    clientUserId: clientUser?.id ?? null,
    url: clientUser?.invoiceSignatureUrl ?? null,
    transform: clampSignatureTransform(clientUser?.invoiceSignatureTransform),
  };
  const bankConfig = mergeInvoiceBankConfig(
    siteSettings?.invoiceBankConfig ?? null,
  );

  const canPromote =
    project.progressPercent >= 100 || project.status === "done";

  return (
    <ClientProjectWorkspace
      project={{
        id: project.id,
        title: project.title,
        status: project.status,
        progressPercent: project.progressPercent,
        clientEmail: project.clientEmail,
        notes: project.notes,
        portfolioProjectId: project.portfolioProjectId,
        assets: project.assets,
        messages: project.messages,
        invoices: project.invoices,
      }}
      clientDisplayName={clientUser?.displayName ?? null}
      clientPhone={clientUser?.phone ?? null}
      clientAddress={clientUser?.address ?? null}
      supplierSignature={supplierSignature}
      clientSignature={clientSignature}
      bankConfig={bankConfig}
      canPromote={canPromote}
    />
  );
}
