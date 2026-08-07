/**
 * Georgian amount-in-words helpers (ported from EstateOS contract-generator).
 */

const UNITS = [
  "",
  "ერთი",
  "ორი",
  "სამი",
  "ოთხი",
  "ხუთი",
  "ექვსი",
  "შვიდი",
  "რვა",
  "ცხრა",
  "ათი",
  "თერთმეტი",
  "თორმეტი",
  "ცამეტი",
  "თოთხმეტი",
  "თხუთმეტი",
  "ექვსმეტი",
  "ჩვიდმეტი",
  "თვრამეტი",
  "ცხრამეტი",
];

const HUNDREDS = [
  "",
  "ასი",
  "ორასი",
  "სამასი",
  "ოთხასი",
  "ხუთასი",
  "ექვსასი",
  "შვიდასი",
  "რვაასი",
  "ცხრაასი",
];

function convertUnder20(n: number): string {
  return UNITS[n] || "";
}

function convertUnder100(n: number): string {
  if (n < 20) return convertUnder20(n);
  if (n >= 20 && n < 40) {
    const rem = n - 20;
    return rem === 0 ? "ოცი" : "ოცდა" + convertUnder20(rem);
  }
  if (n >= 40 && n < 60) {
    const rem = n - 40;
    return rem === 0 ? "ორმოცი" : "ორმოცდა" + convertUnder20(rem);
  }
  if (n >= 60 && n < 80) {
    const rem = n - 60;
    return rem === 0 ? "სამოცი" : "სამოცდა" + convertUnder20(rem);
  }
  if (n >= 80 && n < 100) {
    const rem = n - 80;
    return rem === 0 ? "ოთხმოცი" : "ოთხმოცდა" + convertUnder20(rem);
  }
  return "";
}

function convertUnder1000(n: number): string {
  if (n < 100) return convertUnder100(n);
  const hundredDigit = Math.floor(n / 100);
  const remainder = n % 100;
  let hundredStr = HUNDREDS[hundredDigit] ?? "";
  if (remainder === 0) return hundredStr;
  if (hundredStr.endsWith("ი")) hundredStr = hundredStr.slice(0, -1);
  return hundredStr + " " + convertUnder100(remainder);
}

function convertIntegerToWords(n: number): string {
  if (n < 1000) return convertUnder1000(n);
  if (n >= 1_000_000_000) {
    const billions = Math.floor(n / 1_000_000_000);
    const remainder = n % 1_000_000_000;
    const billionStr = convertIntegerToWords(billions) + " მილიარდი";
    if (remainder === 0) return billionStr;
    return billionStr.replace(/ი$/, "") + " " + convertIntegerToWords(remainder);
  }
  if (n >= 1_000_000) {
    const millions = Math.floor(n / 1_000_000);
    const remainder = n % 1_000_000;
    const millionStr =
      millions === 1
        ? "ერთი მილიონი"
        : convertIntegerToWords(millions) + " მილიონი";
    if (remainder === 0) return millionStr;
    return millionStr.replace(/ი$/, "") + " " + convertIntegerToWords(remainder);
  }
  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;
  let thousandPrefix =
    thousands === 1 ? "ათასი" : convertUnder1000(thousands) + " ათასი";
  if (remainder === 0) return thousandPrefix;
  if (thousandPrefix.endsWith("ი")) {
    thousandPrefix = thousandPrefix.slice(0, -1);
  }
  return thousandPrefix + " " + convertUnder1000(remainder);
}

export function numberToGeorgianWords(num: number): string {
  if (!Number.isFinite(num)) return "";
  if (num === 0) return "ნული";
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const integerPart = Math.floor(absNum);
  const decimalPart = Math.round((absNum - integerPart) * 100);
  let result =
    integerPart === 0 ? "ნული" : convertIntegerToWords(integerPart);
  if (isNegative) result = "მინუს " + result;
  if (decimalPart > 0) result += ` და ${decimalPart} მეასედი`;
  return result.trim();
}

export function formatAmountWithWords(
  amount: number,
  currency: "USD" | "GEL" | "EUR" = "GEL",
): string {
  if (!Number.isFinite(amount)) return "";
  const hasDecimals = amount % 1 !== 0;
  const formattedNum = amount.toLocaleString("en-US", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
  const words = numberToGeorgianWords(amount);
  const currencySymbol =
    currency === "GEL"
      ? "ლარი"
      : currency === "USD"
        ? "ა.შ.შ. დოლარი"
        : "ევრო";
  return `${formattedNum} (${words}) ${currencySymbol}`;
}
