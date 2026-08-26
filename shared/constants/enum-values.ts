/**
 * ENUM VALUES — Shared across frontend & backend
 * Source: DATABASE.md enum definitions
 */

// ========================================
// INVITATION
// ========================================

export const INVITATION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type InvitationStatus = typeof INVITATION_STATUS[keyof typeof INVITATION_STATUS];

// ========================================
// EVENT
// ========================================

export const EVENT_TYPE = {
  AKAD: 'akad',
  RECEPTION: 'reception',
  OTHER: 'other',
} as const;

export type EventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];

// ========================================
// ASSET
// ========================================

export const ASSET_TYPE = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  OTHER: 'other',
} as const;

export type AssetType = typeof ASSET_TYPE[keyof typeof ASSET_TYPE];

// ========================================
// GUEST
// ========================================

export const GUEST_STATUS = {
  INVITED: 'invited',
  VIEWED: 'viewed',
  RESPONDED: 'responded',
  ATTENDED: 'attended',
} as const;

export type GuestStatus = typeof GUEST_STATUS[keyof typeof GUEST_STATUS];

// ========================================
// RSVP
// ========================================

export const RSVP_STATUS = {
  ATTENDING: 'attending',
  NOT_ATTENDING: 'not_attending',
  MAYBE: 'maybe',
} as const;

export type RsvpStatus = typeof RSVP_STATUS[keyof typeof RSVP_STATUS];

// ========================================
// WISH
// ========================================

export const WISH_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  HIDDEN: 'hidden',
} as const;

export type WishStatus = typeof WISH_STATUS[keyof typeof WISH_STATUS];

// ========================================
// GIFT
// ========================================

export const GIFT_TYPE = {
  BANK: 'bank',
  EWALLET: 'ewallet',
  ADDRESS: 'address',
  OTHER: 'other',
} as const;

export type GiftType = typeof GIFT_TYPE[keyof typeof GIFT_TYPE];

// ========================================
// AUDIT
// ========================================

export const AUDIT_ACTION = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  PUBLISH: 'publish',
  UNPUBLISH: 'unpublish',
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPLOAD: 'upload',
  EXPORT: 'export',
} as const;

export type AuditAction = typeof AUDIT_ACTION[keyof typeof AUDIT_ACTION];
