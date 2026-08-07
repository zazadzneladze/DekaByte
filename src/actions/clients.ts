"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, like } from "drizzle-orm";
import { put } from "@vercel/blob";
import { z } from "zod";
import { getDb } from "@/db";
import {
  clientAssets,
  clientInvoices,
  clientMessages,
  clientProjects,
  clientUsers,
  projects,
} from "@/db/schema";
import { adminGetClientProject, adminGetSiteSettings, getClientUserByEmail } from "@/db/queries";
import { deleteBlobSafe } from "@/lib/blob";
import { computeInvoiceTotals, getInvoiceBankProfile, INVOICE_NUMBER_PREFIX, mergeInvoiceBankConfig } from "@/config/invoice";
import { invoicePdfPathname } from "@/lib/invoice-filename";
import { renderInvoicePdf } from "@/lib/invoice-pdf";
import { clampSignatureTransform } from "@/lib/invoice-signature";
import { sendAdminPush, pushPreview, notifyClientUserPush } from "@/lib/push";
import { requireAdminSession } from "@/lib/session";
import { slugify } from "@/lib/security";
import {
  clientAssetMetaSchema,
  clientInvoiceGenerateSchema,
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

async function ensureClientUserByEmail(email: string) {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const existing = await db.query.clientUsers.findFirst({
    where: eq(clientUsers.email, normalized),
  });
  if (existing) return existing;

  const [created] = await db
    .insert(clientUsers)
    .values({ email: normalized })
    .returning();
  if (!created) throw new Error("client_users insert failed");
  return created;
}

const clientSignatureTransformSchema = z.object({
  offsetX: z.coerce.number().int().min(-80).max(80),
  offsetY: z.coerce.number().int().min(-40).max(48),
  rotate: z.coerce.number().int().min(-45).max(45),
});

export async function ensureClientUserForProject(
  projectId: string,
): Promise<ClientActionResult<{ clientUserId: string }>> {
  await requireAdminSession();

  const idParsed = z.string().uuid().safeParse(projectId);
  if (!idParsed.success) {
    return { ok: false, error: "არასწორი პროექტი" };
  }

  const project = await adminGetClientProject(idParsed.data);
  if (!project) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  try {
    const user = await ensureClientUserByEmail(project.clientEmail);
    return { ok: true, data: { clientUserId: user.id } };
  } catch {
    return { ok: false, error: "კლიენტის პროფილი ვერ შეიქმნა" };
  }
}

export async function updateClientUserSignature(
  raw: unknown,
): Promise<ClientActionResult> {
  await requireAdminSession();

  const parsed = z
    .object({
      clientUserId: z.string().uuid(),
      projectId: z.string().uuid(),
      url: z.string().url(),
      pathname: z.string().min(1),
      transform: clientSignatureTransformSchema,
    })
    .safeParse(raw);

  if (!parsed.success) {
    return { ok: false, error: "არასწორი ხელმოწერის მონაცემები" };
  }

  const db = getDb();
  const user = await db.query.clientUsers.findFirst({
    where: eq(clientUsers.id, parsed.data.clientUserId),
    columns: {
      id: true,
      invoiceSignaturePathname: true,
    },
  });
  if (!user) return { ok: false, error: "კლიენტი ვერ მოიძებნა" };

  if (
    user.invoiceSignaturePathname &&
    user.invoiceSignaturePathname !== parsed.data.pathname
  ) {
    await deleteBlobSafe(user.invoiceSignaturePathname);
  }

  await db
    .update(clientUsers)
    .set({
      invoiceSignatureUrl: parsed.data.url,
      invoiceSignaturePathname: parsed.data.pathname,
      invoiceSignatureTransform: clampSignatureTransform(parsed.data.transform),
      updatedAt: new Date(),
    })
    .where(eq(clientUsers.id, parsed.data.clientUserId));

  revalidateClientProject(parsed.data.projectId);
  revalidatePath("/portal/profile");
  return { ok: true, data: undefined };
}

export async function updateClientUserSignatureTransform(
  raw: unknown,
): Promise<ClientActionResult> {
  await requireAdminSession();

  const parsed = z
    .object({
      clientUserId: z.string().uuid(),
      projectId: z.string().uuid(),
      transform: clientSignatureTransformSchema,
    })
    .safeParse(raw);

  if (!parsed.success) {
    return { ok: false, error: "არასწორი პოზიცია" };
  }

  const db = getDb();
  const user = await db.query.clientUsers.findFirst({
    where: eq(clientUsers.id, parsed.data.clientUserId),
    columns: { id: true, invoiceSignatureUrl: true },
  });
  if (!user?.invoiceSignatureUrl) {
    return { ok: false, error: "ჯერ ატვირთეთ ხელმოწერა" };
  }

  await db
    .update(clientUsers)
    .set({
      invoiceSignatureTransform: clampSignatureTransform(parsed.data.transform),
      updatedAt: new Date(),
    })
    .where(eq(clientUsers.id, parsed.data.clientUserId));

  revalidateClientProject(parsed.data.projectId);
  revalidatePath("/portal/profile");
  return { ok: true, data: undefined };
}

export async function clearClientUserSignature(
  raw: unknown,
): Promise<ClientActionResult> {
  await requireAdminSession();

  const parsed = z
    .object({
      clientUserId: z.string().uuid(),
      projectId: z.string().uuid(),
    })
    .safeParse(raw);

  if (!parsed.success) {
    return { ok: false, error: "არასწორი მოთხოვნა" };
  }

  const db = getDb();
  const user = await db.query.clientUsers.findFirst({
    where: eq(clientUsers.id, parsed.data.clientUserId),
    columns: { id: true, invoiceSignaturePathname: true },
  });
  if (!user) return { ok: false, error: "კლიენტი ვერ მოიძებნა" };

  if (user.invoiceSignaturePathname) {
    await deleteBlobSafe(user.invoiceSignaturePathname);
  }

  await db
    .update(clientUsers)
    .set({
      invoiceSignatureUrl: null,
      invoiceSignaturePathname: null,
      invoiceSignatureTransform: null,
      updatedAt: new Date(),
    })
    .where(eq(clientUsers.id, parsed.data.clientUserId));

  revalidateClientProject(parsed.data.projectId);
  revalidatePath("/portal/profile");
  return { ok: true, data: undefined };
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
      progressPercent: parsed.data.progressPercent,
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
      progressPercent: parsed.data.progressPercent,
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

  const clientUser = await getClientUserByEmail(project.clientEmail);
  void notifyClientUserPush(clientUser?.id, {
    title: "DekaByte",
    body: `${project.title}\nახალი ფაილი: ${parsed.data.filename}`,
    url: `/portal/projects/${project.id}`,
    tag: `admin-file-${project.id}`,
  });

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

  const clientUser = await getClientUserByEmail(project.clientEmail);
  void notifyClientUserPush(clientUser?.id, {
    title: "DekaByte",
    body: `${project.title}\n${pushPreview(parsed.data.body)}`,
    url: `/portal/projects/${project.id}#chat`,
    tag: `admin-msg-${project.id}`,
  });

  return { ok: true, data: { id: row.id } };
}

async function allocateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${INVOICE_NUMBER_PREFIX}-${year}-`;
  const db = getDb();
  const latest = await db.query.clientInvoices.findFirst({
    where: like(clientInvoices.invoiceNumber, `${prefix}%`),
    orderBy: [desc(clientInvoices.invoiceNumber)],
    columns: { invoiceNumber: true },
  });
  let seq = 1;
  if (latest?.invoiceNumber) {
    const tail = latest.invoiceNumber.slice(prefix.length);
    const n = Number.parseInt(tail, 10);
    if (Number.isFinite(n)) seq = n + 1;
  }
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

async function resolveInvoiceNumber(
  manual: string | undefined,
): Promise<{ ok: true; value: string } | { ok: false; error: string }> {
  const trimmed = manual?.trim();
  if (!trimmed) {
    return { ok: true, value: await allocateInvoiceNumber() };
  }
  const db = getDb();
  const existing = await db.query.clientInvoices.findFirst({
    where: eq(clientInvoices.invoiceNumber, trimmed),
    columns: { id: true },
  });
  if (existing) {
    return { ok: false, error: "ეს ინვოისის № უკვე გამოყენებულია" };
  }
  return { ok: true, value: trimmed };
}

export async function generateClientInvoice(
  raw: unknown,
): Promise<ClientActionResult<{ id: string; pdfUrl: string }>> {
  await requireAdminSession();
  const parsed = clientInvoiceGenerateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "არასწორი მონაცემები",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const project = await adminGetClientProject(parsed.data.projectId);
  if (!project) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "BLOB_READ_WRITE_TOKEN არ არის კონფიგურირებული" };
  }

  const totals = computeInvoiceTotals(
    parsed.data.lineItems,
    {
      discountGel: parsed.data.discountGel,
      discountPercent: parsed.data.discountPercent,
    },
    { withholdIncomeTax: parsed.data.recipientIsCompany },
  );
  const issuedAt = new Date();
  const db = getDb();
  const settings = await adminGetSiteSettings();
  const useSupplierSignature =
    parsed.data.includeSupplierSignature &&
    Boolean(settings?.invoiceSupplierSignatureUrl);
  const supplierSignatureUrl = useSupplierSignature
    ? settings!.invoiceSupplierSignatureUrl
    : null;
  const supplierSignatureTransform = useSupplierSignature
    ? clampSignatureTransform(settings!.invoiceSupplierSignatureTransform)
    : undefined;
  const clientSignatureTransform = clampSignatureTransform(
    parsed.data.clientSignatureTransform,
  );
  const bankConfig = mergeInvoiceBankConfig(settings?.invoiceBankConfig ?? null);
  const bankProfile = getInvoiceBankProfile(bankConfig, parsed.data.bankId);

  let invoiceId = parsed.data.id;
  let invoiceNumber: string;
  let existingPdfPath: string | null = null;

  if (invoiceId) {
    const existing = await db.query.clientInvoices.findFirst({
      where: eq(clientInvoices.id, invoiceId),
    });
    if (!existing || existing.projectId !== project.id) {
      return { ok: false, error: "ინვოისი ვერ მოიძებნა" };
    }
    invoiceNumber = existing.invoiceNumber;
    existingPdfPath = existing.pdfPathname;
  } else {
    const resolved = await resolveInvoiceNumber(parsed.data.invoiceNumber);
    if (!resolved.ok) return { ok: false, error: resolved.error };
    invoiceNumber = resolved.value;
    const [created] = await db
      .insert(clientInvoices)
      .values({
        projectId: project.id,
        invoiceNumber,
        title: `${project.title} — ${parsed.data.paymentStage}`,
        amountGel: totals.net,
        status: parsed.data.status,
        issuedAt,
        paymentStage: parsed.data.paymentStage,
        currency: parsed.data.currency,
        contractRef: parsed.data.contractRef ?? "",
        recipientName: parsed.data.recipientName,
        recipientPersonalId: parsed.data.recipientPersonalId || null,
        recipientAddress: parsed.data.recipientAddress || null,
        recipientPhone: parsed.data.recipientPhone || null,
        recipientContactPerson: parsed.data.recipientIsCompany
          ? parsed.data.recipientContactPerson || null
          : null,
        recipientEmail: parsed.data.recipientEmail || null,
        recipientIsCompany: parsed.data.recipientIsCompany,
        lineItems: parsed.data.lineItems,
        discountGel: totals.discount,
        discountPercent: totals.discountPercent,
        subtotalGel: totals.subtotal,
        taxWithheldGel: totals.taxWithheld,
        netGel: totals.net,
        supplierSignatureUrl,
        clientSignatureUrl: parsed.data.clientSignatureUrl ?? null,
        dueDate: parsed.data.dueDate ?? null,
        bodyHtml: "",
      })
      .returning({ id: clientInvoices.id });
    if (!created) return { ok: false, error: "ინვოისის შენახვა ვერ მოხერხდა" };
    invoiceId = created.id;
  }

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderInvoicePdf({
      invoiceNumber,
      issuedAt,
      dueDate: parsed.data.dueDate ?? null,
      status: parsed.data.status,
      projectTitle: project.title,
      paymentStage: parsed.data.paymentStage,
      currency: parsed.data.currency,
      contractRef: parsed.data.contractRef ?? "",
      recipientName: parsed.data.recipientName,
      recipientPersonalId: parsed.data.recipientPersonalId || "",
      recipientAddress: parsed.data.recipientAddress || "",
      recipientContactPerson: parsed.data.recipientIsCompany
        ? parsed.data.recipientContactPerson || ""
        : "",
      recipientIsCompany: parsed.data.recipientIsCompany,
      recipientPhone: parsed.data.recipientPhone || "",
      recipientEmail: parsed.data.recipientEmail || "",
      lineItems: parsed.data.lineItems,
      subtotal: totals.subtotal,
      discount: totals.discount,
      discountPercent: totals.discountPercent,
      gross: totals.gross,
      taxWithheld: totals.taxWithheld,
      net: totals.net,
      withholdIncomeTax: totals.withholdIncomeTax,
      supplierSignatureUrl,
      clientSignatureUrl: parsed.data.clientSignatureUrl ?? null,
      supplierSignatureTransform,
      clientSignatureTransform,
      bankProfile,
    });
  } catch (error) {
    console.error("[invoice] pdf render failed", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "PDF გენერაცია ვერ მოხერხდა",
    };
  }

  const pathname = invoicePdfPathname(
    project.id,
    project.title,
    invoiceNumber,
    issuedAt,
  );
  const blob = await put(pathname, pdfBuffer, {
    access: "public",
    contentType: "application/pdf",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  if (existingPdfPath && existingPdfPath !== blob.pathname) {
    await deleteBlobSafe(existingPdfPath);
  }

  await db
    .update(clientInvoices)
    .set({
      title: `${project.title} — ${parsed.data.paymentStage}`,
      amountGel: totals.net,
      status: parsed.data.status,
      issuedAt,
      paymentStage: parsed.data.paymentStage,
      currency: parsed.data.currency,
      contractRef: parsed.data.contractRef ?? "",
      recipientName: parsed.data.recipientName,
      recipientPersonalId: parsed.data.recipientPersonalId || null,
      recipientAddress: parsed.data.recipientAddress || null,
      recipientPhone: parsed.data.recipientPhone || null,
      recipientContactPerson: parsed.data.recipientIsCompany
        ? parsed.data.recipientContactPerson || null
        : null,
      recipientEmail: parsed.data.recipientEmail || null,
      recipientIsCompany: parsed.data.recipientIsCompany,
      lineItems: parsed.data.lineItems,
      discountGel: totals.discount,
      discountPercent: totals.discountPercent,
      subtotalGel: totals.subtotal,
      taxWithheldGel: totals.taxWithheld,
      netGel: totals.net,
      supplierSignatureUrl,
      clientSignatureUrl: parsed.data.clientSignatureUrl ?? null,
      dueDate: parsed.data.dueDate ?? null,
      pdfUrl: blob.url,
      pdfPathname: blob.pathname,
      bodyHtml: "",
      updatedAt: new Date(),
    })
    .where(eq(clientInvoices.id, invoiceId));

  revalidateClientProject(project.id);
  return { ok: true, data: { id: invoiceId, pdfUrl: blob.url } };
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

  if (parsed.data.status && parsed.data.status !== "draft" && !existing.pdfUrl) {
    return {
      ok: false,
      error: "ჯერ დააგენერირეთ PDF, შემდეგ შეცვალეთ სტატუსი",
    };
  }

  await db
    .update(clientInvoices)
    .set({
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
  messageBody: string;
}) {
  const preview = pushPreview(input.messageBody);
  await sendAdminPush({
    title: input.clientLabel,
    body: `${input.projectTitle}\n${preview}`,
    url: `/admin/clients/${input.projectId}#messages`,
    tag: `portal-msg-${input.projectId}`,
  });
}

