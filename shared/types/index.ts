/**
 * TYPES — Guest, RSVP, Wish, Asset, Story, Gift
 * Shared between frontend and backend
 */

import type { GuestStatus, RsvpStatus, WishStatus, GiftType, AssetType } from '../constants/enum-values';

// ========================================
// GUEST
// ========================================

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  phone: string | null;
  email: string | null;
  guestGroup: string | null;
  maxGuestCount: number;
  status: GuestStatus;
  notes: string | null;
  viewedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ========================================
// RSVP
// ========================================

export interface Rsvp {
  id: string;
  invitationId: string;
  guestId: string;
  status: RsvpStatus;
  guestCount: number;
  message: string | null;
  submittedAt: string;
  updatedAt: string;
}

// ========================================
// WISH
// ========================================

export interface Wish {
  id: string;
  invitationId: string;
  guestId: string | null;
  name: string;
  message: string;
  status: WishStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ========================================
// ASSET
// ========================================

export interface Asset {
  id: string;
  invitationId: string;
  type: AssetType;
  objectKey: string;
  originalFilename: string | null;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  altText: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ========================================
// STORY
// ========================================

export interface Story {
  id: string;
  invitationId: string;
  yearLabel: string | null;
  storyDate: string | null;
  title: string;
  description: string | null;
  imageAssetId: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// GIFT
// ========================================

export interface Gift {
  id: string;
  invitationId: string;
  type: GiftType;
  label: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  ewalletProvider: string | null;
  ewalletNumber: string | null;
  recipientName: string | null;
  address: string | null;
  instructions: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// GALLERY ITEM
// ========================================

export interface GalleryItem {
  id: string;
  invitationId: string;
  assetId: string;
  caption: string | null;
  altText: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// GUEST ACCESS TOKEN
// ========================================

export interface GuestAccessToken {
  id: string;
  guestId: string;
  tokenHash: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
}
