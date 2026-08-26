# DATABASE.md — Wedding Invitation Platform

**Version:** 1.0  
**Status:** Production-oriented MVP specification  
**Database:** PostgreSQL (Neon)  
**ORM:** Drizzle ORM  
**Runtime:** Cloudflare Workers / Astro  
**Primary consumer:** Hermes + OpenCode

---

# 1. Purpose

Dokumen ini adalah **database contract** untuk Wedding Invitation Platform.

`PRD.md` menjelaskan kebutuhan produk. Dokumen ini menjelaskan bagaimana kebutuhan tersebut direpresentasikan secara relational di PostgreSQL.

OpenCode **MUST NOT invent database structure** yang bertentangan dengan dokumen ini tanpa melakukan architecture review terlebih dahulu.

---

# 2. Database Principles

## 2.1 Relational First

Data yang perlu:

- dicari
- difilter
- diurutkan
- direlasikan
- dihitung

harus disimpan sebagai kolom relational biasa.

Gunakan JSONB hanya untuk configuration yang memang fleksibel.

## 2.2 Invitation sebagai Tenant Boundary

`invitations` adalah tenant boundary utama.

Hampir seluruh data bisnis harus dapat ditelusuri melalui:

```text
invitation_id
```

Contoh:

```text
invitation
 ├── couple
 ├── events
 ├── stories
 ├── assets
 ├── gallery_items
 ├── gifts
 ├── guests
 │    └── rsvps
 └── wishes
```

Tidak boleh ada akses data tenant lain hanya karena user mengetahui ID resource.

## 2.3 UUID

Gunakan UUID sebagai primary key untuk entity bisnis.

Rekomendasi PostgreSQL:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

Jangan menggunakan sequential integer ID untuk entity publik.

## 2.4 Timestamps

Semua entity utama menggunakan:

```text
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL
```

Gunakan UTC di database.

Timezone wedding disimpan sebagai IANA timezone, contoh:

```text
Asia/Jakarta
```

## 2.5 Public Identifier

Slug invitation:

```text
domain.com/fauzan-indah
```

harus unique.

Guest token tidak boleh menggunakan database ID mentah.

---

# 3. Entity Relationship Overview

```text
users
  │
  │ 1:N
  ▼
invitations
  │
  ├── 1:1 ── couples
  │
  ├── 1:N ── events
  │
  ├── 1:N ── stories
  │
  ├── 1:N ── assets
  │              │
  │              └── 1:N/1:1 ── gallery_items
  │
  ├── 1:N ── gifts
  │
  ├── 1:N ── guests
  │              │
  │              ├── 1:1 ── rsvps
  │              │
  │              └── 1:N ── guest_access_tokens
  │
  └── 1:N ── wishes

templates
  │
  └── 1:N ── invitations

themes
  │
  └── 1:N ── invitations

users
  └── 1:N ── audit_logs
```

---

# 4. Table Inventory

## Authentication

```text
users
accounts
sessions
verifications
```

These tables mengikuti kebutuhan Better Auth.

## Product

```text
invitations
templates
themes
couples
events
stories
assets
gallery_items
gifts
guests
guest_access_tokens
rsvps
wishes
audit_logs
```

---

# 5. Enum Definitions

Gunakan PostgreSQL enum atau Drizzle enum.

## Invitation Status

```text
draft
published
archived
```

## Event Type

```text
akad
reception
other
```

## Asset Type

```text
image
audio
video
other
```

## Guest Status

```text
invited
viewed
responded
attended
```

## RSVP Status

```text
attending
not_attending
maybe
```

## Wish Status

```text
pending
approved
hidden
```

## Gift Type

```text
bank
ewallet
address
other
```

## Audit Action

```text
create
update
delete
publish
unpublish
login
logout
upload
export
```

---

# 6. users

Authentication user.

Better Auth menjadi owner lifecycle authentication.

