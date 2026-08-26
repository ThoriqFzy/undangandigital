# IMPLEMENTATION PLAN — Wedding Invitation Platform

**Version:** 1.0
**Created:** 2026-08-26
**Status:** Ready for Phase 0

---

# 1. Folder Structure (Option A — Monorepo, Single Deployment)

Struktur ini memisahkan concern secara jelas tanpa mengubah deployment strategy
(Astro SSR + Cloudflare Workers = satu deployment).

```text
undangandigital/
├── frontend/                          # PUBLIC INVITATION
│   ├── pages/                         # Astro pages (routing)
│   │   ├── [slug].astro               # Public invitation route
│   │   ├── api/                       # API routes (public)
│   │   │   ├── invitations/
│   │   │   │   └── [slug]/
│   │   │   │       ├── index.ts       # GET invitation data
│   │   │   │       ├── rsvp.ts       # POST RSVP
│   │   │   │       └── wishes.ts     # POST wishes
│   │   │   └── health.ts
│   │   └── admin/                     # Admin pages
│   │       ├── index.astro            # Dashboard
│   │       ├── login.astro
│   │       ├── invitations/
│   │       │   ├── index.astro        # List
│   │       │   ├── new.astro          # Create
│   │       │   └── [id]/
│   │       │       ├── index.astro    # Overview
│   │       │       ├── details.astro
│   │       │       ├── theme.astro
│   │       │       ├── couple.astro
│   │       │       ├── events.astro
│   │       │       ├── story.astro
│   │       │       ├── gallery.astro
│   │       │       ├── gifts.astro
│   │       │       ├── guests.astro
│   │       │       ├── rsvp.astro
│   │       │       ├── wishes.astro
│   │       │       └── settings.astro
│   │       └── api/                   # API routes (admin, auth-protected)
│   │           └── admin/
│   │               ├── invitations/
│   │               ├── guests/
│   │               ├── assets/
│   │               └── ...
│   │
│   ├── components/                    # UI Components
│   │   ├── invitation/                # Public invitation sections
│   │   │   ├── Cover.astro
│   │   │   ├── Hero.astro
│   │   │   ├── Quote.astro
│   │   │   ├── Couple.astro
│   │   │   ├── Countdown.tsx          # React Island
│   │   │   ├── Events.astro
│   │   │   ├── Story.astro
│   │   │   ├── Gallery.tsx            # React Island (lightbox)
│   │   │   ├── Gift.astro
│   │   │   ├── RSVP.tsx               # React Island (form)
│   │   │   ├── Wishes.tsx             # React Island (list + form)
│   │   │   ├── Music.tsx              # React Island (controller)
│   │   │   └── Closing.astro
│   │   │
│   │   ├── admin/                     # Admin dashboard components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── InvitationCard.tsx
│   │   │   ├── GuestTable.tsx
│   │   │   ├── ThemeEditor.tsx
│   │   │   ├── GalleryManager.tsx
│   │   │   └── ...
│   │   │
│   │   └── ui/                        # Shared UI primitives
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Input.tsx
│   │       ├── Spinner.tsx
│   │       └── Toast.tsx
│   │
│   ├── layouts/                       # Astro layouts
│   │   ├── BaseLayout.astro
│   │   ├── InvitationLayout.astro
│   │   └── AdminLayout.astro
│   │
│   ├── styles/                        # Global styles
│   │   ├── globals.css
│   │   └── fonts.css
│   │
│   └── lib/                           # Frontend-specific utilities
│       ├── hooks/
│       ├── utils/
│       └── constants.ts
│
├── backend/                           # BACKEND LOGIC
│   ├── db/                            # Database
│   │   ├── client.ts                  # Neon connection setup
│   │   ├── index.ts                   # Export all
│   │   ├── schema/                    # Drizzle schemas
│   │   │   ├── auth.ts               # users, accounts, sessions, verifications
│   │   │   ├── invitations.ts
│   │   │   ├── templates.ts
│   │   │   ├── themes.ts
│   │   │   ├── couples.ts
│   │   │   ├── events.ts
│   │   │   ├── stories.ts
│   │   │   ├── assets.ts
│   │   │   ├── gallery.ts
│   │   │   ├── gifts.ts
│   │   │   ├── guests.ts
│   │   │   ├── rsvps.ts
│   │   │   ├── wishes.ts
│   │   │   └── audit.ts
│   │   ├── relations.ts              # All Drizzle relations
│   │   ├── migrations/               # Generated migrations
│   │   ├── seed.ts                   # Development seed
│   │   └── enums.ts                  # All enum definitions
│   │
│   ├── repositories/                  # Data access layer
│   │   ├── invitation.repository.ts
│   │   ├── template.repository.ts
│   │   ├── theme.repository.ts
│   │   ├── couple.repository.ts
│   │   ├── event.repository.ts
│   │   ├── story.repository.ts
│   │   ├── asset.repository.ts
│   │   ├── gallery.repository.ts
│   │   ├── gift.repository.ts
│   │   ├── guest.repository.ts
│   │   ├── rsvp.repository.ts
│   │   ├── wish.repository.ts
│   │   └── audit.repository.ts
│   │
│   ├── services/                      # Business logic
│   │   ├── invitation.service.ts
│   │   ├── template.service.ts
│   │   ├── theme.service.ts
│   │   ├── guest.service.ts
│   │   ├── rsvp.service.ts
│   │   ├── wish.service.ts
│   │   ├── asset.service.ts
│   │   ├── gallery.service.ts
│   │   ├── gift.service.ts
│   │   ├── auth.service.ts
│   │   └── audit.service.ts
│   │
│   ├── media/                         # R2 / media handling
│   │   ├── r2.client.ts
│   │   ├── upload.service.ts
│   │   └── image-optimizer.ts
│   │
│   ├── middleware/                     # Request middleware
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── owner-check.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── viewmodels/                    # DTO / ViewModels
│   │   ├── invitation-public.vm.ts
│   │   ├── invitation-admin.vm.ts
│   │   ├── guest.vm.ts
│   │   ├── rsvp.vm.ts
│   │   └── types.ts
│   │
│   ├── integrations/                  # External services
│   │   ├── better-auth.ts
│   │   └── cloudflare.ts             # R2 binding helper
│   │
│   └── lib/                           # Backend-specific utilities
│       ├── errors.ts                  # Custom error classes
│       ├── response.ts               # Standard API response
│       └── token.ts                  # Guest token hash/verify
│
├── shared/                            # SHARED (frontend + backend)
│   ├── types/                         # TypeScript types
│   │   ├── invitation.ts
│   │   ├── guest.ts
│   │   ├── event.ts
│   │   ├── rsvp.ts
│   │   ├── wish.ts
│   │   ├── theme.ts
│   │   ├── template.ts
│   │   └── index.ts
│   │
│   ├── validation/                    # Zod schemas (shared!)
│   │   ├── invitation.schema.ts
│   │   ├── guest.schema.ts
│   │   ├── rsvp.schema.ts
│   │   ├── wish.schema.ts
│   │   ├── event.schema.ts
│   │   ├── story.schema.ts
│   │   ├── gift.schema.ts
│   │   ├── theme.schema.ts
│   │   └── index.ts
│   │
│   ├── constants/                     # Shared constants
│   │   ├── enum-values.ts
│   │   └── limits.ts                 # Max file size, max guest count, etc.
│   │
│   └── utils/                         # Shared pure functions
│       ├── slug.ts                    # Slug validation/generation
│       ├── format.ts                  # Date, currency formatting
│       └── token.ts                  # Token generation
│
├── templates/                         # TEMPLATE SYSTEM
│   └── classic/                       # MVP template
│       ├── index.ts                   # Template contract implementation
│       ├── sections/                  # Section renderers
│       │   ├── cover.tsx
│       │   ├── hero.tsx
│       │   ├── quote.tsx
│       │   ├── couple.tsx
│       │   ├── countdown.tsx
│       │   ├── events.tsx
│       │   ├── story.tsx
│       │   ├── gallery.tsx
│       │   ├── gift.tsx
│       │   ├── rsvp.tsx
│       │   ├── wishes.tsx
│       │   └── closing.tsx
│       ├── theme-config.ts           # Default theme values
│       └── assets/                   # Template-specific static assets
│           ├── fonts/
│           ├── patterns/
│           └── decorative/
│
├── tests/                             # TESTS
│   ├── unit/
│   │   ├── validation/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── repositories/
│   │   ├── api/
│   │   └── auth/
│   └── e2e/
│       ├── invitation-flow.spec.ts
│       ├── rsvp-flow.spec.ts
│       └── admin-flow.spec.ts
│
├── public/                            # Static assets
│   ├── favicon.ico
│   └── og-default.jpg
│
├── drizzle/                           # Drizzle config + migrations output
│   ├── drizzle.config.ts
│   └── migrations/
│
├── docs/                              # Documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── AGENTS.md
│   └── IMPLEMENTATION_PLAN.md         # This file
│
├── scripts/                           # Utility scripts
│   ├── setup.sh                       # First-time setup
│   ├── db-reset.sh
│   └── seed.sh
│
├── .env.example                       # Environment template
├── .gitignore
├── tsconfig.json
├── tailwind.config.ts
├── astro.config.ts
├── package.json
├── README.md
└── vitest.config.ts
```

