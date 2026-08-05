# DekaByte — Architecture

## Product

Public Georgian studio site + private admin CMS + invite-only client portal. No AI assistant routes.

## Stack

Next.js App Router · TypeScript strict · Tailwind v4 · shadcn/ui · Neon Postgres · Drizzle ORM · Auth.js (admin credentials + Google for clients) · Vercel Blob · Web Push (admin PWA) · Vercel Analytics / Speed Insights.

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
| Admin | `/admin/*` | Auth-gated CMS; clients CRUD; PWA + push |
| Portal | `/portal/*` | Invite-only Google clients; onboarding gate |

## Data

- **DB:** Neon Postgres via Drizzle (`src/db`).
- **Tables:** `projects`, `project_images`, `leads`, `site_settings`, `admin_users`, `lead_rate_limits`, plus portal: `client_users`, `client_projects`, `client_assets`, `client_messages`, `client_invoices`, `push_subscriptions`.
- **Contact defaults:** `src/config/site.ts` (`siteDefaults`); overridden by `site_settings` when present (`getPublicSiteSettings`).
- Public portfolio `projects` ≠ client work `client_projects`.

## Auth

Auth.js v5: credentials for admin; Google for invited clients (`client_projects.clientEmail` must match). Middleware guards `/admin` (admin role) and `/portal` (client role).

## Blob

Vercel Blob stores portfolio images, client assets/invoice PDFs, and client avatars. DB holds URL + pathname; deletes should remove both record and blob object.

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
