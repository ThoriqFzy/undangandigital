# PRD — Wedding Invitation Platform & Template Engine

**Version:** 1.0  
**Status:** Ready for Implementation  
**Product Type:** Digital Wedding Invitation Platform  
**Primary Orchestrator:** Hermes Agent  
**Primary Engineering Executor:** OpenCode  
**Deployment:** Cloudflare  
**Target URL:** `domain.com/{invitation-slug}`

---

# 1. Product Vision

Membangun platform undangan pernikahan digital yang:

1. Memiliki kualitas visual premium.
2. Sangat cepat di perangkat mobile.
3. Menggunakan template yang reusable.
4. Memisahkan data undangan dari desain/template.
5. Dapat menghasilkan banyak undangan dari satu codebase.
6. Memiliki admin dashboard.
7. Memiliki guest list dan RSVP database.
8. Dapat dikembangkan menjadi SaaS.
9. Dapat dikerjakan dan dipelihara oleh Hermes + OpenCode secara agentic.

Produk bukan dibuat sebagai satu website statis.

Arsitektur harus sejak awal diperlakukan sebagai:

```text
Invitation Platform
        │
        ├── Template Engine
        ├── Theme System
        ├── Invitation Data
        ├── Guest System
        ├── RSVP System
        ├── Media System
        ├── Admin Dashboard
        └── Deployment System
```

---

# 2. Product Strategy

## MVP

MVP harus mampu membuat:

```text
Admin
  ↓
Create Invitation
  ↓
Choose Template
  ↓
Input Wedding Data
  ↓
Upload Photos
  ↓
Configure Theme
  ↓
Manage Guests
  ↓
Publish
  ↓
domain.com/fauzan-indah
```

Kemudian tamu dapat:

```text
Open Invitation
      ↓
Opening / Cover
      ↓
Wedding Content
      ↓
RSVP
      ↓
Wedding Gift
      ↓
Wishes
```

---

# 3. Target User

## Primary

Pasangan yang ingin membuat undangan pernikahan digital premium tanpa harus memahami programming.

## Secondary

Admin/operator jasa undangan digital.

## Future

Customer SaaS yang membuat undangannya sendiri.

---

# 4. Product Principles

Semua implementasi harus mengikuti prinsip:

### Performance First

Invitation adalah content-heavy website yang mayoritas diakses melalui smartphone.

Prioritas:

```text
HTML cepat
↓
CSS minimal
↓
JavaScript hanya jika diperlukan
↓
Images optimized
↓
Animations progressive
```

### Mobile First

Desain utama harus dibuat untuk:

```text
360px
390px
414px
```

kemudian ditingkatkan untuk tablet/desktop.

### Data ≠ Design

Data pasangan tidak boleh hard-coded ke template.

```text
Invitation Data
        ↓
Template
        ↓
Theme
        ↓
Components
```

### Template Reusability

Menambahkan template baru tidak boleh membutuhkan perubahan database core.

### Agent Maintainability

Semua struktur kode harus mudah dianalisis oleh Hermes dan OpenCode.

---

# 5. Recommended Technology Stack

## Frontend

### Astro

Digunakan sebagai framework utama.

Alasan:

- minimal client-side JavaScript
- cocok untuk content-focused websites
- SSR/on-demand rendering tersedia
- Cloudflare Workers adapter
- React dapat digunakan sebagai island ketika diperlukan

### React

Digunakan hanya untuk interactive components:

- RSVP form
- countdown
- gallery interaction
- music controller
- admin dashboard
- theme controls

Jangan menjadikan seluruh invitation sebagai React SPA.

---

# 6. Styling

### Tailwind CSS

Digunakan sebagai styling foundation.

Gunakan design tokens:

```text
--color-primary
--color-secondary
--color-background
--color-surface
--color-text
--font-heading
--font-body
--radius
--spacing
```

Template tidak boleh meng-hardcode warna secara acak.

Theme harus dapat mengubah token.

---

# 7. Animation

