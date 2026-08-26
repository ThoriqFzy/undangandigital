# ARCHITECTURE.md — Wedding Invitation Platform

**Version:** 1.0  
**Status:** Architecture Baseline  
**Primary Runtime:** Cloudflare Workers  
**Frontend:** Astro + React Islands  
**Styling:** Tailwind CSS  
**Animation:** Motion / Framer Motion  
**Database:** Neon PostgreSQL  
**ORM:** Drizzle ORM  
**Object Storage:** Cloudflare R2  
**Authentication:** Better Auth  
**Primary Orchestrator:** Hermes  
**Primary Engineering Executor:** OpenCode

---

# 1. Purpose

Dokumen ini mendefinisikan arsitektur teknis Wedding Invitation Platform.

Source of truth:

```text
PRD.md
    ↓
Product requirements

ARCHITECTURE.md
    ↓
System architecture

DATABASE.md
    ↓
Database/data model

AGENTS.md
    ↓
Hermes/OpenCode operating rules
```

Jika terjadi konflik:

1. Security requirement mengalahkan convenience.
2. `DATABASE.md` menjadi source of truth untuk data model.
3. `ARCHITECTURE.md` menjadi source of truth untuk system boundaries.
4. `PRD.md` menjadi source of truth untuk product behavior.
5. OpenCode tidak boleh mengubah architectural decision secara diam-diam.

---

# 2. Architecture Goals

Arsitektur harus:

- cepat untuk public invitation
- mobile-first
- ringan client-side
- scalable untuk banyak invitation
- reusable untuk banyak template
- mudah dipelihara agent
- aman terhadap cross-tenant access
- mudah di-deploy ke Cloudflare
- murah pada MVP
- tidak over-engineered
- memungkinkan evolusi menjadi SaaS

---

# 3. Core Architecture Principle

Produk bukan kumpulan website individual.

Modelnya:

```text
One Application
      ↓
One Invitation Engine
      ↓
Many Templates
      ↓
Many Invitations
      ↓
Many Customers
```

Data dan presentation harus dipisahkan:

```text
PostgreSQL
    ↓
Repository
    ↓
Service
    ↓
View Model
    ↓
Template
    ↓
Astro
    ↓
HTML
```

Template tidak boleh melakukan direct database access.

---

# 4. High-Level System Architecture

```text
                         INTERNET
                            │
                            ▼
                     Cloudflare Edge
                            │
                    ┌───────┴────────┐
                    │                │
                    ▼                ▼
              Public Routes      Admin Routes
                    │                │
                    ▼                ▼
                 Astro SSR      React Islands
                    │                │
                    └───────┬────────┘
                            │
                            ▼
                       Service Layer
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
             Repository Layer      R2 Service
                  │                   │
                  ▼                   ▼
            Neon PostgreSQL     Cloudflare R2
```

---

# 5. Runtime Architecture

Application dijalankan di:

```text
Cloudflare Workers
```

Astro digunakan sebagai application framework.

Cloudflare menangani:

- edge request
- HTTPS
- routing
- Worker runtime
- caching primitives
- static assets
- R2 integration

Database dan storage tetap berada di external managed services.

---

# 6. Frontend Architecture

## 6.1 Astro

Astro menjadi framework utama untuk public invitation.

Tujuan:

```text
HTML-first
minimal JavaScript
server-rendered content
progressive enhancement
```

Public invitation tidak boleh menjadi SPA.

---

## 6.2 React Islands

React hanya digunakan ketika component membutuhkan client-side state/interactivity.

Contoh:

```text
RSVPForm
GalleryLightbox
MusicController
Countdown
AdminDashboard
ThemeEditor
```

Static content tetap dirender Astro.

---

# 7. Public vs Admin Architecture

Public dan Admin memiliki kebutuhan berbeda.

## Public

```text
Astro
SSR
Minimal JS
Image optimization
Caching
SEO
```

## Admin

