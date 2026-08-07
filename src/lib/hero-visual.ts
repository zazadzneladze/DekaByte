export type HeroVisualMode = "cube" | "orbit" | "mark";

export const HERO_VISUAL_STORAGE_KEY = "dekabyte-hero-visual";
export const HERO_VISUAL_EVENT = "dekabyte:hero-visual";
export const DEFAULT_HERO_VISUAL: HeroVisualMode = "mark";

export function isHeroVisualMode(value: unknown): value is HeroVisualMode {
  return value === "cube" || value === "orbit" || value === "mark";
}

export function readHeroVisualMode(): HeroVisualMode {
  if (typeof window === "undefined") return DEFAULT_HERO_VISUAL;
  try {
    const raw = window.localStorage.getItem(HERO_VISUAL_STORAGE_KEY);
    return isHeroVisualMode(raw) ? raw : DEFAULT_HERO_VISUAL;
  } catch {
    return DEFAULT_HERO_VISUAL;
  }
}

export function writeHeroVisualMode(mode: HeroVisualMode) {
  try {
    window.localStorage.setItem(HERO_VISUAL_STORAGE_KEY, mode);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(
    new CustomEvent(HERO_VISUAL_EVENT, { detail: mode }),
  );
}
