import type { Metadata } from "next";

import { EstimateCalculator } from "@/app/(public)/estimate/estimate-calculator";
import { PublicPageHero } from "@/components/public/public-page-hero";
import { getEstimateConfig } from "@/db/queries";

export const metadata: Metadata = {
  title: "ბიუჯეტის შეფასება",
  description:
    "გაიგეთ პროექტის საწყისი სავარაუდო ბიუჯეტი და ვადა — DekaByte კალკულატორი.",
};

export default async function EstimatePage() {
  const config = await getEstimateConfig();

  return (
    <div data-hide-mobile-contact>
      <PublicPageHero
        label="კალკულატორი"
        title="ბიუჯეტის შეფასება"
        description="აირჩიეთ პროდუქტის ტიპი, მასშტაბი და საჭირო მოდულები — მიიღეთ საწყისი სავარაუდო დიაპაზონი."
      >
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {config.disclaimer}
        </p>
        {config.discountPercent > 0 ? (
          <p className="mt-3 text-sm font-medium text-electric">
            მიმდინარე ფასდაკლება: {config.discountPercent}%
          </p>
        ) : null}
      </PublicPageHero>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <EstimateCalculator config={config} />
      </div>
    </div>
  );
}
