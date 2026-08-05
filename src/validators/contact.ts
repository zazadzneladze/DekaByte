import { z } from "zod";
import { CONTACT_METHODS, LEAD_PROJECT_TYPES } from "@/config/categories";

const MIN_FILL_MS = 2_000;
const MAX_FILL_MS = 2 * 60 * 60 * 1000;

function emptyToUndefined(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const contactSchema = z
  .object({
    name: z
      .string({ error: "სახელი აუცილებელია" })
      .trim()
      .min(1, "სახელი აუცილებელია")
      .max(160, "სახელი ძალიან გრძელია"),
    phone: z
      .string()
      .trim()
      .max(60, "ტელეფონი ძალიან გრძელია")
      .optional()
      .transform(emptyToUndefined),
    email: z
      .string()
      .trim()
      .max(255)
      .optional()
      .transform(emptyToUndefined)
      .pipe(z.email("ელფოსტა არასწორია").optional()),
    projectType: z.enum(LEAD_PROJECT_TYPES, {
      error: "აირჩიეთ პროექტის ტიპი",
    }),
    message: z
      .string({ error: "შეტყობინება აუცილებელია" })
      .trim()
      .min(1, "შეტყობინება აუცილებელია")
      .max(5000, "შეტყობინება ძალიან გრძელია"),
    preferredContactMethod: z
      .union([z.enum(CONTACT_METHODS), z.literal(""), z.undefined()])
      .optional()
      .transform((value) => (value === "" || value == null ? undefined : value)),
    company_website: z
      .string()
      .optional()
      .refine((value) => !value, { message: "Invalid submission" }),
    formStartedAt: z.number({ error: "არასწორი ფორმა" }),
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: "მიუთითეთ ტელეფონი ან ელფოსტა",
    path: ["phone"],
  })
  .refine(
    (data) => {
      const elapsed = Date.now() - data.formStartedAt;
      return elapsed >= MIN_FILL_MS && elapsed <= MAX_FILL_MS;
    },
    {
      message: "ფორმის გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან.",
      path: ["formStartedAt"],
    },
  );

export type ContactInput = z.infer<typeof contactSchema>;
