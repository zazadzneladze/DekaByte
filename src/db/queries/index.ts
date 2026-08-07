import { cacheLife, cacheTag, updateTag } from "next/cache";
import { eq, and, desc, asc } from "drizzle-orm";
import { getDb } from "@/db";
import {
  projects,
  projectImages,
  siteSettings,
  leads,
  adminUsers,
  clientUsers,
  clientProjects,
  clientAssets,
  clientMessages,
  clientInvoices,
  clientPushSubscriptions,
  pushSubscriptions,
} from "@/db/schema";
import { siteDefaults } from "@/config/site";
import type { ProjectCategoryId } from "@/config/categories";
import {
  defaultEstimateConfig,
  mergeEstimateConfig,
  type EstimateConfig,
} from "@/config/estimate";

export const CACHE_TAGS = {
  projects: "projects",
  featured: "featured-projects-v2",
  siteSettings: "site-settings",
  estimate: "estimate-config",
  project: (slug: string) => `project:${slug}`,
} as const;

export async function getPublicSiteSettings() {
  "use cache";
  cacheTag(CACHE_TAGS.siteSettings);
  cacheLife("days");

  try {
    const db = getDb();
    const row = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.id, 1),
    });
    if (!row) return { ...siteDefaults };
    return {
      brandName: row.brandName,
      phoneDisplay: row.phoneDisplay,
      phoneE164: row.phoneE164,
      whatsappNumber: row.whatsappNumber,
      email: row.email,
      facebookUrl: row.facebookUrl,
      messengerUrl: row.messengerUrl,
      instagramUrl: row.instagramUrl,
      linkedinUrl: row.linkedinUrl,
      githubUrl: row.githubUrl,
      defaultSeoTitle: row.defaultSeoTitle,
      defaultSeoDescription: row.defaultSeoDescription,
      logoUrl: row.logoUrl,
    };
  } catch {
    return { ...siteDefaults };
  }
}

export async function getPublishedProjects(category?: ProjectCategoryId | "all") {
  "use cache";
  cacheTag(CACHE_TAGS.projects);
  cacheLife("hours");

  try {
    const db = getDb();
    const rows = await db.query.projects.findMany({
      where:
        category && category !== "all"
          ? and(eq(projects.status, "published"), eq(projects.category, category))
          : eq(projects.status, "published"),
      orderBy: [asc(projects.sortOrder), desc(projects.publishedAt)],
      with: { images: { orderBy: [asc(projectImages.sortOrder)] } },
    });
    return rows;
  } catch {
    return [];
  }
}

export async function getFeaturedProjects() {
  "use cache";
  cacheTag(CACHE_TAGS.featured);
  cacheTag(CACHE_TAGS.projects);
  cacheLife("hours");

  try {
    const db = getDb();
    return await db.query.projects.findMany({
      where: and(eq(projects.status, "published"), eq(projects.featured, true)),
      orderBy: [asc(projects.sortOrder), desc(projects.publishedAt)],
      with: { images: { orderBy: [asc(projectImages.sortOrder)], limit: 1 } },
    });
  } catch {
    return [];
  }
}

export async function getPublishedProjectBySlug(slug: string) {
  "use cache";
  cacheTag(CACHE_TAGS.project(slug));
  cacheTag(CACHE_TAGS.projects);
  cacheLife("hours");

  try {
    const db = getDb();
    return await db.query.projects.findFirst({
      where: and(eq(projects.slug, slug), eq(projects.status, "published")),
      with: { images: { orderBy: [asc(projectImages.sortOrder)] } },
    });
  } catch {
    return null;
  }
}

export async function getAdjacentPublishedProjects(slug: string) {
  const list = await getPublishedProjects();
  const index = list.findIndex((p) => p.slug === slug);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
  };
}

/** Same-category published projects for case-study cross-links. */
export async function getRelatedPublishedProjects(
  slug: string,
  category: ProjectCategoryId,
  limit = 3,
) {
  const list = await getPublishedProjects(category);
  return list.filter((p) => p.slug !== slug).slice(0, limit);
}

