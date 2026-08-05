"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { projects, projectImages } from "@/db/schema";
import {
  adminGetProject,
  invalidateProjectCaches,
} from "@/db/queries";
import { projectSchema, type ProjectInput } from "@/validators/project";
import { deleteBlobSafe } from "@/lib/blob";
import { slugify } from "@/lib/security";
import type { ProjectImage } from "@/types";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

async function ensureUniqueSlug(desired: string, excludeId?: string) {
  const db = getDb();
  let candidate = desired;
  let attempt = 0;

  while (attempt < 50) {
    const existing = await db.query.projects.findFirst({
      where: eq(projects.slug, candidate),
      columns: { id: true },
    });
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    attempt += 1;
    candidate = `${desired}-${attempt + 1}`;
  }

  return `${desired}-${Date.now().toString(36)}`;
}

function mapProjectFields(input: ProjectInput) {
  const publishedAt =
    input.status === "published"
      ? (input.publishedAt ?? new Date())
      : null;

  return {
    title: input.title,
    slug: input.slug,
    category: input.category,
    shortDescription: input.shortDescription,
    overview: input.overview ?? "",
    challenge: input.challenge ?? "",
    solution: input.solution ?? "",
    features: input.features ?? [],
    technologies: input.technologies ?? [],
    coverImageUrl: input.coverImageUrl,
    coverImagePathname: input.coverImagePathname,
    coverImageAlt: input.coverImageAlt,
    liveUrl: input.liveUrl,
    externalUrl: input.externalUrl,
    status: input.status,
    featured: input.featured,
    sortOrder: input.sortOrder,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    publishedAt,
    updatedAt: new Date(),
  };
}

export type GalleryImageInput = {
  id?: string;
  url: string;
  pathname: string;
  alt: string;
  caption: string | null;
  sortOrder: number;
  width?: number | null;
  height?: number | null;
};

async function syncGallery(
  projectId: string,
  images: GalleryImageInput[] | undefined,
) {
  if (images === undefined) return { warnings: [] as string[] };

  const db = getDb();
  const warnings: string[] = [];
  const existing = await db.query.projectImages.findMany({
    where: eq(projectImages.projectId, projectId),
  });

  const keepIds = new Set(
    images.map((img) => img.id).filter((id): id is string => Boolean(id)),
  );

  for (const row of existing) {
    if (keepIds.has(row.id)) continue;

    await db.delete(projectImages).where(eq(projectImages.id, row.id));
    const blobResult = await deleteBlobSafe(row.pathname);
    if (!blobResult.ok) {
      warnings.push(
        `გალერეის სურათი წაიშალა ბაზიდან, მაგრამ Blob ვერ წაიშალა (${row.pathname})`,
      );
    }
  }

  for (const [index, img] of images.entries()) {
    const sortOrder = img.sortOrder ?? index;
    if (img.id) {
      await db
        .update(projectImages)
        .set({
          url: img.url,
          pathname: img.pathname,
          alt: img.alt ?? "",
          caption: img.caption,
          sortOrder,
          width: img.width ?? null,
          height: img.height ?? null,
        })
        .where(eq(projectImages.id, img.id));
    } else {
      await db.insert(projectImages).values({
        projectId,
        url: img.url,
        pathname: img.pathname,
        alt: img.alt ?? "",
        caption: img.caption,
        sortOrder,
        width: img.width ?? null,
        height: img.height ?? null,
      });
    }
  }

  return { warnings };
}

export async function createProject(
  raw: unknown,
  gallery?: GalleryImageInput[],
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "ვალიდაცია ვერ გაიარა",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const slug = await ensureUniqueSlug(parsed.data.slug);
  const db = getDb();
  const fields = mapProjectFields({ ...parsed.data, slug });

  const [row] = await db
    .insert(projects)
    .values({
      ...fields,
      createdAt: new Date(),
    })
    .returning({ id: projects.id, slug: projects.slug });

  const { warnings } = await syncGallery(row.id, gallery);

  invalidateProjectCaches(row.slug);
  revalidatePath("/admin/projects");
  revalidatePath("/admin");

  if (warnings.length) {
    return {
      ok: true,
      data: { id: row.id },
    };
  }

  return { ok: true, data: { id: row.id } };
}

