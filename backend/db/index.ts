/**
 * SCHEMA INDEX — Export all Drizzle schemas
 * 
 * This is the single entry point for all database schemas.
 * Import from here: import { db, users, invitations } from '@db/index';
 */

// ========================================
// ENUMS
// ========================================
export {
  invitationStatusEnum,
  eventTypeEnum,
  assetTypeEnum,
  guestStatusEnum,
  rsvpStatusEnum,
  wishStatusEnum,
  giftTypeEnum,
  auditActionEnum,
} from './schema/enums';

// ========================================
// TABLES
// ========================================
export { users, accounts, sessions, verifications } from './schema/auth';
export { templates } from './schema/templates';
export { themes } from './schema/themes';
export { invitations } from './schema/invitations';
export { couples } from './schema/couples';
export { events } from './schema/events';
export { stories } from './schema/stories';
export { assets } from './schema/assets';
export { galleryItems } from './schema/gallery';
export { gifts } from './schema/gifts';
export { guests } from './schema/guests';
export { guestAccessTokens } from './schema/tokens';
export { rsvps } from './schema/rsvps';
export { wishes } from './schema/wishes';
export { auditLogs } from './schema/audit';

// ========================================
// RELATIONS
// ========================================
export {
  usersRelations,
  templatesRelations,
  themesRelations,
  invitationsRelations,
  couplesRelations,
  eventsRelations,
  storiesRelations,
  assetsRelations,
  galleryItemsRelations,
  giftsRelations,
  guestsRelations,
  guestAccessTokensRelations,
  rsvpsRelations,
  wishesRelations,
  auditLogsRelations,
} from './relations';
