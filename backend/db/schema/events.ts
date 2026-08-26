/**
 * EVENTS SCHEMA
 * Source of truth: DATABASE.md Section 14
 * 
 * Wedding events (akad, reception, other).
 */

import { pgTable, uuid, varchar, text, date, time, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { eventTypeEnum } from './enums';
import { invitations } from './invitations';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),

  type: eventTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  eventDate: date('event_date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  timezone: varchar('timezone', { length: 50 }).notNull().default('Asia/Jakarta'),
  venueName: varchar('venue_name', { length: 255 }),
  address: text('address'),
  mapsUrl: text('maps_url'),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