export async function updateProject(
  id: string,
  raw: unknown,
  gallery?: GalleryImageInput[],
): Promise<ActionResult<{ id: string; warnings?: string[] }>> {
  await requireAdmin();

  const existing = await adminGetProject(id);
  if (!existing) {
    return { ok: false, error: "პროექტი ვერ მოიძებნა" };
  }

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "ვალიდაცია ვერ გაიარა",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const slug = await ensureUniqueSlug(parsed.data.slug, id);
  const db = getDb();

  const oldCoverPath = existing.coverImagePathname;
  const newCoverPath = parsed.data.coverImagePathname;
  const coverChanged =
    oldCoverPath && oldCoverPath !== newCoverPath ? oldCoverPath : null;

  const publishedAt =
    parsed.data.status === "published"
      ? (existing.publishedAt ?? parsed.data.publishedAt ?? new Date())
      : null;

  await db
    .update(projects)
    .set({
      ...mapProjectFields({ ...parsed.data, slug }),
      publishedAt,
    })
    .where(eq(projects.id, id));

  const { warnings } = await syncGallery(id, gallery);

  if (coverChanged) {
    const blobResult = await deleteBlobSafe(coverChanged);
    if (!blobResult.ok) {
      warnings.push(
        "ძველი ქავერი განახლდა ბაზაში, მაგრამ ძველი Blob ვერ წაიშალა",
      );
    }
  }

  invalidateProjectCaches(existing.slug);
  if (slug !== existing.slug) {
    invalidateProjectCaches(slug);
  }
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/admin");

  return {
    ok: true,
    data: {
      id,
      warnings: warnings.length ? warnings : undefined,
    },
  };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await adminGetProject(id);
  if (!existing) {
    return { ok: false, error: "პროექტი ვერ მოიძებნა" };
  }

  const db = getDb();
  const warnings: string[] = [];

  for (const img of existing.images) {
    const blobResult = await deleteBlobSafe(img.pathname);
    if (!blobResult.ok) {
      warnings.push(`Blob ვერ წაიშალა: ${img.pathname}`);
    }
  }

  if (existing.coverImagePathname) {
    const blobResult = await deleteBlobSafe(existing.coverImagePathname);
    if (!blobResult.ok) {
      warnings.push(`ქავერის Blob ვერ წაიშალა: ${existing.coverImagePathname}`);
    }
  }

  await db.delete(projects).where(eq(projects.id, id));

  invalidateProjectCaches(existing.slug);
  revalidatePath("/admin/projects");
  revalidatePath("/admin");

  if (warnings.length) {
    return {
      ok: false,
      error: `პროექტი წაიშალა ბაზიდან, მაგრამ ზოგიერთი ფაილი ვერ წაიშალა: ${warnings.join("; ")}`,
    };
  }

  return { ok: true, data: undefined };
}

export async function duplicateProject(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const existing = await adminGetProject(id);
  if (!existing) {
    return { ok: false, error: "პროექტი ვერ მოიძებნა" };
  }

  const baseSlug = slugify(`${existing.slug}-copy`) || `copy-${Date.now().toString(36)}`;
  const slug = await ensureUniqueSlug(baseSlug);
  const db = getDb();

  const [row] = await db
    .insert(projects)
    .values({
      title: `${existing.title} (ასლი)`,
      slug,
      category: existing.category,
      shortDescription: existing.shortDescription,
      overview: existing.overview,
      challenge: existing.challenge,
      solution: existing.solution,
      features: existing.features,
      technologies: existing.technologies,
      coverImageUrl: existing.coverImageUrl,
      coverImagePathname: existing.coverImagePathname,
      coverImageAlt: existing.coverImageAlt,
      liveUrl: existing.liveUrl,
      externalUrl: existing.externalUrl,
      status: "draft",
      featured: false,
      sortOrder: existing.sortOrder,
      seoTitle: existing.seoTitle,
      seoDescription: existing.seoDescription,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: projects.id });

  if (existing.images.length) {
    await db.insert(projectImages).values(
      existing.images.map((img: ProjectImage, index: number) => ({
        projectId: row.id,
        url: img.url,
        pathname: img.pathname,
        alt: img.alt,
        caption: img.caption,
        width: img.width,
        height: img.height,
        sortOrder: img.sortOrder ?? index,
      })),
    );
  }

  invalidateProjectCaches();
  revalidatePath("/admin/projects");

  return { ok: true, data: { id: row.id } };
}

