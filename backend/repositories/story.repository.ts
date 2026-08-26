import { db } from '../db/client';
import { stories } from '../db/index';
import { eq, and, isNull, asc } from 'drizzle-orm';

export const storyRepository = {
  async findVisible(invitationId: string) {
    return db.select().from(stories)
      .where(and(eq(stories.invitationId, invitationId), eq(stories.isVisible, true)))
      .orderBy(asc(stories.sortOrder));
  },
  async findAllByInvitation(invitationId: string) {
    return db.select().from(stories).where(eq(stories.invitationId, invitationId)).orderBy(asc(stories.sortOrder));
  },
  async findById(id: string) {
    const rows = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
    return rows[0] ?? null;
  },
  async create(data: { invitationId: string; yearLabel?: string; storyDate?: string; title: string; description?: string; sortOrder?: number }) {
    const rows = await db.insert(stories).values(data).returning();
    return rows[0];
  },
  async update(id: string, data: Record<string, unknown>) {
    const rows = await db.update(stories).set({ ...data, updatedAt: new Date() }).where(eq(stories.id, id)).returning();
    return rows[0] ?? null;
  },
  async delete(id: string) {
    return db.delete(stories).where(eq(stories.id, id));
  },
};
