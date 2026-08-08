---
name: DekaByte
description: Georgian digital studio — graphite field, electric accent, real portfolio proof
colors:
  graphite: "#12151A"
  slate: "#4A5160"
  off-white: "#F5F6F8"
  surface: "#FFFFFF"
  electric: "#1D4ED8"
  muted-blue: "#DBEAFE"
  ink: "#0E1116"
  ink-muted: "#9AA3B2"
  primary: "#1D4ED8"
  background: "#F5F6F8"
  foreground: "#12151A"
  border: "#E0E3E9"
typography:
  display:
    fontFamily: "var(--font-noto-sans-georgian), ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  body:
    fontFamily: "var(--font-noto-sans-georgian), ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.625
  label:
    fontFamily: "var(--font-noto-sans-georgian), ui-sans-serif, system-ui, sans-serif"
    fontWeight: 600
    fontSize: "0.7rem"
    letterSpacing: "0.16em"
rounded:
  sm: "calc(var(--radius) - 4px)"
  md: "calc(var(--radius) - 2px)"
  lg: "var(--radius)"
  xl: "calc(var(--radius) + 4px)"
spacing:
  header: "4rem"
  gutter-sm: "1rem"
  gutter-md: "1.5rem"
  gutter-lg: "2rem"
  section-y: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 1rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    rounded: "{rounded.lg}"
    padding: "0.5rem"
---

# Design System: DekaByte

## Overview

**Creative North Star: "The Graphite Studio"**

A precision Georgian studio surface: calm off-white or charcoal field, graphite type, one electric-blue voice for action. Marketing pages **persuade** with real portfolio proof inside device chrome; admin and portal **operate** with shadcn clarity. Depth comes from soft graphite shadows and ink closing bands—not purple gradients, cream serif templates, or fake metrics.

Light mode is the authored default; **dark mode is a first-class theme** (system/light/dark via `next-themes`) on public site, admin, and portal. Footer and final CTA bands stay **ink** in both themes—a deliberate anchor, not full-page dark chrome.

**Key Characteristics:**

- Graphite + electric blue; Georgian typography throughout (`Noto Sans Georgian`).
- Open grids and dividers over boxed marketing cards; cards only for interactive clusters.
- Hero signature: portfolio in browser/admin/Android frames; optional mark / cube / orbit toggle.
- Subtle motion (fade-up, float, scroll reveal) with `prefers-reduced-motion` respected.
- No fabricated stats, testimonials, or decorative analytics.

## Colors

Cool neutral studio with a single saturated accent; ink bands for closure.

### Primary

- **Electric Studio Blue** (`#1D4ED8` light / `#3B82F6` dark): Primary buttons, links, focus rings, section labels, active nav underline. Rare enough to read as "the action color."

### Neutral

- **Graphite** (`#12151A` light text / `#F7F8FA` dark text): Headlines, logo mark weight.
- **Slate** (`#4A5160` / `#A8B0BD`): Secondary nav and supporting copy.
- **Off-white Field** (`#F5F6F8` / `#1A1D23` background): Page canvas.
- **Surface Panel** (`#FFFFFF` / `#23272F` card): Header, sheets, form panels, elevated bands.
- **Muted Blue Wash** (`#DBEAFE` / `rgb(59 130 246 / 0.18)`): Soft fills, hero glows (`--hero-glow-1`, `--hero-glow-2`).
- **Studio Ink** (`#0E1116` / `#0A0C10`): Footer, CTA bands (`.cta-band`); always dark regardless of theme.
- **Ink Muted** (`#9AA3B2` / `#8B95A5`): Secondary text on ink bands.

### Named Rules

**The One Accent Rule.** Electric blue appears on primary actions, focus, and small labels—not as full-page gradients or decorative fills.

**The Ink Anchor Rule.** Closing sections and footer use `--ink` with light text; do not convert them to theme background colors.

## Typography

**Display & Body Font:** Noto Sans Georgian (`next/font/google`, `--font-noto-sans-georgian`)

**Character:** Crisp Georgian glyphs at all sizes; Latin wordmark "DekaByte" may use electric accent on "Byte" in hero display.

### Hierarchy