---

# 2. Why This Structure (Debugging Benefits)

## Backend terisolasi dari frontend
- Kalau ada error di repository/service, langsung lari ke `backend/`
- Kalau ada error di rendering/UI, langsung lari ke `frontend/`
- Kalau error di validasi, cek `shared/validation/`
- Kalau error di type mismatch, cek `shared/types/`

## Shared folder mencegah duplikasi
- Zod schemas pakai DUA kali: frontend (client validation) + backend (server validation)
- Satu source of truth, tidak perlu sync manual
- Types terpusat, tidak ada type definition ganda

## Template terpisah dari components
- Template = layout composer (urutan section, overall structure)
- Components = section implementation (visual, interactivity)
- Menambah template baru tidak mengubah components

## Repository terisolasi dari UI
- Langsung bisa test repository tanpa menjalankan Astro
- Test backend = test pure TypeScript + PostgreSQL
- Test frontend = test rendering + interaksi

---

# 3. Implementation Phases (Updated)

## Phase 0 — Reconnaissance & Setup
```
Duration: Day 1
Goal: Project running locally + all infrastructure ready

Tasks:
[  ] Setup project structure (folder di atas)
[  ] Initialize Astro + Cloudflare adapter
[  ] Initialize TypeScript + Tailwind
[  ] Setup Vitest
[  ] Setup Git repository
[  ] Setup Neon PostgreSQL (akun + database)
[  ] Setup Cloudflare R2 bucket
[  ] Setup Better Auth skeleton
[  ] Setup Drizzle ORM + client
[  ] Setup shared/types + shared/validation skeleton
[  ] Verify: app runs locally
```

