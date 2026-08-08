export type HeroVisualMode = "cube" | "orbit" | "mark";

export const DEFAULT_HERO_VISUAL: HeroVisualMode = "mark";

export function isHeroVisualMode(value: unknown): value is HeroVisualMode {
  return value === "cube" || value === "orbit" || value === "mark";
}

export function resolveHeroVisualMode(value: unknown): HeroVisualMode {
  return isHeroVisualMode(value) ? value : DEFAULT_HERO_VISUAL;
}
