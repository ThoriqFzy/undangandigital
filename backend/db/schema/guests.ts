/**
 * GUESTS SCHEMA
 * Source of truth: DATABASE.md Section 19
 * 
 * Guest list for each invitation.
 */

import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { guestStatusEnum } from './enums';
import { invitations } from './invitations';

export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  guestGroup: varchar('guest_group', { length: 100 }),
  maxGuestCount: integer('max_guest_count').notNull().default(1),
  status: guestStatusEnum('status').notNull().default('invited'),
  notes: text('notes'),
  viewedAt: timestamp('viewed_at', { withTimezone: true }),
  viewCount: integer('view_count').notNull().default(0),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
