/**
 * DRIZZLE RELATIONS
 * Source of truth: DATABASE.md Entity Relationship Overview
 * 
 * Defines all Drizzle relations for type-safe queries.
 * Foreign key database constraints remain the source of truth.
 */

import { relations } from 'drizzle-orm';
import { users } from './schema/auth';
import { invitations } from './schema/invitations';
import { couples } from './schema/couples';
import { events } from './schema/events';
import { stories } from './schema/stories';
import { assets } from './schema/assets';
import { galleryItems } from './schema/gallery';
import { gifts } from './schema/gifts';
import { guests } from './schema/guests';
import { guestAccessTokens } from './schema/tokens';
import { rsvps } from './schema/rsvps';
import { wishes } from './schema/wishes';
import { templates } from './schema/templates';
import { themes } from './schema/themes';
import { auditLogs } from './schema/audit';

// ========================================
// USERS
// ========================================
export const usersRelations = relations(users, ({ many }) => ({
  invitations: many(invitations),
  auditLogs: many(auditLogs),
}));

// ========================================
// TEMPLATES
// ========================================
export const templatesRelations = relations(templates, ({ many }) => ({
  invitations: many(invitations),
}));

// ========================================
// THEMES
// ========================================
export const themesRelations = relations(themes, ({ many }) => ({
  invitations: many(invitations),
}));

// ========================================
// INVITATIONS
// ========================================
export const invitationsRelations = relations(invitations, ({ one, many }) => ({
  owner: one(users, {
    fields: [invitations.ownerId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [invitations.templateId],
    references: [templates.id],
  }),
  theme: one(themes, {
    fields: [invitations.themeId],
    references: [themes.id],
  }),
  couple: one(couples),
  events: many(events),
  stories: many(stories),
  assets: many(assets),
  galleryItems: many(galleryItems),
  gifts: many(gifts),
  guests: many(guests),
  wishes: many(wishes),
  auditLogs: many(auditLogs),
}));

// ========================================
// COUPLES
// ========================================
export const couplesRelations = relations(couples, ({ one }) => ({
  invitation: one(invitations, {
    fields: [couples.invitationId],
    references: [invitations.id],
  }),
}));

// ========================================
// EVENTS
// ========================================
export const eventsRelations = relations(events, ({ one }) => ({
  invitation: one(invitations, {
    fields: [events.invitationId],
    references: [invitations.id],
  }),
}));

// ========================================
// STORIES
// ========================================
export const storiesRelations = relations(stories, ({ one }) => ({
  invitation: one(invitations, {
    fields: [stories.invitationId],
    references: [invitations.id],
  }),
}));

// ========================================
// ASSETS
// ========================================
export const assetsRelations = relations(assets, ({ one, many }) => ({
  invitation: one(invitations, {
    fields: [assets.invitationId],
    references: [invitations.id],
  }),
  galleryItems: many(galleryItems),
}));

// ========================================
// GALLERY ITEMS
// ========================================
export const galleryItemsRelations = relations(galleryItems, ({ one }) => ({
  invitation: one(invitations, {
    fields: [galleryItems.invitationId],
    references: [invitations.id],
  }),
  asset: one(assets, {
    fields: [galleryItems.assetId],
    references: [assets.id],
  }),
}));

// ========================================
// GIFTS
// ========================================
export const giftsRelations = relations(gifts, ({ one }) => ({
  invitation: one(invitations, {
    fields: [gifts.invitationId],
    references: [invitations.id],
  }),
}));

// ========================================
// GUESTS
// ========================================
export const guestsRelations = relations(guests, ({ one, many }) => ({
  invitation: one(invitations, {
    fields: [guests.invitationId],
    references: [invitations.id],
  }),
  accessTokens: many(guestAccessTokens),
  rsvp: one(rsvps),
}));

// ========================================
// GUEST ACCESS TOKENS
// ========================================
export const guestAccessTokensRelations = relations(guestAccessTokens, ({ one }) => ({
  guest: one(guests, {
    fields: [guestAccessTokens.guestId],
    references: [guests.id],
  }),
}));

// ========================================
// RSVPS
// ========================================
export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  invitation: one(invitations, {
    fields: [rsvps.invitationId],
    references: [invitations.id],
  }),
  guest: one(guests, {
    fields: [rsvps.guestId],
    references: [guests.id],
  }),
}));

// ========================================
// WISHES
// ========================================
export const wishesRelations = relations(wishes, ({ one }) => ({
  invitation: one(invitations, {
    fields: [wishes.invitationId],
    references: [invitations.id],
  }),
  guest: one(guests, {
    fields: [wishes.guestId],
    references: [guests.id],
  }),
}));

// ========================================
// AUDIT LOGS
// ========================================
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  invitation: one(invitations, {
    fields: [auditLogs.invitationId],
    references: [invitations.id],
  }),
}));
