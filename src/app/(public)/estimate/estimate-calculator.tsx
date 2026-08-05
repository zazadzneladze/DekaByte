"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ESTIMATE_DISCLAIMER,
  addOns,
  buildEstimateWhatsAppMessage,
  calculateEstimate,
  formatDaysRange,
  formatGelRange,
  productTypes,
  scopeOptions,
  type EstimateResult,
} from "@/config/estimate";
import { whatsappHref } from "@/config/site";
import { trackMetaEvent, TrackedAnchor } from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";

export function EstimateCalculator() {
  const [productId, setProductId] = useState(productTypes[0]?.id ?? "landing");
  const [scopeId, setScopeId] = useState(scopeOptions[0]?.id ?? "small");
  const [addOnIds, setAddOnIds] = useState<string[]>([]);

  const result: EstimateResult | null = useMemo(() => {
    try {
      return calculateEstimate({ productId, scopeId, addOnIds });
    } catch {
      return null;
    }
  }, [productId, scopeId, addOnIds]);

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
    : whatsappHref();
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
            {productTypes.map((product) => (
              <li key={product.id}>
                <label
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-lg border px-3 py-3 transition-colors",
                    productId === product.id
                      ? "border-electric bg-muted-blue/40"
                      : "border-border bg-surface hover:border-foreground/20",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="product"
                      value={product.id}
                      checked={productId === product.id}
                      onChange={() => setProductId(product.id)}
                      className="size-4 accent-[var(--electric)]"
                    />
                    <span className="font-medium text-foreground">
                      {product.name}
                    </span>
                  </span>
                  <span className="pl-6 text-sm text-muted-foreground">
                    {product.description}
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
            {scopeOptions.map((scope) => (
              <li key={scope.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors",
                    scopeId === scope.id
                      ? "border-electric bg-muted-blue/40"
                      : "border-border bg-surface hover:border-foreground/20",
                  )}
                >
                  <input
                    type="radio"
                    name="scope"
                    value={scope.id}
                    checked={scopeId === scope.id}
                    onChange={() => setScopeId(scope.id)}
                    className="size-4 accent-[var(--electric)]"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {scope.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold text-foreground">
            დამატებითი მოდულები
          </legend>
          <ul className="flex flex-col gap-3">
            {addOns.map((addon) => {
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
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground">
                        {addon.name}
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
        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">
            სავარაუდო შეფასება
          </h2>

          {result ? (
            <div className="mt-5 flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ბიუჯეტი</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                  {formatGelRange(result.minPrice, result.maxPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ვადა</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatDaysRange(result.minDays, result.maxDays)}
                </p>
              </div>
              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">პროდუქტი</dt>
                  <dd className="text-right text-foreground">
                    {result.productName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">მასშტაბი</dt>
                  <dd className="text-right text-foreground">
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
                {ESTIMATE_DISCLAIMER}
              </p>

              <div className="flex flex-col gap-2 pt-2">
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
            <p className="mt-4 text-sm text-muted-foreground">
              აირჩიეთ პროდუქტი და მასშტაბი შეფასების სანახავად.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
