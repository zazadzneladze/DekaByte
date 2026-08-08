"use client";

import { Box, Orbit, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateHeroVisual } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroVisualMode } from "@/lib/hero-visual";

const options = [
  {
    value: "mark" as const,
    label: "მარკი",
    description: "ბრენდის მარკი ორბიტალური კატეგორიებით — default",
    icon: Sparkles,
  },
  {
    value: "cube" as const,
    label: "კუბი",
    description: "3D კუბი სტუდიის კატეგორიებით",
    icon: Box,
  },
  {
    value: "orbit" as const,
    label: "ორბიტა",
    description: "ორბიტალური რუკა მარკის გარშემო",
    icon: Orbit,
  },
];

type HeroVisualSettingsPanelProps = {
  initial: HeroVisualMode;
};

export function HeroVisualSettingsPanel({ initial }: HeroVisualSettingsPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    setCurrent(initial);
  }, [initial]);

  function select(mode: HeroVisualMode) {
    if (mode === current || pending) return;
    const previous = current;
    setCurrent(mode);
    startTransition(async () => {
      const result = await updateHeroVisual(mode);
      if (!result.ok) {
        toast.error(result.error);
        setCurrent(previous);
        return;
      }
      toast.success("Hero ვიზუალი შენახულია");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold">Hero ვიზუალი</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          მთავარი გვერდის hero ბლოკის ვიზუალი — ყველა visitor-ისთვის ერთნაირი.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map(({ value, label, description, icon: Icon }) => {
          const active = current === value;
          return (
            <Button
              key={value}
              type="button"
              variant={active ? "default" : "outline"}
              className={cn(
                "h-auto flex-col items-start gap-2 px-3 py-3 text-left",
                pending && "pointer-events-none opacity-70",
              )}
              onClick={() => select(value)}
              aria-pressed={active}
            >
              <span className="flex items-center gap-2 font-medium">
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </span>
              <span
                className={cn(
                  "text-xs leading-snug font-normal",
                  active ? "text-primary-foreground/85" : "text-muted-foreground",
                )}
              >
                {description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
