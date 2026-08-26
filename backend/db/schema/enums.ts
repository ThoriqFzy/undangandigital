/**
 * ENUMS — PostgreSQL enum definitions
 * Source of truth: DATABASE.md Section 5
 * 
 * Using pgEnum from Drizzle for type-safe enums.
 */

import { pgEnum } from 'drizzle-orm/pg-core';

// ========================================
// INVITATION STATUS
// ========================================
export const invitationStatusEnum = pgEnum('invitation_status', [
  'draft',
  'published',
  'archived',
]);

// ========================================
// EVENT TYPE
// ========================================
export const eventTypeEnum = pgEnum('event_type', [
  'akad',
  'reception',
  'other',
]);

// ========================================
// ASSET TYPE
// ========================================
export const assetTypeEnum = pgEnum('asset_type', [
  'image',
  'audio',
  'video',
  'other',
]);

// ========================================
// GUEST STATUS
// ========================================
export const guestStatusEnum = pgEnum('guest_status', [
  'invited',
  'viewed',
  'responded',
  'attended',
]);

// ========================================
// RSVP STATUS
// ========================================
export const rsvpStatusEnum = pgEnum('rsvp_status', [
  'attending',
  'not_attending',
  'maybe',
]);

// ========================================
// WISH STATUS
// ========================================
export const wishStatusEnum = pgEnum('wish_status', [
  'pending',
  'approved',
  'hidden',
]);

// ========================================
// GIFT TYPE
// ========================================
export const giftTypeEnum = pgEnum('gift_type', [
  'bank',
  'ewallet',
  'address',
  'other',
]);

// ========================================
// AUDIT ACTION
// ========================================
export const auditActionEnum = pgEnum('audit_action', [
  'create',
  'update',
  'delete',
  'publish',
  'unpublish',
  'login',
  'logout',
  'upload',
  'export',
]);