```text
users
────────────────────────────────────────
id                  UUID PK
name                VARCHAR NOT NULL
email               VARCHAR NOT NULL UNIQUE
email_verified      BOOLEAN NOT NULL
image               TEXT NULL
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Constraints

```text
email UNIQUE
```

## Index

```text
users_email_unique
```

---

# 7. accounts

Better Auth account/provider records.

```text
accounts
────────────────────────────────────────
id                  UUID PK
user_id             UUID FK → users.id
account_id          VARCHAR NOT NULL
provider_id         VARCHAR NOT NULL
access_token        TEXT NULL
refresh_token       TEXT NULL
access_token_expires_at TIMESTAMPTZ NULL
refresh_token_expires_at TIMESTAMPTZ NULL
scope               TEXT NULL
password            TEXT NULL
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Constraint

```text
user_id → users.id ON DELETE CASCADE
```

Provider credentials must never be exposed to public APIs.

---

# 8. sessions

Better Auth sessions.

```text
sessions
────────────────────────────────────────
id                  UUID PK
expires_at          TIMESTAMPTZ NOT NULL
token               VARCHAR NOT NULL UNIQUE
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
ip_address          VARCHAR NULL
user_agent          TEXT NULL
user_id             UUID FK → users.id
```

## Index

```text
sessions_user_id_idx
sessions_token_unique
sessions_expires_at_idx
```

---

# 9. verifications

Better Auth verification records.

```text
verifications
────────────────────────────────────────
id                  UUID PK
identifier          VARCHAR NOT NULL
value               VARCHAR NOT NULL
expires_at          TIMESTAMPTZ NOT NULL
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

---

# 10. templates

Global invitation template catalog.

Template bukan milik satu invitation.

```text
templates
────────────────────────────────────────
id                  UUID PK
slug                VARCHAR UNIQUE NOT NULL
name                VARCHAR NOT NULL
description         TEXT NULL
version             VARCHAR NOT NULL
preview_image_url   TEXT NULL
is_active           BOOLEAN NOT NULL DEFAULT TRUE
config              JSONB NOT NULL DEFAULT '{}'
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Example

```json
{
  "sections": [
    "cover",
    "quote",
    "couple",
    "countdown",
    "events",
    "story",
    "gallery",
    "gift",
    "rsvp",
    "wishes",
    "closing"
  ]
}
```

Template configuration tidak boleh menyimpan invitation-specific content.

---

# 11. themes

Global preset theme.

```text
themes
────────────────────────────────────────
id                  UUID PK
slug                VARCHAR UNIQUE NOT NULL
name                VARCHAR NOT NULL
description         TEXT NULL
config              JSONB NOT NULL
preview_image_url   TEXT NULL
is_active           BOOLEAN NOT NULL DEFAULT TRUE
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Example

```json
{
  "colors": {
    "primary": "#8A6A52",
    "secondary": "#D8C4B6",
    "background": "#FAF7F2",
    "surface": "#FFFFFF",
    "text": "#2D2926"
  },
  "typography": {
    "heading": "Cormorant Garamond",
    "body": "Inter"
  },
  "buttons": {
    "radius": "9999px"
  },
  "animation": {
    "intensity": "medium"
  }
}
```

---

# 12. invitations

Core tenant/entity.

```text
invitations
────────────────────────────────────────
id                  UUID PK
owner_id            UUID FK → users.id
template_id         UUID FK → templates.id
theme_id            UUID FK → themes.id

slug                VARCHAR UNIQUE NOT NULL
title               VARCHAR NULL
status              invitation_status NOT NULL DEFAULT 'draft'

settings            JSONB NOT NULL DEFAULT '{}'
theme_overrides     JSONB NOT NULL DEFAULT '{}'

