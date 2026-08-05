export type ProductType = {
  id: string;
  name: string;
  basePrice: number;
  baseDays: number;
  description: string;
};

export type ScopeOption = {
  id: string;
  name: string;
  multiplier: number;
  extraDays: number;
};

export type AddOnOption = {
  id: string;
  name: string;
  price: number;
  days: number;
  description: string;
};

export type EstimateInput = {
  productId: string;
  scopeId: string;
  addOnIds: string[];
};

export type EstimateResult = {
  minPrice: number;
  maxPrice: number;
  minDays: number;
  maxDays: number;
  /** Price before discount (same as minPrice when discount is 0). */
  preDiscountMinPrice: number;
  discountPercent: number;
  productName: string;
  scopeName: string;
  addOnNames: string[];
  summary: string;
};

export type EstimateConfig = {
  discountPercent: number;
  priceRangeMultiplier: number;
  daysRangeMultiplier: number;
  products: ProductType[];
  scopes: ScopeOption[];
  addOns: AddOnOption[];
  disclaimer: string;
};

export const ESTIMATE_DISCLAIMER =
  "კალკულატორი აჩვენებს საწყის სავარაუდო შეფასებას ლარში (₾). საბოლოო ღირებულება ზუსტდება პროექტის დეტალური განხილვის შემდეგ.";

export const productTypes: ProductType[] = [
  {
    id: "landing",
    name: "სავიზიტო / Landing Page",
    basePrice: 900,
    baseDays: 5,
    description: "ერთი გვერდისგან შემდგარი, მაღალი კონვერტაციის მქონე წარდგენა.",
  },
  {
    id: "corporate",
    name: "კორპორატიული ვებსაიტი",
    basePrice: 1800,
    baseDays: 12,
    description: "მრავალგვერდიანი საინფორმაციო ვებსაიტი კომპანიებისთვის.",
  },
  {
    id: "webapp",
    name: "Web Application / სისტემა",
    basePrice: 3200,
    baseDays: 20,
    description: "რთული ბიზნეს ლოგიკის მქონე ვებ-აპლიკაცია მართვის პანელით.",
  },
  {
    id: "android",
    name: "Android აპლიკაცია",
    basePrice: 4000,
    baseDays: 25,
    description: "მობილური აპლიკაცია Android პლატფორმისთვის.",
  },
];

export const scopeOptions: ScopeOption[] = [
  { id: "small", name: "მცირე (1-3 გვერდი / ეკრანი)", multiplier: 1.0, extraDays: 0 },
  { id: "medium", name: "საშუალო (4-8 გვერდი / ეკრანი)", multiplier: 1.25, extraDays: 4 },
  { id: "large", name: "დიდი (9-15 გვერდი / ეკრანი)", multiplier: 1.5, extraDays: 8 },
  {
    id: "enterprise",
    name: "მასშტაბური (15+ გვერდი / ეკრანი)",
    multiplier: 1.85,
    extraDays: 14,
  },
];

export const addOns: AddOnOption[] = [
  {
    id: "design",
    name: "უნიკალური UI/UX დიზაინი (Figma)",
    price: 450,
    days: 4,
    description: "ნულიდან შექმნილი პერსონალური ვიზუალური დიზაინი შაბლონების გარეშე.",
  },
  {
    id: "admin",
    name: "ადმინისტრირების პანელი (CMS)",
    price: 800,
    days: 6,
    description: "კონტენტის დამოუკიდებლად მართვისა და სტატისტიკის სისტემა.",
  },
  {
    id: "multilang",
    name: "მრავალენოვანი მხარდაჭერა",
    price: 300,
    days: 2,
    description: "ვებსაიტის ან აპლიკაციის ადაპტაცია რამდენიმე ენაზე.",
  },
  {
    id: "payment",
    name: "ონლაინ გადახდების ინტეგრაცია",
    price: 500,
    days: 4,
    description: "ქართული ბანკების ან Stripe გადახდის სისტემის ჩაშენება.",
  },
  {
    id: "branding",
    name: "ლოგო და ბრენდინგი",
    price: 350,
    days: 3,
    description: "ბრენდის იდენტობის, ლოგოსა და ფერების პალიტრის შემუშავება.",
  },
];

export const defaultEstimateConfig: EstimateConfig = {
  discountPercent: 0,
  priceRangeMultiplier: 1.25,
  daysRangeMultiplier: 1.3,
  products: productTypes,
  scopes: scopeOptions,
  addOns,
  disclaimer: ESTIMATE_DISCLAIMER,
};

export function formatGelAmount(amount: number) {
  return `${amount.toLocaleString("ka-GE")} ₾`;
}

export function formatGelRange(min: number, max: number) {
  return `${min.toLocaleString("ka-GE")} - ${max.toLocaleString("ka-GE")} ₾`;
}

export function formatDaysRange(min: number, max: number) {
  return `${min} - ${max} დღე`;
}

