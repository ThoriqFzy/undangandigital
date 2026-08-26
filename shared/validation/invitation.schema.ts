/**
 * INVITATION VALIDATION SCHEMAS
 * Used by BOTH frontend (client) and backend (server).
 */

import { z } from 'zod';

// Slug: lowercase, ASCII, 2-80 chars
export const slugSchema = z
  .string()
  .min(2, 'Slug minimal 2 karakter')
  .max(80, 'Slug maksimal 80 karakter')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan dash');

// Invitation settings
export const invitationSettingsSchema = z.object({
  music: z.object({
    enabled: z.boolean().default(false),
    assetId: z.string().uuid().optional(),
  }).default({ enabled: false }),
  showCountdown: z.boolean().default(true),
  showStory: z.boolean().default(true),
  showGallery: z.boolean().default(true),
  showGift: z.boolean().default(true),
  showRsvp: z.boolean().default(true),
  showWishes: z.boolean().default(true),
});

// Create invitation
export const createInvitationSchema = z.object({
  slug: slugSchema,
  title: z.string().max(255).optional(),
  templateId: z.string().uuid('Template harus dipilih'),
  themeId: z.string().uuid('Theme harus dipilih'),
  settings: invitationSettingsSchema.optional(),
});

// Update invitation
export const updateInvitationSchema = z.object({
  slug: slugSchema.optional(),
  title: z.string().max(255).optional(),
  templateId: z.string().uuid().optional(),
  themeId: z.string().uuid().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  settings: invitationSettingsSchema.optional(),
  themeOverrides: z.record(z.unknown()).optional(),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