published_at        TIMESTAMPTZ NULL
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
deleted_at          TIMESTAMPTZ NULL
```

## `settings` Example

```json
{
  "music": {
    "enabled": true,
    "assetId": "..."
  },
  "showCountdown": true,
  "showStory": true,
  "showGallery": true,
  "showGift": true,
  "showRsvp": true,
  "showWishes": true
}
```

## `theme_overrides` Example

```json
{
  "colors": {
    "primary": "#7A5C45"
  },
  "typography": {
    "heading": "Cormorant Garamond"
  }
}
```

## Constraints

```text
owner_id → users.id ON DELETE RESTRICT
template_id → templates.id ON DELETE RESTRICT
theme_id → themes.id ON DELETE RESTRICT
slug UNIQUE
```

## Index

```text
invitations_owner_id_idx
invitations_slug_unique
invitations_status_idx
```

---

# 13. couples

One couple profile per invitation.

```text
couples
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID UNIQUE FK → invitations.id

groom_name          VARCHAR NOT NULL
groom_nickname      VARCHAR NULL
groom_photo_asset_id UUID NULL
groom_father_name   VARCHAR NULL
groom_mother_name   VARCHAR NULL
groom_social_links  JSONB NOT NULL DEFAULT '{}'

bride_name          VARCHAR NOT NULL
bride_nickname      VARCHAR NULL
bride_photo_asset_id UUID NULL
bride_father_name   VARCHAR NULL
bride_mother_name   VARCHAR NULL
bride_social_links  JSONB NOT NULL DEFAULT '{}'

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Relationship

```text
invitations 1 ─── 1 couples
```

`invitation_id UNIQUE` memastikan satu invitation hanya memiliki satu couple profile.

---

# 14. events

Wedding events.

```text
events
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id

type                event_type NOT NULL
title               VARCHAR NOT NULL

event_date          DATE NOT NULL
start_time          TIME NULL
end_time            TIME NULL
timezone            VARCHAR NOT NULL

venue_name          VARCHAR NULL
address             TEXT NULL
maps_url            TEXT NULL

description         TEXT NULL
sort_order          INTEGER NOT NULL DEFAULT 0
is_visible          BOOLEAN NOT NULL DEFAULT TRUE

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Index

```text
events_invitation_id_idx
events_invitation_sort_idx
```

---

# 15. stories

Love story / timeline.

```text
stories
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id

year_label          VARCHAR NULL
story_date          DATE NULL
title               VARCHAR NOT NULL
description         TEXT NULL
image_asset_id      UUID NULL

sort_order          INTEGER NOT NULL DEFAULT 0
is_visible          BOOLEAN NOT NULL DEFAULT TRUE

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Index

```text
stories_invitation_id_idx
stories_invitation_sort_idx
```

---

# 16. assets

Media metadata.

Actual binary object disimpan di Cloudflare R2.

```text
assets
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id

type                asset_type NOT NULL
object_key          TEXT NOT NULL UNIQUE

original_filename   TEXT NULL
mime_type           VARCHAR NOT NULL
file_size           BIGINT NOT NULL

width               INTEGER NULL
height              INTEGER NULL
duration_ms         INTEGER NULL

alt_text            TEXT NULL

metadata            JSONB NOT NULL DEFAULT '{}'

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
deleted_at          TIMESTAMPTZ NULL
```

## Important

`object_key` bukan public URL yang dipercaya client.

Server menentukan object key.

## Index

```text
assets_invitation_id_idx
assets_type_idx
assets_object_key_unique
```

---

# 17. gallery_items

References asset yang digunakan dalam gallery.

```text
gallery_items
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id
asset_id            UUID FK → assets.id

caption             TEXT NULL
alt_text            TEXT NULL
sort_order          INTEGER NOT NULL DEFAULT 0
is_visible          BOOLEAN NOT NULL DEFAULT TRUE

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Constraint

```text
asset_id → assets.id ON DELETE RESTRICT
```

## Index

```text
gallery_invitation_id_idx
gallery_invitation_sort_idx
```

---

# 18. gifts

Wedding gift information.

MVP terutama bank transfer.

```text
gifts
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id

type                gift_type NOT NULL
label               VARCHAR NULL

