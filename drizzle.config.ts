/**
 * DRIZZLE KIT CONFIGURATION
 * 
 * Run commands:
 *   npx drizzle-kit generate  — generate migration SQL
 *   npx drizzle-kit migrate   — run pending migrations
 *   npx drizzle-kit studio    — open Drizzle Studio
 */

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './backend/db/schema/*',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
