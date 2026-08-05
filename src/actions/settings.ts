"use server";

import { revalidatePath } from "next/cache";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { adminUsers, siteSettings } from "@/db/schema";
import {
  adminGetSiteSettings,
  invalidateSiteSettingsCache,
} from "@/db/queries";
import { changePasswordSchema } from "@/validators/auth";
import { isSafeHttpUrl } from "@/lib/security";

export type SettingsActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

async function requireAdmin() {
  const session = await auth();
  if (
    !session?.user?.id ||
    !session.user.email ||
    session.user.role !== "admin"
  ) {
    throw new Error("Unauthorized");
  }
  return session.user;
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