bank_name           VARCHAR NULL
account_number      VARCHAR NULL
account_holder      VARCHAR NULL

ewallet_provider    VARCHAR NULL
ewallet_number      VARCHAR NULL

recipient_name      VARCHAR NULL
address             TEXT NULL

instructions        TEXT NULL

sort_order          INTEGER NOT NULL DEFAULT 0
is_visible          BOOLEAN NOT NULL DEFAULT TRUE

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Security

Bank account data harus hanya muncul pada public invitation jika owner mengaktifkan gift section.

Jangan expose database object secara langsung.

API public hanya mengembalikan field yang memang diperlukan untuk rendering.

---

# 19. guests

Guest list.

```text
guests
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id

name                VARCHAR NOT NULL
phone               VARCHAR NULL
email               VARCHAR NULL

guest_group         VARCHAR NULL
max_guest_count     INTEGER NOT NULL DEFAULT 1

status              guest_status NOT NULL DEFAULT 'invited'

notes               TEXT NULL

viewed_at           TIMESTAMPTZ NULL
view_count          INTEGER NOT NULL DEFAULT 0

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
deleted_at          TIMESTAMPTZ NULL
```

## Index

```text
guests_invitation_id_idx
guests_invitation_status_idx
guests_invitation_name_idx
```

Do not assume email or phone is globally unique.

The same guest may appear in different invitations.

---

# 20. guest_access_tokens

Opaque token untuk personalized invitation.

```text
guest_access_tokens
────────────────────────────────────────
id                  UUID PK
guest_id            UUID FK → guests.id

token_hash          CHAR(64) UNIQUE NOT NULL

expires_at          TIMESTAMPTZ NULL
last_used_at        TIMESTAMPTZ NULL

created_at          TIMESTAMPTZ NOT NULL
revoked_at          TIMESTAMPTZ NULL
```

## Security Model

Raw token:

```text
guest=<random-secret>
```

tidak disimpan di database.

Database hanya menyimpan:

```text
SHA-256(token)
```

Flow:

```text
Guest URL
   ↓
Raw token
   ↓
Hash
   ↓
Lookup token_hash
   ↓
Guest
   ↓
Invitation
```

Guest database ID tidak boleh digunakan sebagai public access token.

---

# 21. rsvps

Current RSVP state untuk guest.

MVP menggunakan satu active RSVP per guest.

```text
rsvps
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id
guest_id            UUID UNIQUE FK → guests.id

status              rsvp_status NOT NULL
guest_count         INTEGER NOT NULL DEFAULT 1
message             TEXT NULL

submitted_at        TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

## Important Constraint

`guest_id UNIQUE` memastikan satu guest memiliki satu current RSVP.

Jika history RSVP diperlukan di masa depan, buat:

```text
rsvp_events
```

Jangan memaksa history ke table `rsvps` MVP.

## Index

```text
rsvps_invitation_id_idx
rsvps_guest_id_unique
rsvps_status_idx
```

---

# 22. wishes

Wedding wishes / guest messages.

```text
wishes
────────────────────────────────────────
id                  UUID PK
invitation_id       UUID FK → invitations.id
guest_id            UUID NULL FK → guests.id

name                VARCHAR NOT NULL
message             TEXT NOT NULL

status              wish_status NOT NULL DEFAULT 'pending'

created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
deleted_at          TIMESTAMPTZ NULL
```

Guest ID boleh NULL karena guest dapat mengirim ucapan tanpa personalized token jika flow tersebut diaktifkan.

## Index

```text
wishes_invitation_id_idx
wishes_status_idx
wishes_created_at_idx
```

---

# 23. audit_logs

Audit trail untuk admin actions.

```text
audit_logs
────────────────────────────────────────
id                  UUID PK

user_id             UUID NULL FK → users.id
invitation_id       UUID NULL FK → invitations.id

action              audit_action NOT NULL
entity_type         VARCHAR NOT NULL
entity_id           UUID NULL

metadata            JSONB NOT NULL DEFAULT '{}'

