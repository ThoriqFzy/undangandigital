# Wedding Invitation Platform

Platform undangan pernikahan digital yang elegan, interaktif, dan dapat dikembangkan menjadi SaaS.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 7 (SSR) |
| Interactive UI | React 19 (Islands) |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) |
| Database | Neon PostgreSQL |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| Storage | Cloudflare R2 |
| Runtime | Cloudflare Workers |
| Validation | Zod |
| Testing | Vitest |

## Project Structure

```
undangandigital/
├── frontend/          # Astro pages, components, layouts
├── backend/           # Database, services, repositories
├── shared/            # Types, validation (used by both)
├── templates/         # Template engine (classic/)
├── tests/             # Unit, integration, E2E tests
├── docs/              # PRD, Architecture, Database docs
└── drizzle/           # Database migrations
```

### Separation Rationale

- **frontend/** → Error di rendering → lari ke sini
- **backend/** → Error di query/service → lari ke sini
- **shared/validation/** → Error di validasi → lari ke sini
- **shared/types/** → Error di type → lari ke sini
- **templates/** → Error di template layout → lari ke sini

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL, R2 credentials, etc.

# Run dev server
npm run dev

# Open http://localhost:4321
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run typecheck    # TypeScript check
npm run test         # Run tests (watch mode)
npm run test:run     # Run tests (single run)
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed development database
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Neon PostgreSQL
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=random-secret
BETTER_AUTH_URL=http://localhost:4321

# Cloudflare R2
R2_ACCOUNT_ID=<your-account-id>
R2_ACCESS_KEY_ID=<your-r2-api-token-key-id>
R2_SECRET_ACCESS_KEY=<your-r2-api-token-secret>
R2_BUCKET_NAME=wedding-assets

# App
PUBLIC_SITE_URL=http://localhost:4321
```

## Documentation

All project documentation is in `docs/`:

- `docs/PRD.md` — Product requirements
- `docs/ARCHITECTURE.md` — Technical architecture
- `docs/DATABASE.md` — Database schema & rules
- `docs/AGENTS.md` — Hermes + OpenCode operating contract
- `docs/REFERENCE.md` — Visual & UX reference
- `IMPLEMENTATION_PLAN.md` — Build phases & timeline

## License

Private — Internal use only.
