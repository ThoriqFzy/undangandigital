import { z } from 'zod';

export const eventTimezoneSchema = z.string().default('Asia/Jakarta');

export const createEventSchema = z.object({
  type: z.enum(['akad', 'reception', 'other']),
  title: z.string().min(1, 'Judul acara wajib diisi').max(255),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal: YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
  timezone: eventTimezoneSchema,
  venueName: z.string().max(255).optional().nullable(),
  address: z.string().optional().nullable(),
  mapsUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