ip_address          VARCHAR NULL
user_agent          TEXT NULL

created_at          TIMESTAMPTZ NOT NULL
```

## Example

```json
{
  "field": "status",
  "from": "draft",
  "to": "published"
}
```

## Index

```text
audit_logs_user_id_idx
audit_logs_invitation_id_idx
audit_logs_entity_idx
audit_logs_created_at_idx
```

---

# 24. Foreign Key Matrix

| Child | Column | Parent | Delete |
|---|---|---|---|
| accounts | user_id | users.id | CASCADE |
| sessions | user_id | users.id | CASCADE |
| invitations | owner_id | users.id | RESTRICT |
| invitations | template_id | templates.id | RESTRICT |
| invitations | theme_id | themes.id | RESTRICT |
| couples | invitation_id | invitations.id | CASCADE |
| events | invitation_id | invitations.id | CASCADE |
| stories | invitation_id | invitations.id | CASCADE |
| assets | invitation_id | invitations.id | CASCADE |
| gallery_items | invitation_id | invitations.id | CASCADE |
| gallery_items | asset_id | assets.id | RESTRICT |
| gifts | invitation_id | invitations.id | CASCADE |
| guests | invitation_id | invitations.id | CASCADE |
| guest_access_tokens | guest_id | guests.id | CASCADE |
| rsvps | invitation_id | invitations.id | CASCADE |
| rsvps | guest_id | guests.id | CASCADE |
| wishes | invitation_id | invitations.id | CASCADE |
| wishes | guest_id | guests.id | SET NULL |
| audit_logs | user_id | users.id | SET NULL |
| audit_logs | invitation_id | invitations.id | SET NULL |

---

# 25. Tenant Isolation Rules

Setiap authenticated request ke admin API harus mengikuti:

```text
session
 ↓
authenticated user
 ↓
invitation.owner_id = session.user.id
 ↓
resource.invitation_id = authorized invitation.id
 ↓
query
```

Jangan:

```text
GET /api/admin/guests/:guestId
```

lalu langsung query berdasarkan `guestId`.

Harus:

```text
guest
  ↓
invitation
  ↓
owner
  ↓
current session
```

Contoh konsep query:

```sql
SELECT g.*
FROM guests g
JOIN invitations i ON i.id = g.invitation_id
WHERE g.id = $guest_id
  AND i.owner_id = $authenticated_user_id;
```

---

# 26. Public Data Boundary

Public invitation tidak boleh melakukan:

```text
SELECT *
```

dari database.

Gunakan dedicated view model.

Contoh:

```text
InvitationPublicViewModel
├── couple
├── events
├── story
├── gallery
├── gifts
├── settings
└── theme
```

Jangan expose:

```text
owner_id
audit_logs
session data
internal object metadata
raw guest token
password
authentication credentials
private notes
```

---

# 27. Invitation Public Query

Conceptual flow:

```text
slug
 ↓
invitation
 ↓
template
 ↓
theme
 ↓
couple
 ↓
events
 ↓
stories
 ↓
gallery
 ↓
gifts
 ↓
public settings
```

Guest personalization:

```text
slug + opaque token
 ↓
validate token
 ↓
guest
 ↓
public invitation
 ↓
personalized greeting
```

---

# 28. Indexing Strategy

Minimum indexes:

```text
users.email UNIQUE

sessions.token UNIQUE
sessions.user_id
sessions.expires_at

templates.slug UNIQUE
themes.slug UNIQUE

invitations.slug UNIQUE
invitations.owner_id
invitations.status

couples.invitation_id UNIQUE

events.invitation_id
events.invitation_id + sort_order

stories.invitation_id
stories.invitation_id + sort_order

assets.object_key UNIQUE
assets.invitation_id
assets.type

gallery_items.invitation_id
gallery_items.invitation_id + sort_order

gifts.invitation_id
gifts.invitation_id + sort_order

guests.invitation_id
guests.invitation_id + status
guests.invitation_id + name

