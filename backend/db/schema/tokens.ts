/**
 * GUEST ACCESS TOKENS SCHEMA
 * Source of truth: DATABASE.md Section 20
 * 
 * Opaque token for personalized invitation.
 * Raw token is NOT stored. Only SHA-256 hash.
 */

import { pgTable, uuid, char, timestamp } from 'drizzle-orm/pg-core';
import { guests } from './guests';

export const guestAccessTokens = pgTable('guest_access_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  guestId: uuid('guest_id')
    .notNull()
    .references(() => guests.id, { onDelete: 'cascade' }),

  tokenHash: char('token_hash', { length: 64 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
});
