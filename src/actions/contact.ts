"use server";

import { headers } from "next/headers";

import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { notifyNewLead } from "@/lib/email";
import { checkLeadRateLimit, recordLeadAttempt } from "@/lib/rate-limit";
import { hashIp } from "@/lib/security";
import { contactSchema } from "@/validators/contact";

export type ContactActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

function getClientIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

export async function submitContact(
  raw: unknown,
): Promise<ContactActionResult> {
  // Honeypot: pretend success so bots do not retry.
  if (
    raw &&
    typeof raw === "object" &&
    "company_website" in raw &&
    typeof (raw as { company_website?: unknown }).company_website === "string" &&
    (raw as { company_website: string }).company_website.trim().length > 0
  ) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstMessage =
      parsed.error.issues[0]?.message ??
      "ფორმის გაგზავნა ვერ მოხერხდა. შეამოწმეთ ველები.";
    return { ok: false, error: firstMessage, fieldErrors };
  }

  const data = parsed.data;

  try {
    const headerList = await headers();
    const ip = getClientIp(headerList);
    const ipHash = await hashIp(ip);

    const allowed = await checkLeadRateLimit(ipHash);
    if (!allowed) {
      return {
        ok: false,
        error:
          "ძალიან ბევრი მოთხოვნაა. გთხოვთ სცადოთ მოგვიანებით.",
      };
    }

    await recordLeadAttempt(ipHash);

    const db = getDb();
    await db.insert(leads).values({
      name: data.name,
      phone: data.phone ?? null,
      email: data.email ?? null,
      projectType: data.projectType,
      message: data.message,
      preferredContactMethod: data.preferredContactMethod ?? null,
      status: "new",
      source: "contact_form",
      ipHash,
    });

    void notifyNewLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      projectType: data.projectType,
      message: data.message,
      preferredContactMethod: data.preferredContactMethod,
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "შეტყობინების შენახვა ვერ მოხერხდა. სცადეთ თავიდან.",
    };
  }
}
