import { db } from '../db/client';
import { assets } from '../db/index';
import { eq, and, isNull, asc } from 'drizzle-orm';

export const assetRepository = {
  async findByInvitationId(invitationId: string) {
    return db.select().from(assets)
      .where(and(eq(assets.invitationId, invitationId), isNull(assets.deletedAt)))
      .orderBy(asc(assets.createdAt));
  },
  async findById(id: string) {
    const rows = await db.select().from(assets).where(eq(assets.id, id)).limit(1);
    return rows[0] ?? null;
  },
  async findByObjectKey(objectKey: string) {
    const rows = await db.select().from(assets).where(eq(assets.objectKey, objectKey)).limit(1);
    return rows[0] ?? null;
  },
  async create(data: {
    invitationId: string;
    type: 'image' | 'audio' | 'video' | 'other';
    objectKey: string;
    mimeType: string;
    fileSize: number;
    originalFilename?: string;
    width?: number;
    height?: number;
    altText?: string;
  }) {
    const rows = await db.insert(assets).values(data).returning();
    return rows[0];
  },
  async softDelete(id: string) {
    const rows = await db.update(assets).set({ deletedAt: new Date() }).where(eq(assets.id, id)).returning();
    return rows[0] ?? null;
  },
};
