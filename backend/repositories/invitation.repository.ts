/**
 * INVITATION REPOSITORY
 * Source of truth: ARCHITECTURE.md Section 14
 * 
 * Business-oriented operations. No raw SQL leaks.
 */

import { db } from '../db/client';
import { invitations, templates, themes, couples, events, stories, assets, galleryItems, gifts, guests, wishes } from '../db/index';
import { eq, and, isNull, desc, asc, count, ne } from 'drizzle-orm';
import type { InvitationStatus } from '../../shared/constants/enum-values';

export const invitationRepository = {
  /**
   * Find invitation by slug (public-facing).
   * Only returns published invitations.
   */
  async findBySlug(slug: string) {
    const rows = await db
      .select()
      .from(invitations)
      .where(and(
        eq(invitations.slug, slug),
        eq(invitations.status, 'published'),
        isNull(invitations.deletedAt),
      ))
      .limit(1);
    return rows[0] ?? null;
  },

  /**
   * Find invitation by ID with full relations (admin view).
   */
  async findByIdWithRelations(id: string) {
    const rows = await db.query.invitations.findFirst({
      where: eq(invitations.id, id),
      with: {
        template: true,
        theme: true,
        couple: true,
        events: { orderBy: [asc(events.sortOrder)] },
        stories: { orderBy: [asc(stories.sortOrder)] },
        gifts: { orderBy: [asc(gifts.sortOrder)] },
      },
    });
    return rows ?? null;
  },

  /**
   * Find all invitations for a specific owner (admin dashboard).
   */
  async findByOwnerId(ownerId: string) {
    return db
      .select()
      .from(invitations)
      .where(and(
        eq(invitations.ownerId, ownerId),
        isNull(invitations.deletedAt),
      ))
      .orderBy(desc(invitations.createdAt));
  },

  /**
   * Create a new invitation.
   */
  async create(data: {
    ownerId: string;
    templateId: string;
    themeId: string;
    slug: string;
    title?: string;
    settings?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(invitations)
      .values(data)
      .returning();
    return rows[0];
  },

  /**
   * Update an invitation.
   */
  async update(id: string, data: Record<string, unknown>) {
    const rows = await db
      .update(invitations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();
    return rows[0] ?? null;
  },

  /**
   * Publish an invitation.
   */
  async publish(id: string) {
    return this.update(id, {
      status: 'published',
      publishedAt: new Date(),
    });
  },

  /**
   * Unpublish (set back to draft).
   */
  async unpublish(id: string) {
    return this.update(id, {
      status: 'draft',
      publishedAt: null,
    });
  },

  /**
   * Soft delete an invitation.
   */
  async softDelete(id: string) {
    return this.update(id, { deletedAt: new Date() });
  },

  /**
   * Check if slug is available (not used by active invitations).
   */
  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const conditions = [
      eq(invitations.slug, slug),
      isNull(invitations.deletedAt),
    ];
    if (excludeId) {
      conditions.push(ne(invitations.id, excludeId));
    }
    const rows = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(and(...conditions))
      .limit(1);
    return rows.length === 0;
  },

  /**
   * Count invitations by owner.
   */
  async countByOwnerId(ownerId: string) {
    const rows = await db
      .select({ count: count() })
      .from(invitations)
      .where(and(
        eq(invitations.ownerId, ownerId),
        isNull(invitations.deletedAt),
      ));
    return rows[0]?.count ?? 0;
  },
};