```text
Astro shell
+
React Islands
+
Authenticated API
+
Interactive forms
```

Jangan membuat seluruh public invitation bergantung pada React hydration.

---

# 8. Request Lifecycle — Public Invitation

Request:

```text
GET /fauzan-indah
```

Flow:

```text
Browser
   ↓
Cloudflare
   ↓
Worker
   ↓
Astro route
   ↓
Resolve slug
   ↓
Invitation service
   ↓
Repository
   ↓
PostgreSQL
   ↓
Build InvitationViewModel
   ↓
Resolve template
   ↓
Resolve theme
   ↓
Astro render
   ↓
HTML response
```

Media:

```text
HTML
 ↓
Cloudflare/R2 asset URL
 ↓
Browser
```

---

# 9. Personalized Invitation Request

Example:

```text
GET /fauzan-indah?guest=<opaque-token>
```

Flow:

```text
Request
 ↓
Resolve invitation by slug
 ↓
Validate guest token
 ↓
Hash token
 ↓
Lookup token_hash
 ↓
Resolve guest
 ↓
Ensure guest belongs to invitation
 ↓
Build personalized view model
 ↓
Render
```

Never trust guest ID supplied by the client.

---

# 10. Admin Request Lifecycle

Example:

```text
GET /admin/invitations
```

Flow:

```text
Browser
 ↓
Cloudflare Worker
 ↓
Better Auth session
 ↓
Authenticated user
 ↓
Authorization
 ↓
Service
 ↓
Repository
 ↓
PostgreSQL
 ↓
DTO/ViewModel
 ↓
React Island
```

Every resource query must enforce ownership.

---

# 11. Layered Architecture

Use these boundaries:

```text
Presentation
     ↓
Application / Service
     ↓
Repository
     ↓
Infrastructure
```

Detailed:

```text
src/
├── pages/
├── components/
├── layouts/
│
├── features/
│
├── services/
│
├── repositories/
│
├── db/
│
├── integrations/
│
├── lib/
└── templates/
```

---

# 12. Presentation Layer

Contains:

- Astro pages
- Astro layouts
- React islands
- UI components
- forms
- presentation-specific state

Presentation layer must not contain raw SQL.

---

# 13. Service Layer

Service layer contains business logic.

Examples:

```text
InvitationService
GuestService
RSVPService
WishService
GalleryService
AssetService
TemplateService
ThemeService
```

Responsibilities:

- validation orchestration
- authorization checks
- transactions
- state transitions
- repository coordination
- DTO generation

---

# 14. Repository Layer

Repository is the only application boundary allowed to directly use Drizzle queries.

Examples:

```text
InvitationRepository
GuestRepository
RSVPRepository
WishRepository
AssetRepository
GalleryRepository
```

Repositories should expose business-oriented operations rather than leaking SQL details.

Example:

```typescript
getPublishedInvitationBySlug(slug)
```

is preferred over:

```typescript
findMany(...)
```

from UI code.

---

# 15. Database Layer

```text
Drizzle
   ↓
Neon PostgreSQL
```

Database schema is defined according to `DATABASE.md`.

Database client initialization must be centralized.

Do not create a new database client per component/request unless required by the runtime pattern.

---

# 16. R2 Media Architecture

R2 stores binary assets.

```text
Browser
   ↓
Upload authorization
   ↓
Signed upload URL
   ↓
R2
   ↓
Asset metadata
   ↓
PostgreSQL
```

Database stores:

```text
asset_id
invitation_id
object_key
mime_type
size
width
height
metadata
```

Database does not store binary image/audio/video data.

---

# 17. Media Upload Flow

```text
Admin
 ↓
POST /api/admin/assets/upload-intent
 ↓
Auth
 ↓
Authorization
 ↓
Validate invitation
 ↓
Generate object key
 ↓
Generate signed upload URL
 ↓
Browser uploads directly to R2
 ↓
Confirm upload
 ↓
Create asset record
```

