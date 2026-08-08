"use server";

import { revalidatePath } from "next/cache";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminSession } from "@/lib/session";
import { getDb } from "@/db";
import { adminUsers, siteSettings } from "@/db/schema";
import {
  adminGetSiteSettings,
  invalidateSiteSettingsCache,
} from "@/db/queries";
import { changePasswordSchema } from "@/validators/auth";
import { estimateConfigSchema } from "@/validators/estimate";
import { deleteBlobSafe } from "@/lib/blob";
import { isSafeHttpUrl } from "@/lib/security";
import { clampSignatureTransform } from "@/lib/invoice-signature";
import { siteDefaults } from "@/config/site";
import type { EstimateConfig } from "@/config/estimate";
import type { InvoiceBankConfig } from "@/config/invoice";
import { invoiceBankConfigSchema } from "@/validators/invoice-bank";

export type SettingsActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

async function requireAdmin() {
  return requireAdminSession();
}

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || isSafeHttpUrl(value), {
    message: "URL უნდა იწყებოდეს http:// ან https://-ით",
  });

const siteSettingsSchema = z.object({
  brandName: z.string().trim().min(1).max(120),
  phoneDisplay: z.string().trim().min(1).max(60),
  phoneE164: z.string().trim().min(1).max(40),
  whatsappNumber: z.string().trim().min(1).max(40),
  email: z
    .string()
    .trim()
    .max(255)
    .pipe(z.email("ელფოსტა არასწორია")),
  facebookUrl: optionalUrl,
  messengerUrl: optionalUrl,
  instagramUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  defaultSeoTitle: z.string().trim().min(1).max(200),
  defaultSeoDescription: z.string().trim().min(1).max(2000),
});

export async function updateSiteSettings(
  raw: unknown,
): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse(raw);
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

  const db = getDb();
  const existing = await adminGetSiteSettings();
  const data = {
    ...parsed.data,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.update(siteSettings).set(data).where(eq(siteSettings.id, 1));
  } else {
    await db.insert(siteSettings).values({ id: 1, ...data });
  }

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/");

  return { ok: true };
}

export async function updateSiteLogo(raw: unknown): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = z
    .object({
      logoUrl: z.string().url().nullable(),
      logoPathname: z.string().nullable(),
    })
    .safeParse(raw);

  if (!parsed.success) {
    return { ok: false, error: "არასწორი ლოგოს მონაცემები" };
  }

  const db = getDb();
  const existing = await adminGetSiteSettings();

  if (existing?.logoPathname && existing.logoPathname !== parsed.data.logoPathname) {
    await deleteBlobSafe(existing.logoPathname);
  }

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        logoUrl: parsed.data.logoUrl,
        logoPathname: parsed.data.logoPathname,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, 1));
  } else {
    return { ok: false, error: "ჯერ შეინახეთ საიტის პარამეტრები" };
  }

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/portal");
  revalidatePath("/admin/login");
  revalidatePath("/portal/login");

  return { ok: true };
}

export async function updateEstimateConfig(
  raw: unknown,
): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = estimateConfigSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ვალიდაცია ვერ გაიარა",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const config = parsed.data as EstimateConfig;
  const db = getDb();
  const existing = await adminGetSiteSettings();

  if (existing) {
    await db
      .update(siteSettings)
      .set({ estimateConfig: config, updatedAt: new Date() })
      .where(eq(siteSettings.id, 1));
  } else {
    return {
      ok: false,
      error: "ჯერ შეინახეთ საიტის პარამეტრები, შემდეგ ბიუჯეტის ცხრილები",
    };
  }

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/estimate");
  revalidatePath("/");

  return { ok: true };
}

export async function updateInvoiceBankConfig(
  raw: unknown,
): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = invoiceBankConfigSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ვალიდაცია ვერ გაიარა",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const config = parsed.data as InvoiceBankConfig;
  const db = getDb();
  const existing = await adminGetSiteSettings();

  if (existing) {
    await db
      .update(siteSettings)
      .set({ invoiceBankConfig: config, updatedAt: new Date() })
      .where(eq(siteSettings.id, 1));
  } else {
    return {
      ok: false,
      error: "ჯერ შეინახეთ საიტის პარამეტრები, შემდეგ საბანკო რეკვიზიტები",
    };
  }

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/clients");

  return { ok: true };
}

