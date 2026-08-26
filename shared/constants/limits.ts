/**
 * LIMITS & CONSTRAINTS
 * Source of truth: DATABASE.md, PRD.md
 */

export const LIMITS = {
  // Invitation
  SLUG_MIN_LENGTH: 2,
  SLUG_MAX_LENGTH: 80,
  TITLE_MAX_LENGTH: 255,

  // Guest
  GUEST_NAME_MAX_LENGTH: 255,
  GUEST_PHONE_MAX_LENGTH: 20,
  GUEST_EMAIL_MAX_LENGTH: 255,
  GUEST_GROUP_MAX_LENGTH: 100,
  GUEST_MAX_COUNT_MIN: 1,
  GUEST_MAX_COUNT_MAX: 10,

  // RSVP
  RSVP_MESSAGE_MAX_LENGTH: 1000,
  RSVP_GUEST_COUNT_MIN: 1,
  RSVP_GUEST_COUNT_MAX: 10,

  // Wish
  WISH_MESSAGE_MAX_LENGTH: 2000,

  // Gift
  BANK_NAME_MAX_LENGTH: 100,
  ACCOUNT_NUMBER_MAX_LENGTH: 50,

  // Upload
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
