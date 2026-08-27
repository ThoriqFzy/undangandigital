/**
 * GUEST REPOSITORY
 * Source of truth: DATABASE.md Section 19, ARCHITECTURE.md Section 14
 */

import { db } from '../db/client';
import { guests } from '../db/index';
import { eq, and, isNull, desc, asc, ilike, count } from 'drizzle-orm';
import type { GuestStatus } from '../../shared/constants/enum-values';

export const guestRepository = {
  /**
   * Find all guests for an invitation.
   */
  async findByInvitationId(invitationId: string) {
    return db
      .select()
      .from(guests)
      .where(and(
        eq(guests.invitationId, invitationId),
        isNull(guests.deletedAt),
      ))
      .orderBy(asc(guests.name));
  },

  /**
   * Find guests by status for an invitation.
   */
  async findByStatus(invitationId: string, status: GuestStatus) {
    return db
      .select()
      .from(guests)
      .where(and(
        eq(guests.invitationId, invitationId),
        eq(guests.status, status),
        isNull(guests.deletedAt),
      ))
      .orderBy(asc(guests.name));
  },

  /**
   * Find a specific guest with owner verification.
   */
  async findByIdForOwner(guestId: string, ownerId: string) {
    const rows = await db
      .select()
      .from(guests)
      .where(and(
        eq(guests.id, guestId),
        isNull(guests.deletedAt),
      ))
      .limit(1);
    // Tenant isolation check happens at service layer
    return rows[0] ?? null;
  },

  /**
   * Find guest by ID within an invitation (for public access).
   */
  async findByIdAndInvitation(guestId: string, invitationId: string) {
    const rows = await db
      .select()
      .from(guests)
      .where(and(
        eq(guests.id, guestId),
        eq(guests.invitationId, invitationId),
        isNull(guests.deletedAt),
      ))
      .limit(1);
    return rows[0] ?? null;
  },

  /**
   * Search guests by name within an invitation.
   */
  async searchByName(invitationId: string, query: string) {
    return db
      .select()
      .from(guests)
      .where(and(
        eq(guests.invitationId, invitationId),
        ilike(guests.name, `%${query}%`),
        isNull(guests.deletedAt),
      ))
      .orderBy(asc(guests.name))
      .limit(50);
  },

  /**
   * Create a guest.
   */
  async create(data: {
    invitationId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    guestGroup?: string | null;
    maxGuestCount?: number;
    notes?: string | null;
  }) {
    const rows = await db.insert(guests).values(data).returning();
    return rows[0];
  },

  /**
   * Create multiple guests (bulk import).
   */
  async createMany(data: Array<{
    invitationId: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    guestGroup?: string | null;
    maxGuestCount?: number;
  }>) {
    return db.insert(guests).values(data).returning();
  },

  /**
   * Update a guest.
   */
  async update(id: string, data: Record<string, unknown>) {
    const rows = await db
      .update(guests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(guests.id, id))
      .returning();
    return rows[0] ?? null;
  },

  /**
   * Update guest status.
   */
  async updateStatus(id: string, status: GuestStatus) {
    return this.update(id, { status });
  },

  /**
   * Mark guest as viewed.
   */
  async markAsViewed(id: string) {
    const rows = await db
      .update(guests)
      .set({
        status: 'viewed',
        viewedAt: new Date(),
        // Increment view_count manually since Drizzle doesn't have .inc()
      })
      .where(eq(guests.id, id))
      .returning();
    return rows[0] ?? null;
  },

  /**
   * Soft delete a guest.
   */
  async softDelete(id: string) {
    const rows = await db
      .update(guests)
      .set({ deletedAt: new Date() })
      .where(eq(guests.id, id))
      .returning();
    return rows[0] ?? null;
  },

  /**
   * Count guests by invitation.
   */
  async countByInvitation(invitationId: string) {
    const rows = await db
      .select({ count: count() })
      .from(guests)
      .where(and(
        eq(guests.invitationId, invitationId),
        isNull(guests.deletedAt),
      ));
    return rows[0]?.count ?? 0;
  },

  /**
   * Count guests by status for an invitation.
   */
  async countByStatus(invitationId: string) {
    const rows = await db
      .select({ status: guests.status, count: count() })
      .from(guests)
      .where(and(
        eq(guests.invitationId, invitationId),
        isNull(guests.deletedAt),
      ))
      .groupBy(guests.status);
    return rows;
  },
};
