/**
 * POSTBUILD — Prepare dist/client for Cloudflare Pages
 * 
 * After `astro build`, this script:
 * 1. Copies entry.mjs → _worker.js
 * 2. Copies server chunks → dist/client/chunks/
 * 3. Fixes wrangler.json for Pages compatibility
 * 
 * Runs automatically via: "build": "astro build && node scripts/postbuild.mjs"
 */

import { cpSync, rmSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SERVER = join(ROOT, 'dist', 'server');
const CLIENT = join(ROOT, 'dist', 'client');

console.log('🔧 Postbuild: preparing dist/client for Cloudflare Pages...');

// 1. Copy entry.mjs as _worker.js
const entrySrc = join(SERVER, 'entry.mjs');
const workerDst = join(CLIENT, '_worker.js');
if (existsSync(entrySrc)) {
  cpSync(entrySrc, workerDst);
  console.log('  ✓ Copied entry.mjs → _worker.js');
}

// 2. Copy server chunks
const chunksSrc = join(SERVER, 'chunks');
const chunksDst = join(CLIENT, 'chunks');
if (existsSync(chunksSrc)) {
  if (existsSync(chunksDst)) rmSync(chunksDst, { recursive: true });
  cpSync(chunksSrc, chunksDst, { recursive: true });
  console.log(`  ✓ Copied server chunks (${readdirSync(chunksDst).length} files)`);
}

// 3. Copy virtual middleware
const mwSrc = join(SERVER, 'virtual_astro_middleware.mjs');
const mwDst = join(CLIENT, 'virtual_astro_middleware.mjs');
if (existsSync(mwSrc)) {
  cpSync(mwSrc, mwDst);
  console.log('  ✓ Copied virtual_astro_middleware.mjs');
}

// 4. Fix all wrangler.json files for Pages
function fixWrangler(dir) {
  const files = readdirSync(dir, { recursive: true });
  for (const f of files) {
    if (f === 'wrangler.json') {
      const path = join(dir, String(f));
      try {
        const config = JSON.parse(readFileSync(path, 'utf-8'));
        const clean = {
          name: config.name || 'wedding-platform',
          compatibility_date: config.compatibility_date || '2026-08-26',
          compatibility_flags: config.compatibility_flags || ['nodejs_compat'],
        };
        writeFileSync(path, JSON.stringify(clean, null, 2));
      } catch {}
    }
  }
}

import { readdirSync } from 'fs';
fixWrangler(CLIENT);
fixWrangler(SERVER);
console.log('  ✓ Fixed wrangler.json files');

// 5. Count files
const totalFiles = readdirSync(CLIENT, { recursive: true }).length;
console.log(`\n✅ Postbuild complete: ${totalFiles} files in dist/client/`);
