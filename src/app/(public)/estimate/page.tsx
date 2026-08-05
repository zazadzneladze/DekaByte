import type { Metadata } from "next";

import { EstimateCalculator } from "@/app/(public)/estimate/estimate-calculator";
import { SectionLabel } from "@/components/public/section-label";
import { ESTIMATE_DISCLAIMER } from "@/config/estimate";

export const metadata: Metadata = {
  title: "ბიუჯეტის შეფასება",
  description:
    "გაიგეთ პროექტის საწყისი სავარაუდო ბიუჯეტი და ვადა — DekaByte კალკულატორი.",
};

export default function EstimatePage() {
  return (
    <div
      data-hide-mobile-contact
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mb-12 max-w-2xl">
        <SectionLabel>კალკულატორი</SectionLabel>
        <h1 className="text-display text-3xl font-semibold text-foreground sm:text-5xl">
          ბიუჯეტის შეფასება
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          აირჩიეთ პროდუქტის ტიპი, მასშტაბი და საჭირო მოდულები — მიიღეთ საწყისი
          სავარაუდო დიაპაზონი.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {ESTIMATE_DISCLAIMER}
        </p>
      </div>

      <EstimateCalculator />
    </div>
  );
}
