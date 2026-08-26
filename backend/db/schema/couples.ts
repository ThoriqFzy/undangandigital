/**
 * COUPLES SCHEMA
 * Source of truth: DATABASE.md Section 13
 * 
 * One couple profile per invitation (1:1).
 */

import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { invitations } from './invitations';

export const couples = pgTable('couples', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id')
    .notNull()
    .unique()
    .references(() => invitations.id, { onDelete: 'cascade' }),

  groomName: varchar('groom_name', { length: 255 }).notNull(),
  groomNickname: varchar('groom_nickname', { length: 100 }),
  groomPhotoAssetId: uuid('groom_photo_asset_id'),
  groomFatherName: varchar('groom_father_name', { length: 255 }),
  groomMotherName: varchar('groom_mother_name', { length: 255 }),
  groomSocialLinks: jsonb('groom_social_links').notNull().default({}),

  brideName: varchar('bride_name', { length: 255 }).notNull(),
  brideNickname: varchar('bride_nickname', { length: 100 }),
  bridePhotoAssetId: uuid('bride_photo_asset_id'),
  brideFatherName: varchar('bride_father_name', { length: 255 }),
  brideMotherName: varchar('bride_mother_name', { length: 255 }),
  brideSocialLinks: jsonb('bride_social_links').notNull().default({}),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