### Motion / Framer Motion

Gunakan skill `motion` yang sudah tersedia di OpenCode.

Motion hanya digunakan pada bagian yang memang membutuhkan interaction/animation:

- opening animation
- section reveal
- image reveal
- gallery
- modal
- menu
- decorative elements

Jangan menggunakan animation berlebihan.

Performance > animation.

Gunakan CSS animation untuk animasi sederhana jika lebih efisien.

---

# 8. Backend Architecture

Backend tidak dibuat sebagai server terpisah untuk MVP.

Gunakan:

```text
Astro SSR
+
Cloudflare Workers
+
API Routes
```

Jika kebutuhan API bertambah kompleks, API layer dapat dipisahkan kemudian.

---

# 9. Database

### PostgreSQL — Neon

Database utama menggunakan Neon PostgreSQL.

Alasan:

- PostgreSQL native
- serverless
- scale-to-zero
- cocok untuk Cloudflare/serverless
- free tier tersedia
- mudah dipindahkan ke PostgreSQL provider lain

---

# 10. ORM

### Drizzle ORM

Gunakan:

```text
Drizzle ORM
+
Neon Serverless Driver
```

Untuk request sederhana, prioritaskan HTTP driver.

---

# 11. Authentication

### Better Auth

Admin dashboard menggunakan Better Auth.

MVP:

```text
Email
+
Password
```

Future:

```text
Google OAuth
Passkey
Magic Link
```

---

# 12. Object Storage

### Cloudflare R2

Digunakan untuk:

- wedding photos
- gallery
- cover images
- background
- music
- optional video
- template assets

Jangan menyimpan binary media di PostgreSQL.

Database hanya menyimpan metadata:

```text
asset_id
invitation_id
object_key
url
mime_type
size
width
height
created_at
```

---

# 13. Deployment

### Cloudflare Workers

Application utama:

```text
Astro
↓
Cloudflare Adapter
↓
Cloudflare Workers
```

---

# 14. Infrastructure

```text
                    Cloudflare
                        │
              ┌─────────┴─────────┐
              │                   │
          Workers                 R2
              │                   │
              │              Media Assets
              │
              ↓
          Astro SSR
              │
       ┌──────┴───────┐
       │              │
   Public Site     Admin/API
       │              │
       └──────┬───────┘
              ↓
           Drizzle
              ↓
       Neon PostgreSQL
```

---

# 15. Domain Architecture

MVP menggunakan:

```text
domain.com/{slug}
```

Contoh:

```text
domain.com/fauzan-indah
domain.com/andi-salsa
domain.com/rizky-nadia
```

Slug:

- lowercase
- URL safe
- unique
- editable sebelum publish
- tidak boleh berubah sembarangan setelah invitation aktif

---

# 16. Invitation Template Engine

Template harus bersifat data-driven.

```text
Invitation
├── template
├── theme
├── couple
├── events
├── story
├── gallery
├── gifts
├── guests
├── rsvp
└── settings
```

MVP cukup implementasikan **1 template production-grade**.

Arsitektur harus memungkinkan template berikutnya ditambahkan tanpa mengubah database core.

---

# 17. Theme System

Customization Level 2.

User tidak dapat drag-and-drop.

User dapat mengubah:

- primary color
- secondary color
- background
- typography
- font pairing
- button style
- section style
- animation intensity
- gallery style
- music

Contoh:

```json
{
  "colors": {},
  "typography": {},
  "buttons": {},
  "sections": {},
  "animation": {}
}
```

---

# 18. Invitation Sections

Template MVP minimal memiliki:

## 18.1 Cover

Menampilkan:

- background image
- nama pasangan
- tanggal
- nama tamu
- CTA "Buka Undangan"

Opening animation harus ringan.

## 18.2 Hero

Menampilkan:

- nama pasangan
- wedding date
- visual utama

## 18.3 Opening Quote / Quran Verse

Content configurable.

## 18.4 Couple Profile

Menampilkan:

- nama
- foto
- nama orang tua

## 18.5 Countdown

Countdown menuju event utama.

Harus:

- realtime
- timezone-aware
- aman ketika event sudah lewat

## 18.6 Wedding Event

Support minimal:

```text
Akad
Resepsi
```

Field:

```text
title
date
start_time
end_time
timezone
venue
address
maps_url
```

---

# 19. Location

MVP tidak membutuhkan paid Maps API.

Gunakan Google Maps URL.

Features:

- address
- venue
- open map
- directions

Jangan membuat ketergantungan terhadap Google Maps API pada MVP.

---

# 20. Love Story / Timeline

Support:

```text
Year
Title
Description
Image
```

Contoh:

```text
2019
First Meeting

2021
Started Relationship

2025
Engagement

2026
Wedding
```

Section harus optional.

---

# 21. Gallery

Support:

- multiple photos
- lazy loading
- responsive grid
- lightbox
- optimized images

Image pipeline:

```text
Upload
↓
R2
↓
Metadata
↓
Optimized delivery
↓
Responsive rendering
```

Jangan mengirim original image berukuran besar jika versi optimized tersedia.

---

# 22. Wedding Gift

Support:

### Bank Transfer

Fields:

```text
bank_name
account_number
account_holder
```

Feature:

```text
Copy Rekening
```

Feedback:

```text
Nomor rekening berhasil disalin
```

Jangan expose data sensitif melalui unnecessary public API.

---

# 23. RSVP

User dapat memilih:

```text
Hadir
Tidak Hadir
Masih Tentatif
```

Optional:

```text
jumlah_tamu
```

Fields:

```text
guest_id
name
attendance
guest_count
message
submitted_at
```

RSVP harus memiliki rate limiting.

---

# 24. WhatsApp RSVP

Setelah submit:

```text
RSVP Database
        ↓
Generate WhatsApp Message
        ↓
Open WhatsApp
```

WhatsApp API berbayar tidak diperlukan untuk MVP.

---

# 25. Guest Management

Admin dapat:

- add guest
- edit guest
- delete guest
- import guest
- search guest
- filter RSVP
- export guest

Guest status:

```text
Invited
Viewed
RSVP
Attended
```

---

# 26. Personalized Guest Greeting

URL utama:

```text
domain.com/fauzan-indah
```

Personalization dapat menggunakan opaque guest token/query.

Contoh konseptual:

```text
domain.com/fauzan-indah?guest=<opaque-token>
```

Sistem menampilkan:

```text
Kepada Yth.
Bapak/Ibu/Saudara
Nama Tamu
```

Guest ID tidak boleh diekspos secara enumerable.

---

# 27. Wishes

Guest dapat mengirim:

```text
name
message
```

Admin dapat:

- approve
- hide
- delete

Default:

```text
pending
```

Jangan langsung publish jika moderation diaktifkan.

---

# 28. Music

Support:

```text
music_url
```

Music controller:

```text
Play
Pause
Mute
```

Autoplay harus mengikuti browser policy.

Jangan memaksa autoplay sebelum user melakukan interaction.

---

# 29. Admin Dashboard

Dashboard minimal:

```text
Dashboard
├── Invitations
├── Create Invitation
├── Templates
├── Theme
├── Wedding Details
├── Story
├── Gallery
├── Guests
├── RSVP
├── Wishes
├── Wedding Gift
└── Settings
```

---

# 30. Invitation Management

Admin dapat:

```text
Create
Read
Update
Delete
Duplicate
Preview
Publish
Unpublish
```

Status:

```text
draft
published
archived
```

---

# 31. Dashboard Overview

Dashboard menampilkan:

```text
Total Invitations
Published
Draft
Total Guests
RSVP Accepted
RSVP Declined
Pending RSVP
Wishes
```

---

# 32. Database Schema

Minimum entities:

```text
users
sessions
accounts

invitations
templates
themes

couples
events
stories
gallery_items
assets
gifts

guests
rsvps
wishes

audit_logs
```

