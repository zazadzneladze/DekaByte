import { Suspense } from "react";
import { adminGetSiteSettings } from "@/db/queries";
import { siteDefaults } from "@/config/site";
import { mergeEstimateConfig } from "@/config/estimate";
import { mergeInvoiceBankConfig } from "@/config/invoice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSettingsTabs } from "@/components/admin/admin-settings-tabs";
import { SettingsForms } from "@/components/admin/settings-forms";
import { EstimateSettingsForm } from "@/components/admin/estimate-settings-form";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { InvoiceSupplierSignatureSettings } from "@/components/admin/invoice-supplier-signature-settings";
import { InvoiceBankSettings } from "@/components/admin/invoice-bank-settings";
import { clampSignatureTransform } from "@/lib/invoice-signature";

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">იტვირთება…</p>}
    >
      <AdminSettingsContent />
    </Suspense>
  );
}

async function AdminSettingsContent() {
  const settings = await adminGetSiteSettings();

  const initial = {
    brandName: settings?.brandName ?? siteDefaults.brandName,
    phoneDisplay: settings?.phoneDisplay ?? siteDefaults.phoneDisplay,
    phoneE164: settings?.phoneE164 ?? siteDefaults.phoneE164,
    whatsappNumber: settings?.whatsappNumber ?? siteDefaults.whatsappNumber,
    email: settings?.email ?? siteDefaults.email,
    facebookUrl: settings?.facebookUrl ?? siteDefaults.facebookUrl,
    messengerUrl: settings?.messengerUrl ?? siteDefaults.messengerUrl,
    instagramUrl: settings?.instagramUrl ?? siteDefaults.instagramUrl,
    linkedinUrl: settings?.linkedinUrl ?? siteDefaults.linkedinUrl,
    githubUrl: settings?.githubUrl ?? siteDefaults.githubUrl,
    defaultSeoTitle: settings?.defaultSeoTitle ?? siteDefaults.defaultSeoTitle,
    defaultSeoDescription:
      settings?.defaultSeoDescription ?? siteDefaults.defaultSeoDescription,
  };

  const estimateInitial = mergeEstimateConfig(settings?.estimateConfig ?? null);
  const bankInitial = mergeInvoiceBankConfig(settings?.invoiceBankConfig ?? null);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="პარამეტრები"
        description="ლოგო, ინვოისი, კონტაქტი, ბიუჯეტის ცხრილი და ადმინის პაროლი"
      />
      <AdminSettingsTabs
        brand={
          <LogoUploader
            initialUrl={settings?.logoUrl ?? null}
            initialPathname={settings?.logoPathname ?? null}
          />
        }
        invoice={
          <>
            <InvoiceSupplierSignatureSettings
              initialUrl={settings?.invoiceSupplierSignatureUrl ?? null}
              initialPathname={settings?.invoiceSupplierSignaturePathname ?? null}
              initialTransform={clampSignatureTransform(
                settings?.invoiceSupplierSignatureTransform,
              )}
            />
            <InvoiceBankSettings initial={bankInitial} />
          </>
        }
        contact={<SettingsForms initial={initial} />}
        estimate={<EstimateSettingsForm initial={estimateInitial} />}
      />
    </div>
  );
}