## Phase 1 — Database Foundation
```
Duration: Day 2-3
Goal: All schema, migrations, relations, seed working

Tasks:
[  ] Implement all Drizzle schemas (auth → invitations → couples → ...)
[  ] Define all enums
[  ] Define all relations
[  ] Define all indexes
[  ] Generate migrations
[  ] Run migrations on fresh Neon database
[  ] Implement seed data
[  ] Verify: migrations run cleanly, seed works
[  ] Verify: Drizzle typecheck passes
```

## Phase 2 — Backend Layer
```
Duration: Day 3-5
Goal: All repositories, services, middleware, viewmodels working

Tasks:
[  ] Implement repositories (invitation → guest → rsvp → ...)
[  ] Implement services (with authorization checks)
[  ] Implement middleware (auth, rate-limit, validation, owner-check)
[  ] Implement viewmodels (public + admin DTO)
[  ] Implement API response standard
[  ] Implement error handling
[  ] Implement guest token system
[  ] Verify: repository tests pass
[  ] Verify: service unit tests pass
```

## Phase 3 — Design System & Theme
```
Duration: Day 4-6
Goal: Visual foundation ready for all pages

Tasks:
[  ] Implement design tokens (CSS custom properties)
[  ] Implement Tailwind theme config
[  ] Implement shared UI components (Button, Card, Modal, Input, ...)
[  ] Implement font loading strategy
[  ] Implement classic template theme-config
[  ] Implement motion primitives
[  ] Verify: visual QA at 360/390/414/768/1024/1440px
```