Object key should be server-generated.

Recommended conceptual format:

```text
invitations/{invitationId}/{assetId}/{safe-filename}
```

Never trust the client to choose arbitrary R2 object keys.

---

# 18. Media Security

Validate:

- MIME type
- extension
- file size
- image dimensions
- allowed asset types

Do not rely only on filename extension.

For image uploads, server-side metadata validation is required.

---

# 19. Template Engine Architecture

Template engine is one of the most important boundaries.

```text
Database
   ↓
InvitationViewModel
   ↓
Template Resolver
   ↓
Template
   ↓
Sections
   ↓
Components
```

Template must not know:

- database schema
- authentication
- Drizzle
- R2 credentials
- admin user
- SQL

Template only receives presentation-ready data.

---

# 20. Template Contract

Conceptual contract:

```typescript
interface InvitationTemplate {
  id: string
  version: string
  name: string

  getSections(data: InvitationViewModel): InvitationSection[]

  render(
    data: InvitationViewModel
  ): unknown
}
```

Exact implementation may evolve after OpenCode architecture review.

---

# 21. Template Versioning

Templates must have:

```text
id
version
```

Example:

```text
classic
1.0.0
```

An invitation should retain its selected template reference.

Future template updates must not unexpectedly break an existing published invitation.

Therefore template changes should follow versioning rules.

---

# 22. Theme Engine

Theme is independent from template.

```text
Template
   +
Theme
   +
Theme Overrides
   ↓
Rendered Invitation
```

Theme hierarchy:

```text
Global Theme
      ↓
Invitation Theme Override
      ↓
CSS Variables
      ↓
Components
```

---

# 23. Design Token Architecture

Theme tokens should map to CSS custom properties.

Example:

```text
--color-primary
--color-secondary
--color-background
--color-surface
--color-text
--font-heading
--font-body
--radius-button
--animation-intensity
```

Components should consume tokens rather than hard-coded design values wherever practical.

---

# 24. Invitation Section Architecture

Each template composes sections.

Example:

```text
Template
├── Cover
├── Quote
├── Couple
├── Countdown
├── Events
├── Story
├── Gallery
├── Gift
├── RSVP
├── Wishes
└── Closing
```

Sections should be independently configurable through invitation settings.

---

# 25. Optional Sections

The invitation must support disabling optional sections.

Example:

```json
{
  "showStory": false,
  "showGallery": true,
  "showGift": true,
  "showRsvp": true
}
```

Template must gracefully handle missing/disabled sections.

---

# 26. Animation Architecture

Animation hierarchy:

```text
CSS
 ↓
Motion
 ↓
Advanced interaction
```

Use CSS for:

- simple fades
- simple transitions
- decorative loops

Use Motion for:

- coordinated entrance
- interactive gallery
- modal
- complex section transitions

Avoid shipping animation libraries to pages that do not need them.

Respect:

```text
prefers-reduced-motion
```

---

# 27. Performance Architecture

Primary objective:

```text
Fast first render
+
Low JS
+
Optimized media
+
Minimal network requests
```

Priorities:

```text
1. HTML
2. Critical CSS
3. Hero image
4. Fonts
5. Interactive JS
6. Non-critical media
```

---

# 28. Image Delivery

Images must use responsive sizing.

Conceptual:

```text
Original
   ↓
R2
   ↓
Optimized variants
   ↓
Browser chooses appropriate size
```

Use:

```text
width
height
loading
decoding
sizes
srcset
```

Hero image may be eager.

Gallery images should generally be lazy.

---

# 29. Caching Strategy

Public invitation data is mostly read-heavy.

Potential strategy:

```text
Public invitation
 ↓
Edge cache where safe
```

But personalized guest pages must not accidentally share private guest information through a shared cache.

Rule:

```text
Anonymous public page
→ cacheable

Personalized guest response
→ private/no shared cache
```

Admin routes:

```text
no public caching
```

---

# 30. SEO Architecture

