# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary (marketing site):** Mixed audience in Georgia — small and medium businesses, startups, and product teams that need websites, web applications, Android apps, or UI/UX work. They arrive to evaluate credibility, see real portfolio work, estimate budget, and start contact.

**Primary (client portal):** Invite-only clients on active projects. Email must match `client_projects.client_email`; Google sign-in. They track progress, chat, view/upload assets, manage profile and invoice signature, and receive web push notifications.

**Secondary (admin):** Studio operator(s) — manage portfolio, leads, contact messages, client projects, Georgian invoices (manual PDF), site settings, and admin PWA push alerts.

## Product Purpose

DekaByte is a Georgian digital product studio’s public presence plus operational backends: attract and convert project inquiries, showcase published work honestly, and run private client collaboration without third-party CRM/billing SaaS.

Success means: credible public site in Georgian, real portfolio and contact flow, admin CMS that replaces ad-hoc tools, and a client portal that feels professional for invited users only.

**What the studio builds for clients (services, not this repo’s scope):** marketing sites, corporate websites, web applications, admin dashboards, payment flows, multi-tenant SaaS, booking/order systems, calculators, business automation, Android apps, UI/UX — scoped per project in discovery.

**What this repository is:** DekaByte’s own marketing site + studio admin + invite-only client portal (manual Georgian invoices; no Stripe in-platform).

## Positioning

DekaByte აწყობს **ვებსაიტებსა და ციფრულ პროდუქტებს სრული ფუნქციონალით** — არა მხოლოდ „ლენდინგს“. კლიენტისთვის შესაძლებელია admin პანელი, გადახდები, multi-tenant SaaS, web application, Android აპი, კალკულატორები, ავტომატიზაცია და სხვა ყველაფერი, რაც კოდინგსა და პროდუქტის განვითარებას ეხება — იდეიდან დიზაინამდე, დეველოპმენტიდან გაშვებამდე.

**Differentiation:** სრული stack-ის სტუდიო საქართველოში; ერთი გუნდი ფარავს ვებსაიტიდან SaaS-ისა და მობილური აპის ჩათვლით, რეალური portfolio-ით და გამჭვირვალე პროცესით.

## Operating Context

- **Public routes:** `/`, `/work`, `/services`, `/about`, `/estimate`, `/contact`, legal pages.
- **Admin routes:** `/admin/*` — credentials auth; PWA + web push for new portal messages and contact leads.
- **Portal routes:** `/portal/login`, `/portal/onboarding`, `/portal`, `/portal/projects/[id]`, `/portal/profile` — Google auth for clients.
- **Production URL:** `https://www.dekabyte.ge` (Vercel). Subdomains `estateos.dekabyte.ge`, `gardenos.dekabyte.ge` are separate Vercel projects on the same domain.
- **Content:** Defaults in `src/config/site.ts`, `src/config/content.ts`, `src/config/estimate.ts`; admin can override contact, logo, and estimate discount via `site_settings`.
- **Invoices:** Manual Georgian PDF generation in admin; no Stripe. Clients see invoices in portal; signatures supported (admin + client upload with background removal).

## Capabilities and Constraints

**Capabilities**

- Public marketing site with portfolio (`projects` table), services, process, FAQ, budget calculator, contact form (stored as leads).
- Admin CMS: portfolio CRUD, client projects (separate from public portfolio), chat, invoices, settings, messages inbox.
- Client portal: project stages, assets, chat, invoices, profile, push subscriptions.
- Web Push: admin PWA; portal push for clients.
- Theme: light/dark/system on public site and admin (via `next-themes`); brand tokens in `src/app/globals.css`.
- Blob storage (Vercel) for uploads; Neon Postgres + Drizzle.

**Constraints**

- Georgian UI copy on public surfaces; no fake stats or testimonials.
- No AI assistant / Gemini routes.
- No Prisma, Firebase, Supabase, Stripe.
- Do not commit secrets or provision cloud resources without owner approval.
- Client portal is invite-by-email only — not a public signup product.
- Invoice Word/HTML template content is sensitive — spacing/layout fixes only unless explicitly requested.

**Terminology**

- **Portfolio project** — public `projects` table, `/work`.
- **Client project** — private `client_projects` table, portal + admin.
- **Lead** — contact form submission in admin.

## Brand Commitments

- **Name:** DekaByte (`src/config/site.ts`, logo/monogram in `src/components/public/logo.tsx`).
- **Voice:** Georgian, direct, professional studio tone; no hype metrics.
- **Visual system:** Documented in `docs/DESIGN.md` — graphite / off-white / electric blue; Noto Sans Georgian throughout.
- **Contact defaults:** Phone +995 557 16 26 32, email from site config, WhatsApp CTAs with preset Georgian message.
- **Hero signature:** Real portfolio visuals in device chrome (mark / cube / orbit toggle on homepage); grain + scroll reveals.

## Evidence on Hand

- **Portfolio:** Published projects from DB (`/work`); featured on homepage when marked.
- **Services copy:** `src/config/content.ts` — websites, web apps, Android, UI/UX; examples include admin panels, SaaS-style systems, payments, automation (marketing claims for studio work, not fabricated case studies).
- **No fabricated:** testimonials, client counts, revenue stats, or fake logos.
- **Assets:** `public/brand/`, fonts for Georgian PDF invoices, admin/portal PWA manifests.

## Product Principles

1. **Truth over polish** — show real work and honest scope; never invent social proof.
2. **Georgian-first** — copy, typography, and forms serve Georgian readers and business context.
3. **Studio ops in-house** — admin + portal replace scattered tools; keep flows lean for a small team.
4. **Invite-only clients** — portal trust through email-matched access, not open registration.
5. **Ship complete surfaces** — public, admin, and portal each usable end-to-end, not demo shells.

## Accessibility & Inclusion

- Skip link to `#main-content`; sticky header with `scroll-padding-top`.
- Focus-visible rings on interactive elements; `prefers-reduced-motion` respected for animations.
- Mobile contact bar and cookie consent must not trap focus permanently.
- Georgian script must render with Noto Sans Georgian — no Latin-only display substitutes for UI text.
