import { getSiteUrl, siteDefaults } from "@/config/site";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(settings?: {
  brandName?: string;
  email?: string;
  phoneE164?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.brandName ?? siteDefaults.brandName,
    url: getSiteUrl(),
    email: settings?.email ?? siteDefaults.email,
    telephone: settings?.phoneE164 ?? siteDefaults.phoneE164,
    areaServed: "GE",
  };
}

export function projectJsonLd(project: {
  title: string;
  shortDescription: string;
  slug: string;
  coverImageUrl?: string | null;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: `${getSiteUrl()}/work/${project.slug}`,
    ...(project.coverImageUrl ? { image: project.coverImageUrl } : {}),
    creator: {
      "@type": "Organization",
      name: siteDefaults.brandName,
    },
  };
}

export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