Public invitation route should generate:

```text
<title>
<meta description>
canonical
Open Graph
Twitter metadata
structured metadata
```

Canonical:

```text
https://domain.com/{slug}
```

Personalized query parameters should not become canonical pages.

---

# 31. Authentication Architecture

Better Auth owns:

```text
session
user
account
verification
```

Admin routes require valid session.

Authorization must additionally verify:

```text
resource.owner_id === session.user.id
```

Authentication != authorization.

Both are required.

---

# 32. Authorization Model

MVP uses owner-based authorization.

```text
User
 └── Invitations
```

Future can evolve to:

```text
User
 ├── Invitations
 └── InvitationMembers
          ├── owner
          ├── editor
          └── viewer
```

Do not implement team permissions in MVP unless required.

---

# 33. API Architecture

Public endpoints:

```text
GET  /api/invitations/:slug
POST /api/invitations/:slug/rsvp
POST /api/invitations/:slug/wishes
```

Admin endpoints:

```text
GET    /api/admin/invitations
POST   /api/admin/invitations
GET    /api/admin/invitations/:id
PATCH  /api/admin/invitations/:id
DELETE /api/admin/invitations/:id
```

Feature-specific endpoints may be added under:

```text
/api/admin/invitations/:id/*
```

---

# 34. API Rules

Every endpoint must:

1. validate input
2. authenticate when required
3. authorize resource ownership
4. execute service logic
5. return safe DTO
6. handle expected errors
7. log unexpected errors

Do not return raw database rows.

---

# 35. Validation Architecture

Use Zod or equivalent schema validation.

Flow:

```text
Request
 ↓
Parse
 ↓
Validate
 ↓
Normalize
 ↓
Service
```

Never rely on frontend validation alone.

---

# 36. Error Architecture

Use stable application error codes.

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVITATION_NOT_FOUND",
    "message": "Invitation tidak ditemukan"
  }
}
```

Internal errors must not expose:

- SQL
- stack traces
- secrets
- database connection information

---

# 37. Rate Limiting

Rate limiting is required for public mutation endpoints:

```text
POST /rsvp
POST /wishes
```

Also protect:

```text
authentication
upload intent
admin APIs
```

Exact implementation can use Cloudflare-native mechanisms or another free/low-cost strategy after implementation research.

Do not add an unnecessary third-party paid service for MVP.

---

# 38. RSVP Architecture

```text
Guest
 ↓
Invitation
 ↓
RSVP Form
 ↓
Validation
 ↓
Rate Limit
 ↓
Guest Token Validation
 ↓
RSVP Service
 ↓
Transaction
 ├── UPSERT RSVP
 └── Update Guest Status
 ↓
Response
 ↓
Optional WhatsApp action
```

WhatsApp opening happens client-side.

No WhatsApp Business API required for MVP.

---

# 39. Wishes Architecture

```text
Guest
 ↓
Wish Form
 ↓
Validation
 ↓
Rate Limit
 ↓
Create pending wish
 ↓
Admin moderation
 ↓
Approve
 ↓
Public display
```

Public page should query only approved wishes.

---

# 40. Guest Architecture

Guest lifecycle:

```text
Invited
   ↓
Viewed
   ↓
Responded
   ↓
Attended
```

Guest token provides personalized access.

Token must be opaque and revocable.

---

# 41. Admin Dashboard Architecture

Admin UI is a separate feature boundary within the same application.

Conceptual:

```text
/admin
├── dashboard
├── invitations
├── invitations/[id]
│   ├── details
│   ├── theme
│   ├── story
│   ├── gallery
│   ├── gifts
│   ├── guests
│   ├── rsvp
│   └── wishes
└── templates
```

Use React islands where interactivity is needed.

---

# 42. Admin State Management

Do not introduce a global state library until necessary.

Prefer:

```text
server state
+
local component state
+
URL state
```

For complex admin state, OpenCode may recommend a state library after profiling actual complexity.

Avoid premature abstraction.

---

# 43. Form Architecture

Forms should use:

```text
UI form
 ↓
