"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  clientAssets,
  clientInvoices,
  clientMessages,
  clientProjects,
} from "@/db/schema";
import {
  adminGetClientProject,
} from "@/db/queries";
import { deleteBlobSafe } from "@/lib/blob";
import { sendAdminPush } from "@/lib/push";
import { requireAdminSession } from "@/lib/session";
import {
  clientAssetMetaSchema,
  clientInvoiceSchema,
  clientInvoiceUpdateSchema,
  clientMessageSchema,
  clientProjectSchema,
} from "@/validators/client-portal";

export type ClientActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function revalidateClientProject(id: string) {
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/portal");
  revalidatePath(`/portal/projects/${id}`);
}

export async function createClientProject(
  raw: unknown,
): Promise<ClientActionResult<{ id: string }>> {
  await requireAdminSession();
  const parsed = clientProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const db = getDb();
  const [row] = await db
    .insert(clientProjects)
    .values({
      title: parsed.data.title,
      status: parsed.data.status,
      clientEmail: parsed.data.clientEmail,
      notes: parsed.data.notes ?? "",
    })
    .returning({ id: clientProjects.id });

  if (!row) return { ok: false, error: "შენახვა ვერ მოხერხდა" };

  revalidateClientProject(row.id);
  return { ok: true, data: { id: row.id } };
}

export async function updateClientProject(
  id: string,
  raw: unknown,
): Promise<ClientActionResult> {
  await requireAdminSession();
  const parsed = clientProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const db = getDb();
  const existing = await adminGetClientProject(id);
  if (!existing) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  await db
    .update(clientProjects)
    .set({
      title: parsed.data.title,
      status: parsed.data.status,
      clientEmail: parsed.data.clientEmail,
      notes: parsed.data.notes ?? "",
      updatedAt: new Date(),
    })
    .where(eq(clientProjects.id, id));

  revalidateClientProject(id);
  return { ok: true, data: undefined };
}

export async function deleteClientProject(
  id: string,
): Promise<ClientActionResult> {
  await requireAdminSession();
  const existing = await adminGetClientProject(id);
  if (!existing) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  for (const asset of existing.assets) {
    await deleteBlobSafe(asset.pathname);
  }
  for (const invoice of existing.invoices) {
    await deleteBlobSafe(invoice.pdfPathname);
  }

  const db = getDb();
  await db.delete(clientProjects).where(eq(clientProjects.id, id));

  revalidatePath("/admin/clients");
  revalidatePath("/portal");
  return { ok: true, data: undefined };
}

export async function addClientAsset(
  raw: unknown,
): Promise<ClientActionResult<{ id: string }>> {
  await requireAdminSession();
  const parsed = clientAssetMetaSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
    };
  }

  const project = await adminGetClientProject(parsed.data.projectId);
  if (!project) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  const db = getDb();
  const [row] = await db
    .insert(clientAssets)
    .values({
      projectId: parsed.data.projectId,
      url: parsed.data.url,
      pathname: parsed.data.pathname,
      filename: parsed.data.filename,
      mime: parsed.data.mime,
      size: parsed.data.size ?? null,
      kind: parsed.data.kind,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning({ id: clientAssets.id });

  if (!row) return { ok: false, error: "ფაილის შენახვა ვერ მოხერხდა" };

  await db
    .update(clientProjects)
    .set({ updatedAt: new Date() })
    .where(eq(clientProjects.id, parsed.data.projectId));

  revalidateClientProject(parsed.data.projectId);
  return { ok: true, data: { id: row.id } };
}

export async function deleteClientAsset(
  id: string,
): Promise<ClientActionResult> {
  await requireAdminSession();
  const db = getDb();
  const row = await db.query.clientAssets.findFirst({
    where: eq(clientAssets.id, id),
  });
  if (!row) return { ok: false, error: "ფაილი ვერ მოიძებნა" };

  await db.delete(clientAssets).where(eq(clientAssets.id, id));
  await deleteBlobSafe(row.pathname);
  revalidateClientProject(row.projectId);
  return { ok: true, data: undefined };
}

export async function sendAdminClientMessage(
  raw: unknown,
): Promise<ClientActionResult<{ id: string }>> {
  const admin = await requireAdminSession();
  const parsed = clientMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
    };
  }

  const project = await adminGetClientProject(parsed.data.projectId);
  if (!project) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  const db = getDb();
  const [row] = await db
    .insert(clientMessages)
    .values({
      projectId: parsed.data.projectId,
      authorRole: "admin",
      authorEmail: admin.email,
      body: parsed.data.body,
    })
    .returning({ id: clientMessages.id });

  if (!row) return { ok: false, error: "გაგზავნა ვერ მოხერხდა" };

  await db
    .update(clientProjects)
    .set({ updatedAt: new Date() })
    .where(eq(clientProjects.id, parsed.data.projectId));

  revalidateClientProject(parsed.data.projectId);
  return { ok: true, data: { id: row.id } };
}

