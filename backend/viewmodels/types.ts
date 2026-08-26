/**
 * VIEW MODEL TYPES
 * Source of truth: ARCHITECTURE.md Section 44
 * 
 * Public DTO must be strictly smaller than admin DTO.
 * Never expose: owner_id, audit_logs, sessions, credentials, raw tokens.
 */

import type { Invitation, ThemeConfig } from '../../shared/types/invitation';
import type { Couple } from '../../shared/types/couple';
import type { WeddingEvent } from '../../shared/types/event';
import type { Story, Guest, Rsvp, Wish, Gift, GalleryItem, Asset } from '../../shared/types/index';

// ========================================
// PUBLIC VIEW MODEL (what guests see)
// ========================================
export interface InvitationPublicVM {
  slug: string;
  title: string | null;
  template: {
    slug: string;
    name: string;
    config: unknown;
  };
  theme: {
    config: ThemeConfig;
  };
  couple: {
    groomName: string;
    groomNickname: string | null;
    groomPhotoUrl: string | null;
    groomFatherName: string | null;
    groomMotherName: string | null;
    brideName: string;
    brideNickname: string | null;
    bridePhotoUrl: string | null;
    brideFatherName: string | null;
    brideMotherName: string | null;
  } | null;
  events: Array<{
    type: string;
    title: string;
    eventDate: string;
    startTime: string | null;
    endTime: string | null;
    timezone: string;
    venueName: string | null;
    address: string | null;
    mapsUrl: string | null;
  }>;
  stories: Array<{
    yearLabel: string | null;
    title: string;
    description: string | null;
    imageUrl: string | null;
  }>;
  gallery: Array<{
    imageUrl: string;
    thumbUrl: string;
    caption: string | null;
    altText: string | null;
  }>;
  gifts: Array<{
    type: string;
    label: string | null;
    bankName: string | null;
    accountNumber: string | null;
    accountHolder: string | null;
    ewalletProvider: string | null;
    ewalletNumber: string | null;
    recipientName: string | null;
    address: string | null;
    instructions: string | null;
  }>;
  wishes: Array<{
    name: string;
    message: string;
    createdAt: string;
  }>;
  settings: {
    music: { enabled: boolean };
    showCountdown: boolean;
    showStory: boolean;
    showGallery: boolean;
    showGift: boolean;
    showRsvp: boolean;
    showWishes: boolean;
  };
  guest?: {
    displayName: string;
    maxGuestCount: number;
  };
}

// ========================================
// ADMIN VIEW MODEL (what owner sees)
// ========================================
export interface InvitationAdminVM {
  id: string;
  slug: string;
  title: string | null;
  status: 'draft' | 'published' | 'archived';
  template: { id: string; slug: string; name: string; version: string };
  theme: { id: string; slug: string; name: string; config: ThemeConfig };
  couple: Couple | null;
  events: WeddingEvent[];
  stories: Story[];
  gallery: GalleryItem[];
  gifts: Gift[];
  guestCount: number;
  rsvpStats: { attending: number; notAttending: number; maybe: number; pending: number };
  wishCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// DASHBOARD OVERVIEW
// ========================================
export interface DashboardOverview {
  totalInvitations: number;
  published: number;
  draft: number;
  totalGuests: number;
  rsvpAccepted: number;
  rsvpDeclined: number;
  pendingRsvp: number;
  totalWishes: number;
}