const signatureTransformSchema = z.object({
  offsetX: z.coerce.number().int().min(-80).max(80),
  offsetY: z.coerce.number().int().min(-40).max(48),
  rotate: z.coerce.number().int().min(-45).max(45),
});

export async function updateInvoiceSupplierSignature(raw: unknown): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = z
    .object({
      url: z.string().url(),
      pathname: z.string().min(1),
      transform: signatureTransformSchema,
    })
    .safeParse(raw);

  if (!parsed.success) {
    return { ok: false, error: "არასწორი ხელმოწერის მონაცემები" };
  }

  const db = getDb();
  const existing = await adminGetSiteSettings();
  if (!existing) {
    return { ok: false, error: "ჯერ შეინახეთ საიტის პარამეტრები" };
  }

  if (
    existing.invoiceSupplierSignaturePathname &&
    existing.invoiceSupplierSignaturePathname !== parsed.data.pathname
  ) {
    await deleteBlobSafe(existing.invoiceSupplierSignaturePathname);
  }

  await db
    .update(siteSettings)
    .set({
      invoiceSupplierSignatureUrl: parsed.data.url,
      invoiceSupplierSignaturePathname: parsed.data.pathname,
      invoiceSupplierSignatureTransform: clampSignatureTransform(
        parsed.data.transform,
      ),
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, 1));

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/clients");

  return { ok: true };
}

export async function updateInvoiceSupplierSignatureTransform(
  raw: unknown,
): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = signatureTransformSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "არასწორი პოზიცია" };
  }

  const db = getDb();
  const existing = await adminGetSiteSettings();
  if (!existing?.invoiceSupplierSignatureUrl) {
    return { ok: false, error: "ჯერ ატვირთეთ ხელმოწერა" };
  }

  await db
    .update(siteSettings)
    .set({
      invoiceSupplierSignatureTransform: clampSignatureTransform(parsed.data),
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, 1));

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/clients");

  return { ok: true };
}

export async function clearInvoiceSupplierSignature(): Promise<SettingsActionResult> {
  await requireAdmin();

  const db = getDb();
  const existing = await adminGetSiteSettings();
  if (!existing) {
    return { ok: false, error: "პარამეტრები ვერ მოიძებნა" };
  }

  if (existing.invoiceSupplierSignaturePathname) {
    await deleteBlobSafe(existing.invoiceSupplierSignaturePathname);
  }

  await db
    .update(siteSettings)
    .set({
      invoiceSupplierSignatureUrl: null,
      invoiceSupplierSignaturePathname: null,
      invoiceSupplierSignatureTransform: null,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, 1));

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/clients");

  return { ok: true };
}

export async function changeAdminPassword(
  raw: unknown,
): Promise<SettingsActionResult> {
  const user = await requireAdmin();

  const parsed = changePasswordSchema.safeParse(raw);
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

  const db = getDb();
  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, user.id),
  });

  if (!admin) {
    return { ok: false, error: "მომხმარებელი ვერ მოიძებნა" };
  }

  const currentOk = await compare(
    parsed.data.currentPassword,
    admin.passwordHash,
  );
  if (!currentOk) {
    return {
      ok: false,
      error: "მიმდინარე პაროლი არასწორია",
      fieldErrors: { currentPassword: ["მიმდინარე პაროლი არასწორია"] },
    };
  }

  const passwordHash = await hash(parsed.data.newPassword, 12);

  await db
    .update(adminUsers)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, admin.id));

  // Never log passwords.
  revalidatePath("/admin/settings");
  return { ok: true };
}

const heroVisualSchema = z.enum(["mark", "cube", "orbit"]);

export async function updateHeroVisual(raw: unknown): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = heroVisualSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Hero ვიზუალი არასწორია" };
  }

  const db = getDb();
  const existing = await adminGetSiteSettings();
  const data = {
    heroVisual: parsed.data,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.update(siteSettings).set(data).where(eq(siteSettings.id, 1));
  } else {
    await db.insert(siteSettings).values({
      id: 1,
      ...siteDefaults,
      heroVisual: parsed.data,
      updatedAt: new Date(),
    });
  }

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  revalidatePath("/");

  return { ok: true };
}
