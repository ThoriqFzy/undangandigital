# REFERENCE.md — Wedding Invitation Visual & UX Reference

**Version:** 1.0  
**Reference Type:** Visual / UX / Interaction Reference  
**Source:** Uploaded reference video  
**Source File:** `ssstik.io_@rumahundangan.id_1787746461711(1).mp4`  
**Video Format:** 512 × 910 portrait, ~53 seconds  
**Primary Target:** Mobile-first digital wedding invitation

---

# 1. Purpose

Dokumen ini adalah **reference specification** yang dibuat dari video contoh undangan digital yang diberikan untuk project Wedding Invitation Platform.

Tujuannya agar Hermes + OpenCode dapat memahami:

- visual direction
- section structure
- content hierarchy
- component patterns
- interaction patterns
- responsive/mobile behavior
- animation direction
- overall aesthetic

Dokumen ini **bukan instruksi untuk melakukan clone 1:1**.

Source of truth tetap:

```text
PRD.md
    ↓
Product requirements

ARCHITECTURE.md
    ↓
Technical architecture

DATABASE.md
    ↓
Data model

AGENTS.md
    ↓
Engineering / agent workflow

REFERENCE.md
    ↓
Visual & UX direction
```

Jika terdapat konflik, PRD/Architecture/Database memiliki prioritas sesuai domainnya.

---

# 2. Reference Summary

Video menunjukkan undangan digital dengan karakter utama:

```text
Mobile-first
Elegant
Romantic
Editorial
Floral
Blue / ivory palette
Traditional-modern Indonesian wedding aesthetic
Soft rounded cards
Serif / calligraphic typography
Photo-centric sections
Long-form single-page experience
```

Komposisi visual banyak menggunakan:

- ivory / cream background
- muted blue
- dusty blue
- warm gold / champagne accent
- floral ornament
- decorative frame
- rounded content cards
- portrait wedding photography
- centered typography

Overall visual impression:

> Elegant wedding invitation dengan perpaduan nuansa tradisional, botanical, dan editorial modern.

---

# 3. Video Characteristics

Observed source:

```text
Resolution: 512 × 910
Aspect ratio: ~9:16
Duration: ~53 seconds
Orientation: Portrait
```

Implikasi:

```text
Primary design target
        ↓
Mobile portrait
        ↓
390px-ish viewport
        ↓
Progressive enhancement
        ↓
Tablet / desktop
```

Desktop bukan primary canvas.

Desktop harus menjadi responsive adaptation dari mobile-first design.

---

# 4. Core Visual Direction

## 4.1 Color Direction

Reference menggunakan keluarga warna:

```text
Ivory / Cream
       +
Dusty / Muted Blue
       +
Deep Blue
       +
Warm Gold / Champagne
       +
Neutral Gray
```

Jangan mengunci nilai warna dari video secara literal.

Gunakan semantic design tokens:

```text
--color-background
--color-surface
--color-primary
--color-primary-soft
--color-accent
--color-text
--color-muted
--color-border
```

Theme system harus memungkinkan pasangan mengubah palette tanpa mengubah component implementation.

---

# 5. Typography Direction

Typography terlihat menggunakan kombinasi:

```text
Decorative / Calligraphic font
        +
Elegant Serif
        +
Readable body font
```

Recommended hierarchy:

```text
Display / Couple Names
→ elegant serif / script

Section Heading
→ serif

Body
→ highly readable serif/sans-serif

Metadata / labels
→ clean sans-serif or restrained serif
```

Jangan menggunakan terlalu banyak font family.

Recommended maximum:

```text
1 display font
1 body font
1 optional accent font
```

Typography harus tetap readable pada mobile.

---

# 6. Decorative Language

Elemen dekoratif utama:

```text
Floral branches
Botanical leaves
Blue ornamental patterns
Gold accent
Arch / oval framing
Decorative borders
```

Decorations harus diposisikan sebagai visual layer.

Conceptual structure:

```text
Section
├── Background
├── Decorative layer
├── Content layer
└── Interaction layer
```

Decorative elements tidak boleh mengganggu:

- text readability
- CTA
- form
- touch target
- image subject

---

# 7. Layout Language

Reference banyak menggunakan:

```text
Full-width section
      ↓
Centered content
      ↓
Rounded content card
      ↓
Decorative background
```

Common width strategy:

```text
Mobile
→ almost full width
→ horizontal safe padding

Tablet
→ constrained max-width

Desktop
→ centered invitation canvas
```

Recommended conceptual constraint:

```text
page
└── invitation-shell
    └── section
        └── content-container
```

---

# 8. Cover / Opening

Reference menggunakan opening yang kuat secara visual.

Pattern:

