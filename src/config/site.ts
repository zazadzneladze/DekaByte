export const siteDefaults = {
  brandName: "DekaByte",
  phoneDisplay: "+995 557 16 26 32",
  phoneE164: "+995557162632",
  whatsappNumber: "995557162632",
  email: "zazadzneladze@gmail.com",
  facebookUrl: "",
  messengerUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  defaultSeoTitle: "DekaByte — ვებსაიტები და Android აპლიკაციები",
  defaultSeoDescription:
    "DekaByte ქმნის თანამედროვე ვებსაიტებს, Web Applications-ს, ადმინისტრირების სისტემებს, UI/UX დიზაინსა და Android აპლიკაციებს.",
} as const;

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${siteDefaults.whatsappNumber}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

/** Default outreach message when clicking WhatsApp CTAs. */
export const whatsappDefaultMessage =
  "გამარჯობა! მაინტერესებს პროექტი DekaByte-თან.";

export function whatsappProjectMessage(projectTitle: string) {
  return `გამარჯობა! მაინტერესებს მსგავსი პროექტი: ${projectTitle}`;
}

export function telHref(phoneE164: string = siteDefaults.phoneE164) {
  return `tel:${phoneE164}`;
}

export function mailtoHref(email: string = siteDefaults.email) {
  return `mailto:${email}`;
}
