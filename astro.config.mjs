// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  // srcDir points to frontend/ — pages, layouts, components all live here
  // backend/, shared/, templates/ are outside Astro's src and accessed via tsconfig paths
  srcDir: './frontend',
  output: 'server',
  adapter: cloudflare(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@frontend': path.resolve('./frontend'),
        '@backend': path.resolve('./backend'),
        '@shared': path.resolve('./shared'),
        '@templates': path.resolve('./templates'),
        '@components': path.resolve('./frontend/components'),
        '@layouts': path.resolve('./frontend/layouts'),
        '@db': path.resolve('./backend/db'),
        '@services': path.resolve('./backend/services'),
        '@repos': path.resolve('./backend/repositories'),
        '@lib': path.resolve('./backend/lib'),
      },
    },
  },
});
