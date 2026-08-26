/**
 * RSVP REPOSITORY
 * Source of truth: DATABASE.md Section 21
 */

import { db } from '../db/client';
import { rsvps } from '../db/index';
import { eq, and, count } from 'drizzle-orm';

export const rsvpRepository = {
  /**
   * Find RSVP by guest ID.
   */
  async findByGuestId(guestId: string) {
    const rows = await db
      .select()
      .from(rsvps)
      .where(eq(rsvps.guestId, guestId))
      .limit(1);
    return rows[0] ?? null;
  },

  /**
   * Find all RSVPs for an invitation (admin view).
   */
  async findByInvitationId(invitationId: string) {
    return db
      .select()
      .from(rsvps)
      .where(eq(rsvps.invitationId, invitationId))
      .orderBy(rsvps.submittedAt);
  },

  /**
   * Upsert RSVP (create or update).
   * One active RSVP per guest (guest_id UNIQUE).
   */
  async upsert(data: {
    invitationId: string;
    guestId: string;
    status: 'attending' | 'not_attending' | 'maybe';
    guestCount?: number;
    message?: string;
  }) {
    const existing = await this.findByGuestId(data.guestId);

    if (existing) {
      const rows = await db
        .update(rsvps)
        .set({
          status: data.status,
          guestCount: data.guestCount ?? existing.guestCount,
          message: data.message ?? existing.message,
          updatedAt: new Date(),
        })
        .where(eq(rsvps.guestId, data.guestId))
        .returning();
      return rows[0];
    }

    const rows = await db
      .insert(rsvps)
      .values({
        ...data,
        guestCount: data.guestCount ?? 1,
        submittedAt: new Date(),
      })
      .returning();
    return rows[0];
  },

  /**
   * Count RSVPs by status for an invitation.
   */
  async countByStatus(invitationId: string) {
    const rows = await db
      .select({ status: rsvps.status, count: count() })
      .from(rsvps)
      .where(eq(rsvps.invitationId, invitationId))
      .groupBy(rsvps.status);
    return rows;
  },

  /**
   * Delete an RSVP.
   */
  async delete(guestId: string) {
    return db
      .delete(rsvps)
      .where(eq(rsvps.guestId, guestId));
  },
};
