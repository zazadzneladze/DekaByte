"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { clientMessages, clientProjects, clientUsers } from "@/db/schema";
import {
  getClientUserById,
  portalGetProject,
} from "@/db/queries";
import { deleteBlobSafe } from "@/lib/blob";
import { requireClientSession } from "@/lib/session";
import { notifyAdminsOfClientMessage } from "@/actions/clients";
import { unstable_update } from "@/lib/auth";
import {
  clientMessageSchema,
  clientProfileSchema,
} from "@/validators/client-portal";

export type PortalActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateClientProfile(
  raw: unknown,
): Promise<PortalActionResult> {
  const user = await requireClientSession();
  const parsed = clientProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const db = getDb();
  const existing = await getClientUserById(user.id);
  if (!existing) return { ok: false, error: "პროფილი ვერ მოიძებნა" };

  const nextAvatarPath =
    parsed.data.avatarPathname !== undefined
      ? parsed.data.avatarPathname
      : existing.avatarPathname;

  if (
    existing.avatarPathname &&
    nextAvatarPath &&
    existing.avatarPathname !== nextAvatarPath
  ) {
    await deleteBlobSafe(existing.avatarPathname);
  }
  if (parsed.data.avatarPathname === null && existing.avatarPathname) {
    await deleteBlobSafe(existing.avatarPathname);
  }

  await db
    .update(clientUsers)
    .set({
      displayName: parsed.data.displayName,
      avatarUrl:
        parsed.data.avatarUrl !== undefined
          ? parsed.data.avatarUrl
          : existing.avatarUrl,
      avatarPathname:
        parsed.data.avatarPathname !== undefined
          ? parsed.data.avatarPathname
          : existing.avatarPathname,
      updatedAt: new Date(),
    })
    .where(eq(clientUsers.id, user.id));

  const avatarUrl =
    parsed.data.avatarUrl !== undefined
      ? parsed.data.avatarUrl
      : existing.avatarUrl;

  await unstable_update({
    user: {
      displayName: parsed.data.displayName,
      image: avatarUrl || existing.image,
      needsOnboarding: false,
    },
  });

  revalidatePath("/portal");
  revalidatePath("/portal/profile");
  revalidatePath("/portal/onboarding");
  return { ok: true, data: undefined };
}

export async function clearClientAvatar(): Promise<PortalActionResult> {
  const user = await requireClientSession();
  const db = getDb();
  const existing = await getClientUserById(user.id);
  if (!existing) return { ok: false, error: "პროფილი ვერ მოიძებნა" };

  await deleteBlobSafe(existing.avatarPathname);
  await db
    .update(clientUsers)
    .set({
      avatarUrl: null,
      avatarPathname: null,
      updatedAt: new Date(),
    })
    .where(eq(clientUsers.id, user.id));

  await unstable_update({
    user: {
      displayName: existing.displayName,
      image: existing.image,
      needsOnboarding: !existing.displayName?.trim(),
    },
  });

  revalidatePath("/portal/profile");
  revalidatePath("/portal/onboarding");
  return { ok: true, data: undefined };
}

export async function sendClientMessage(
  raw: unknown,
): Promise<PortalActionResult<{ id: string }>> {
  const user = await requireClientSession();
  const parsed = clientMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
    };
  }

  const project = await portalGetProject(parsed.data.projectId, user.email);
  if (!project) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  const db = getDb();
  const [row] = await db
    .insert(clientMessages)
    .values({
      projectId: parsed.data.projectId,
      authorRole: "client",
      authorEmail: user.email,
      body: parsed.data.body,
    })
    .returning({ id: clientMessages.id });

  if (!row) return { ok: false, error: "გაგზავნა ვერ მოხერხდა" };

  await db
    .update(clientProjects)
    .set({ updatedAt: new Date() })
    .where(eq(clientProjects.id, parsed.data.projectId));

  const label = user.displayName?.trim() || user.email;
  void notifyAdminsOfClientMessage({
    projectTitle: project.title,
    clientLabel: label,
    projectId: project.id,
  });

  revalidatePath(`/portal/projects/${project.id}`);
  revalidatePath(`/admin/clients/${project.id}`);
  return { ok: true, data: { id: row.id } };
}