Relasi utama:

```text
User
 │
 └── Invitations
       │
       ├── Couple
       ├── Events
       ├── Stories
       ├── Gallery
       ├── Gifts
       ├── Guests
       │     └── RSVP
       │
       └── Wishes
```

Semua tenant-owned entity harus memiliki hubungan yang jelas dengan `invitation_id`.

---

# 33. Security

Wajib:

- authentication
- authorization
- invitation ownership checks
- rate limiting
- input validation
- XSS protection
- secure cookies
- signed/opaque guest tokens
- server-side validation
- file type validation
- upload size limit
- MIME validation
- database constraints

Admin API tidak boleh mempercayai `user_id` dari client.

User identity harus diperoleh dari authenticated session.

---

# 34. Performance Requirements

Target mobile public invitation:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Target Lighthouse:

```text
Performance ≥ 90
Accessibility ≥ 90
Best Practices ≥ 90
SEO ≥ 90
```

---

# 35. Image Performance

Setiap image harus memiliki:

- width
- height
- alt
- lazy loading jika bukan above-the-fold
- responsive sizing
- optimized format

Hero image boleh eager load.

Gallery harus lazy load.

---

# 36. SEO

Setiap invitation memiliki:

```text
title
description
og:title
og:description
og:image
canonical
```

Generate:

```text
sitemap
robots.txt
structured metadata
```

Personalized guest query tidak boleh menghasilkan duplicate SEO pages.

Canonical harus mengarah ke:

```text
domain.com/{slug}
```

---

# 37. Accessibility

Minimal:

- semantic HTML
- keyboard navigation
- visible focus state
- sufficient contrast
- alt text
- form labels
- accessible buttons
- reduced motion support

Jika:

```text
prefers-reduced-motion: reduce
```

animation harus dikurangi.

---

# 38. Design Direction

Referensi visual utama:

**Premium romantic wedding invitation.**

Karakter:

- elegant
- emotional
- clean
- cinematic
- premium
- typography-driven
- photography-focused

Hindari:

- template terlihat generik
- terlalu banyak gradient
- terlalu banyak animation
- UI dashboard bercampur dengan visual invitation
- decorative element berlebihan
- layout seperti SaaS dashboard pada halaman undangan

---

# 39. Component Architecture

```text
src/
├── components/
│   ├── invitation/
│   │   ├── Cover
│   │   ├── Hero
│   │   ├── Quote
│   │   ├── Couple
│   │   ├── Countdown
│   │   ├── Events
│   │   ├── Story
│   │   ├── Gallery
│   │   ├── Gift
│   │   ├── RSVP
│   │   ├── Wishes
│   │   └── Closing
│   │
│   ├── ui/
│   └── admin/
```

Template:

```text
src/templates/
├── classic/
│   ├── sections/
│   ├── layout/
│   └── theme.ts
```

---

# 40. Template Contract

Setiap template harus memiliki contract:

```typescript
interface InvitationTemplate {
  id: string
  name: string
  version: string
  sections: InvitationSection[]
  render(data: InvitationData): unknown
}
```

Template tidak boleh mengambil database secara langsung.

Template menerima:

```text
InvitationViewModel
```

Flow:

```text
Database
↓
Repository
↓
ViewModel
↓
Template
```

---

# 41. Repository Layer

Jangan melakukan query database langsung dari UI component.

Gunakan:

```text
UI
 ↓
Service
 ↓
Repository
 ↓
Drizzle
 ↓
PostgreSQL
```

Contoh:

```text
InvitationRepository
GuestRepository
RSVPRepository
GalleryRepository
```

---

# 42. API Architecture

Public:

```text
GET  /api/invitations/:slug
POST /api/invitations/:slug/rsvp
POST /api/invitations/:slug/wishes
```

Admin:

```text
GET    /api/admin/invitations
POST   /api/admin/invitations
GET    /api/admin/invitations/:id
PATCH  /api/admin/invitations/:id
DELETE /api/admin/invitations/:id
```

