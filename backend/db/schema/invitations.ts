/**
 * INVITATIONS SCHEMA
 * Source of truth: DATABASE.md Section 12
 * 
 * Core tenant/entity. Tenant boundary = invitation_id.
 */

import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { invitationStatusEnum } from './enums';
import { users } from './auth';
import { templates } from './templates';
import { themes } from './themes';

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  templateId: uuid('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'restrict' }),
  themeId: uuid('theme_id')
    .notNull()
    .references(() => themes.id, { onDelete: 'restrict' }),

  slug: varchar('slug', { length: 80 }).notNull().unique(),
  title: varchar('title', { length: 255 }),
  status: invitationStatusEnum('status').notNull().default('draft'),

  settings: jsonb('settings').notNull().default({}),
  themeOverrides: jsonb('theme_overrides').notNull().default({}),

  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
