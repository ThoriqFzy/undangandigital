#!/bin/bash
# Setup Cloudflare Pages environment variables
# Run this after first deploy
# Usage: ./scripts/setup-env.sh

set -e

echo "🔧 Setting up Cloudflare Pages environment variables..."
echo ""

# Check if wrangler is authenticated
if ! npx wrangler whoami > /dev/null 2>&1; then
  echo "❌ Not authenticated. Run: wrangler login"
  exit 1
fi

# Set secrets
echo "Setting DATABASE_URL..."
npx wrangler pages secret put DATABASE_URL --project-name=wedding-platform

echo "Setting BETTER_AUTH_SECRET..."
npx wrangler pages secret put BETTER_AUTH_SECRET --project-name=wedding-platform

echo "Setting R2_ACCESS_KEY_ID..."
npx wrangler pages secret put R2_ACCESS_KEY_ID --project-name=wedding-platform

echo "Setting R2_SECRET_ACCESS_KEY..."
npx wrangler pages secret put R2_SECRET_ACCESS_KEY --project-name=wedding-platform

echo "Setting R2_ACCOUNT_ID..."
npx wrangler pages secret put R2_ACCOUNT_ID --project-name=wedding-platform

echo "Setting R2_BUCKET_NAME..."
npx wrangler pages secret put R2_BUCKET_NAME --project-name=wedding-platform

echo ""
echo "✅ All environment variables set!"
echo ""
echo "Set PUBLIC_SITE_URL in Cloudflare Dashboard → Pages → Settings → Environment variables"
echo "Example: https://your-domain.com"
