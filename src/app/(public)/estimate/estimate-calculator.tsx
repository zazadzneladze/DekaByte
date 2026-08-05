"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  buildEstimateWhatsAppMessage,
  calculateEstimate,
  formatDaysRange,
  formatGelAmount,
  formatGelRange,
  type EstimateConfig,
  type EstimateResult,
} from "@/config/estimate";
import { whatsappDefaultMessage, whatsappHref } from "@/config/site";
import { trackMetaEvent, TrackedAnchor } from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";

export function EstimateCalculator({ config }: { config: EstimateConfig }) {
  const [productId, setProductId] = useState(
    config.products[0]?.id ?? "landing",
  );
  const [scopeId, setScopeId] = useState(config.scopes[0]?.id ?? "small");
  const [addOnIds, setAddOnIds] = useState<string[]>([]);

  const result: EstimateResult | null = useMemo(() => {
    try {
      return calculateEstimate({ productId, scopeId, addOnIds }, config);
    } catch {
      return null;
    }
  }, [productId, scopeId, addOnIds, config]);

  const resultSummary = result?.summary;

  useEffect(() => {
    if (!resultSummary) return;
    trackMetaEvent("estimate_complete", {
      product_id: productId,
      scope_id: scopeId,
      addon_count: addOnIds.length,
    });
  }, [resultSummary, productId, scopeId, addOnIds.length]);

  function toggleAddOn(id: string, checked: boolean) {
    setAddOnIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((x) => x !== id);
    });
  }

  const waHref = result
    ? whatsappHref(buildEstimateWhatsAppMessage(result))
    : whatsappHref(whatsappDefaultMessage);
  const contactHref = result
    ? `/contact?summary=${encodeURIComponent(result.summary)}`
    : "/contact";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold text-foreground">
            პროდუქტის ტიპი
          </legend>
          <ul className="flex flex-col gap-2">
            {config.products.map((product) => (
              <li key={product.id}>
                <label
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-lg border px-3 py-3 transition-colors",
                    productId === product.id
                      ? "border-electric bg-muted-blue/40"
                      : "border-border bg-surface hover:border-foreground/20",
                  )}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="product"
                      className="mt-1"
                      checked={productId === product.id}
                      onChange={() => setProductId(product.id)}
                    />
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {product.name}
                        </span>
                        <span className="text-sm font-medium tabular-nums text-electric">
                          {formatGelAmount(product.basePrice)}-დან
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.description}
                      </span>
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold text-foreground">
            მასშტაბი
          </legend>
          <ul className="flex flex-col gap-2">
            {config.scopes.map((scope) => (
              <li key={scope.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition-colors",
                    scopeId === scope.id
                      ? "border-electric bg-muted-blue/40"
                      : "border-border bg-surface hover:border-foreground/20",
                  )}
                >
                  <input
                    type="radio"
                    name="scope"
                    className="mt-1"
                    checked={scopeId === scope.id}
                    onChange={() => setScopeId(scope.id)}
                  />
                  <span className="font-medium text-foreground">{scope.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold text-foreground">
            დამატებითი მოდულები
          </legend>
          <ul className="flex flex-col gap-2">
            {config.addOns.map((addon) => {
              const checked = addOnIds.includes(addon.id);
              return (
                <li key={addon.id}>
                  <Label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition-colors",
                      checked
                        ? "border-electric bg-muted-blue/40"
                        : "border-border bg-surface hover:border-foreground/20",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        toggleAddOn(addon.id, value === true)
                      }
                      className="mt-0.5"
                    />
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {addon.name}
                        </span>
                        <span className="text-sm font-medium tabular-nums text-electric">
                          +{formatGelAmount(addon.price)}
                        </span>
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {addon.description}
                      </span>
                    </span>
                  </Label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
        <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-lift ring-1 ring-border/40 sm:p-6">
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-electric uppercase">
            შედეგი
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            სავარაუდო შეფასება
          </h2>

          {result ? (
            <div className="mt-6 flex flex-col gap-5">
              <div>
                <p className="text-sm text-muted-foreground">ბიუჯეტი</p>
                {result.discountPercent > 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground line-through">
                    {formatGelAmount(result.preDiscountMinPrice)}
                  </p>
                ) : null}
                <p className="text-display mt-1 text-3xl font-semibold text-foreground">
                  {formatGelRange(result.minPrice, result.maxPrice)}
                </p>
                {result.discountPercent > 0 ? (
                  <p className="mt-1 text-sm font-medium text-electric">
                    ფასდაკლება {result.discountPercent}%
                  </p>
                ) : null}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ვადა</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                  {formatDaysRange(result.minDays, result.maxDays)}
                </p>
              </div>
              <dl className="space-y-2.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">პროდუქტი</dt>
                  <dd className="text-right font-medium text-foreground">
                    {result.productName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">მასშტაბი</dt>
                  <dd className="text-right font-medium text-foreground">
                    {result.scopeName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">მოდულები</dt>
                  <dd className="text-right text-foreground">
                    {result.addOnNames.length
                      ? result.addOnNames.join(", ")
                      : "არ არის არჩეული"}
                  </dd>
                </div>
              </dl>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {config.disclaimer}
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <Button
                  size="lg"
                  className="w-full"
                  render={
                    <TrackedAnchor
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      event="whatsapp_click"
                    />
                  }
                >
                  WhatsApp-ში გაგზავნა
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  render={<Link href={contactHref} />}
                >
                  კონტაქტის ფორმა
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              აირჩიეთ პროდუქტი და მასშტაბი შეფასების სანახავად.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