## Phase 4 — Public Invitation
```
Duration: Day 6-9
Goal: Public invitation fully functional

Tasks:
[  ] Implement InvitationLayout
[  ] Implement all invitation sections (Cover → Closing)
[  ] Implement React Islands (Countdown, Gallery, RSVP, Wishes, Music)
[  ] Implement music controller
[  ] Implement template renderer
[  ] Implement theme application
[  ] Implement public API routes (GET /api/invitations/:slug)
[  ] Implement RSVP API (POST)
[  ] Implement Wishes API (POST)
[  ] Implement personalized guest greeting
[  ] Implement SEO metadata
[  ] Verify: public invitation renders correctly
[  ] Verify: RSVP flow works end-to-end
[  ] Verify: Wishes flow works end-to-end
```

## Phase 5 — Media System (R2)
```
Duration: Day 8-10
Goal: Upload, serve, optimize media

Tasks:
[  ] Implement R2 signed upload URL flow
[  ] Implement asset service (create, delete, validate)
[  ] Implement image optimization pipeline
[  ] Implement responsive image delivery (srcset, sizes)
[  ] Implement gallery management API
[  ] Verify: upload flow works
[  ] Verify: images served from R2
[  ] Verify: responsive images work
```

## Phase 6 — Admin Dashboard
```
Duration: Day 9-12
Goal: Full admin dashboard

Tasks:
[  ] Implement AdminLayout
[  ] Implement login/auth flow
[  ] Implement dashboard overview
[  ] Implement invitation CRUD
[  ] Implement invitation management (publish/unpublish)
[  ] Implement couple editing
[  ] Implement event management
[  ] Implement story management
[  ] Implement gallery management (with R2 upload)
[  ] Implement gift management
[  ] Implement guest management (CRUD, import, search)
[  ] Implement RSVP dashboard
[  ] Implement wishes moderation
[  ] Implement theme editor
[  ] Implement settings
[  ] Verify: all admin features work
[  ] Verify: tenant isolation enforced
```

## Phase 7 — QA & Hardening
```
Duration: Day 12-14
Goal: Production-ready

Tasks:
[  ] Run full test suite (unit + integration + E2E)
[  ] Run visual QA (all breakpoints)
[  ] Run Lighthouse audit
[  ] Run accessibility check
[  ] Run security review
[  ] Performance optimization
[  ] Error handling audit
[  ] SEO verification
[  ] Fix any critical issues
```

## Phase 8 — Production Deployment
```
Duration: Day 14-15
Goal: Live on Cloudflare

Tasks:
[  ] Configure production environment
[  ] Setup Cloudflare Workers deployment
[  ] Configure custom domain
[  ] Configure R2 production bucket
[  ] Run production database migrations
[  ] Verify HTTPS
[  ] Verify caching strategy
[  ] Verify robots.txt + sitemap
[  ] Smoke test production
[  ] Document deployment process
```

---

# 4. Infrastructure Setup Guide

## 4.1 Neon PostgreSQL

1. Buka https://neon.tech
2. Sign up (bisa pakai GitHub/Google)
3. Buat project baru:
   - Project name: `wedding-platform`
   - Region: `AWS Singapore (ap-southeast-1)` (terdekat Indonesia)
4. Setelah project created, catat:
   - `DATABASE_URL` (connection string) — ada di Dashboard → Connection Details
   - Pilih mode: `Pooled` (untuk serverless/Workers)
5. Simpan URL ini untuk configuration nanti

## 4.2 Cloudflare R2

