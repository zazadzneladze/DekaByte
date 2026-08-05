# DekaByte — Agent notes

## Product
Georgian digital product studio site + private admin CMS. Not a client portal. No AI assistant.

## Stack
Next.js App Router, TypeScript strict, Tailwind, shadcn/ui, Neon Postgres, Drizzle ORM, Auth.js (credentials), Vercel Blob.

## Skills to use
- `frontend-design` for public UI
- `shadcn` for UI components
- Prefer Server Components; Client Components only for interactivity

## Content rules
- Georgian UI copy; no fake stats/testimonials
- Contact defaults from `src/config/site.ts` with DB `site_settings` override
- Pricing only in `src/config/estimate.ts`

## Do not
- Commit secrets or `.env`
- Create Neon/Vercel/Blob resources without owner approval
- Reintroduce Gemini / AI consultant routes
- Use Prisma, Firebase, Supabase, Stripe

## Commands
`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:smoke` · `pnpm db:generate` · `pnpm db:migrate` · `pnpm db:seed`