guest_access_tokens.token_hash UNIQUE
guest_access_tokens.guest_id

rsvps.guest_id UNIQUE
rsvps.invitation_id
rsvps.status

wishes.invitation_id
wishes.status
wishes.created_at

audit_logs.user_id
audit_logs.invitation_id
audit_logs.created_at
```

Jangan membuat index untuk setiap column secara otomatis.

---

# 29. JSONB Rules

JSONB boleh digunakan untuk:

```text
templates.config
themes.config
invitations.settings
invitations.theme_overrides
couples.social_links
assets.metadata
audit_logs.metadata
```

Jangan menggunakan JSONB untuk:

```text
events
guests
rsvps
wishes
gallery_items
```

karena entity tersebut akan sering dicari, difilter, dan direlasikan.

---

# 30. Soft Delete Strategy

Gunakan `deleted_at` pada:

```text
invitations
assets
guests
wishes
```

Untuk entity tersebut, default query harus:

```text
WHERE deleted_at IS NULL
```

Jangan langsung menghapus invitation production secara fisik dari public workflow.

Hard delete dapat menjadi maintenance/admin operation terpisah.

---

# 31. Cascade Strategy

Jika invitation dihapus secara permanent:

```text
invitation
 ├── couple
 ├── events
 ├── stories
 ├── assets
 ├── gallery_items
 ├── gifts
 ├── guests
 │    ├── access_tokens
 │    └── rsvps
 └── wishes
```

dapat dihapus cascade.

Tetapi `templates` dan `themes` tidak boleh ikut terhapus.

---

# 32. Slug Rules

Slug harus:

```text
lowercase
ASCII-safe
URL-safe
unique
2–80 characters
```

Regex konseptual:

```regex
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

Contoh valid:

```text
fauzan-indah
andi-salsa
rizky-nadia
```

Contoh invalid:

```text
Fauzan Indah
fauzan_indah
fauzan/indah
```

---

# 33. Timezone Rules

Database:

```text
TIMESTAMPTZ
```

Wedding event:

```text
event_date DATE
start_time TIME
timezone VARCHAR
```

Contoh:

```text
event_date = 2026-10-10
start_time = 08:00
timezone = Asia/Jakarta
```

Frontend harus menginterpretasikan event menggunakan timezone yang disimpan.

Jangan menyimpan timezone hanya sebagai offset:

```text
UTC+7
```

Gunakan IANA timezone:

```text
Asia/Jakarta
```

---

# 34. Guest Count Rules

Minimum:

```text
guest_count >= 1
max_guest_count >= 1
```

RSVP tidak boleh:

```text
guest_count > guests.max_guest_count
```

Validasi harus dilakukan server-side.

---

# 35. RSVP Rules

Ketika guest submit RSVP:

```text
Validate guest token
        ↓
Resolve guest
        ↓
Validate invitation ownership
        ↓
Validate guest_count
        ↓
UPSERT rsvp
        ↓
Update guest.status
        ↓
Audit if admin action
```

Contoh:

```text
attending
guest_count = 2
```

maka:

```text
guest_count <= max_guest_count
```

harus terpenuhi.

---

# 36. Guest Viewed Tracking

Saat personalized invitation dibuka:

```text
guest.viewed_at = NOW()
guest.view_count += 1
guest.status = viewed
```

Jika guest sudah memiliki RSVP:

```text
guest.status = responded
```

Jangan menurunkan status:

```text
responded → viewed
```

Status harus mengikuti state machine:

```text
invited
   ↓
viewed
   ↓
responded
   ↓
attended
```

RSVP dapat diperbarui tanpa menghapus history jika history ditambahkan di fase berikutnya.

---

# 37. Invitation State Machine

```text
draft
  │
  │ publish
  ▼
published
  │
  │ archive
  ▼
archived
```

Unpublish:

```text
published → draft
```

Archived tidak boleh tampil public.

---

# 38. Migration Strategy