---

# 43. Validation

Gunakan schema validation.

Rekomendasi:

```text
Zod
```

Semua input eksternal harus divalidasi.

Termasuk:

- RSVP
- guest
- invitation
- upload metadata
- theme
- events
- stories
- gifts

---

# 44. File Upload Architecture

Jangan upload file besar melalui database/API jika tidak diperlukan.

Flow:

```text
Admin
 ↓
Request Upload
 ↓
Generate Signed Upload URL
 ↓
Browser → R2
 ↓
Return Object Key
 ↓
Save Metadata → PostgreSQL
```

---

# 45. Git Strategy

Gunakan:

```text
main
development branch
feature branches
```

OpenCode harus menggunakan worktree untuk pekerjaan paralel.

Contoh:

```text
feature/template-engine
feature/admin-dashboard
feature/rsvp
feature/media-system
```

Merge hanya setelah verification.

---

# 46. Testing

Minimum:

### Unit

- utilities
- validation
- services
- repositories

### Integration

- RSVP
- guest
- invitation CRUD
- authentication
- upload flow

### E2E

Critical path:

```text
Create invitation
↓
Publish
↓
Open public invitation
↓
Submit RSVP
↓
Admin sees RSVP
```

---

# 47. Visual QA

Gunakan browser automation / screenshot capability jika tersedia di OpenCode.

Test:

```text
360px
390px
414px
768px
1024px
1440px
```

Visual QA harus memeriksa:

- overflow
- typography
- spacing
- image cropping
- animation
- button size
- mobile navigation
- gallery
- RSVP
- dashboard

---

# 48. Hermes Agent Architecture

Hermes tidak langsung mengerjakan seluruh project sebagai satu task.

Hermes bertindak sebagai:

```text
ORCHESTRATOR
```

Pipeline:

```text
PRD
 ↓
Reconnaissance
 ↓
Planning
 ↓
Task Decomposition
 ↓
Parallel Dispatch
 ↓
OpenCode Execution
 ↓
Verification
 ↓
Code Review
 ↓
Fix
 ↓
Final QA
```

---

# 49. Hermes Initial Reconnaissance

Sebelum coding:

Hermes WAJIB meminta OpenCode membaca:

```text
OpenCode configuration
Plugin configuration
MCP configuration
Skills directory
Superpowers skills
Project repository
Existing conventions
```

Tujuannya bukan mengulang skill yang sudah ada.

Hermes harus membuat capability map:

```text
Requirement
↓
Required capability
↓
Existing OpenCode skill/plugin
↓
Agent responsible
```

---

# 50. OpenCode Capability Mapping

Gunakan capability yang sudah tersedia.

### Architecture / Planning

```text
writing-plans
brainstorming
codemap
codebase-design
```

### Design

```text
impeccable
ui-ux-pro-max
design-system
ui-styling
brand
motion
21st-components
```

### Engineering

```text
executing-plans
test-driven-development
systematic-debugging
verification-before-completion
```

### Parallel Development

```text
dispatching-parallel-agents
using-git-worktrees
```

### Review

```text
requesting-code-review
receiving-code-review
```

### Finalization

```text
finishing-a-development-branch
```

### Optimization

```text
honey
```

### Research

```text
deepwork
explorer
librarian
oracle
```

---

# 51. Hermes Agent Roles

## Orchestrator

- planning
- task decomposition
- dependency management
- agent coordination
- final decision

## Explorer

Mencari:

- existing architecture
- repository patterns
- dependencies
- implementation constraints

## Librarian

Mencari:

- documentation
- API
- framework capabilities
- current best practices

## Designer

Menggunakan:

```text
impeccable
ui-ux-pro-max
design-system
motion
21st-components
```

untuk menghasilkan visual system.

## Fixer

Menangani:

- bugs
- failed tests
- type errors
- runtime issues
- visual issues

## Observer

Melakukan:

