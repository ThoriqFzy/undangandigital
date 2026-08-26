/**
 * WISHES SCHEMA
 * Source of truth: DATABASE.md Section 22
 * 
 * Wedding wishes / guest messages.
 * guest_id is nullable (guest can wish without personalized token).
 */

import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { wishStatusEnum } from './enums';
import { invitations } from './invitations';
import { guests } from './guests';

export const wishes = pgTable('wishes', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),
  guestId: uuid('guest_id')
    .references(() => guests.id, { onDelete: 'set null' }),

  name: varchar('name', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: wishStatusEnum('status').notNull().default('pending'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
