import type { InferSelectModel } from "drizzle-orm";
import type {
  adminUsers,
  leads,
  projectImages,
  projects,
  siteSettings,
} from "@/db/schema";
import type {
  LeadStatus,
  ProjectCategoryId,
  ProjectStatus,
} from "@/config/categories";
import type { ContactInput } from "@/validators/contact";
import type { ProjectInput } from "@/validators/project";
import type { ChangePasswordInput, LoginInput } from "@/validators/auth";

export type AdminUser = InferSelectModel<typeof adminUsers>;
export type Project = InferSelectModel<typeof projects>;
export type ProjectImage = InferSelectModel<typeof projectImages>;
export type Lead = InferSelectModel<typeof leads>;
export type SiteSettings = InferSelectModel<typeof siteSettings>;

export type ProjectWithImages = Project & {
  images: ProjectImage[];
};

export type PublicSiteSettings = {
  brandName: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  email: string;
  facebookUrl: string;
  messengerUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  logoUrl?: string | null;
};

export type AdminSessionUser = {
  id: string;
  email: string;
};

export type DashboardStats = {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  newLeads: number;
  recentLeads: Lead[];
};

export type {
  ContactInput,
  ProjectInput,
  LoginInput,
  ChangePasswordInput,
  LeadStatus,
  ProjectCategoryId,
  ProjectStatus,
};
