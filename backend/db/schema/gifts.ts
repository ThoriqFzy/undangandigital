/**
 * GIFTS SCHEMA
 * Source of truth: DATABASE.md Section 18
 * 
 * Wedding gift information (bank transfer, e-wallet, address).
 */

import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { giftTypeEnum } from './enums';
import { invitations } from './invitations';

export const gifts = pgTable('gifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .references(() => invitations.id, { onDelete: 'cascade' }),

  type: giftTypeEnum('type').notNull(),
  label: varchar('label', { length: 255 }),
  bankName: varchar('bank_name', { length: 100 }),
  accountNumber: varchar('account_number', { length: 50 }),
  accountHolder: varchar('account_holder', { length: 255 }),
  ewalletProvider: varchar('ewallet_provider', { length: 100 }),
  ewalletNumber: varchar('ewallet_number', { length: 50 }),
  recipientName: varchar('recipient_name', { length: 255 }),
  address: text('address'),
  instructions: text('instructions'),
  sortOrder: integer('sort_order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
