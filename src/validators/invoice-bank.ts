import { z } from "zod";
import { INVOICE_BANK_IDS } from "@/config/invoice";

const bankProfileSchema = z.object({
  bankName: z.string().trim().min(1, "ბანკის სახელი აუცილებელია").max(200),
  swift: z.string().trim().min(1, "SWIFT აუცილებელია").max(20),
  accountNumber: z.string().trim().max(40).default(""),
  ibanGel: z.string().trim().max(40).default(""),
});

export const invoiceBankConfigSchema = z.object({
  bog: bankProfileSchema,
  tbc: bankProfileSchema,
});

export const invoiceBankIdSchema = z.enum(INVOICE_BANK_IDS);
