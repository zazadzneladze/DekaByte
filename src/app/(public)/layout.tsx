import { Suspense } from "react";

import { CookieConsent } from "@/components/public/cookie-consent";
import { MobileContactBar } from "@/components/public/mobile-contact-bar";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getPublicSiteSettings } from "@/db/queries";
import {
  JsonLdScript,
  organizationJsonLd,
  professionalServiceJsonLd,
} from "@/lib/seo";

function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--header-height) border-b border-border/60 bg-background/90" />
  );
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSiteSettings();

  return (
    <>
      <JsonLdScript
        data={[
          organizationJsonLd({
            brandName: settings.brandName,
            email: settings.email,
            phoneE164: settings.phoneE164,
          }),
          professionalServiceJsonLd({
            brandName: settings.brandName,
            email: settings.email,
            phoneE164: settings.phoneE164,
          }),
        ]}
      />
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:px-3 focus:py-2 focus:outline-none sr-only focus:not-sr-only"
      >
        გადასვლა ძირითად კონტენტზე
      </a>
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <div className="flex min-h-full flex-1 flex-col pt-header">
        <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter settings={settings} />
      </div>
      <Suspense fallback={null}>
        <MobileContactBar
          settings={{
            phoneE164: settings.phoneE164,
            email: settings.email,
          }}
        />
      </Suspense>
      <CookieConsent />
    </>
  );
}
