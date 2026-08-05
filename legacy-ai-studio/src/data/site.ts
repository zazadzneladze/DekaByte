export interface SiteConfig {
  companyName: string;
  companyNameFormatted: string;
  tagline: string;
  subTagline: string;
  email: string;
  phone: string;
  phoneFormatted: string;
  whatsappUrl: string;
  messengerUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  address: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    canonicalUrlPlaceholder: string;
  };
}

export const siteConfig: SiteConfig = {
  companyName: "DEKABYTE",
  companyNameFormatted: "DekaByte",
  tagline: "ვქმნით ვებსაიტებსა და Android აპლიკაციებს, რომლებიც ბიზნესს ზრდაში ეხმარება",
  subTagline: "DekaByte ქმნის თანამედროვე, სწრაფ და მომხმარებელზე მორგებულ ციფრულ პროდუქტებს — იდეიდან დიზაინამდე, დეველოპმენტიდან გაშვებამდე.",
  email: "info@dekabyte.ge",
  phone: "+995599292929", // Real formatting for links (e.g. WhatsApp, tel)
  phoneFormatted: "+995 599 29 29 29", // Visual formatting
  whatsappUrl: "https://wa.me/995599292929",
  messengerUrl: "https://m.me/dekabyte.ge",
  facebookUrl: "https://facebook.com/dekabyte.ge",
  linkedinUrl: "https://linkedin.com/company/dekabyte",
  githubUrl: "https://github.com/dekabyte-studio",
  address: "თბილისი, საქართველო",
  seo: {
    title: "DekaByte — ვებსაიტები და Android აპლიკაციები",
    description: "DekaByte ქმნის თანამედროვე ვებსაიტებს, Web Applications-ს, ადმინისტრირების სისტემებს, UI/UX დიზაინსა და Android აპლიკაციებს.",
    keywords: [
      "ვებსაიტების დამზადება",
      "Android აპლიკაციები",
      "აპლიკაციების შექმნა",
      "Web Applications",
      "ადმინისტრაციული პანელები",
      "UI/UX დიზაინი",
      "პროგრამული უზრუნველყოფა",
      "DEKABYTE",
      "DekaByte"
    ],
    ogImage: "/assets/og-image.jpg",
    canonicalUrlPlaceholder: "https://dekabyte.ge"
  }
};