export function invalidateProjectCaches(slug?: string) {
  updateTag(CACHE_TAGS.projects);
  updateTag(CACHE_TAGS.featured);
  if (slug) updateTag(CACHE_TAGS.project(slug));
}

export function invalidateSiteSettingsCache() {
  updateTag(CACHE_TAGS.siteSettings);
  updateTag(CACHE_TAGS.estimate);
}

export async function getEstimateConfig(): Promise<EstimateConfig> {
  "use cache";
  cacheTag(CACHE_TAGS.estimate);
  cacheTag(CACHE_TAGS.siteSettings);
  cacheLife("hours");

  try {
    const db = getDb();
    const row = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.id, 1),
      columns: { estimateConfig: true },
    });
    return mergeEstimateConfig(row?.estimateConfig ?? null);
  } catch {
    return structuredClone(defaultEstimateConfig);
  }
}

/** Always-fresh admin reads — never use cache helpers here. */
export async function adminGetProjects() {
  const db = getDb();
  return db.query.projects.findMany({
    orderBy: [asc(projects.sortOrder), desc(projects.updatedAt)],
  });
}

export async function adminGetProject(id: string) {
  const db = getDb();
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { images: { orderBy: [asc(projectImages.sortOrder)] } },
  });
}

export async function adminGetLeads() {
  const db = getDb();
  return db.query.leads.findMany({ orderBy: [desc(leads.createdAt)] });
}

export async function adminGetLead(id: string) {
  const db = getDb();
  return db.query.leads.findFirst({ where: eq(leads.id, id) });
}

export async function adminGetDashboardStats() {
  const db = getDb();
  const [allProjects, allLeads, clientProjectRows, threads] = await Promise.all([
    db.select().from(projects),
    db.select().from(leads),
    db.select().from(clientProjects),
    adminListMessageThreads(),
  ]);

  const unreadMessages = threads.reduce((sum, t) => sum + t.unreadCount, 0);
  const activeClientProjects = clientProjectRows.filter(
    (p) => p.status !== "done",
  ).length;

  return {
    totalProjects: allProjects.length,
    publishedProjects: allProjects.filter((p) => p.status === "published").length,
    draftProjects: allProjects.filter((p) => p.status === "draft").length,
    featuredProjects: allProjects.filter((p) => p.featured).length,
    newLeads: allLeads.filter((l) => l.status === "new").length,
    clientProjects: clientProjectRows.length,
    activeClientProjects,
    unreadMessages,
    recentLeads: allLeads
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5),
    recentThreads: threads.slice(0, 5),
  };
}

export async function adminGetSiteSettings() {
  const db = getDb();
  const row = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, 1),
  });
  return row ?? null;
}

export async function adminGetUserByEmail(email: string) {
  const db = getDb();
  return db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email.toLowerCase()),
  });
}

/* ——— Client portal ——— */

export async function clientEmailHasProjectAccess(email: string) {
  const db = getDb();
  const normalized = email.toLowerCase();
  const row = await db.query.clientProjects.findFirst({
    where: eq(clientProjects.clientEmail, normalized),
    columns: { id: true },
  });
  return Boolean(row);
}

export async function upsertClientUserFromGoogle(input: {
  email: string;
  googleSub: string | null;
  image: string | null;
}) {
  const db = getDb();
  const email = input.email.toLowerCase();
  const existing = await db.query.clientUsers.findFirst({
    where: eq(clientUsers.email, email),
  });

  if (existing) {
    const [updated] = await db
      .update(clientUsers)
      .set({
        googleSub: input.googleSub ?? existing.googleSub,
        image: input.image ?? existing.image,
        updatedAt: new Date(),
      })
      .where(eq(clientUsers.id, existing.id))
      .returning();
    return updated ?? existing;
  }

  const [created] = await db
    .insert(clientUsers)
    .values({
      email,
      googleSub: input.googleSub,
      image: input.image,
    })
    .returning();

  if (!created) {
    throw new Error("client_users insert failed");
  }
  return created;
}

export async function getClientUserByEmail(email: string) {
  const db = getDb();
  return db.query.clientUsers.findFirst({
    where: eq(clientUsers.email, email.toLowerCase()),
  });
}