Gunakan Drizzle migrations.

Flow:

```text
schema.ts
   ↓
drizzle-kit generate
   ↓
migration SQL
   ↓
review
   ↓
drizzle-kit migrate
```

Migration harus:

- deterministic
- committed ke Git
- tidak diedit setelah production digunakan kecuali melalui migration baru
- dapat dijalankan pada fresh database

---

# 39. Seed Strategy

Development seed minimal:

```text
1 admin user
1 template
2 themes
1 invitation
1 couple
2 events
3 story items
5 gallery items
2 gifts
5 guests
2 RSVPs
3 wishes
```

Seed tidak boleh menggunakan credential production.

---

# 40. Drizzle Project Structure

Rekomendasi:

```text
src/
├── db/
│   ├── index.ts
│   ├── client.ts
│   ├── schema/
│   │   ├── auth.ts
│   │   ├── invitations.ts
│   │   ├── templates.ts
│   │   ├── themes.ts
│   │   ├── couples.ts
│   │   ├── events.ts
│   │   ├── stories.ts
│   │   ├── assets.ts
│   │   ├── gallery.ts
│   │   ├── gifts.ts
│   │   ├── guests.ts
│   │   ├── rsvps.ts
│   │   ├── wishes.ts
│   │   └── audit.ts
│   │
│   └── seed.ts
│
└── repositories/
    ├── invitations.ts
    ├── guests.ts
    ├── rsvps.ts
    ├── gallery.ts
    └── wishes.ts
```

---

# 41. Drizzle Naming Rules

Database:

```text
snake_case
```

TypeScript:

```text
camelCase
```

Example:

```text
database:
created_at

TypeScript:
createdAt
```

Table names tetap plural:

```text
invitations
guests
rsvps
```

---

# 42. Recommended Drizzle Relations

Conceptual:

```text
users
 └── invitations

invitations
 ├── couple
 ├── events
 ├── stories
 ├── assets
 ├── galleryItems
 ├── gifts
 ├── guests
 └── wishes

guests
 ├── accessTokens
 └── rsvp
```

Relations harus didefinisikan menggunakan Drizzle relations API, tetapi foreign key database tetap menjadi source of truth.

---

# 43. Transaction Boundaries

Gunakan transaction untuk operation yang mengubah beberapa entity yang harus konsisten.

Contoh RSVP:

```text
BEGIN
  UPSERT rsvp
  UPDATE guest status
COMMIT
```

Create invitation:

```text
BEGIN
  create invitation
  create couple
  create initial events
COMMIT
```

Upload asset:

```text
R2 upload
↓
DB metadata insert
```

Jika DB insert gagal setelah R2 upload, lakukan cleanup/compensation.

---

# 44. R2 Asset Lifecycle

```text
Request upload
      ↓
Generate signed URL
      ↓
Browser upload → R2
      ↓
Validate metadata
      ↓
Create asset record
      ↓
Use asset
```

Delete:

```text
Remove reference
      ↓
Mark asset deleted
      ↓
Remove R2 object
```

Jangan menghapus R2 object terlebih dahulu jika object masih direferensikan entity lain.

---

# 45. Data Integrity Rules

Database harus menjaga integrity sebanyak mungkin.

Wajib:

```text
FK constraints
UNIQUE constraints
NOT NULL constraints
CHECK constraints
```

Business validation tetap dilakukan di service layer.

Jangan mengandalkan frontend validation.

---

# 46. Privacy Rules

Sensitive/private data:

```text
users.email
accounts.*
sessions.*
guests.phone
guests.email
guests.notes
audit_logs.ip_address
```

tidak boleh masuk public invitation response.

Public response hanya menggunakan projection yang diperlukan.

---

# 47. Public Invitation Query Contract

Public endpoint sebaiknya menghasilkan struktur seperti:

```json
{
  "slug": "fauzan-indah",
  "title": "Fauzan & Indah",
  "status": "published",
  "template": {},
  "theme": {},
  "couple": {},
  "events": [],
  "story": [],
  "gallery": [],
  "gifts": [],
  "settings": {}
}
```