client validation
 ↓
server validation
 ↓
API/service
 ↓
database
```

Client validation improves UX.

Server validation protects integrity.

---

# 44. Data Transfer Objects

Never expose database entities directly to frontend.

Use DTO/ViewModel:

```text
InvitationPublicDTO
InvitationAdminDTO
GuestDTO
RSVPDTO
GalleryItemDTO
```

Public DTO must be strictly smaller than admin DTO.

---

# 45. Security Boundaries

## Public

Can access:

- published invitation
- public couple data
- public events
- public gallery
- public gifts
- approved wishes

## Guest

Can additionally access:

- personalized greeting
- guest-specific RSVP state

## Admin

Can access:

- private guest data
- RSVP management
- wishes moderation
- invitation editing
- assets
- analytics available in MVP

---

# 46. Secret Management

Secrets must exist only in environment/runtime bindings.

Examples:

```text
DATABASE_URL
BETTER_AUTH_SECRET
R2 credentials
Cloudflare bindings
```

Never commit:

```text
.env
API keys
database passwords
R2 secrets
auth secrets
```

Provide:

```text
.env.example
```

without real credentials.

---

# 47. Environment Strategy

Minimum:

```text
development
preview
production
```

Environment-specific values:

```text
DATABASE_URL
AUTH_SECRET
R2 binding
PUBLIC_SITE_URL
```

Cloudflare bindings should be preferred where appropriate over hard-coded credentials.

---

# 48. Local Development

Local stack should be as close as practical to production.

Recommended:

```text
Astro dev server
Neon development database
R2 development bucket
```

Avoid requiring the developer to run unnecessary local infrastructure.

---

# 49. Testing Architecture

## Unit

Test:

- validators
- utilities
- services
- state transitions

## Integration

Test:

- repository
- database
- authentication
- RSVP
- guest access
- upload metadata

## E2E

Test:

```text
Admin login
 ↓
Create invitation
 ↓
Publish
 ↓
Open invitation
 ↓
RSVP
 ↓
Admin sees RSVP
```

## Visual

Test:

```text
360
390
414
768
1024
1440
```

---

# 50. Performance Testing

Required checks:

```text
Lighthouse
Core Web Vitals
bundle size
image size
request count
hydration footprint
```

Performance regression must be checked after major UI changes.

---

# 51. Accessibility Architecture

Use semantic HTML.

Required:

```text
heading hierarchy
labels
button semantics
focus states
keyboard navigation
alt text
contrast
reduced motion
```

Do not use divs as buttons unless there is a strong reason.

---

# 52. Deployment Architecture

```text
GitHub
   ↓
CI
   ↓
Tests
   ↓
Build
   ↓
Cloudflare deployment
   ↓
Workers
   ↓
Production
```

Database migration must be a deliberate deployment step.

Do not blindly run destructive migrations during every deploy.

---

# 53. CI/CD Gates

Before production:

```text
[ ] install
[ ] lint
[ ] typecheck
[ ] unit tests
[ ] integration tests
[ ] build
[ ] migration validation
[ ] E2E where configured
```

Failure at a required gate blocks deployment.

---

# 54. Database Migration Deployment

Recommended:

```text
Migration generated
 ↓
Review
 ↓
CI migration check
 ↓
Production migration
 ↓
Application deployment
```

For breaking schema changes:

```text
expand
 ↓
deploy compatible code
 ↓
migrate data
 ↓
