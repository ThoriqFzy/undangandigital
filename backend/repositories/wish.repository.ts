/**
 * WISH REPOSITORY
 * Source of truth: DATABASE.md Section 22
 */

import { db } from '../db/client';
import { wishes } from '../db/index';
import { eq, and, isNull, desc } from 'drizzle-orm';

export const wishRepository = {
  /**
   * Find approved wishes for public display.
   */
  async findApproved(invitationId: string) {
    return db
      .select()
      .from(wishes)
      .where(and(
        eq(wishes.invitationId, invitationId),
        eq(wishes.status, 'approved'),
        isNull(wishes.deletedAt),
      ))
      .orderBy(desc(wishes.createdAt));
  },

  /**
   * Find all wishes for an invitation (admin view, including pending).
   */
  async findAllByInvitation(invitationId: string) {
    return db
      .select()
      .from(wishes)
      .where(and(
        eq(wishes.invitationId, invitationId),
        isNull(wishes.deletedAt),
      ))
      .orderBy(desc(wishes.createdAt));
  },

  /**
   * Find a wish by ID.
   */
  async findById(id: string) {
    const rows = await db
      .select()
      .from(wishes)
      .where(and(eq(wishes.id, id), isNull(wishes.deletedAt)))
      .limit(1);
    return rows[0] ?? null;
  },

  /**
   * Create a wish.
   */
  async create(data: {
    invitationId: string;
    guestId?: string;
    name: string;
    message: string;
  }) {
    const rows = await db.insert(wishes).values(data).returning();
    return rows[0];
  },

  /**
   * Update wish status (moderation).
   */
  async updateStatus(id: string, status: 'approved' | 'hidden') {
    const rows = await db
      .update(wishes)
      .set({ status, updatedAt: new Date() })
      .where(eq(wishes.id, id))
      .returning();
    return rows[0] ?? null;
  },

  /**
   * Soft delete a wish.
   */
  async softDelete(id: string) {
    const rows = await db
      .update(wishes)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(wishes.id, id))
      .returning();
    return rows[0] ?? null;
  },
};