1. Buka https://dash.cloudflare.com
2. Login ke account
3. Menu: R2 Object Storage → Create bucket
   - Bucket name: `wedding-assets`
   - Region: auto (R2 is global)
4. Setelah bucket created:
   - Menu: R2 → Manage R2 API Tokens → Create API Token
   - Permission: `Object Read & Write`
   - Scope: `wedding-assets` bucket
   - Catat: `Access Key ID` + `Secret Access Key`
5. Untuk binding di Workers (production):
   - Cloudflare Workers → Settings → Bindings
   - Add binding: R2 Bucket
   - Variable name: `MEDIA_BUCKET`
   - Bucket: `wedding-assets`

## 4.3 Cloudflare Workers (Deployment Target)

1. Dari dashboard yang sama
2. Menu: Workers & Pages → Create application
   - Name: `wedding-platform`
   - Framework: Astro (nanti kita configure manual)
3. Binding ke R2 bucket (langkah 4.2.5)
4. Environment variables:
   - `DATABASE_URL` = dari Neon
   - `BETTER_AUTH_SECRET` = generate random string

## 4.4 Domain Setup

1. Menu: Domain & Zones → Add existing domain
2. Atau kalau belum punya, beli domain dari Cloudflare
3. Nanti kita bisa setup route:
   ```
   wedding-platform.example.com → Cloudflare Workers
   ```

---

# 5. Environment Variables

```bash
# .env.example

# Database (Neon)
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/wedding_platform?sslmode=require

# Auth
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=http://localhost:4321

# R2 (Cloudflare)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=wedding-assets
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# App
PUBLIC_SITE_URL=http://localhost:4321
NODE_ENV=development
```

---

# 6. Key Technology Versions

| Package | Version | Purpose |
|---------|---------|---------|
| Astro | ^5.x | Framework |
| React | ^19.x | Interactive islands |
| Tailwind CSS | ^4.x | Styling |
| Drizzle ORM | ^0.38.x | Database ORM |
| Neon Serverless Driver | latest | DB connection |
| Better Auth | latest | Authentication |
| Motion | ^12.x | Animations |
| Zod | ^3.x | Validation |
| Vitest | latest | Testing |
| Wrangler | latest | Cloudflare CLI |

---

# 7. Startup Commands

```bash
# First-time setup
cd project/undangandigital

# 1. Initialize Astro
npm create astro@latest . -- --template minimal --typescript strict --install

# 2. Add core dependencies
npx astro add react tailwind

# 3. Add backend dependencies
npm install drizzle-orm @neondatabase/serverless better-auth zod

# 4. Add dev dependencies
npm install -D drizzle-kit @types/react vitest @testing-library/react

# 5. Add motion
npm install motion

# 6. Create folder structure
mkdir -p backend/{db/schema,repositories,services,media,middleware,viewmodels,integrations,lib}
mkdir -p frontend/{components/{invitation,admin,ui},layouts,lib/{hooks,utils},pages/{admin,api/{invitations,admin}}}
mkdir -p shared/{types,validation,constants,utils}
mkdir -p templates/classic/{sections,assets/{fonts,patterns,decorative}}
mkdir -p tests/{unit/{validation,services,utils},integration/{repositories,api,auth},e2e}
mkdir -p scripts docs

# 7. Configure paths in tsconfig.json
# (add path aliases: @shared/*, @backend/*, @frontend/*, @templates/*)

# 8. Verify
npm run dev
```

---

# 8. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cloudflare Workers runtime limits | High | Keep backend lightweight; test early on Workers |
| Neon free tier connection limits | Medium | Use pooled connections; connection reuse |
| R2 latency for images | Low | Use CDN caching; responsive images |
| Better Auth complexity | Medium | Start with email+password only |
| Astro SSR + Cloudflare adaptation | Medium | Use official Cloudflare adapter |
| Cross-package type sharing | Low | Shared types folder; strict tsconfig paths |
| Image optimization on Workers | Medium | Consider client-side optimization or external service |

---

**End of IMPLEMENTATION PLAN**
