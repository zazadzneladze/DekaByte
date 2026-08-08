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
import type { EstimateConfig } from "@/config/estimate";
import type { InvoiceBankConfig } from "@/config/invoice";

export const projectStatusEnum = pgEnum("project_status", ["draft", "published"]);
export const projectCategoryEnum = pgEnum("project_category", [
  "websites",
  "web_apps",
  "android",
  "ui_ux",
  "ai_tools",
  "systems",
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
  logoUrl: text("logo_url"),
  logoPathname: text("logo_pathname"),
  invoiceSupplierSignatureUrl: text("invoice_supplier_signature_url"),
  invoiceSupplierSignaturePathname: text("invoice_supplier_signature_pathname"),
  invoiceSupplierSignatureTransform: jsonb(
    "invoice_supplier_signature_transform",
  ).$type<{
    offsetX: number;
    offsetY: number;
    rotate: number;
  } | null>(),
  invoiceBankConfig: jsonb("invoice_bank_config").$type<InvoiceBankConfig | null>(),
  estimateConfig: jsonb("estimate_config").$type<EstimateConfig | null>(),
  heroVisual: varchar("hero_visual", { length: 16 }).notNull().default("mark"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leadRateLimits = pgTable("lead_rate_limits", {
  id: uuid("id").defaultRandom().primaryKey(),
  ipHash: varchar("ip_hash", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ——— Client portal ——— */

export const clientProjectStatusEnum = pgEnum("client_project_status", [
  "upcoming",
  "in_progress",
  "review",
  "done",
  "archived",
]);

export const clientAssetKindEnum = pgEnum("client_asset_kind", [
  "screenshot",
  "document",
  "other",
]);

export const clientMessageRoleEnum = pgEnum("client_message_role", [
  "admin",
  "client",
]);

export const clientInvoiceStatusEnum = pgEnum("client_invoice_status", [
  "draft",
  "sent",
  "paid",
]);

export const clientUsers = pgTable(
  "client_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    displayName: varchar("display_name", { length: 160 }),
    phone: varchar("phone", { length: 40 }),
    address: text("address"),
    image: text("image"),
    avatarUrl: text("avatar_url"),
    avatarPathname: text("avatar_pathname"),
    invoiceSignatureUrl: text("invoice_signature_url"),
    invoiceSignaturePathname: text("invoice_signature_pathname"),
    invoiceSignatureTransform: jsonb("invoice_signature_transform").$type<{
      offsetX: number;
      offsetY: number;
      rotate: number;
    } | null>(),
    googleSub: varchar("google_sub", { length: 255 }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("client_users_email_idx").on(t.email)],
);

export const clientProjects = pgTable(
  "client_projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    status: clientProjectStatusEnum("status").notNull().default("upcoming"),
    progressPercent: integer("progress_percent").notNull().default(0),
    clientEmail: varchar("client_email", { length: 255 }).notNull(),
    notes: text("notes").notNull().default(""),
    portfolioProjectId: uuid("portfolio_project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    adminMessagesReadAt: timestamp("admin_messages_read_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("client_projects_email_idx").on(t.clientEmail),
    index("client_projects_status_idx").on(t.status),
  ],
);

export const clientAssets = pgTable(
  "client_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    pathname: text("pathname").notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mime: varchar("mime", { length: 120 }).notNull(),
    size: integer("size"),
    kind: clientAssetKindEnum("kind").notNull().default("other"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("client_assets_project_id_idx").on(t.projectId)],
);

export const clientMessages = pgTable(
  "client_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    authorRole: clientMessageRoleEnum("author_role").notNull(),
    authorEmail: varchar("author_email", { length: 255 }).notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("client_messages_project_created_idx").on(t.projectId, t.createdAt)],
);

export const clientInvoices = pgTable(
  "client_invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    invoiceNumber: varchar("invoice_number", { length: 40 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    amountGel: integer("amount_gel").notNull(),
    status: clientInvoiceStatusEnum("status").notNull().default("draft"),
    bodyHtml: text("body_html").notNull().default(""),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
    paymentStage: varchar("payment_stage", { length: 120 }).notNull().default(""),
    currency: varchar("currency", { length: 8 }).notNull().default("GEL"),
    contractRef: text("contract_ref").notNull().default(""),
    recipientName: varchar("recipient_name", { length: 200 }),
    recipientPersonalId: varchar("recipient_personal_id", { length: 40 }),
    recipientAddress: text("recipient_address"),
    recipientPhone: varchar("recipient_phone", { length: 40 }),
    recipientContactPerson: varchar("recipient_contact_person", { length: 200 }),
    recipientEmail: varchar("recipient_email", { length: 255 }),
    recipientIsCompany: boolean("recipient_is_company").notNull().default(false),
    lineItems: jsonb("line_items")
      .$type<{ description: string; qty: number; unitPrice: number }[]>()
      .notNull()
      .default([]),
    discountGel: integer("discount_gel").notNull().default(0),
    discountPercent: integer("discount_percent").notNull().default(0),
    subtotalGel: integer("subtotal_gel").notNull().default(0),
    taxWithheldGel: integer("tax_withheld_gel").notNull().default(0),
    netGel: integer("net_gel").notNull().default(0),
    supplierSignatureUrl: text("supplier_signature_url"),
    clientSignatureUrl: text("client_signature_url"),
    pdfUrl: text("pdf_url"),
    pdfPathname: text("pdf_pathname"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("client_invoices_project_id_idx").on(t.projectId),
    index("client_invoices_number_idx").on(t.invoiceNumber),
  ],
);

export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adminUserId: uuid("admin_user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("push_subscriptions_admin_idx").on(t.adminUserId)],
);

export const clientPushSubscriptions = pgTable(
  "client_push_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientUserId: uuid("client_user_id")
      .notNull()
      .references(() => clientUsers.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("client_push_subscriptions_user_idx").on(t.clientUserId)],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

export const clientProjectsRelations = relations(clientProjects, ({ many, one }) => ({
  assets: many(clientAssets),
  messages: many(clientMessages),
  invoices: many(clientInvoices),
  portfolioProject: one(projects, {
    fields: [clientProjects.portfolioProjectId],
    references: [projects.id],
  }),
}));

export const clientAssetsRelations = relations(clientAssets, ({ one }) => ({
  project: one(clientProjects, {
    fields: [clientAssets.projectId],
    references: [clientProjects.id],
  }),
}));

export const clientMessagesRelations = relations(clientMessages, ({ one }) => ({
  project: one(clientProjects, {
    fields: [clientMessages.projectId],
    references: [clientProjects.id],
  }),
}));

export const clientInvoicesRelations = relations(clientInvoices, ({ one }) => ({
  project: one(clientProjects, {
    fields: [clientInvoices.projectId],
    references: [clientProjects.id],
  }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [pushSubscriptions.adminUserId],
    references: [adminUsers.id],
  }),
}));

export const clientPushSubscriptionsRelations = relations(
  clientPushSubscriptions,
  ({ one }) => ({
    clientUser: one(clientUsers, {
      fields: [clientPushSubscriptions.clientUserId],
      references: [clientUsers.id],
    }),
  }),
);
