import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ადმინი",
  robots: { index: false, follow: false },
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "DekaByte Admin",
    statusBarStyle: "default",
  },
};

/** Root admin layout — login stays outside the authenticated shell. */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
