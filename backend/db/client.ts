/**
 * DATABASE CLIENT — Neon PostgreSQL
 * 
 * Centralized connection setup.
 * Uses Neon serverless driver for Cloudflare Workers compatibility.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(databaseUrl);

export const db = drizzle(sql);

export type Database = typeof db;
