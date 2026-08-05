# DekaByte

Production website and private admin CMS for **DekaByte** — a Georgian digital product studio (websites, web apps, Android, UI/UX).

## Stack

- Next.js App Router (Cache Components) · React · TypeScript
- Tailwind CSS · shadcn/ui · Lucide
- Neon Postgres · Drizzle ORM · Neon serverless driver
- Auth.js (Credentials) · bcrypt
- Vercel Blob · Zod · Vitest · Playwright

## Local setup

```bash
pnpm install
cp .env.example .env.local
# fill DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_INITIAL_PASSWORD, NEXT_PUBLIC_SITE_URL
# optionally BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_META_PIXEL_ID
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | yes | Neon connection string |
| `AUTH_SECRET` | yes | Auth.js session secret (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | yes (seed) | Initial admin email |
| `ADMIN_INITIAL_PASSWORD` | yes (seed) | Initial password (min 10 chars); never commit |
| `BLOB_READ_WRITE_TOKEN` | for uploads | Vercel Blob write token (server only) |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical site URL, no trailing slash |
| `NEXT_PUBLIC_META_PIXEL_ID` | no | Meta Pixel; loads only after consent |

See `.env.example`. Never commit `.env` / `.env.local`.

## Neon setup

1. Create a Neon project (manual / owner approval).
2. Copy the pooled or serverless connection string into `DATABASE_URL`.
3. Run `pnpm db:migrate` then `pnpm db:seed`.

Migrations live in `src/db/migrations`. Schema is in `src/db/schema`.

## Admin seed

```bash
# in .env.local
ADMIN_EMAIL=zazadzneladze@gmail.com
ADMIN_INITIAL_PASSWORD=your-long-secure-password
pnpm db:seed
```

Seed also upserts site settings (phone/email from brief) and inserts five portfolio projects as **draft** (text only, no live URLs/images).

## Vercel Blob

1. Create a public Blob store in the Vercel project.
2. Set `BLOB_READ_WRITE_TOKEN` on the server.
3. Upload cover/gallery images from Admin → project editor.
4. Local development uses the same token against the remote store.

Allowed types: JPEG, PNG, WebP, AVIF. Paths: `projects/{projectId}/{uuid}.{ext}`.

## Commands

| Script | Description |
|--------|-------------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest (estimate calculator) |
| `pnpm test:smoke` | Playwright smoke (needs `pnpm build` + server or webServer) |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:seed` | Seed settings, drafts, admin |

## Pricing calculator

All prices and durations live in [`src/config/estimate.ts`](src/config/estimate.ts). Update there only — unit tests cover the math.

## Portfolio workflow

1. Admin → პროექტები → დამატება / რედაქტირება
2. Fill Georgian copy, tags, SEO
3. Upload cover + gallery via Blob
4. Set live URL when real
5. Publish / feature / reorder
6. Public `/work` shows only published projects

## Leads

Contact form saves to Neon (`leads`). Admin → ლიდები: mark read/contacted/archive; open tel / WhatsApp / email. No outbound email integration in v1.

## Change admin password

Admin → პარამეტრები → password section (current + new + confirm).

## Meta Pixel

Set `NEXT_PUBLIC_META_PIXEL_ID`. Pixel loads only after cookie consent (`dekabyte-consent`). Events: project view, contact view, form success, WhatsApp/phone click, estimate complete. No PII sent.

## Logo

Replace the temporary **DB** monogram in [`src/components/public/logo.tsx`](src/components/public/logo.tsx).

## Docs

- [`docs/DESIGN.md`](docs/DESIGN.md) — visual system
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — routes, DB, auth, cache
- [`AGENTS.md`](AGENTS.md) — agent working notes

## Deploy (Vercel)

1. Link the GitHub repo to Vercel (owner approval).
2. Set all env vars for Production / Preview.
3. Deploy. Run migrate + seed against production Neon once.
4. Attach custom domain when ready.

## Backup / rollback

- Git branch `archive/ai-studio-react` holds the original AI Studio Vite export.
- Working branch: `feat/nextjs-rebuild`.
- Neon: use branch / point-in-time restore for DB recovery.
- Blob: deleted objects are gone; keep DB pathnames consistent when deleting images.

## Git history note

The Vite prototype was archived on `archive/ai-studio-react` and removed from `feat/nextjs-rebuild` after content extraction (copy, calculator values, portfolio text).
