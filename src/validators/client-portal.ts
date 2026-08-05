import { z } from "zod";
import {
  CLIENT_ASSET_KINDS,
  CLIENT_INVOICE_STATUSES,
  CLIENT_PROJECT_STATUSES,
} from "@/config/client-portal";

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

export const clientProjectSchema = z.object({
  title: z.string().trim().min(2, "სათაური აუცილებელია").max(200),
  status: z.enum(statusIds),
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

export const clientInvoiceSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().trim().min(2).max(200),
  amountGel: z.coerce.number().int().min(0).max(10_000_000),
  status: z.enum(invoiceStatusIds).default("draft"),
  pdfUrl: z.string().url().nullable().optional(),
  pdfPathname: z.string().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

export const clientInvoiceUpdateSchema = clientInvoiceSchema
  .omit({ projectId: true })
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const clientProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "სახელი აუცილებელია (მინ. 2 სიმბოლო)")
    .max(160),
  avatarUrl: z.string().url().nullable().optional(),
  avatarPathname: z.string().nullable().optional(),
});
