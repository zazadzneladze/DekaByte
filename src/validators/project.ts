import { z } from "zod";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  type ProjectCategoryId,
} from "@/config/categories";
import { isSafeHttpUrl } from "@/lib/security";

const categoryIds = PROJECT_CATEGORIES.map((c) => c.id) as [
  ProjectCategoryId,
  ...ProjectCategoryId[],
];

function emptyToNull(value: string | null | undefined) {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

const optionalText = z.preprocess(
  (value) => emptyToNull(value as string | null | undefined),
  z.string().nullable(),
);

const optionalUrl = z.preprocess(
  (value) => emptyToNull(value as string | null | undefined),
  z
    .string()
    .nullable()
    .refine((value) => isSafeHttpUrl(value), {
      message: "URL უნდა იწყებოდეს http:// ან https://-ით",
    }),
);

const stringList = z
  .array(z.string().trim().min(1))
  .default([])
  .transform((items) => items.map((item) => item.trim()).filter(Boolean));

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "სათაური აუცილებელია")
    .max(200, "სათაური ძალიან გრძელია"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug აუცილებელია")
    .max(220, "Slug ძალიან გრძელია")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug უნდა იყოს kebab-case"),
  category: z.enum(categoryIds, { error: "აირჩიეთ კატეგორია" }),
  shortDescription: z
    .string()
    .trim()
    .min(1, "მოკლე აღწერა აუცილებელია")
    .max(1000, "მოკლე აღწერა ძალიან გრძელია"),
  overview: z.string().default(""),
  challenge: z.string().default(""),
  solution: z.string().default(""),
  features: stringList,
  technologies: stringList,
  coverImageUrl: optionalText,
  coverImagePathname: optionalText,
  coverImageAlt: optionalText,
  liveUrl: optionalUrl,
  externalUrl: optionalUrl,
  status: z.enum(PROJECT_STATUSES, { error: "აირჩიეთ სტატუსი" }),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  seoTitle: z.preprocess(
    (value) => emptyToNull(value as string | null | undefined),
    z.string().max(200).nullable(),
  ),
  seoDescription: optionalText,
  publishedAt: z.coerce.date().nullable().optional(),
});

export const projectCreateSchema = projectSchema;
export const projectUpdateSchema = projectSchema;

export type ProjectInput = z.infer<typeof projectSchema>;
