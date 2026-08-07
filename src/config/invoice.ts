export type InvoiceCurrency = "GEL" | "USD" | "EUR";

export const INVOICE_CURRENCIES: { id: InvoiceCurrency; label: string }[] = [
  { id: "GEL", label: "GEL" },
  { id: "USD", label: "USD" },
  { id: "EUR", label: "EUR" },
];

export const INVOICE_PAYMENT_STAGES = [
  "ავანსი",
  "ეტაპი",
  "სრული",
] as const;

/** Supplier party block on invoice (not bank-specific). */
export const INVOICE_SUPPLIER = {
  nameKa: "ზაზა ძნელაძე",
  nameEn: "ZAZA DZNELADZE",
  personalId: "01027056654",
  address: "ბათუმი, 26 მაისის ქ. №87",
  phone: "+995 557 162 632",
  serviceLine: "ვებდიზაინი, ვებდეველოპმენტი და ციფრული პროდუქტები",
} as const;

export type InvoiceBankId = "bog" | "tbc";

export type InvoiceBankProfile = {
  bankName: string;
  swift: string;
  accountNumber: string;
  ibanGel: string;
};

export type InvoiceBankConfig = Record<InvoiceBankId, InvoiceBankProfile>;

export const INVOICE_BANK_IDS: InvoiceBankId[] = ["bog", "tbc"];

export const INVOICE_BANK_OPTIONS: { id: InvoiceBankId; label: string }[] = [
  { id: "bog", label: "საქართველოს ბანკი" },
  { id: "tbc", label: "TBC ბანკი" },
];

export const DEFAULT_INVOICE_BANK_CONFIG: InvoiceBankConfig = {
  bog: {
    bankName: "სს „საქართველოს ბანკი“",
    swift: "BAGAGE22",
    accountNumber: "01010101010100101",
    ibanGel: "",
  },
  tbc: {
    bankName: "სს „TBC ბანკი“",
    swift: "TBCBGE22",
    accountNumber: "",
    ibanGel: "",
  },
};

export function mergeInvoiceBankConfig(
  stored: Partial<InvoiceBankConfig> | null | undefined,
): InvoiceBankConfig {
  const defaults = DEFAULT_INVOICE_BANK_CONFIG;
  if (!stored || typeof stored !== "object") {
    return structuredClone(defaults);
  }
  return {
    bog: { ...defaults.bog, ...stored.bog },
    tbc: { ...defaults.tbc, ...stored.tbc },
  };
}

export function getInvoiceBankProfile(
  config: InvoiceBankConfig,
  bankId: InvoiceBankId,
): InvoiceBankProfile {
  return config[bankId];
}

export const INVOICE_NUMBER_PREFIX = "DB";

export const INCOME_TAX_RATE = 0.2;

export type InvoiceLineItem = {
  description: string;
  qty: number;
  unitPrice: number;
};

export type InvoiceDiscountInput = {
  discountGel?: number;
  discountPercent?: number;
};

export type InvoiceTotalsOptions = {
  /** 20% საშემოსავლო — მხოლოდ კომპანია/საგადასახადო აგენტის შემთხვევაში */
  withholdIncomeTax?: boolean;
};

export function computeInvoiceTotals(
  items: InvoiceLineItem[],
  discount: InvoiceDiscountInput = {},
  options: InvoiceTotalsOptions = {},
) {
  const subtotal = items.reduce(
    (sum, row) => sum + Math.round(row.qty * row.unitPrice),
    0,
  );

  const pct = Math.max(0, Math.min(100, discount.discountPercent ?? 0));
  let discountAmount: number;
  let discountPercent = 0;

  if (pct > 0) {
    discountPercent = pct;
    discountAmount = Math.round((subtotal * pct) / 100);
  } else {
    discountAmount = Math.max(0, Math.min(discount.discountGel ?? 0, subtotal));
    if (subtotal > 0 && discountAmount > 0) {
      discountPercent = Math.round((discountAmount / subtotal) * 100);
    }
  }

  const gross = Math.max(0, subtotal - discountAmount);
  const withhold = Boolean(options.withholdIncomeTax);
  const taxWithheld = withhold
    ? Math.round(gross * INCOME_TAX_RATE)
    : 0;
  const net = Math.max(0, gross - taxWithheld);

  return {
    subtotal,
    discount: discountAmount,
    discountPercent,
    gross,
    taxWithheld,
    net,
    withholdIncomeTax: withhold,
  };
}

export function invoiceStatusLabelKa(
  status: "draft" | "sent" | "paid",
): string {
  switch (status) {
    case "draft":
      return "დრაფტი";
    case "sent":
      return "გადასახდელი";
    case "paid":
      return "გადახდილი";
    default:
      return status;
  }
}

export function formatMoney(amount: number, currency: InvoiceCurrency = "GEL") {
  const formatted = amount.toLocaleString("ka-GE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${currency}`;
}
