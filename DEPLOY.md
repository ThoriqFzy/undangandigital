# DEPLOYMENT GUIDE — Cloudflare Pages

## Status
- Build: ✓ PASS
- Wrangler: Installed (v4.126.0)
- Auth: Belum login (butuh perintah `wrangler login`)

## Cara Deploy

### Step 1: Login Cloudflare
```bash
cd /home/hermes/project/undangandigital
wrangler login
```
Ini akan buka browser. Login dengan akun Cloudflare Mas.

### Step 2: Deploy
```bash
npm run deploy
```
Atau:
```bash
wrangler pages deploy dist/ --project-name=wedding-platform
```

### Step 3: Set Environment Variables
Buka Cloudflare Dashboard → Pages → wedding-platform → Settings → Environment variables:

| Variable | Value |
|----------|-------|
| DATABASE_URL | postgresql://neondb_owner:***@ep-fancy-wildflower-azc6xewt-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require |
| BETTER_AUTH_SECRET | (generate random 32 char string) |
| R2_ACCOUNT_ID | (your Cloudflare Account ID) |
| R2_ACCESS_KEY_ID | (your R2 API Token Access Key ID) |
| R2_SECRET_ACCESS_KEY | (your R2 API Token Secret Access Key) |
| R2_BUCKET_NAME | wedding-assets |
| PUBLIC_SITE_URL | (URL dari Cloudflare Pages, contoh: https://wedding-platform.pages.dev) |

> **⚠️ SECURITY**: Jangan pernah commit credential asli ke repository. Gunakan Cloudflare Pages **Encrypted Environment Variables** (Settings → Environment variables → Add → "Encrypt"). R2 credentials dibuat via Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token (Object Read & Write permission).

### Step 4: Custom Domain (Optional)
Cloudflare Dashboard → Pages → wedding-platform → Custom domains → Add domain

## Troubleshooting

### Build Error
```bash
npm run build  # Cek error lokal dulu
```

### Database Connection Error
Pastikan Neon database allow Cloudflare IP ranges (biasanya sudah default).

### R2 Upload Error
Pastikan R2 bucket sudah dibuat dan API token punya permission Object Read & Write.

## URLs Setelah Deploy
- Preview: https://preview.wedding-platform.pages.dev
- Production: https://wedding-platform.pages.dev
- Custom: https://domain-mas.com (setelah setup)
