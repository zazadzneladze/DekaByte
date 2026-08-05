import { Suspense } from "react";
import { adminGetSiteSettings } from "@/db/queries";
import { siteDefaults } from "@/config/site";
import { mergeEstimateConfig } from "@/config/estimate";
import { SettingsForms } from "@/components/admin/settings-forms";
import { EstimateSettingsForm } from "@/components/admin/estimate-settings-form";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">პარამეტრები</h1>
        <p className="text-sm text-muted-foreground">
          საკონტაქტო ინფო, ბიუჯეტის ცხრილები და ადმინ პაროლი
        </p>
      </div>
      <SettingsForms initial={initial} />
      <EstimateSettingsForm initial={estimateInitial} />
    </div>
  );
}