export async function markClientProjectMessagesRead(
  projectId: string,
): Promise<ClientActionResult> {
  await requireAdminSession();
  const db = getDb();
  const existing = await adminGetClientProject(projectId);
  if (!existing) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  await db
    .update(clientProjects)
    .set({ adminMessagesReadAt: new Date(), updatedAt: new Date() })
    .where(eq(clientProjects.id, projectId));

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/clients/${projectId}`);
  return { ok: true, data: undefined };
}

export async function promoteClientProjectToPortfolio(
  projectId: string,
): Promise<ClientActionResult<{ portfolioProjectId: string }>> {
  await requireAdminSession();
  const existing = await adminGetClientProject(projectId);
  if (!existing) return { ok: false, error: "პროექტი ვერ მოიძებნა" };

  if (existing.portfolioProjectId) {
    return {
      ok: true,
      data: { portfolioProjectId: existing.portfolioProjectId },
    };
  }

  const eligible =
    existing.progressPercent >= 100 || existing.status === "done";
  if (!eligible) {
    return {
      ok: false,
      error: "პორტფოლიოში გადასატანად პროექტი უნდა იყოს 100% ან გაშვებული",
    };
  }

  const { invalidateProjectCaches } = await import("@/db/queries");

  const db = getDb();
  const baseSlug = slugify(existing.title) || `project-${Date.now().toString(36)}`;
  let candidate = baseSlug;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const clash = await db.query.projects.findFirst({
      where: eq(projects.slug, candidate),
      columns: { id: true },
    });
    if (!clash) break;
    candidate = `${baseSlug}-${attempt + 2}`;
  }

  const cover =
    existing.assets.find((a) => a.kind === "screenshot") ??
    existing.assets[0] ??
    null;

  const shortDescription =
    existing.notes.trim().slice(0, 280) ||
    "კლიენტის პროექტიდან გადმოტანილი დრაფტი — შეავსეთ აღწერა და გამოაქვეყნეთ.";

  const [row] = await db
    .insert(projects)
    .values({
      title: existing.title,
      slug: candidate,
      category: "websites",
      shortDescription,
      overview: existing.notes.trim() || "",
      status: "draft",
      coverImageUrl: cover?.url ?? null,
      coverImagePathname: cover?.pathname ?? null,
      coverImageAlt: existing.title,
    })
    .returning({ id: projects.id, slug: projects.slug });

  if (!row) return { ok: false, error: "პორტფოლიოს დრაფტი ვერ შეიქმნა" };

  await db
    .update(clientProjects)
    .set({
      portfolioProjectId: row.id,
      updatedAt: new Date(),
    })
    .where(eq(clientProjects.id, projectId));

  invalidateProjectCaches(row.slug);
  revalidatePath("/admin/projects");
  revalidateClientProject(projectId);

  return { ok: true, data: { portfolioProjectId: row.id } };
}
