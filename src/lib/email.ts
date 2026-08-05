import "server-only";

import { Resend } from "resend";

import { getSiteUrl, siteDefaults } from "@/config/site";

export type LeadEmailPayload = {
  name: string;
  phone?: string | null;
  email?: string | null;
  projectType: string;
  message: string;
  preferredContactMethod?: string | null;
};

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

/**
 * Notify studio owner about a new contact lead.
 * Never throws to the caller — form success must not depend on email.
 */
export async function notifyNewLead(payload: LeadEmailPayload): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.info("[email] RESEND_API_KEY missing — lead notify skipped");
    return;
  }

  const to =
    process.env.LEAD_NOTIFY_EMAIL?.trim() || siteDefaults.email;
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "DekaByte <onboarding@resend.dev>";
  const adminUrl = `${getSiteUrl()}/admin/leads`;

  const lines = [
    `ახალი ლიდი — ${payload.name}`,
    "",
    `პროექტის ტიპი: ${payload.projectType}`,
    `ტელეფონი: ${payload.phone || "—"}`,
    `ელფოსტა: ${payload.email || "—"}`,
    `კონტაქტის მეთოდი: ${payload.preferredContactMethod || "—"}`,
    "",
    "შეტყობინება:",
    payload.message,
    "",
    `ადმინი: ${adminUrl}`,
  ];

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `DekaByte — ახალი ლიდი: ${payload.name}`,
      text: lines.join("\n"),
    });
    if (error) {
      console.error("[email] Resend error", error);
    }
  } catch (err) {
    console.error("[email] notify failed", err);
  }
}
