/**
 * ASSETS SCHEMA
 * Source of truth: DATABASE.md Section 16
 * 
 * Media metadata. Binary stored in R2, metadata in PostgreSQL.
 */

import { pgTable, uuid, varchar, text, bigint, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { assetTypeEnum } from './enums';
import { invitations } from './invitations';

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),

  type: assetTypeEnum('type').notNull(),
  objectKey: text('object_key').notNull().unique(),
  originalFilename: text('original_filename'),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  width: integer('width'),
  height: integer('height'),
  durationMs: integer('duration_ms'),
  altText: text('alt_text'),
  metadata: jsonb('metadata').notNull().default({}),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