- verification
- QA
- regression detection
- performance check

## Oracle

Digunakan untuk:

- architecture decisions
- difficult technical decisions
- tradeoff analysis

---

# 52. Parallelization Strategy

Jangan menjalankan semua task paralel.

Dependency-aware.

```text
                    Architecture
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
           Database    Design     Template
              │          │          │
              └──────────┼──────────┘
                         ↓
                  Public Invitation
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
             RSVP      Gallery     Gift
              │          │          │
              └──────────┼──────────┘
                         ↓
                  Admin Dashboard
                         ↓
                    Integration
                         ↓
                         QA
```

---

# 53. Implementation Phases

## Phase 0 — Reconnaissance

Deliverables:

```text
architecture.md
capability-map.md
implementation-plan.md
risk-register.md
```

Tidak boleh coding sebelum phase ini selesai.

## Phase 1 — Foundation

Implement:

- Astro
- Cloudflare adapter
- Tailwind
- TypeScript
- Drizzle
- Neon
- Better Auth
- environment management
- database migration
- testing infrastructure
- CI/CD

Acceptance:

```text
App runs locally
Database connected
Authentication works
Cloudflare deployment works
```

## Phase 2 — Design System

Implement:

- typography
- colors
- spacing
- buttons
- cards
- section primitives
- motion primitives
- responsive system

Gunakan:

```text
impeccable
ui-ux-pro-max
design-system
ui-styling
motion
```

## Phase 3 — Template Engine

Implement:

```text
Invitation data model
Template contract
Theme contract
Template renderer
```

Acceptance:

Satu template dapat merender invitation berdasarkan database data.

## Phase 4 — Public Invitation

Implement:

```text
Cover
Hero
Quote
Couple
Countdown
Events
Location
Story
Gallery
Gift
RSVP
Wishes
Closing
Music
```

## Phase 5 — Guest System

Implement:

- guest CRUD
- guest token
- personalization
- RSVP
- WhatsApp
- filtering
- statistics

## Phase 6 — Admin Dashboard

Implement:

```text
Dashboard
Invitation management
Template selection
Theme configuration
Wedding details
Story
Gallery
Gift
Guests
RSVP
Wishes
Publish
```

## Phase 7 — Media System

Implement:

```text
R2
Signed uploads
Image metadata
Image optimization
Delete/replace
Gallery management
```

## Phase 8 — QA

Run:

```text
Unit Test
Integration Test
E2E
Visual QA
Mobile QA
Performance
Accessibility
SEO
Security
```

## Phase 9 — Production

Verify:

```text
Production build
Environment variables
Database migrations
R2
Domain
HTTPS
Caching
SEO
robots
sitemap
observability
rollback
```

---

# 54. Definition of Done

Task dianggap selesai hanya jika:

```text
[ ] Implementation complete
[ ] TypeScript passes
[ ] Lint passes
[ ] Tests pass
[ ] Build passes
[ ] No console errors
[ ] Responsive verified
[ ] Accessibility checked
[ ] Security implications reviewed
[ ] Existing functionality not broken
[ ] Code reviewed
[ ] Documentation updated when needed
```

"Kode sudah dibuat" bukan Definition of Done.

---

# 55. Agent Definition of Done

Hermes tidak boleh menerima laporan:

```text
"Implemented successfully."
```

tanpa evidence.

OpenCode harus memberikan:

```text
Changed files
Tests executed
Commands executed
Results
Known limitations
Potential risks
Screenshots if visual work
```

Contoh:

```text
Implementation:
✓ RSVP form

Validation:
✓ Typecheck
✓ Unit tests
✓ Build
✓ E2E

Visual:
✓ 390px
✓ 414px
✓ 768px

Known issue:
None
```

---

# 56. Verification Hierarchy

Setiap perubahan harus diverifikasi:

```text
Type
 ↓
Lint
 ↓
Unit
 ↓
Integration
 ↓
Build
 ↓
E2E
 ↓
Visual
 ↓
Production-like test
```

