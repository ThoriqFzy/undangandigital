import { z } from 'zod';

export const submitWishSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(255),
  message: z.string().min(1, 'Ucapan wajib diisi').max(2000),
});

export const moderateWishSchema = z.object({
  status: z.enum(['approved', 'hidden']),
});

export type SubmitWishInput = z.infer<typeof submitWishSchema>;
export type ModerateWishInput = z.infer<typeof moderateWishSchema>;
