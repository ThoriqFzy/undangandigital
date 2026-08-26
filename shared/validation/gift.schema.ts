import { z } from 'zod';

export const createGiftSchema = z.object({
  type: z.enum(['bank', 'ewallet', 'address', 'other']),
  label: z.string().max(255).optional().nullable(),
  bankName: z.string().max(100).optional().nullable(),
  accountNumber: z.string().max(50).optional().nullable(),
  accountHolder: z.string().max(255).optional().nullable(),
  ewalletProvider: z.string().max(100).optional().nullable(),
  ewalletNumber: z.string().max(50).optional().nullable(),
  recipientName: z.string().max(255).optional().nullable(),
  address: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateGiftSchema = createGiftSchema.partial();

export type CreateGiftInput = z.infer<typeof createGiftSchema>;
export type UpdateGiftInput = z.infer<typeof updateGiftSchema>;