export function calculateEstimate(
  input: EstimateInput,
  config: EstimateConfig = defaultEstimateConfig,
): EstimateResult {
  const product = config.products.find((p) => p.id === input.productId);
  const scope = config.scopes.find((s) => s.id === input.scopeId);

  if (!product || !scope) {
    throw new Error("INVALID_ESTIMATE_INPUT");
  }

  const uniqueAddOnIds = [...new Set(input.addOnIds)];
  const selectedAddOns = uniqueAddOnIds.map((id) => {
    const addon = config.addOns.find((a) => a.id === id);
    if (!addon) throw new Error("INVALID_ADDON");
    return addon;
  });

  let calcMinPrice = product.basePrice * scope.multiplier;
  let calcMinDays = product.baseDays + scope.extraDays;

  for (const addon of selectedAddOns) {
    calcMinPrice += addon.price;
    calcMinDays += addon.days;
  }

  const discountPercent = Math.min(
    100,
    Math.max(0, Number(config.discountPercent) || 0),
  );
  const preDiscountMinPrice = Math.round(calcMinPrice);
  const discounted =
    calcMinPrice * (1 - discountPercent / 100);
  const minPrice = Math.round(discounted);
  const maxPrice = Math.round(
    discounted * (config.priceRangeMultiplier || 1.25),
  );
  const minDays = Math.round(calcMinDays);
  const maxDays = Math.round(
    calcMinDays * (config.daysRangeMultiplier || 1.3),
  );
  const addOnNames = selectedAddOns.map((a) => a.name);

  const discountLine =
    discountPercent > 0
      ? `ფასდაკლება: ${discountPercent}% (ფასამდე: ${formatGelAmount(preDiscountMinPrice)})`
      : null;

  const summary = [
    `პროდუქტი: ${product.name}`,
    `მასშტაბი: ${scope.name}`,
    `დამატებითი მოდულები: ${addOnNames.length ? addOnNames.join(", ") : "არ არის არჩეული"}`,
    discountLine,
    `სავარაუდო ბიუჯეტი: ${formatGelRange(minPrice, maxPrice)}`,
    `სავარაუდო ვადა: ${formatDaysRange(minDays, maxDays)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    minPrice,
    maxPrice,
    minDays,
    maxDays,
    preDiscountMinPrice,
    discountPercent,
    productName: product.name,
    scopeName: scope.name,
    addOnNames,
    summary,
  };
}

export function buildEstimateWhatsAppMessage(result: EstimateResult) {
  const discountBit =
    result.discountPercent > 0
      ? `\n• ფასდაკლება: ${result.discountPercent}%`
      : "";
  return `გამარჯობა, მაინტერესებს პროექტის დაწყება DekaByte-ში. ჩემი წინასწარი კალკულაციაა:
• პროდუქტი: ${result.productName}
• მასშტაბი: ${result.scopeName}
• დამატებითი მოდულები: ${result.addOnNames.length ? result.addOnNames.join(", ") : "არ არის არჩეული"}${discountBit}
• სავარაუდო ბიუჯეტი: ${formatGelRange(result.minPrice, result.maxPrice)}
• სავარაუდო ვადა: ${formatDaysRange(result.minDays, result.maxDays)}.`;
}

/** Merge partial DB jsonb with file defaults (keeps ids/structure stable). */
export function mergeEstimateConfig(
  stored: Partial<EstimateConfig> | null | undefined,
): EstimateConfig {
  if (!stored || typeof stored !== "object") {
    return structuredClone(defaultEstimateConfig);
  }

  const byId = <T extends { id: string }>(
    defaults: T[],
    overrides: T[] | undefined,
  ): T[] => {
    if (!Array.isArray(overrides) || overrides.length === 0) {
      return structuredClone(defaults);
    }
    const map = new Map(overrides.map((item) => [item.id, item]));
    return defaults.map((item) => {
      const over = map.get(item.id);
      return over ? { ...item, ...over, id: item.id } : structuredClone(item);
    });
  };

  return {
    discountPercent: Math.min(
      100,
      Math.max(0, Number(stored.discountPercent) || 0),
    ),
    priceRangeMultiplier:
      Number(stored.priceRangeMultiplier) > 0
        ? Number(stored.priceRangeMultiplier)
        : defaultEstimateConfig.priceRangeMultiplier,
    daysRangeMultiplier:
      Number(stored.daysRangeMultiplier) > 0
        ? Number(stored.daysRangeMultiplier)
        : defaultEstimateConfig.daysRangeMultiplier,
    products: byId(defaultEstimateConfig.products, stored.products),
    scopes: byId(defaultEstimateConfig.scopes, stored.scopes),
    addOns: byId(defaultEstimateConfig.addOns, stored.addOns),
    disclaimer:
      typeof stored.disclaimer === "string" && stored.disclaimer.trim()
        ? stored.disclaimer.trim()
        : defaultEstimateConfig.disclaimer,
  };
}
