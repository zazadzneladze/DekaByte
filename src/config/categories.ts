export const PROJECT_CATEGORIES = [
  { id: "websites", label: "ვებსაიტები" },
  { id: "web_apps", label: "Web Applications" },
  { id: "android", label: "Android" },
  { id: "ui_ux", label: "UI/UX" },
  { id: "ai_tools", label: "AI Tools" },
] as const;

export type ProjectCategoryId = (typeof PROJECT_CATEGORIES)[number]["id"];

export const PROJECT_STATUSES = ["draft", "published"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const LEAD_STATUSES = ["new", "read", "contacted", "archived"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_PROJECT_TYPES = [
  "ვებსაიტი",
  "Web Application",
  "Android აპლიკაცია",
  "UI/UX დიზაინი",
  "არსებული პროექტის განახლება",
  "სხვა",
] as const;

export const CONTACT_METHODS = ["phone", "whatsapp", "email"] as const;

export function categoryLabel(id: string) {
  return PROJECT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
