/**
 * TYPES — Invitation
 * Shared between frontend and backend
 */

import type { InvitationStatus } from '../constants/enum-values';

// ========================================
// CORE INVITATION
// ========================================

export interface Invitation {
  id: string;
  ownerId: string;
  templateId: string;
  themeId: string;
  slug: string;
  title: string | null;
  status: InvitationStatus;
  settings: InvitationSettings;
  themeOverrides: ThemeOverrides;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface InvitationSettings {
  music?: {
    enabled?: boolean;
    assetId?: string;
  };
  opening?: {
    enabled?: boolean;
    buttonText?: string;
    duration?: number;
    wayangAssetId?: string;
    pepohonanAssetId?: string;
    rumahAssetId?: string;
    couplePhotoAssetId?: string;
  };
  showCountdown?: boolean;
  showStory?: boolean;
  showGallery?: boolean;
  showGift?: boolean;
  showRsvp?: boolean;
  showWishes?: boolean;
}

export interface ThemeOverrides {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
  typography?: {
    heading?: string;
    body?: string;
  };
}

// ========================================
// TEMPLATE
// ========================================

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  version: string;
  previewImageUrl: string | null;
  isActive: boolean;
  config: TemplateConfig;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateConfig {
  sections: string[];
  [key: string]: unknown;
}

// ========================================
// THEME
// ========================================

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  config: ThemeConfig;
  previewImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  buttons: {
    radius: string;
  };
  animation: {
    intensity: 'low' | 'medium' | 'high';
  };
  opening?: {
    wayangAssetId?: string;
    pepohonanAssetId?: string;
    rumahAssetId?: string;
    defaultButtonText?: string;
    defaultDuration?: number;
  };
}
