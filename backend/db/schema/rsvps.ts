/**
 * RSVPS SCHEMA
 * Source of truth: DATABASE.md Section 21
 * 
 * Current RSVP state per guest (1:1 with guest_id UNIQUE).
 * MVP: one active RSVP per guest.
 */

import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { rsvpStatusEnum } from './enums';
import { invitations } from './invitations';
import { guests } from './guests';

export const rsvps = pgTable('rsvps', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),
  guestId: uuid('guest_id')
    .notNull()
    .unique()
    .references(() => guests.id, { onDelete: 'cascade' }),

  status: rsvpStatusEnum('status').notNull(),
  guestCount: integer('guest_count').notNull().default(1),
  message: text('message'),

  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