export async function getClientUserById(id: string) {
  const db = getDb();
  return db.query.clientUsers.findFirst({
    where: eq(clientUsers.id, id),
  });
}

export async function portalListProjects(clientEmail: string) {
  const db = getDb();
  return db.query.clientProjects.findMany({
    where: eq(clientProjects.clientEmail, clientEmail.toLowerCase()),
    orderBy: [desc(clientProjects.updatedAt)],
  });
}

export async function portalGetProject(id: string, clientEmail: string) {
  const db = getDb();
  return db.query.clientProjects.findFirst({
    where: and(
      eq(clientProjects.id, id),
      eq(clientProjects.clientEmail, clientEmail.toLowerCase()),
    ),
    with: {
      assets: { orderBy: [asc(clientAssets.sortOrder), desc(clientAssets.createdAt)] },
      messages: { orderBy: [asc(clientMessages.createdAt)] },
      invoices: { orderBy: [desc(clientInvoices.createdAt)] },
    },
  });
}

export async function adminListClientProjects() {
  const db = getDb();
  return db.query.clientProjects.findMany({
    orderBy: [desc(clientProjects.updatedAt)],
  });
}

export async function adminGetClientProject(id: string) {
  const db = getDb();
  return db.query.clientProjects.findFirst({
    where: eq(clientProjects.id, id),
    with: {
      assets: { orderBy: [asc(clientAssets.sortOrder), desc(clientAssets.createdAt)] },
      messages: { orderBy: [asc(clientMessages.createdAt)] },
      invoices: { orderBy: [desc(clientInvoices.createdAt)] },
    },
  });
}

export async function adminGetClientUserByEmail(email: string) {
  return getClientUserByEmail(email);
}

export type AdminMessageThread = {
  projectId: string;
  projectTitle: string;
  clientEmail: string;
  lastMessageAt: Date;
  lastBody: string;
  unreadCount: number;
};

export async function adminListMessageThreads(): Promise<AdminMessageThread[]> {
  const db = getDb();
  const projectsList = await db.query.clientProjects.findMany({
    with: {
      messages: {
        orderBy: [desc(clientMessages.createdAt)],
      },
    },
    orderBy: [desc(clientProjects.updatedAt)],
  });

  const threads: AdminMessageThread[] = [];
  for (const project of projectsList) {
    const clientMsgs = project.messages.filter((m) => m.authorRole === "client");
    if (clientMsgs.length === 0) continue;
    const last = clientMsgs[0]!;
    const readAt = project.adminMessagesReadAt;
    const unreadCount = clientMsgs.filter(
      (m) => !readAt || m.createdAt > readAt,
    ).length;
    threads.push({
      projectId: project.id,
      projectTitle: project.title,
      clientEmail: project.clientEmail,
      lastMessageAt: last.createdAt,
      lastBody: last.body,
      unreadCount,
    });
  }

  return threads.sort(
    (a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime(),
  );
}

export async function adminGetInboxBadgeCount() {
  const db = getDb();
  const [threads, newLeadRows] = await Promise.all([
    adminListMessageThreads(),
    db
      .select()
      .from(leads)
      .where(eq(leads.status, "new")),
  ]);
  const unreadMessages = threads.reduce((sum, t) => sum + t.unreadCount, 0);
  return {
    unreadMessages,
    newLeads: newLeadRows.length,
    total: unreadMessages + newLeadRows.length,
  };
}

export async function listPushSubscriptions() {
  const db = getDb();
  return db.select().from(pushSubscriptions);
}

export async function deletePushSubscriptionByEndpoint(endpoint: string) {
  const db = getDb();
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
}

export async function listClientPushSubscriptions(clientUserId: string) {
  const db = getDb();
  return db
    .select()
    .from(clientPushSubscriptions)
    .where(eq(clientPushSubscriptions.clientUserId, clientUserId));
}

export async function deleteClientPushSubscriptionByEndpoint(endpoint: string) {
  const db = getDb();
  await db
    .delete(clientPushSubscriptions)
    .where(eq(clientPushSubscriptions.endpoint, endpoint));
}
