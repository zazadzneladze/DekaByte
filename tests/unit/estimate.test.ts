import { describe, expect, it } from "vitest";

import {
  calculateEstimate,
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
    expect(result.minPrice).toBe(1500);
    expect(result.maxPrice).toBe(Math.round(1500 * 1.25));
    expect(result.minDays).toBe(7);
    expect(result.maxDays).toBe(Math.round(7 * 1.3));
    expect(result.addOnNames).toEqual([]);
  });

  it("adds feature (add-on) prices and days", () => {
    const result = calculateEstimate({
      productId: "corporate",
      scopeId: "medium",
      addOnIds: ["design", "admin"],
    });

    const base = 2800 * 1.25 + 700 + 1200;
    const days = 14 + 5 + 5 + 7;

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

    expect(result.minPrice).toBe(1500 + 450);
    expect(result.addOnNames).toHaveLength(1);
  });

  it("formats gel and day ranges with Georgian locale", () => {
    expect(formatGelRange(1500, 1875)).toBe(
      `${(1500).toLocaleString("ka-GE")} - ${(1875).toLocaleString("ka-GE")} ₾`,
    );
    expect(formatDaysRange(7, 9)).toBe("7 - 9 დღე");
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
