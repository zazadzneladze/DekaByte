import { describe, expect, it } from "vitest";

import {
  calculateEstimate,
  defaultEstimateConfig,
  formatDaysRange,
  formatGelRange,
} from "@/config/estimate";

describe("calculateEstimate", () => {
  it("computes base price and day range for landing + small scope", () => {
    const result = calculateEstimate({
      productId: "landing",
      scopeId: "small",
      addOnIds: [],
    });

    expect(result.productName).toBe("სავიზიტო / Landing Page");
    expect(result.scopeName).toBe("მცირე (1-3 გვერდი / ეკრანი)");
    expect(result.minPrice).toBe(900);
    expect(result.maxPrice).toBe(Math.round(900 * 1.25));
    expect(result.minDays).toBe(5);
    expect(result.maxDays).toBe(Math.round(5 * 1.3));
    expect(result.addOnNames).toEqual([]);
    expect(result.discountPercent).toBe(0);
    expect(result.preDiscountMinPrice).toBe(900);
  });

  it("applies global discount percent to prices", () => {
    const result = calculateEstimate(
      { productId: "landing", scopeId: "small", addOnIds: [] },
      { ...defaultEstimateConfig, discountPercent: 10 },
    );

    expect(result.preDiscountMinPrice).toBe(900);
    expect(result.minPrice).toBe(Math.round(900 * 0.9));
    expect(result.maxPrice).toBe(Math.round(900 * 0.9 * 1.25));
    expect(result.discountPercent).toBe(10);
  });

  it("adds feature (add-on) prices and days", () => {
    const result = calculateEstimate({
      productId: "corporate",
      scopeId: "medium",
      addOnIds: ["design", "admin"],
    });

    const base = 1800 * 1.25 + 450 + 800;
    const days = 12 + 4 + 4 + 6;

    expect(result.minPrice).toBe(Math.round(base));
    expect(result.maxPrice).toBe(Math.round(base * 1.25));
    expect(result.minDays).toBe(Math.round(days));
    expect(result.maxDays).toBe(Math.round(days * 1.3));
    expect(result.addOnNames).toEqual([
      "უნიკალური UI/UX დიზაინი (Figma)",
      "ადმინისტრირების პანელი (CMS)",
    ]);
  });

  it("deduplicates add-on ids", () => {
    const result = calculateEstimate({
      productId: "landing",
      scopeId: "small",
      addOnIds: ["multilang", "multilang"],
    });

    expect(result.minPrice).toBe(900 + 300);
    expect(result.addOnNames).toHaveLength(1);
  });

  it("formats gel and day ranges with Georgian locale", () => {
    expect(formatGelRange(900, 1125)).toBe(
      `${(900).toLocaleString("ka-GE")} - ${(1125).toLocaleString("ka-GE")} ₾`,
    );
    expect(formatDaysRange(5, 7)).toBe("5 - 7 დღე");
  });

  it("includes formatted ranges in summary", () => {
    const result = calculateEstimate({
      productId: "landing",
      scopeId: "small",
      addOnIds: [],
    });

    expect(result.summary).toContain(
      formatGelRange(result.minPrice, result.maxPrice),
    );
    expect(result.summary).toContain(
      formatDaysRange(result.minDays, result.maxDays),
    );
  });

  it("throws on invalid product or scope", () => {
    expect(() =>
      calculateEstimate({
        productId: "missing",
        scopeId: "small",
        addOnIds: [],
      }),
    ).toThrow("INVALID_ESTIMATE_INPUT");

    expect(() =>
      calculateEstimate({
        productId: "landing",
        scopeId: "missing",
        addOnIds: [],
      }),
    ).toThrow("INVALID_ESTIMATE_INPUT");
  });

  it("throws on invalid add-on", () => {
    expect(() =>
      calculateEstimate({
        productId: "landing",
        scopeId: "small",
        addOnIds: ["not-real"],
      }),
    ).toThrow("INVALID_ADDON");
  });
});
