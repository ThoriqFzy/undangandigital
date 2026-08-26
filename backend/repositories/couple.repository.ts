import { db } from '../db/client';
import { couples } from '../db/index';
import { eq } from 'drizzle-orm';

export const coupleRepository = {
  async findByInvitationId(invitationId: string) {
    const rows = await db.select().from(couples).where(eq(couples.invitationId, invitationId)).limit(1);
    return rows[0] ?? null;
  },
  async create(data: {
    invitationId: string;
    groomName: string;
    groomNickname?: string;
    groomFatherName?: string;
    groomMotherName?: string;
    brideName: string;
    brideNickname?: string;
    brideFatherName?: string;
    brideMotherName?: string;
  }) {
    const rows = await db.insert(couples).values(data).returning();
    return rows[0];
  },
  async update(invitationId: string, data: Record<string, unknown>) {
    const rows = await db.update(couples).set({ ...data, updatedAt: new Date() }).where(eq(couples.invitationId, invitationId)).returning();
    return rows[0] ?? null;
  },
};
