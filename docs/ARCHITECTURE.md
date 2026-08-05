# DekaByte — Architecture

## Product

Public Georgian studio site + private admin CMS. Not a client portal. No AI assistant routes.

## Stack

Next.js App Router · TypeScript strict · Tailwind v4 · shadcn/ui · Neon Postgres · Drizzle ORM · Auth.js (credentials) · Vercel Blob · Vercel Analytics / Speed Insights.

## Routes

| Area | Path | Notes |
| --- | --- | --- |
| Public shell | `(public)/*` | Header, footer, mobile contact bar, cookie consent |
| Home | `/` | Marketing homepage |
| Work | `/work`, `/work/[slug]` | Published projects |
| Services | `/services` | Service catalogue |
| Budget | `/estimate` | Estimator; pricing only from `src/config/estimate.ts` |
| Contact | `/contact` | Lead form |
| Legal | `/privacy`, `/terms` | Linked from footer |
| Admin | `/admin/*` | Auth-gated CMS; no public chrome / mobile bar |

## Data

- **DB:** Neon Postgres via Drizzle (`src/db`).
- **Tables:** `projects`, `project_images`, `leads`, `site_settings`, `admin_users`, `lead_rate_limits`.
- **Contact defaults:** `src/config/site.ts` (`siteDefaults`); overridden by `site_settings` when present (`getPublicSiteSettings`).

## Auth

Auth.js v5 credentials provider for admin users only. Public routes are unauthenticated. Session protects `/admin`.

## Blob

Vercel Blob stores project cover/gallery images. DB holds URL + pathname; deletes should remove both record and blob object.

## Caching

Next Cache Components (`"use cache"`, `cacheTag`, `cacheLife`, `updateTag`) in `src/db/queries`:

| Tag | Purpose |
| --- | --- |
| `site-settings` | Public contact / SEO settings |
| `projects` | Published project lists |
| `featured-projects` | Homepage featured set |
| `project:{slug}` | Single project detail |

Admin reads are always fresh (no cache helpers). Mutations call `invalidateProjectCaches` / `invalidateSiteSettingsCache`.

## Public UI shell

- Root layout: `lang="ka"`, Noto Sans Georgian, metadata from `siteDefaults`, Analytics, SpeedInsights, Sonner toaster.
- Public layout: skip link → `#main-content`, sticky header, footer (settings props), mobile contact bar, cookie consent (`localStorage` key `dekabyte-consent` for Meta Pixel).
