import type { Metadata } from "next";

import { EstimateCalculator } from "@/app/(public)/estimate/estimate-calculator";
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
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          ბიუჯეტის შეფასება
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
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
