import { z } from 'zod';

export const createStorySchema = z.object({
  yearLabel: z.string().max(20).optional().nullable(),
  storyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  title: z.string().min(1, 'Judul cerita wajib diisi').max(255),
  description: z.string().optional().nullable(),
  imageAssetId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateStorySchema = createStorySchema.partial();

export type CreateStoryInput = z.infer<typeof createStorySchema>;
export type UpdateStoryInput = z.infer<typeof updateStorySchema>;