```text
Decorative background
        ↓
Wedding / event label
        ↓
Couple names
        ↓
Date
        ↓
Primary CTA
```

CTA terlihat seperti:

```text
pill button
```

Primary action harus sangat jelas.

Contoh:

```text
Buka Undangan
```

atau:

```text
Save the Date
```

Cover harus menjadi visual anchor.

---

# 9. Couple Introduction

Observed pattern:

```text
Couple name
        ↓
Family / parent information
        ↓
Portrait photography
```

Foto pasangan/pengantin menjadi focal point.

Gunakan:

```text
portrait crop
rounded / arch / oval framing
```

tergantung template.

---

# 10. Save the Date / Invitation Message

Reference memiliki area yang mengomunikasikan:

- tanggal
- nama pasangan
- invitation context
- CTA
- countdown

Countdown menggunakan visual yang sederhana dan readable.

Conceptual component:

```text
Countdown
├── Days
├── Hours
├── Minutes
└── Seconds
```

Countdown harus:

- live
- accessible
- timezone-aware
- graceful setelah event selesai

---

# 11. Wedding Event / Akad

Reference memisahkan informasi acara dalam card/section.

Informasi minimum:

```text
Event title
Date
Time
Venue
Address
Map CTA
```

MVP mendukung:

```text
Akad
Resepsi
Other
```

CTA:

```text
Lokasi Acara
```

dapat membuka external map URL.

Tidak perlu memaksakan integrasi Google Maps API untuk MVP.

---

# 12. Event Card Pattern

Recommended structure:

```text
Event Card
├── Decorative heading
├── Event title
├── Date
├── Time
├── Venue
├── Address
└── Map CTA
```

Visual:

```text
soft surface
rounded corners
subtle border
decorative accent
```

Jangan membuat event card terlalu padat.

---

# 13. Love Story / Timeline

Reference memiliki section:

```text
Love Story
```

Dengan:

```text
Hero image
      ↓
Story title
      ↓
Story narrative
```

Architecture yang harus digunakan:

```text
stories[]
```

sehingga dapat berkembang menjadi timeline:

```text
2017
 ↓
First Meeting
 ↓
2019
 ↓
Relationship
 ↓
2025
 ↓
Engagement
 ↓
2026
 ↓
Wedding
```

Template boleh menggunakan layout berbeda tanpa mengubah data model.

---

# 14. Quote / Religious Message

Reference memiliki quote / verse section.

Pattern:

```text
Decorative section
      ↓
Quote / verse
      ↓
Source / citation
```

Component harus mendukung:

```text
quote
source
optional attribution
```

Jangan hard-code quote tertentu ke template.

---

# 15. Gallery

Reference menggunakan large portrait-oriented wedding photography.

Gallery should support:

```text
portrait images
landscape images
mixed aspect ratio
```

Recommended UX:

```text
Grid
 ↓
Tap image
 ↓
Lightbox
 ↓
Swipe / next / previous
```

Gallery adalah kandidat kuat untuk React island.

---

# 16. Gallery Visual Direction

Reference menunjukkan:

```text
Large image
rounded corners
generous spacing
decorative background
```

Avoid:

```text
dense masonry
too many thumbnails
tiny images
```

Wedding photography harus menjadi focal point.

---

# 17. RSVP

Reference memiliki:

```text
Ucapan / Kehadiran
```

dan form RSVP.

Observed pattern:

```text
Guest name
Message
Attendance selection
Submit
```

MVP RSVP contract:

```text
Attending
Not attending
Maybe
```

Jika guest memiliki personalized token:

```text
Guest name
```

dapat di-prefill.

---

# 18. RSVP UX

Form harus:

```text
mobile-first
large touch targets
clear validation
clear success state
clear error state
```

Recommended:

```text
Name
Message
Attendance
Guest count
Submit
```

Guest count hanya muncul jika diperlukan.

Server tetap menjadi authority untuk:

```text
max_guest_count
```

---

# 19. Wishes

Reference menampilkan jumlah komentar/ucapan dan form.

Conceptual:

```text
Ucapan
   ↓
Comment count
   ↓
Wish list
   ↓
Form
```

MVP moderation:

```text
submitted
   ↓
pending
   ↓
admin approval
   ↓
public
```

Public page hanya menampilkan:

```text
approved wishes
```

---

# 20. Gift / Wedding Gift

Reference memiliki section:

```text
Wedding Gift
```

dengan bank / digital payment cards.

MVP harus mendukung:

```text
Bank
E-wallet
Physical address
```

Bank card:

```text
Bank logo/name
Account number
Account holder
Copy button
```

Copy interaction harus memberi feedback:

```text
Copied
```

tanpa mengganggu user.

---

# 21. Gift Security

