"use client";

import { useEffect, useState } from "react";

import { HeroCube } from "@/components/public/hero-cube";
import { HeroMark } from "@/components/public/hero-mark";
import { HeroOrbit } from "@/components/public/hero-orbit";
import {
  DEFAULT_HERO_VISUAL,
  HERO_VISUAL_EVENT,
  type HeroVisualMode,
  isHeroVisualMode,
  readHeroVisualMode,
} from "@/lib/hero-visual";

type HeroVisualProps = {
  className?: string;
};

export function HeroVisual({ className }: HeroVisualProps) {
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

  if (!ready) {
    return <HeroMark className={className} />;
  }

  if (mode === "orbit") return <HeroOrbit className={className} />;
  if (mode === "cube") return <HeroCube className={className} />;
  return <HeroMark className={className} />;
}
