"use client";

import { Box, Orbit, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_HERO_VISUAL,
  HERO_VISUAL_EVENT,
  type HeroVisualMode,
  isHeroVisualMode,
  readHeroVisualMode,
  writeHeroVisualMode,
} from "@/lib/hero-visual";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: HeroVisualMode;
  label: string;
  icon: typeof Sparkles;
}[] = [
  { id: "mark", label: "მარკი", icon: Sparkles },
  { id: "cube", label: "კუბი", icon: Box },
  { id: "orbit", label: "ორბიტა", icon: Orbit },
];

/**
 * Homepage-only control: switch between mark, cube, and orbit hero visuals.
 */
export function HeroVisualToggle({ className }: { className?: string }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<HeroVisualMode>(DEFAULT_HERO_VISUAL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMode(readHeroVisualMode());
    setReady(true);
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<HeroVisualMode>).detail;
      if (isHeroVisualMode(detail)) setMode(detail);
    };
    window.addEventListener(HERO_VISUAL_EVENT, onChange);
    return () => window.removeEventListener(HERO_VISUAL_EVENT, onChange);
  }, []);

  if (pathname !== "/" || !ready) return null;

  function set(next: HeroVisualMode) {
    setMode(next);
    writeHeroVisualMode(next);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border/80 bg-secondary/60 p-0.5",
        className,
      )}
      role="group"
      aria-label="Hero ვიზუალი"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = mode === opt.id;
        return (
          <Button
            key={opt.id}
            type="button"
            size="icon-sm"
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "size-8",
              active && "bg-card text-foreground shadow-soft",
            )}
            aria-pressed={active}
            title={opt.label}
            aria-label={`Hero: ${opt.label}`}
            onClick={() => set(opt.id)}
          >
            <Icon aria-hidden />
          </Button>
        );
      })}
    </div>
  );
}
