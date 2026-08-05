import { z } from "zod";

const productSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().trim().min(1).max(200),
  basePrice: z.coerce.number().int().min(0).max(10_000_000),
  baseDays: z.coerce.number().int().min(0).max(3650),
  description: z.string().trim().max(2000),
});

const scopeSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().trim().min(1).max(200),
  multiplier: z.coerce.number().min(0.1).max(20),
  extraDays: z.coerce.number().int().min(0).max(3650),
});

const addOnSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().trim().min(1).max(200),
  price: z.coerce.number().int().min(0).max(10_000_000),
  days: z.coerce.number().int().min(0).max(3650),
  description: z.string().trim().max(2000),
});

export const estimateConfigSchema = z.object({
  discountPercent: z.coerce.number().min(0).max(100),
  priceRangeMultiplier: z.coerce.number().min(1).max(5),
  daysRangeMultiplier: z.coerce.number().min(1).max(5),
  products: z.array(productSchema).min(1),
  scopes: z.array(scopeSchema).min(1),
  addOns: z.array(addOnSchema).min(1),
  disclaimer: z.string().trim().min(1).max(4000),
});

export type EstimateConfigInput = z.infer<typeof estimateConfigSchema>;
