"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateEstimateConfig } from "@/actions/settings";
import type { EstimateConfig } from "@/config/estimate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EstimateSettingsForm({ initial }: { initial: EstimateConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [config, setConfig] = useState<EstimateConfig>(initial);

  function save() {
    startTransition(async () => {
      const result = await updateEstimateConfig(config);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("ბიუჯეტის ცხრილები შენახულია");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8 rounded-xl border border-border bg-card p-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          ბიუჯეტის კალკულატორი
        </h2>
        <p className="text-sm text-muted-foreground">
          ფასები, ვადები და ერთიანი ფასდაკლება — აისახება /estimate გვერდზე
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="discountPercent">ფასდაკლება (%)</Label>
          <Input
            id="discountPercent"
            type="number"
            min={0}
            max={100}
            step={1}
            value={config.discountPercent}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                discountPercent: Number(e.target.value),
              }))
            }
          />
          <p className="text-xs text-muted-foreground">
            0 = ფასდაკლების გარეშე. მაგ. 10 → ყველა შედეგზე −10%
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceRangeMultiplier">ფასის დიაპაზონის კოეფ.</Label>
          <Input
            id="priceRangeMultiplier"
            type="number"
            min={1}
            max={5}
            step={0.05}
            value={config.priceRangeMultiplier}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                priceRangeMultiplier: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="daysRangeMultiplier">ვადის დიაპაზონის კოეფ.</Label>
          <Input
            id="daysRangeMultiplier"
            type="number"
            min={1}
            max={5}
            step={0.05}
            value={config.daysRangeMultiplier}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                daysRangeMultiplier: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="disclaimer">დისქლეიმერი</Label>
        <Textarea
          id="disclaimer"
          rows={3}
          value={config.disclaimer}
          onChange={(e) =>
            setConfig((c) => ({ ...c, disclaimer: e.target.value }))
          }
        />
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">პროდუქტები</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="pb-2 font-medium">სახელი</th>
                <th className="pb-2 font-medium">ბაზ. ფასი ₾</th>
                <th className="pb-2 font-medium">დღეები</th>
                <th className="pb-2 font-medium">აღწერა</th>
              </tr>
            </thead>
            <tbody>
              {config.products.map((product, index) => (
                <tr key={product.id} className="align-top border-t border-border">
                  <td className="py-2 pr-2">
                    <Input
                      value={product.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setConfig((c) => {
                          const products = [...c.products];
                          products[index] = { ...product, name };
                          return { ...c, products };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min={0}
                      value={product.basePrice}
                      onChange={(e) => {
                        const basePrice = Number(e.target.value);
                        setConfig((c) => {
                          const products = [...c.products];
                          products[index] = { ...product, basePrice };
                          return { ...c, products };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min={0}
                      value={product.baseDays}
                      onChange={(e) => {
                        const baseDays = Number(e.target.value);
                        setConfig((c) => {
                          const products = [...c.products];
                          products[index] = { ...product, baseDays };
                          return { ...c, products };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2">
                    <Input
                      value={product.description}
                      onChange={(e) => {
                        const description = e.target.value;
                        setConfig((c) => {
                          const products = [...c.products];
                          products[index] = { ...product, description };
                          return { ...c, products };
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">მასშტაბი</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="pb-2 font-medium">სახელი</th>
                <th className="pb-2 font-medium">მულტიპლიკატორი</th>
                <th className="pb-2 font-medium">დამატ. დღეები</th>
              </tr>
            </thead>
            <tbody>
              {config.scopes.map((scope, index) => (
                <tr key={scope.id} className="border-t border-border">
                  <td className="py-2 pr-2">
                    <Input
                      value={scope.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setConfig((c) => {
                          const scopes = [...c.scopes];
                          scopes[index] = { ...scope, name };
                          return { ...c, scopes };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min={0.1}
                      step={0.05}
                      value={scope.multiplier}
                      onChange={(e) => {
                        const multiplier = Number(e.target.value);
                        setConfig((c) => {
                          const scopes = [...c.scopes];
                          scopes[index] = { ...scope, multiplier };
                          return { ...c, scopes };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      min={0}
                      value={scope.extraDays}
                      onChange={(e) => {
                        const extraDays = Number(e.target.value);
                        setConfig((c) => {
                          const scopes = [...c.scopes];
                          scopes[index] = { ...scope, extraDays };
                          return { ...c, scopes };
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">დამატებითი მოდულები</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="pb-2 font-medium">სახელი</th>
                <th className="pb-2 font-medium">ფასი ₾</th>
                <th className="pb-2 font-medium">დღეები</th>
                <th className="pb-2 font-medium">აღწერა</th>
              </tr>
            </thead>
            <tbody>
              {config.addOns.map((addon, index) => (
                <tr key={addon.id} className="align-top border-t border-border">
                  <td className="py-2 pr-2">
                    <Input
                      value={addon.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setConfig((c) => {
                          const addOns = [...c.addOns];
                          addOns[index] = { ...addon, name };
                          return { ...c, addOns };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min={0}
                      value={addon.price}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setConfig((c) => {
                          const addOns = [...c.addOns];
                          addOns[index] = { ...addon, price };
                          return { ...c, addOns };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min={0}
                      value={addon.days}
                      onChange={(e) => {
                        const days = Number(e.target.value);
                        setConfig((c) => {
                          const addOns = [...c.addOns];
                          addOns[index] = { ...addon, days };
                          return { ...c, addOns };
                        });
                      }}
                    />
                  </td>
                  <td className="py-2">
                    <Input
                      value={addon.description}
                      onChange={(e) => {
                        const description = e.target.value;
                        setConfig((c) => {
                          const addOns = [...c.addOns];
                          addOns[index] = { ...addon, description };
                          return { ...c, addOns };
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Button type="button" disabled={pending} onClick={save}>
        {pending ? "ინახება…" : "ბიუჯეტის ცხრილების შენახვა"}
      </Button>
    </div>
  );
}
