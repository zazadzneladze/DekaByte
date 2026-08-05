import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const projectStatusEnum = pgEnum("project_status", ["draft", "published"]);
export const projectCategoryEnum = pgEnum("project_category", [
  "websites",
  "web_apps",
  "android",
  "ui_ux",
  "ai_tools",
]);
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "read",
  "contacted",
  "archived",
]);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    failedLoginCount: integer("failed_login_count").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("admin_users_email_idx").on(t.email)],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    category: projectCategoryEnum("category").notNull(),
    shortDescription: text("short_description").notNull(),
    overview: text("overview").notNull().default(""),
    challenge: text("challenge").notNull().default(""),
    solution: text("solution").notNull().default(""),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
    coverImageUrl: text("cover_image_url"),
    coverImagePathname: text("cover_image_pathname"),
    coverImageAlt: text("cover_image_alt"),
    liveUrl: text("live_url"),
    externalUrl: text("external_url"),
    status: projectStatusEnum("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("projects_slug_idx").on(t.slug),
    index("projects_status_idx").on(t.status),
    index("projects_featured_sort_idx").on(t.featured, t.sortOrder),
  ],
);

export const projectImages = pgTable(
  "project_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    pathname: text("pathname").notNull(),
    alt: text("alt").notNull().default(""),
    caption: text("caption"),
    width: integer("width"),
    height: integer("height"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("project_images_project_id_idx").on(t.projectId)],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 60 }),
    email: varchar("email", { length: 255 }),
    projectType: varchar("project_type", { length: 120 }).notNull(),
    message: text("message").notNull(),
    preferredContactMethod: varchar("preferred_contact_method", { length: 40 }),
    status: leadStatusEnum("status").notNull().default("new"),
    source: varchar("source", { length: 80 }).notNull().default("contact_form"),
    ipHash: varchar("ip_hash", { length: 128 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_status_created_idx").on(t.status, t.createdAt)],
);

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  brandName: varchar("brand_name", { length: 120 }).notNull(),
  phoneDisplay: varchar("phone_display", { length: 60 }).notNull(),
  phoneE164: varchar("phone_e164", { length: 40 }).notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 40 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  facebookUrl: text("facebook_url").notNull().default(""),
  messengerUrl: text("messenger_url").notNull().default(""),
  instagramUrl: text("instagram_url").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  githubUrl: text("github_url").notNull().default(""),
  defaultSeoTitle: varchar("default_seo_title", { length: 200 }).notNull(),
  defaultSeoDescription: text("default_seo_description").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leadRateLimits = pgTable("lead_rate_limits", {
  id: uuid("id").defaultRandom().primaryKey(),
  ipHash: varchar("ip_hash", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));