---

# 57. Error Handling

Error harus:

- user-friendly
- tidak expose internal stack
- memiliki logging
- dapat ditelusuri

API response:

```json
{
  "success": false,
  "error": {
    "code": "RSVP_VALIDATION_ERROR",
    "message": "Data RSVP tidak valid"
  }
}
```

---

# 58. Observability

MVP minimal:

- Cloudflare Workers logs
- application error logs
- request timing
- API error tracking

Jangan menambahkan observability SaaS berbayar jika belum diperlukan.

---

# 59. MVP Scope Boundary

## WAJIB

```text
1 template
Theme customization
Public invitation
Admin dashboard
Guest list
RSVP database
WhatsApp RSVP
Gallery
Wedding gift
Love story
Music
SEO
Authentication
R2
PostgreSQL
Cloudflare deployment
```

## JANGAN DIBUAT DI MVP

```text
Drag & drop builder
Payment gateway
Subscription billing
Marketplace
Multi-language
AI wedding copywriter
Advanced analytics
Custom domain per customer
WhatsApp Business API
Mobile app
```

---

# 60. Phase 2 Roadmap

Setelah MVP stabil:

```text
Multiple templates
Template marketplace
Advanced theme editor
Guest import CSV
QR check-in
Analytics
Custom domain
Digital envelope
QRIS
Video
Live streaming
Social sharing analytics
```

---

# 61. Phase 3 — SaaS

```text
User
 ↓
Choose Template
 ↓
Create Invitation
 ↓
Customize
 ↓
Upload
 ↓
Preview
 ↓
Publish
 ↓
Share
```

Monetization future:

```text
Free
Basic
Premium
Custom
```

Billing tidak termasuk MVP.

---

# 62. Critical Technical Decisions

### Astro > Next.js

Invitation adalah content-heavy public site yang membutuhkan minimal client JS dan performa tinggi.

### Neon > Supabase

Requirement utama adalah PostgreSQL dan storage sudah menggunakan Cloudflare R2.

### R2 > database/blob storage

Media dipisahkan dari relational data.

### Drizzle > Prisma

Untuk menjaga bundle/runtime tetap ringan dan cocok dengan serverless environment.

### One application > separate frontend/backend

Untuk MVP, mengurangi deployment, API, auth, dan infrastructure complexity.

---

# 63. Critical Performance Rule

Public invitation dan Admin Dashboard harus diperlakukan berbeda.

```text
PUBLIC
Astro SSR
Minimal JS
Aggressive caching
Image optimization

ADMIN
React Islands
Interactive UI
Authenticated API
More JavaScript acceptable
```

Jangan mengorbankan public invitation performance hanya karena dashboard membutuhkan React.

---

# 64. Hermes Operating Rules

Hermes harus:

1. Membaca PRD.
2. Memahami repository.
3. Membaca capability OpenCode.
4. Memetakan requirement → skill/plugin.
5. Membuat implementation plan.
6. Memecah task berdasarkan dependency.
7. Menggunakan parallel agents jika aman.
8. Menggunakan git worktrees untuk pekerjaan paralel.
9. Meminta verification sebelum merge.
10. Meminta code review.
11. Meminta visual QA untuk UI.
12. Memperbaiki failure.
13. Menjalankan final verification.
14. Hanya menyatakan project selesai jika Definition of Done terpenuhi.

---

# 65. Hermes Must NOT

Hermes tidak boleh:

- mengulang skill yang sudah tersedia
- membuat architecture baru tanpa alasan
- mengabaikan existing repository conventions
- mengubah dependency tanpa justifikasi
- mengerjakan semua task sequential jika dapat diparalelkan
- menerima "looks good" sebagai verification
- menganggap build berhasil sebagai bukti aplikasi benar
- mengorbankan mobile performance demi desktop
- memasukkan API key ke source code
- menyimpan media binary di PostgreSQL
- membuat template hard-coded

---

# 66. First Execution Contract

