import { db } from '../db/client';
import { events } from '../db/index';
import { eq, and, isNull, asc } from 'drizzle-orm';

export const eventRepository = {
  async findVisible(invitationId: string) {
    return db.select().from(events)
      .where(and(eq(events.invitationId, invitationId), eq(events.isVisible, true)))
      .orderBy(asc(events.sortOrder));
  },
  async findAllByInvitation(invitationId: string) {
    return db.select().from(events).where(eq(events.invitationId, invitationId)).orderBy(asc(events.sortOrder));
  },
  async findById(id: string) {
    const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return rows[0] ?? null;
  },
  async create(data: { invitationId: string; type: 'akad' | 'reception' | 'other'; title: string; eventDate: string; startTime?: string; endTime?: string; timezone?: string; venueName?: string; address?: string; mapsUrl?: string; sortOrder?: number }) {
    const rows = await db.insert(events).values({ ...data, timezone: data.timezone ?? 'Asia/Jakarta' }).returning();
    return rows[0];
  },
  async update(id: string, data: Record<string, unknown>) {
    const rows = await db.update(events).set({ ...data, updatedAt: new Date() }).where(eq(events.id, id)).returning();
    return rows[0] ?? null;
  },
  async delete(id: string) {
    return db.delete(events).where(eq(events.id, id));
  },
};
