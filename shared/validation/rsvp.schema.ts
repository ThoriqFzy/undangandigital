import { z } from 'zod';

export const rsvpStatusEnum = z.enum(['attending', 'not_attending', 'maybe']);

export const submitRsvpSchema = z.object({
  guestId: z.string().uuid(),
  name: z.string().min(1, 'Nama wajib diisi').max(255),
  status: rsvpStatusEnum,
  guestCount: z.number().int().min(1).max(10).default(1),
  message: z.string().max(1000).optional().nullable(),
}).refine(
  (data) => {
    // guestCount validation happens server-side against max_guest_count
    return data.guestCount >= 1;
  },
  { message: 'Jumlah tamu minimal 1' }
);

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
