/**
 * GIFT REPOSITORY
 * Source of truth: DATABASE.md Section 18
 */

import { db } from '../db/client';
import { gifts } from '../db/index';
import { eq, and, isNull, asc } from 'drizzle-orm';

export const giftRepository = {
  /**
   * Find all visible gifts for public display.
   */
  async findVisible(invitationId: string) {
    return db
      .select()
      .from(gifts)
      .where(and(
        eq(gifts.invitationId, invitationId),
        eq(gifts.isVisible, true),
      ))
      .orderBy(asc(gifts.sortOrder));
  },

  /**
   * Find all gifts for an invitation (admin view).
   */
  async findAllByInvitation(invitationId: string) {
    return db
      .select()
      .from(gifts)
      .where(eq(gifts.invitationId, invitationId))
      .orderBy(asc(gifts.sortOrder));
  },

  /**
   * Find a gift by ID.
   */
  async findById(id: string) {
    const rows = await db
      .select()
      .from(gifts)
      .where(eq(gifts.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  /**
   * Create a gift.
   */
  async create(data: {
    invitationId: string;
    type: 'bank' | 'ewallet' | 'address' | 'other';
    label?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
    ewalletProvider?: string;
    ewalletNumber?: string;
    recipientName?: string;
    address?: string;
    instructions?: string;
    sortOrder?: number;
    isVisible?: boolean;
  }) {
    const rows = await db.insert(gifts).values(data).returning();
    return rows[0];
  },

  /**
   * Update a gift.
   */
  async update(id: string, data: Record<string, unknown>) {
    const rows = await db
      .update(gifts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(gifts.id, id))
      .returning();
    return rows[0] ?? null;
  },

  /**
   * Delete a gift.
   */
  async delete(id: string) {
    return db.delete(gifts).where(eq(gifts.id, id));
  },
};
