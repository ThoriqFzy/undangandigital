# REVIEW GUIDE — Wedding Invitation Platform

## Cara Review

### 1. Jalankan Dev Server
```bash
cd /home/hermes/project/undangandigital
npm run dev
```
Buka: http://localhost:4321

### 2. Review Public Pages (Yang dilihat tamu)

| Halaman | URL | Yang Dicek |
|---------|-----|------------|
| Home | / | Landing page, tombol CTA |
| Undangan | /fauzan-indah | Cover, quote, couple, countdown, events, story, gift, rsvp, wishes, closing |
| API | /api/invitation/fauzan-indah | Response JSON valid |

### 3. Review Admin Pages (Yang dilihat admin)

| Halaman | URL | Yang Dicek |
|---------|-----|------------|
| Login | /admin/login | Form email+password |
| Register | /admin/register | Form buat akun baru |
| Dashboard | /admin | Stat cards, quick actions |
| Undangan | /admin/invitations | List undangan |
| Tamu | /admin/guests | Tabel tamu |
| RSVP | /admin/rsvp | Konfirmasi kehadiran |
| Ucapan | /admin/wishes | Moderasi ucapan |
| Acara | /admin/events | Daftar acara |
| Cerita | /admin/stories | Love story |
| Hadiah | /admin/gifts | Rekening bank |
| Pengaturan | /admin/settings | Info database |

### 4. Review Database
- 18 tables sudah ada di Neon
- Seed data: "Fauzan & Indah" invitation

### 5. Review Code Structure
```
project/undangandigital/
├── frontend/          → Pages, components, layouts, styles
├── backend/           → Lib, DB, repos, services, middleware, media, auth
├── shared/            → Types, validation (Zod), constants, utils
├── templates/         → Classic template engine
└── docs/              → PRD, ARCHITECTURE, DATABASE, REFERENCE
```

## Checklist Review

### Visual (Buka browser)
- [ ] Cover: Nama mempelai muncul, tanggal benar, tombol "Buka Undangan" jalan
- [ ] Quote: Ayat Quran muncul dengan ornamental
- [ ] Couple: Foto placeholder (arch shape), nama orang tua
- [ ] Countdown: Timer berjalan mundur
- [ ] Events: 2 card (Akad + Resepsi) dengan tanggal, waktu, lokasi
- [ ] Story: Timeline 3 item dengan tahun
- [ ] Gift: 2 rekening bank dengan tombol "Salin"
- [ ] RSVP: Form bisa dipilih (Hadir/Tidak/Ragu)
- [ ] Wishes: List ucapan muncul
- [ ] Closing: Pesan penutup

### Admin (Login dulu)
- [ ] Login/Register form jalan
- [ ] Dashboard: 4 stat cards muncul dengan angka benar
- [ ] Navigasi sidebar: semua link jalan
- [ ] Mobile: sidebar collapsible

### Database
- [ ] 18 tables ada
- [ ] Seed data benar

### Code Quality
- [ ] Build passes (npx astro build)
- [ ] No TypeScript errors
- [ ] Import paths pakai @aliases (bukan relative)
- [ ] Error handling konsisten (AppError → errorResponse)
