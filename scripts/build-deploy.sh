#!/bin/bash
# Build and deploy to Cloudflare Pages
# Usage: ./scripts/build-deploy.sh
set -e

echo "🔧 Cleaning previous build..."
rm -rf dist .wrangler

echo "📦 Building project..."
npx astro build

echo "🔧 Preparing _worker.js for Cloudflare Pages..."
# Copy server entry as _worker.js for Pages Functions
cp dist/server/entry.mjs dist/client/_worker.js
# Copy server chunks to client (imported by _worker.js)
cp -r dist/server/chunks dist/client/
# Copy virtual middleware
cp dist/server/virtual_astro_middleware.mjs dist/client/ 2>/dev/null || true

echo "🔧 Fixing wrangler.json files..."
find dist -name "wrangler.json" -exec python3 -c "
import json, sys
for f in sys.argv[1:]:
    try:
        with open(f) as fh: config = json.load(fh)
        clean = {'name': config.get('name', 'wedding-platform'), 'compatibility_date': config.get('compatibility_date', '2026-08-26'), 'compatibility_flags': config.get('compatibility_flags', ['nodejs_compat'])}
        with open(f, 'w') as fh: json.dump(clean, fh, indent=2)
        print(f'  Fixed: {f}')
    except: pass
" {} +

echo "🚀 Deploying to Cloudflare Pages..."
export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN}"
npx wrangler pages deploy dist/client --project-name=wedding-platform --branch=main

echo ""
echo "✅ Deploy complete!"
echo "   URL: https://wedding-platform-83z.pages.dev"
