"use client";

import { HeroCube } from "@/components/public/hero-cube";
import { HeroMark } from "@/components/public/hero-mark";
import { HeroOrbit } from "@/components/public/hero-orbit";
import type { HeroVisualMode } from "@/lib/hero-visual";

type HeroVisualProps = {
  mode: HeroVisualMode;
  className?: string;
};

export function HeroVisual({ mode, className }: HeroVisualProps) {
  if (mode === "orbit") return <HeroOrbit className={className} />;
  if (mode === "cube") return <HeroCube className={className} />;
  return <HeroMark className={className} />;
}
