import { db } from '../db/client';
import { auditLogs } from '../db/index';
import { eq, desc } from 'drizzle-orm';

export const auditRepository = {
  async create(data: {
    userId?: string;
    invitationId?: string;
    action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'login' | 'logout' | 'upload' | 'export';
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const rows = await db.insert(auditLogs).values(data).returning();
    return rows[0];
  },
  async findByInvitation(invitationId: string, limit: number = 50) {
    return db.select().from(auditLogs)
      .where(eq(auditLogs.invitationId, invitationId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  },
};