contract
```

Avoid destructive one-step changes when production data exists.

---

# 55. Observability

MVP:

```text
Cloudflare Worker logs
Application error logs
Request timing
Critical API error tracking
```

Important events:

```text
auth failure
RSVP failure
upload failure
database failure
unexpected 500
```

Do not log:

```text
password
auth tokens
raw guest tokens
private credentials
```

---

# 56. Logging Strategy

Use structured logs where possible.

Example:

```json
{
  "event": "rsvp_submission_failed",
  "invitationId": "...",
  "code": "VALIDATION_ERROR"
}
```

Avoid excessive logging on high-volume public requests.

---

# 57. Architecture for Scale

MVP:

```text
One Astro application
One Cloudflare Worker
One Neon database
One R2 bucket
```

Scale path:

```text
One Worker
      ↓
multiple Worker instances automatically
      ↓
Neon scales compute/storage
      ↓
R2 scales media
```

Do not introduce microservices until a real bottleneck exists.

---

# 58. Multi-Tenant Scaling

Tenant boundary:

```text
invitation_id
```

Future SaaS:

```text
users
  ↓
organizations
  ↓
invitations
```

MVP should not implement organizations unless required.

---

# 59. Custom Domain Future Architecture

Not MVP.

Future:

```text
custom-domain
       ↓
Cloudflare
       ↓
Worker
       ↓
Resolve hostname
       ↓
Invitation
```

The invitation engine must not assume the URL path is the only identifier forever.

However, MVP uses:

```text
domain.com/{slug}
```

---

# 60. Template Marketplace Future

Future architecture:

```text
Template Registry
       ↓
Template Version
       ↓
Theme
       ↓
Invitation
```

Templates should be versioned to prevent changes from unexpectedly modifying published invitations.

---

# 61. Architecture Decision Records

Important decisions currently:

| Decision | Choice | Reason |
|---|---|---|
| Frontend | Astro | Low JS and fast content rendering |
| Interactive UI | React Islands | Interactivity without SPA overhead |
| Styling | Tailwind | Fast reusable design system |
| Animation | Motion | Existing OpenCode capability |
| Runtime | Cloudflare Workers | Edge deployment and ecosystem fit |
| DB | Neon PostgreSQL | Managed PostgreSQL + serverless |
| ORM | Drizzle | Lightweight serverless-friendly ORM |
| Storage | R2 | Media storage and Cloudflare integration |
| Auth | Better Auth | PostgreSQL-compatible auth layer |
| API | Astro server/API routes | Avoid separate backend in MVP |
| Maps | External Google Maps URL | Avoid Maps API dependency |
| URL | `domain.com/{slug}` | Simple and scalable MVP |

---

# 62. Anti-Patterns

Do not implement:

```text
React SPA for public invitation
```

```text
Direct SQL from components
```

```text
Database queries inside templates
```

```text
Binary media inside PostgreSQL
```

```text
Guest ID as public token
```

```text
Global cache for personalized guest responses
```

```text
Hard-coded wedding data
```

```text
One codebase copy per customer
```

```text
Microservices for MVP
```

```text
Large client-side state framework without evidence
```

```text
Third-party paid service for functionality already available natively
```

---

# 63. Repository Architecture

Recommended project layout:

```text
/
├── src/
│   ├── components/
│   │   ├── invitation/
│   │   ├── ui/
│   │   └── admin/
│   │
│   ├── layouts/
│   ├── pages/
│   ├── features/
│   ├── services/
│   ├── repositories/
│   ├── templates/
│   ├── db/
│   ├── integrations/
│   ├── lib/
│   └── types/
│
├── public/
│
├── drizzle/
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── PRD.md
├── DATABASE.md
├── ARCHITECTURE.md
├── AGENTS.md
└── README.md
```

Exact folder names may be adjusted after repository reconnaissance, but boundaries must remain.

---

# 64. Dependency Rules

Dependency direction:

```text
pages/components
       ↓
features/services
       ↓
repositories
       ↓
db/infrastructure
```

Lower layers must not depend on higher presentation layers.

Example invalid:

```text
repository → React component
```

Example valid:

```text
React component → service → repository
```

---

# 65. Feature-Based Organization

When the project grows, feature boundaries may be used:

```text
features/
├── invitations/
├── guests/
├── rsvp/
├── gallery/
├── gifts/
├── wishes/
├── templates/
└── auth/
```

A feature may contain:

```text
service
validation
DTO
UI
tests
```

Do not duplicate database schema across features.

---

# 66. Public Rendering Model

Prefer server-rendered public invitation.

```text
Request
 ↓
