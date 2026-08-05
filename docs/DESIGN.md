# DekaByte — Design system

## Visual direction

Graphite / off-white / electric blue studio. Light page field, dark type, one blue accent. Closing bands (footer, final CTA) use deep ink — not a dark-mode site. Not purple gradients, not cream-and-serif templates.

Signature: hero layers real portfolio screenshots (when available) inside web + admin + Android chrome. Grain mesh + scroll reveals for presence. No fake analytics percentages.

## Brand colors

| Token | Hex | Role |
| --- | --- | --- |
| Graphite | `#12151A` | Primary text, logo mark |
| Slate | `#4A5160` | Secondary text |
| Off-white | `#F5F6F8` | Page background |
| Surface | `#FFFFFF` | Panels, header |
| Electric blue | `#1D4ED8` | Primary actions, links, focus ring |
| Muted blue | `#DBEAFE` | Soft accent / muted fill |
| Ink | `#0E1116` | Footer / closing CTA band |

CSS variables live in `src/app/globals.css` (`:root` + Tailwind v4 `@theme inline`). Semantic shadcn tokens map onto this palette. Light mode is the default; `.dark` exists for optional surfaces only.

## Typography

- **All UI text:** `Noto Sans Georgian` via `next/font/google` (`--font-noto-sans-georgian`).
- Weights: 400 body, 500 nav/labels, 600–700 headings and CTAs.
- Scale (approx.): display ~2.5–3.5rem, H2 ~1.75–2rem, body 1rem / 1.625, small 0.875rem.
- Georgian glyphs must remain crisp — never substitute Latin-only display fonts for Georgian copy.

## Spacing

- Page gutter: `px-4` → `sm:px-6` → `lg:px-8`, content max `max-w-6xl` (marketing) / `max-w-3xl` (forms).
- Section vertical rhythm: `py-16`–`py-24`.
- Header height token: `--header-height` (3.75rem). Use `scroll-padding-top` and `pt-header` so sticky chrome never covers titles.
- Skip link target: `#main-content`.

## Radius

- Base `--radius: 0.625rem`.
- Controls: `rounded-lg`; sheets/panels may use `rounded-xl`.
- Avoid pill-everything (`rounded-full`) except small icon chips where interaction requires it.

## Shadows

- `--shadow-soft` — resting panels / sticky header on scroll.
- `--shadow-lift` — hero composition layers and elevated chrome.
- Prefer soft graphite-tinted shadows over multi-layer glow.

## Buttons

- Primary: electric blue fill, white label (`Button` default).
- Secondary / outline: border on surface for quieter CTAs.
- Ghost: nav and icon actions.
- Header CTA: „დაიწყე პროექტი“ → `/contact`.
- Focus: visible ring using `--ring` (electric).

## Cards

Default: **no cards**. Use cards only when they contain a clear interaction (forms, selectable options). Portfolio/service lists prefer open grids with dividers or soft borders, not boxed marketing tiles in the hero.

## Logo

`Logo` / `DbMonogram` in `src/components/public/logo.tsx` — small replaceable SVG monogram (DB letters) + „DekaByte“ wordmark. Not a green coin or generic app icon.

## Responsive

- Mobile-first. Sticky slim header; nav collapses into an accessible Sheet.
- Floating mobile contact bar (call / WhatsApp / email) with safe-area insets; dismissible; hidden on `/admin` and when `data-hide-mobile-contact` is present.
- Cookie consent stays compact and does not trap focus permanently.

## Animation

- Subtle only: fade-up on hero copy, gentle float on composition layers.
- Utilities: `.animate-fade-up`, `.animate-fade-in`, `.animate-float`.
- Always respect `prefers-reduced-motion: reduce` (global and utility overrides).
- No continuous glow pulses or large parallax.

## Copy

Georgian UI labels throughout the public shell. No fabricated stats or testimonials.