export async function publishProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await adminGetProject(id);
  if (!existing) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  const db = getDb();
  await db
    .update(projects)
    .set({
      status: "published",
      publishedAt: existing.publishedAt ?? new Date(),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  invalidateProjectCaches(existing.slug);
  revalidatePath("/admin/projects");
  return { ok: true, data: undefined };
}

export async function unpublishProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await adminGetProject(id);
  if (!existing) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  const db = getDb();
  await db
    .update(projects)
    .set({
      status: "draft",
      publishedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  invalidateProjectCaches(existing.slug);
  revalidatePath("/admin/projects");
  return { ok: true, data: undefined };
}

export async function setProjectFeatured(
  id: string,
  featured: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const existing = await adminGetProject(id);
  if (!existing) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  const db = getDb();
  await db
    .update(projects)
    .set({ featured, updatedAt: new Date() })
    .where(eq(projects.id, id));

  invalidateProjectCaches(existing.slug);
  revalidatePath("/admin/projects");
  return { ok: true, data: undefined };
}

export async function reorderProjects(
  orderedIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const db = getDb();

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(projects)
        .set({ sortOrder: (index + 1) * 10, updatedAt: new Date() })
        .where(eq(projects.id, id)),
    ),
  );

  invalidateProjectCaches();
  revalidatePath("/admin/projects");
  return { ok: true, data: undefined };
}

export async function deleteProjectImage(
  imageId: string,
): Promise<ActionResult<{ warning?: string }>> {
  await requireAdmin();
  const db = getDb();

  const image = await db.query.projectImages.findFirst({
    where: eq(projectImages.id, imageId),
  });
  if (!image) {
    return { ok: false, error: "სურათი ვერ მოიძებნა" };
  }

  const project = await adminGetProject(image.projectId);

  await db.delete(projectImages).where(eq(projectImages.id, imageId));
  const blobResult = await deleteBlobSafe(image.pathname);

  if (project) {
    invalidateProjectCaches(project.slug);
  }
  revalidatePath(`/admin/projects/${image.projectId}/edit`);

  if (!blobResult.ok) {
    return {
      ok: true,
      data: {
        warning:
          "სურათი წაიშალა ბაზიდან, მაგრამ Blob ვერ წაიშალა. სცადეთ ხელახლა ან წაშალეთ მანუალურად.",
      },
    };
  }

  return { ok: true, data: {} };
}

export async function reorderProjectImages(
  projectId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const db = getDb();
  const project = await adminGetProject(projectId);
  if (!project) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(projectImages)
        .set({ sortOrder: index })
        .where(eq(projectImages.id, id)),
    ),
  );

  // Touch project updatedAt
  await db
    .update(projects)
    .set({ updatedAt: new Date() })
    .where(eq(projects.id, projectId));

  invalidateProjectCaches(project.slug);
  revalidatePath(`/admin/projects/${projectId}/edit`);
  return { ok: true, data: undefined };
}

export async function updateProjectImageMeta(
  imageId: string,
  data: { alt?: string; caption?: string | null },
): Promise<ActionResult> {
  await requireAdmin();
  const db = getDb();

  const image = await db.query.projectImages.findFirst({
    where: eq(projectImages.id, imageId),
  });
  if (!image) return { ok: false, error: "სურათი ვერ მოიძებნა" };

  await db
    .update(projectImages)
    .set({
      alt: data.alt ?? image.alt,
      caption: data.caption === undefined ? image.caption : data.caption,
    })
    .where(eq(projectImages.id, imageId));

  const project = await adminGetProject(image.projectId);
  if (project) invalidateProjectCaches(project.slug);

  return { ok: true, data: undefined };
}

/** Delete a blob that is not (or no longer) referenced by a DB row. */
export async function deleteOrphanBlob(
  pathname: string,
): Promise<ActionResult<{ warning?: string }>> {
  await requireAdmin();
  if (!pathname.startsWith("projects/")) {
    return { ok: false, error: "არასწორი pathname" };
  }
  const blobResult = await deleteBlobSafe(pathname);
  if (!blobResult.ok) {
    return {
      ok: true,
      data: { warning: blobResult.error },
    };
  }
  return { ok: true, data: {} };
}