Resolve data
 ↓
Render HTML
 ↓
Browser
```

Hydrate only interactive components.

Example:

```text
Cover
→ static

Couple
→ static

Events
→ static

Gallery
→ interactive island

Countdown
→ interactive island

RSVP
→ interactive island

Music
→ interactive island
```

---

# 67. Client JavaScript Budget

Every client-side dependency must have a reason.

Before adding a library, ask:

```text
Can CSS solve this?
Can native browser API solve this?
Can Astro solve this?
Can an existing dependency solve this?
```

Only then add a dependency.

---

# 68. Dependency Management

OpenCode must:

- inspect existing dependencies before adding packages
- prefer existing packages
- avoid duplicate libraries
- verify Cloudflare compatibility
- verify bundle/runtime impact
- document significant new dependencies

No dependency should be added only because it is popular.

---

# 69. Production Readiness Checklist

```text
[ ] Public invitation works
[ ] Admin authentication works
[ ] Tenant isolation verified
[ ] RSVP works
[ ] Wishes moderation works
[ ] Guest personalization works
[ ] R2 upload works
[ ] Database migrations work
[ ] Production environment configured
[ ] HTTPS works
[ ] SEO metadata works
[ ] Sitemap works
[ ] robots.txt works
[ ] Mobile visual QA passed
[ ] Accessibility checked
[ ] Lighthouse target reached
[ ] No critical console errors
[ ] Error logging works
[ ] Rollback path documented
```

---

# 70. Architecture Change Protocol

Any major architecture change must follow:

```text
Problem
 ↓
Current architecture analysis
 ↓
Options
 ↓
Tradeoff analysis
 ↓
Decision
 ↓
Update ARCHITECTURE.md
 ↓
Implementation
 ↓
Verification
```

Examples requiring review:

- replacing Astro
- replacing database
- adding backend service
- changing authentication
- introducing state management framework
- introducing microservices
- changing tenant model
- changing storage provider
- changing public URL architecture

Small implementation details do not require an architecture rewrite.

---

# 71. OpenCode Implementation Contract

OpenCode should implement architecture in dependency order:

```text
1. Runtime / Astro / Cloudflare
2. Tailwind / Design foundation
3. Database / Drizzle
4. Authentication
5. Repository layer
6. Service layer
7. Template engine
8. Public invitation
9. R2 media system
10. Guest system
11. RSVP
12. Wishes
13. Gift
14. Admin dashboard
15. SEO
16. Performance
17. Security hardening
18. E2E / visual QA
19. Production deployment
```

Parallel work is allowed only where dependencies permit it.

---

# 72. Hermes Architecture Review Checklist

Before implementation, Hermes must verify:

```text
[ ] PRD read
[ ] DATABASE.md read
[ ] ARCHITECTURE.md read
[ ] Existing repository inspected
[ ] Existing OpenCode capabilities inspected
[ ] Dependency graph understood
[ ] Major risks identified
[ ] Template boundary understood
[ ] Tenant boundary understood
[ ] Public/private data boundary understood
[ ] Performance strategy understood
[ ] Deployment target understood
```

---

# 73. Final Architecture Principle

The platform must remain:

```text
Simple at the infrastructure level
+
Strict at the architectural boundaries
+
Reusable at the product level
+
Fast at the public experience
+
Agent-friendly at the engineering level
```

The ideal system is not the one with the most services.

The ideal system is the smallest architecture that can reliably support:

```text
Many invitations
Many templates
Many guests
Many RSVP submissions
Many media assets
Future SaaS growth
```

without sacrificing maintainability or performance.

**End of ARCHITECTURE.md**