- **Display** (700, `text-hero-brand` clamp 2.65–3.65rem, `text-display` tracking -0.035em): Hero brand line, major section titles.
- **Headline** (600, ~1.75–2.5rem): Page H1/H2, project titles.
- **Subhead** (600, `text-hero-subhead` clamp 1.25–1.65rem): Hero value proposition (H1).
- **Title** (600, ~1–1.25rem): Card titles, service names, step titles.
- **Body** (400, 1rem / 1.625): Paragraphs; max ~65ch on marketing copy blocks.
- **Label** (600, 0.7rem, uppercase, wide tracking): `SectionLabel`, category eyebrows.
- **Nav link** (`text-nav-link`, 0.8125rem): Header navigation.
- **Micro** (`text-micro`, `text-micro-sm`, `text-orbit-index`): Chrome labels and frame titles.
- **Cube / orbit** (`text-cube-face-title`, `text-orbit-label`): Hero visual node typography.

### Named Rules

**The Georgian-Only Rule.** Never substitute Latin-only display fonts for Georgian UI copy.

## Layout

Mobile-first marketing grid: `max-w-6xl` centered, gutters `px-4` → `sm:px-6` → `lg:px-8`. Forms and portal use `max-w-3xl`. Section rhythm `py-16`–`py-28`; alternating `.section-band` (`bg-card` + border-y) for services/process/FAQ.

Sticky header `--header-height: 4rem`; `scroll-padding-top` and `.pt-header` prevent overlap. Skip target `#main-content`.

Hero utilities: `.hero-gradient`, `.page-gradient`, `.studio-grain`, subtle grid mask on homepage.

Admin: inset sidebar shell (`SidebarProvider`); portal: compact top nav + single column.

## Elevation & Depth

Hybrid: mostly flat fields with **soft graphite shadows** on scroll header, floating mobile contact bar, and hero device frames. Hero glows are radial gradients, not elevation.

### Shadow Vocabulary

- **Soft** (`--shadow-soft`): Sticky header on scroll, resting chips.
- **Lift** (`--shadow-lift`): Mobile contact bar, cookie banner, elevated hero chrome.

### Named Rules

**The Flat-By-Default Rule.** Marketing sections use borders and spacing for structure; shadows signal elevation or scroll state only.

## Shapes

Base radius `--radius: 0.75rem`. Controls `rounded-lg`; panels/sheets `rounded-xl`; CTA bands `rounded-2xl` when inset (estimate teaser). Avoid `rounded-full` except icon buttons and small badges.

## Components

### Buttons

- **CTA band primary:** `.cta-band-button` — always white on ink (`#ffffff` / `var(--ink)` text), theme-independent.
- **Shape:** Gently rounded (`rounded-lg`, 12px effective).
- **Primary:** `bg-primary` electric, white label; hover `primary/80`.
- **Outline:** Border on background; quiet secondary CTAs.
- **Ghost:** Nav links, icon actions (theme toggle, menu).
- **Focus:** Visible ring `--ring` at 50% opacity; never remove focus styles.

### Cards / Containers

- **Default marketing:** No card wrapper—open grid + `border-t` dividers.
- **Interactive:** Forms, calculator options, alerts use `bg-card` + border.
- **CTA band:** `.cta-band` + `.cta-band-glow` on ink background.

### Navigation

- **Public header:** Fixed, `bg-background/75` blur; active link electric 1px underline.
- **Mobile:** Right sheet; theme toggle + hero visual toggle on homepage.
- **Admin:** Collapsible sidebar with badges for unread counts.

### Signature: Hero Visual

`HeroVisual` with user-toggleable **mark / cube / orbit** on homepage only (`HeroVisualToggle`). Real portfolio screenshots inside `MacBrowserFrame` when available.

## Do's and Don'ts

### Do:

- **Do** use semantic tokens (`background`, `foreground`, `card`, `primary`) so light/dark themes stay coherent.
- **Do** use `SectionLabel` + display headline pattern for marketing sections.
- **Do** respect `prefers-reduced-motion` for all hero and reveal animations.
- **Do** keep Georgian copy honest—real portfolio, no fake proof.

### Don't:

- **Don't** use purple gradients, warm cream templates, or serif display stacks for Georgian UI.
- **Don't** box every marketing block in cards or drop shadow stacks.
- **Don't** show fake percentages, client counts, or testimonials.
- **Don't** treat dark mode as an afterthought—test public, admin, and portal in both themes.