Database boleh menyimpan:

```text
bank_name
account_number
account_holder
```

Tetapi public API hanya mengembalikan data yang diperlukan.

Jangan expose internal IDs atau database metadata.

---

# 22. Closing Section

Reference memiliki closing/invitation confirmation section.

Recommended:

```text
Final photo
      ↓
Thank you / invitation closing
      ↓
Couple names
```

Closing harus terasa seperti visual ending, bukan sekadar footer.

---

# 23. Navigation / Floating Control

Reference memperlihatkan circular floating control pada beberapa bagian layar.

Interpretation:

```text
Floating navigation / utility control
```

Potential functions:

```text
music
navigation
back to top
section menu
```

Exact behavior harus ditentukan saat implementation melalui UX review.

Jangan mengasumsikan semua circular control memiliki fungsi yang sama hanya dari video.

---

# 24. Music

Reference memiliki indikasi interactive invitation experience dengan background audio.

MVP:

```text
music enabled
music asset
play/pause
```

Important browser constraint:

```text
Autoplay with sound
```

sering diblokir browser.

Therefore:

```text
Opening CTA
 ↓
User interaction
 ↓
Start music
```

lebih reliable daripada memaksa autoplay.

Respect browser autoplay policy.

---

# 25. Animation Direction

Reference memberikan kesan:

```text
soft
slow
elegant
non-aggressive
```

Recommended motion:

```text
fade
fade-up
soft scale
image reveal
section entrance
gentle decorative movement
```

Avoid:

```text
aggressive parallax
fast bounce
excessive zoom
constant motion
heavy 3D
```

Animation harus mendukung romantic/elegant mood.

---

# 26. Motion Architecture

Use:

```text
CSS
```

untuk simple decorative effects.

Use existing:

```text
Motion / Framer Motion capability
```

untuk:

- section entrance
- coordinated transitions
- gallery interactions
- modal/lightbox
- complex UI state

Respect:

```text
prefers-reduced-motion
```

---

# 27. Mobile Interaction Model

Primary interaction:

```text
Vertical scrolling
```

Do not make the entire invitation dependent on:

```text
horizontal swipe
```

unless the specific template deliberately requires it.

Touch targets should be approximately:

```text
44px+
```

for primary controls.

---

# 28. Responsive Model

Design around:

```text
360px
390px
414px
768px
1024px
1440px
```

Priority:

```text
360–414
    ↓
mobile
    ↓
tablet
    ↓
desktop
```

Desktop should not simply stretch mobile content to full width.

Use constrained invitation canvas when appropriate.

---

# 29. Component Inventory

Reference implies the following reusable components:

```text
InvitationShell
Cover
OpeningCTA
CoupleProfile
FamilyProfile
QuoteSection
Countdown
EventCard
EventList
StorySection
StoryTimeline
Gallery
GalleryLightbox
RSVPForm
WishForm
WishList
GiftSection
BankCard
CopyButton
ClosingSection
FloatingControl
MusicController
```

Not all components need to be implemented immediately.

---

# 30. Template Architecture

The visual reference should become **one template family**, not the entire application architecture.

Conceptual:

```text
Invitation Engine
│
├── Template: Floral Blue
│
├── Template: Minimal Ivory
│
├── Template: Modern Editorial
│
└── Template: Traditional
```

The reference video is primarily inspiration for:

```text
Floral Blue / Elegant
```

---

# 31. Reusable vs Template-Specific

## Reusable

```text
RSVP
Gallery
Countdown
Gift
Event
Wish
Copy button
Music
```

## Template-specific

```text
ornamental frame
background illustration
section composition
font pairing
floral placement
decorative shapes
animation choreography
```

This distinction is important.

---

# 32. Content Model Mapping

Reference content maps to database entities:

```text
Couple
→ couples

Event
→ events

Love Story
→ stories

Gallery
→ gallery_items + assets

Gift
→ gifts

Guest
→ guests

RSVP
→ rsvps

Wishes
→ wishes

Theme
→ themes

Template
→ templates
```

Therefore the visual reference is compatible with `DATABASE.md`.

---

# 33. Admin Configuration Mapping

Admin should eventually be able to configure:

```text
Cover
├── title
├── names
├── date
└── CTA

Couple
├── names
├── parents
├── photos
└── socials

Events
├── date
├── time
├── venue
├── address
└── maps URL

Story
├── title
├── date
├── text
└── image

Gallery
└── assets

Gift
├── bank
├── account
└── copy

RSVP
└── settings

Theme
├── colors
├── typography
└── motion
```

---

# 34. SEO Direction

Reference is a public invitation page.

Each invitation should produce:

```text
unique title
unique description
canonical URL
Open Graph image
structured metadata where appropriate
```

