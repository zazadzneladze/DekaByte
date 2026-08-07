import { z } from "zod";
import {
  CLIENT_ASSET_KINDS,
  CLIENT_INVOICE_STATUSES,
  CLIENT_PROJECT_STATUSES,
} from "@/config/client-portal";
import { INVOICE_CURRENCIES } from "@/config/invoice";

const statusIds = CLIENT_PROJECT_STATUSES.map((s) => s.id) as [
  (typeof CLIENT_PROJECT_STATUSES)[number]["id"],
  ...(typeof CLIENT_PROJECT_STATUSES)[number]["id"][],
];

const invoiceStatusIds = CLIENT_INVOICE_STATUSES.map((s) => s.id) as [
  (typeof CLIENT_INVOICE_STATUSES)[number]["id"],
  ...(typeof CLIENT_INVOICE_STATUSES)[number]["id"][],
];

const assetKindIds = CLIENT_ASSET_KINDS.map((s) => s.id) as [
  (typeof CLIENT_ASSET_KINDS)[number]["id"],
  ...(typeof CLIENT_ASSET_KINDS)[number]["id"][],
];

const currencyIds = INVOICE_CURRENCIES.map((c) => c.id) as [
  (typeof INVOICE_CURRENCIES)[number]["id"],
  ...(typeof INVOICE_CURRENCIES)[number]["id"][],
];

export const clientProjectSchema = z.object({
  title: z.string().trim().min(2, "სათაური აუცილებელია").max(200),
  status: z.enum(statusIds),
  progressPercent: z.coerce.number().int().min(0).max(100).default(0),
  clientEmail: z
    .string()
    .trim()
    .email("არასწორი ელფოსტა")
    .max(255)
    .transform((v) => v.toLowerCase()),
  notes: z.string().max(8000).optional().default(""),
});

export type ClientProjectInput = z.infer<typeof clientProjectSchema>;

export const clientAssetMetaSchema = z.object({
  projectId: z.string().uuid(),
  filename: z.string().trim().min(1).max(255),
  mime: z.string().trim().min(1).max(120),
  size: z.number().int().nonnegative().nullable().optional(),
  kind: z.enum(assetKindIds).default("other"),
  url: z.string().url(),
  pathname: z.string().min(1),
  sortOrder: z.number().int().optional().default(0),
});

export const clientMessageSchema = z.object({
  projectId: z.string().uuid(),
  body: z
    .string()
    .trim()
    .min(1, "შეტყობინება ცარიელია")
    .max(4000, "ძალიან გრძელი შეტყობინება"),
});

export const invoiceLineItemSchema = z.object({
  description: z.string().trim().min(1).max(500),
  qty: z.coerce.number().positive().max(1_000_000),
  unitPrice: z.coerce.number().min(0).max(10_000_000),
});

const signatureTransformSchema = z.object({
  offsetX: z.coerce.number().int().min(-80).max(80).default(0),
  offsetY: z.coerce.number().int().min(-40).max(48).default(0),
  rotate: z.coerce.number().int().min(-45).max(45).default(0),
});

import { invoiceBankIdSchema } from "@/validators/invoice-bank";

export const clientInvoiceGenerateSchema = z.object({
  projectId: z.string().uuid(),
  id: z.string().uuid().optional(),
  invoiceNumber: z
    .string()
    .trim()
    .min(1, "ინვოისის № აუცილებელია")
    .max(40, "ინვოისის № ძალიან გრძელია")
    .optional(),
  status: z.enum(invoiceStatusIds).default("draft"),
  paymentStage: z.string().trim().min(1, "გადახდის ეტაპი აუცილებელია").max(120),
  currency: z.enum(currencyIds).default("GEL"),
  bankId: invoiceBankIdSchema.default("bog"),
  contractRef: z.string().trim().max(500).optional().default(""),
  dueDate: z.coerce.date().nullable().optional(),
  recipientName: z.string().trim().min(1, "დამკვეთის სახელი აუცილებელია").max(200),
  recipientPersonalId: z.string().trim().max(40).optional().default(""),
  recipientAddress: z.string().trim().max(2000).optional().default(""),
  recipientPhone: z.string().trim().max(40).optional().default(""),
  recipientContactPerson: z.string().trim().max(200).optional().default(""),
  recipientEmail: z.string().trim().max(255).optional().default(""),
  recipientIsCompany: z.boolean().default(false),
  lineItems: z.array(invoiceLineItemSchema).min(1, "დაამატეთ მინიმუმ ერთი ხაზი"),
  discountGel: z.coerce.number().int().min(0).max(10_000_000).default(0),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  includeSupplierSignature: z.boolean().default(true),
  clientSignatureUrl: z.string().url().nullable().optional(),
  clientSignatureTransform: signatureTransformSchema.default({
    offsetX: 0,
    offsetY: 0,
    rotate: 0,
  }),
});

/** Legacy partial update (status / pdf). */
export const clientInvoiceUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(invoiceStatusIds).optional(),
  pdfUrl: z.string().url().nullable().optional(),
  pdfPathname: z.string().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

export const clientProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "სახელი აუცილებელია (მინ. 2 სიმბოლო)")
    .max(160),
  phone: z.string().trim().max(40).nullable().optional(),
  address: z.string().trim().max(2000).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  avatarPathname: z.string().nullable().optional(),
});
