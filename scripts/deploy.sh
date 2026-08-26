#!/bin/bash
# Deploy to Cloudflare Pages
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Building for production..."
npm run build

echo "📦 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist/ --project-name=wedding-platform

echo "✅ Deploy complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Cloudflare Dashboard"
echo "2. Configure custom domain (optional)"