Personalized guest parameters should not create duplicate canonical pages.

---

# 35. Performance Direction

The visual quality must not require a heavy page.

Priorities:

```text
1. Fast HTML
2. Optimized hero image
3. Minimal hydration
4. Lazy gallery
5. Deferred non-critical assets
6. Efficient fonts
7. Controlled animation
```

Avoid:

```text
large unoptimized background videos
huge original photos
many font families
large JS bundles
```

---

# 36. Asset Recommendations

For implementation:

```text
Hero image
→ optimized WebP/AVIF where supported

Gallery
→ responsive image variants

Decorations
→ SVG where appropriate

Background illustrations
→ optimized raster/SVG depending on source

Audio
→ compressed web-friendly format
```

Do not use raw 4K images directly in the public page.

---

# 37. UX Quality Bar

The final result should feel:

```text
Elegant
Calm
Premium
Romantic
Readable
Fast
Personal
```

Avoid:

```text
Template-looking
Over-animated
Crowded
Cheap-looking
Too many colors
Too many font styles
```

---

# 38. What Must NOT Be Cloned

The reference is not a request to copy:

```text
exact artwork
exact text
exact photos
exact names
exact bank details
exact brand assets
exact decorative assets
```

Use the reference to understand **design language and interaction patterns**.

Create original implementation/assets where required.

---

# 39. Implementation Priority

When translating this reference into the product:

## Phase 1 — Visual foundation

```text
colors
typography
spacing
container
cards
buttons
decorative system
```

## Phase 2 — Core sections

```text
cover
couple
events
story
gallery
gift
RSVP
wishes
closing
```

## Phase 3 — Interaction

```text
countdown
lightbox
copy
music
personalized guest
```

## Phase 4 — Motion

```text
section entrance
image reveal
decorative motion
micro-interactions
```

## Phase 5 — QA

```text
responsive
accessibility
performance
SEO
visual QA
```

---

# 40. Acceptance Criteria for Reference Implementation

The first template inspired by this reference should satisfy:

```text
[ ] Mobile portrait is primary
[ ] Elegant floral visual language
[ ] Ivory + blue + warm accent palette
[ ] Strong couple-name typography
[ ] Decorative background system
[ ] Cover section
[ ] Couple section
[ ] Event information
[ ] Love story
[ ] Gallery
[ ] RSVP
[ ] Wishes
[ ] Gift / bank transfer
[ ] Closing section
[ ] Countdown
[ ] Responsive behavior
[ ] Soft motion
[ ] Reduced-motion support
[ ] Optimized images
[ ] SEO metadata
[ ] No horizontal overflow
[ ] Public page remains lightweight
```

---

# 41. Important Interpretation Rule

This document describes **what should be learned from the reference**, not what must be copied literally.

If the reference video conflicts with:

```text
PRD.md
ARCHITECTURE.md
DATABASE.md
```

use the appropriate source of truth.

If the reference contains a useful pattern not covered by the PRD:

```text
Do not silently add major product scope.
```

Instead:

```text
Identify pattern
 ↓
Determine whether it is implementation detail
or product requirement
 ↓
If product requirement → update PRD
 ↓
If implementation detail → keep in template/architecture
```

---

# 42. Hermes / OpenCode Usage

When working on visual implementation, Hermes should provide OpenCode with:

```text
PRD.md
ARCHITECTURE.md
REFERENCE.md
```

and relevant source assets.

Recommended flow:

```text
REFERENCE.md
      ↓
Designer
      ↓
Design tokens
      ↓
Component plan
      ↓
OpenCode
      ↓
Implementation
      ↓
Browser screenshot
      ↓
Visual QA
      ↓
Iteration
```

Do not expect a coding agent to infer all visual requirements from a raw video alone.

---

# 43. Reference Asset Location

Recommended repository structure:

```text
references/
└── wedding-example/
    ├── REFERENCE.md
    └── reference.mp4
```

The video itself should generally **not** be committed to Git if it is large.

Preferred:

```text
reference video
→ server/local reference storage
→ R2 / private cloud storage
```

while:

```text
REFERENCE.md
→ Git
```

remains the durable specification.

---

# 44. Final Visual Direction

The reference should guide the first template toward:

```text
              WEDDING INVITATION
                     │
        ┌────────────┴────────────┐
        │                         │
     Editorial                 Traditional
        │                         │
        └────────────┬────────────┘
                     │
                Floral / Blue
                     │
                  Elegant
                     │
              Mobile-first
                     │
             Lightweight SSR
```

The goal is not to reproduce the video.

The goal is to reproduce the **quality, hierarchy, mood, and interaction model** while building a reusable invitation engine.

**End of REFERENCE.md**
