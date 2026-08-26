/**
 * STORIES SCHEMA
 * Source of truth: DATABASE.md Section 15
 * 
 * Love story / timeline items.
 */

import { pgTable, uuid, varchar, text, date, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { invitations } from './invitations';

export const stories = pgTable('stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),

  yearLabel: varchar('year_label', { length: 20 }),
  storyDate: date('story_date'),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageAssetId: uuid('image_asset_id'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
