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
  productName: string;
  scopeName: string;
  addOnNames: string[];
  summary: string;
};

export const ESTIMATE_DISCLAIMER =
  "კალკულატორი აჩვენებს საწყის სავარაუდო შეფასებას. საბოლოო ღირებულება ზუსტდება პროექტის დეტალური განხილვის შემდეგ.";

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

export function formatGelRange(min: number, max: number) {
  return `${min} - ${max} ₾`;
}

export function formatDaysRange(min: number, max: number) {
  return `${min} - ${max} დღე`;
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const product = productTypes.find((p) => p.id === input.productId);
  const scope = scopeOptions.find((s) => s.id === input.scopeId);

  if (!product || !scope) {
    throw new Error("INVALID_ESTIMATE_INPUT");
  }

  const uniqueAddOnIds = [...new Set(input.addOnIds)];
  const selectedAddOns = uniqueAddOnIds.map((id) => {
    const addon = addOns.find((a) => a.id === id);
    if (!addon) throw new Error("INVALID_ADDON");
    return addon;
  });

  let calcMinPrice = product.basePrice * scope.multiplier;
  let calcMinDays = product.baseDays + scope.extraDays;

  for (const addon of selectedAddOns) {
    calcMinPrice += addon.price;
    calcMinDays += addon.days;
  }

  const minPrice = Math.round(calcMinPrice);
  const maxPrice = Math.round(calcMinPrice * 1.25);
  const minDays = Math.round(calcMinDays);
  const maxDays = Math.round(calcMinDays * 1.3);
  const addOnNames = selectedAddOns.map((a) => a.name);

  const summary = [
    `პროდუქტი: ${product.name}`,
    `მასშტაბი: ${scope.name}`,
    `დამატებითი მოდულები: ${addOnNames.length ? addOnNames.join(", ") : "არ არის არჩეული"}`,
    `სავარაუდო ბიუჯეტი: ${formatGelRange(minPrice, maxPrice)}`,
    `სავარაუდო ვადა: ${formatDaysRange(minDays, maxDays)}`,
  ].join("\n");

  return {
    minPrice,
    maxPrice,
    minDays,
    maxDays,
    productName: product.name,
    scopeName: scope.name,
    addOnNames,
    summary,
  };
}

export function buildEstimateWhatsAppMessage(result: EstimateResult) {
  return `გამარჯობა, მაინტერესებს პროექტის დაწყება DEKABYTE-ში. ჩემი წინასწარი კალკულაციაა:
• პროდუქტი: ${result.productName}
• მასშტაბი: ${result.scopeName}
• დამატებითი მოდულები: ${result.addOnNames.length ? result.addOnNames.join(", ") : "არ არის არჩეული"}
• სავარაუდო ბიუჯეტი: ${result.minPrice} - ${result.maxPrice} ₾
• სავარაუდო ვადა: ${result.minDays} - ${result.maxDays} დღე.`;
}