Ketika Hermes menerima project ini:

```text
READ PRD
↓
INSPECT OPENCODE
↓
MAP SKILLS / PLUGINS / MCP
↓
INSPECT REPOSITORY
↓
CREATE IMPLEMENTATION PLAN
↓
IDENTIFY RISKS
↓
ARCHITECTURE REVIEW
↓
START PHASE 0
```

Jangan langsung:

```text
npm install
coding
```

---

# 67. First Milestone

Milestone pertama:

```text
Project Foundation + Architecture
```

Acceptance:

```text
[ ] Astro configured
[ ] Cloudflare Worker configured
[ ] Tailwind configured
[ ] React islands configured
[ ] Motion configured
[ ] Neon connection
[ ] Drizzle configured
[ ] Database schema baseline
[ ] Better Auth configured
[ ] R2 integration skeleton
[ ] Environment strategy
[ ] Repository architecture
[ ] Testing infrastructure
[ ] CI/CD
[ ] Hermes/OpenCode capability map
```

---

# 68. Final Product Architecture

```text
                         HERMES
                    Agent Orchestrator
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          Planning      Research       QA
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                        OPENCODE
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
      Design          Engineering          Testing
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                  Wedding Platform
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
       Astro            Workers           R2
          │                │                │
          │                ↓                │
          │             Drizzle             │
          │                │                │
          │                ↓                │
          │              Neon               │
          │                                 │
          └────────── Public Site ──────────┘
                           │
                           ↓
                  domain.com/{slug}
```

---

# 69. Success Criteria

## Product

```text
[ ] Admin dapat membuat invitation.
[ ] Admin dapat memilih template.
[ ] Admin dapat mengubah theme.
[ ] Admin dapat memasukkan wedding data.
[ ] Admin dapat upload gallery.
[ ] Admin dapat mengelola guest.
[ ] Admin dapat melihat RSVP.
[ ] Admin dapat publish invitation.
```

## Guest

```text
[ ] Guest dapat membuka invitation.
[ ] Guest dapat melihat informasi wedding.
[ ] Guest dapat melihat gallery.
[ ] Guest dapat membuka lokasi.
[ ] Guest dapat melakukan RSVP.
[ ] Guest dapat mengirim wishes.
[ ] Guest dapat copy rekening.
[ ] Guest dapat membuka WhatsApp RSVP.
```

## Engineering

```text
[ ] Public page fast.
[ ] Mobile responsive.
[ ] No critical console error.
[ ] Database reliable.
[ ] Media berada di R2.
[ ] Authentication aman.
[ ] Build reproducible.
[ ] Deployment otomatis.
[ ] Tests pass.
```

## Agentic Development

```text
[ ] Hermes mampu memahami repository.
[ ] Hermes mampu memilih skill OpenCode.
[ ] Hermes mampu melakukan task decomposition.
[ ] OpenCode mampu mengimplementasikan task.
[ ] OpenCode mampu melakukan verification.
[ ] Hermes mampu melakukan review dan orchestration.
```

---

# 70. Final Principle

Produk ini **bukan "website undangan pernikahan"**.

Produk ini adalah:

```text
DATA
  +
TEMPLATE ENGINE
  +
THEME ENGINE
  +
CONTENT SYSTEM
  +
GUEST SYSTEM
  +
RSVP SYSTEM
  +
MEDIA SYSTEM
  +
ADMIN SYSTEM
  +
DEPLOYMENT SYSTEM
```

Wedding invitation yang terlihat oleh user hanyalah output dari engine tersebut.

Arsitektur harus selalu mempertahankan:

```text
One Codebase
        ↓
Many Templates
        ↓
Many Invitations
        ↓
Many Customers
```

Seluruh development lifecycle harus dapat dioperasikan oleh:

```text
Hermes
   ↓
OpenCode
   ↓
Skills / Plugins / MCP
   ↓
Git
   ↓
CI/CD
   ↓
Cloudflare
```

**End of PRD**
