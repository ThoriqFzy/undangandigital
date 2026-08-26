import { z } from 'zod';

export const createGuestSchema = z.object({
  name: z.string().min(1, 'Nama tamu wajib diisi').max(255),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),
  guestGroup: z.string().max(100).optional().nullable(),
  maxGuestCount: z.number().int().min(1).default(1),
  notes: z.string().optional().nullable(),
});

export const updateGuestSchema = createGuestSchema.partial();

export const guestImportSchema = z.array(
  z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    guestGroup: z.string().optional(),
    maxGuestCount: z.number().int().min(1).default(1),
  })
).min(1, 'Minimal 1 tamu');

export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
