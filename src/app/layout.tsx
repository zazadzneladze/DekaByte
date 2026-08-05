import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl, siteDefaults } from "@/config/site";

import "./globals.css";

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  variable: "--font-noto-sans-georgian",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteDefaults.defaultSeoTitle,
    template: `%s · ${siteDefaults.brandName}`,
  },
  description: siteDefaults.defaultSeoDescription,
  openGraph: {
    title: siteDefaults.defaultSeoTitle,
    description: siteDefaults.defaultSeoDescription,
    locale: "ka_GE",
    type: "website",
    siteName: siteDefaults.brandName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteDefaults.defaultSeoTitle,
    description: siteDefaults.defaultSeoDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ka"
      className={`${notoSansGeorgian.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Toaster position="top-center" richColors closeButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
