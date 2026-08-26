/**
 * INDEXES — Database index definitions
 * Source of truth: DATABASE.md Section 28
 * 
 * Only critical indexes. Not every column needs an index.
 */

import { index } from 'drizzle-orm/pg-core';
import { users } from './schema/auth';
import { sessions } from './schema/auth';
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
import { auditLogs } from './schema/audit';

// ========================================
// AUTH INDEXES
// ========================================
export const usersEmailIdx = index('users_email_unique').on(users.email);
export const sessionsTokenIdx = index('sessions_token_unique').on(sessions.token);
export const sessionsUserIdIdx = index('sessions_user_id_idx').on(sessions.userId);
export const sessionsExpiresAtIdx = index('sessions_expires_at_idx').on(sessions.expiresAt);

// ========================================
// INVITATION INDEXES
// ========================================
export const invitationsOwnerIdIdx = index('invitations_owner_id_idx').on(invitations.ownerId);
export const invitationsStatusIdx = index('invitations_status_idx').on(invitations.status);

// ========================================
// COUPLE INDEXES
// ========================================
export const couplesInvitationIdIdx = index('couples_invitation_id_idx').on(couples.invitationId);

// ========================================
// EVENT INDEXES
// ========================================
export const eventsInvitationIdIdx = index('events_invitation_id_idx').on(events.invitationId);
export const eventsInvitationSortIdx = index('events_invitation_sort_idx').on(events.invitationId, events.sortOrder);

// ========================================
// STORY INDEXES
// ========================================
export const storiesInvitationIdIdx = index('stories_invitation_id_idx').on(stories.invitationId);
export const storiesInvitationSortIdx = index('stories_invitation_sort_idx').on(stories.invitationId, stories.sortOrder);

// ========================================
// ASSET INDEXES
// ========================================
export const assetsInvitationIdIdx = index('assets_invitation_id_idx').on(assets.invitationId);
export const assetsTypeIdx = index('assets_type_idx').on(assets.type);

// ========================================
// GALLERY INDEXES
// ========================================
export const galleryInvitationIdIdx = index('gallery_invitation_id_idx').on(galleryItems.invitationId);
export const galleryInvitationSortIdx = index('gallery_invitation_sort_idx').on(galleryItems.invitationId, galleryItems.sortOrder);

// ========================================
// GIFT INDEXES
// ========================================
export const giftsInvitationIdIdx = index('gifts_invitation_id_idx').on(gifts.invitationId);
export const giftsInvitationSortIdx = index('gifts_invitation_sort_idx').on(gifts.invitationId, gifts.sortOrder);

// ========================================
// GUEST INDEXES
// ========================================
export const guestsInvitationIdIdx = index('guests_invitation_id_idx').on(guests.invitationId);
export const guestsInvitationStatusIdx = index('guests_invitation_status_idx').on(guests.invitationId, guests.status);
export const guestsInvitationNameIdx = index('guests_invitation_name_idx').on(guests.invitationId, guests.name);

// ========================================
// GUEST TOKEN INDEXES
// ========================================
export const guestTokensGuestIdIdx = index('guest_tokens_guest_id_idx').on(guestAccessTokens.guestId);

// ========================================
// RSVP INDEXES
// ========================================
export const rsvpsInvitationIdIdx = index('rsvps_invitation_id_idx').on(rsvps.invitationId);
export const rsvpsStatusIdx = index('rsvps_status_idx').on(rsvps.status);

// ========================================
// WISH INDEXES
// ========================================
export const wishesInvitationIdIdx = index('wishes_invitation_id_idx').on(wishes.invitationId);
export const wishesStatusIdx = index('wishes_status_idx').on(wishes.status);
export const wishesCreatedAtIdx = index('wishes_created_at_idx').on(wishes.createdAt);

// ========================================
// AUDIT LOG INDEXES
// ========================================
export const auditLogsUserIdIdx = index('audit_logs_user_id_idx').on(auditLogs.userId);
export const auditLogsInvitationIdIdx = index('audit_logs_invitation_id_idx').on(auditLogs.invitationId);
export const auditLogsCreatedAtIdx = index('audit_logs_created_at_idx').on(auditLogs.createdAt);
