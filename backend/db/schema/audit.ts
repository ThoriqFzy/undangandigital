/**
 * AUDIT LOGS SCHEMA
 * Source of truth: DATABASE.md Section 23
 * 
 * Audit trail for admin actions.
 * user_id and invitation_id are nullable (for system-level events).
 */

import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { auditActionEnum } from './enums';
import { users } from './auth';
import { invitations } from './invitations';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  invitationId: uuid('invitation_id')
    .references(() => invitations.id, { onDelete: 'set null' }),

  action: auditActionEnum('action').notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata').notNull().default({}),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