Jika personalized:

```json
{
  "guest": {
    "displayName": "Bapak Ahmad"
  }
}
```

Tidak boleh:

```json
{
  "ownerId": "...",
  "guestId": "...",
  "accountNumberInternalId": "...",
  "auditLogs": []
}
```

---

# 48. Database Acceptance Criteria

Database implementation dianggap selesai jika:

```text
[ ] Semua table pada dokumen tersedia.
[ ] Semua PK tersedia.
[ ] Semua FK tersedia.
[ ] Semua required NOT NULL tersedia.
[ ] Semua unique constraints tersedia.
[ ] Semua enum tersedia.
[ ] Semua critical index tersedia.
[ ] Tenant isolation dapat diverifikasi.
[ ] Migration dapat dijalankan dari database kosong.
[ ] Seed dapat dijalankan di development.
[ ] Drizzle schema typechecks.
[ ] Repository queries tidak melakukan cross-tenant access.
[ ] Public query tidak expose private fields.
[ ] R2 asset lifecycle memiliki cleanup strategy.
[ ] Transaction digunakan pada multi-write critical flows.
```

---

# 49. OpenCode Implementation Contract

OpenCode harus mengimplementasikan database dalam urutan:

```text
1. Auth schema
2. Enums
3. Templates
4. Themes
5. Invitations
6. Couples
7. Events
8. Stories
9. Assets
10. Gallery
11. Gifts
12. Guests
13. Guest tokens
14. RSVPs
15. Wishes
16. Audit logs
17. Relations
18. Indexes
19. Constraints
20. Seed
21. Migrations
22. Repository tests
```

Setelah implementasi:

```text
schema
 ↓
typecheck
 ↓
migration generation
 ↓
fresh database migration
 ↓
seed
 ↓
repository tests
 ↓
integration tests
```

---

# 50. Schema Change Protocol

Jika OpenCode menemukan kebutuhan schema baru:

```text
Requirement
 ↓
Check DATABASE.md
 ↓
Check existing schema
 ↓
Determine whether existing structure is sufficient
 ↓
If insufficient → architecture review
 ↓
Update DATABASE.md
 ↓
Update Drizzle schema
 ↓
Generate migration
 ↓
Run tests
```

Jangan membuat migration yang tidak tercermin dalam documentation.

---

# 51. Future Tables — Do Not Implement in MVP

Potential future:

```text
rsvp_events
invitation_views
analytics_events
subscriptions
plans
payments
domains
custom_domains
template_versions
template_marketplace
qr_checkins
notifications
webhook_events
api_keys
```

Jangan membuat table tersebut hanya untuk "future proofing".

Buat ketika requirement sudah nyata.

---

# 52. Final Database Architecture

```text
                         PostgreSQL
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   Authentication         Product             Audit
        │                    │                    │
   ┌────┼────┐        ┌──────┼────────┐          │
   │    │    │        │      │        │          │
 users accounts      invitations     templates   audit_logs
       sessions           │           themes
      verifications       │
                          │
          ┌───────────────┼────────────────┐
          │               │                │
       couples          events           stories
          │
          ├────────────── assets
          │                  │
          │             gallery_items
          │
          ├────────────── gifts
          │
          └────────────── guests
                             │
                     ┌───────┼────────┐
                     │       │        │
                  tokens    rsvps    wishes
```

---

# 53. Final Rule

Database adalah **source of truth untuk data**, bukan untuk rendering.

Rendering flow:

```text
PostgreSQL
    ↓
Repository
    ↓
Service
    ↓
Public/Admin ViewModel
    ↓
Astro / React
    ↓
UI
```

Template tidak boleh:

```text
Template
   ↓
Direct Database Query
```

Admin component juga tidak boleh langsung mengakses Drizzle.

Semua access harus melalui service/repository boundary.

**End of DATABASE.md**