export async function createClientInvoice(
  raw: unknown,
): Promise<ClientActionResult<{ id: string }>> {
  await requireAdminSession();
  const parsed = clientInvoiceSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const project = await adminGetClientProject(parsed.data.projectId);
  if (!project) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  const db = getDb();
  const [row] = await db
    .insert(clientInvoices)
    .values({
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      amountGel: parsed.data.amountGel,
      status: parsed.data.status,
      pdfUrl: parsed.data.pdfUrl ?? null,
      pdfPathname: parsed.data.pdfPathname ?? null,
      dueDate: parsed.data.dueDate ?? null,
    })
    .returning({ id: clientInvoices.id });

  if (!row) return { ok: false, error: "ინვოისის შენახვა ვერ მოხერხდა" };

  revalidateClientProject(parsed.data.projectId);
  return { ok: true, data: { id: row.id } };
}

export async function updateClientInvoice(
  raw: unknown,
): Promise<ClientActionResult> {
  await requireAdminSession();
  const parsed = clientInvoiceUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
    };
  }

  const db = getDb();
  const existing = await db.query.clientInvoices.findFirst({
    where: eq(clientInvoices.id, parsed.data.id),
  });
  if (!existing) return { ok: false, error: "ინვოისი ვერ მოიძებნა" };

  const nextPdfPath =
    parsed.data.pdfPathname !== undefined
      ? parsed.data.pdfPathname
      : existing.pdfPathname;

  if (
    existing.pdfPathname &&
    nextPdfPath &&
    existing.pdfPathname !== nextPdfPath
  ) {
    await deleteBlobSafe(existing.pdfPathname);
  }
  if (parsed.data.pdfPathname === null && existing.pdfPathname) {
    await deleteBlobSafe(existing.pdfPathname);
  }

  await db
    .update(clientInvoices)
    .set({
      title: parsed.data.title ?? existing.title,
      amountGel: parsed.data.amountGel ?? existing.amountGel,
      status: parsed.data.status ?? existing.status,
      pdfUrl:
        parsed.data.pdfUrl !== undefined ? parsed.data.pdfUrl : existing.pdfUrl,
      pdfPathname:
        parsed.data.pdfPathname !== undefined
          ? parsed.data.pdfPathname
          : existing.pdfPathname,
      dueDate:
        parsed.data.dueDate !== undefined
          ? parsed.data.dueDate
          : existing.dueDate,
      updatedAt: new Date(),
    })
    .where(eq(clientInvoices.id, parsed.data.id));

  revalidateClientProject(existing.projectId);
  return { ok: true, data: undefined };
}

export async function deleteClientInvoice(
  id: string,
): Promise<ClientActionResult> {
  await requireAdminSession();
  const db = getDb();
  const existing = await db.query.clientInvoices.findFirst({
    where: eq(clientInvoices.id, id),
  });
  if (!existing) return { ok: false, error: "ინვოისი ვერ მოიძებნა" };

  await db.delete(clientInvoices).where(eq(clientInvoices.id, id));
  await deleteBlobSafe(existing.pdfPathname);
  revalidateClientProject(existing.projectId);
  return { ok: true, data: undefined };
}

/** Exported for portal message action to reuse push. */
export async function notifyAdminsOfClientMessage(input: {
  projectTitle: string;
  clientLabel: string;
  projectId: string;
}) {
  await sendAdminPush({
    title: "ახალი შეტყობინება პორტალიდან",
    body: `${input.clientLabel} — ${input.projectTitle}`,
    url: `/admin/clients/${input.projectId}`,
  });
}
