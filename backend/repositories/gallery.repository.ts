import { db } from '../db/client';
import { galleryItems } from '../db/index';
import { eq, and, isNull, asc } from 'drizzle-orm';

export const galleryRepository = {
  async findVisible(invitationId: string) {
    return db.select().from(galleryItems)
      .where(and(eq(galleryItems.invitationId, invitationId), eq(galleryItems.isVisible, true)))
      .orderBy(asc(galleryItems.sortOrder));
  },
  async findAllByInvitation(invitationId: string) {
    return db.select().from(galleryItems)
      .where(eq(galleryItems.invitationId, invitationId))
      .orderBy(asc(galleryItems.sortOrder));
  },
  async findById(id: string) {
    const rows = await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1);
    return rows[0] ?? null;
  },
  async create(data: { invitationId: string; assetId: string; caption?: string; altText?: string; sortOrder?: number }) {
    const rows = await db.insert(galleryItems).values(data).returning();
    return rows[0];
  },
  async update(id: string, data: Record<string, unknown>) {
    const rows = await db.update(galleryItems).set({ ...data, updatedAt: new Date() }).where(eq(galleryItems.id, id)).returning();
    return rows[0] ?? null;
  },
  async delete(id: string) {
    return db.delete(galleryItems).where(eq(galleryItems.id, id));
  },
};
