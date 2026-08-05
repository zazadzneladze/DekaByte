# DekaByte — Agent notes

## Product
Georgian digital product studio site + private admin CMS + invite-only client portal.
No AI assistant.

## Stack
Next.js App Router, TypeScript strict, Tailwind, shadcn/ui, Neon Postgres, Drizzle ORM, Auth.js (admin credentials + Google for clients), Vercel Blob, Web Push (admin PWA).

## Skills to use
- `frontend-design` for public UI
- `shadcn` for UI components
- Prefer Server Components; Client Components only for interactivity

## Content rules
- Georgian UI copy; no fake stats/testimonials
- Contact defaults from `src/config/site.ts` with DB `site_settings` override
- Pricing defaults in `src/config/estimate.ts`; admin override + discount % in `site_settings.estimate_config`

## Client portal
- Invite-by-email: admin sets `client_projects.clientEmail`; Google login email must match
- Routes: `/portal/login`, `/portal/onboarding`, `/portal`, `/portal/projects/[id]`, `/portal/profile`
- Admin: `/admin/clients` — assets, chat, invoices (manual PDF + status; no Stripe)
- Separate from public portfolio `projects` table
- Admin PWA + Web Push for new portal messages and new contact leads (no SMS)

## Do not
- Commit secrets or `.env`
- Create Neon/Vercel/Blob resources without owner approval
- Reintroduce Gemini / AI consultant routes
- Use Prisma, Firebase, Supabase, Stripe

## Commands
`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:smoke` · `pnpm db:generate` · `pnpm db:migrate` · `pnpm db:seed`
