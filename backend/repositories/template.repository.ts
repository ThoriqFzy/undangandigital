import { db } from '../db/client';
import { templates } from '../db/index';
import { eq } from 'drizzle-orm';

export const templateRepository = {
  async findAll() {
    return db.select().from(templates).where(eq(templates.isActive, true));
  },
  async findBySlug(slug: string) {
    const rows = await db.select().from(templates).where(eq(templates.slug, slug)).limit(1);
    return rows[0] ?? null;
  },
  async findById(id: string) {
    const rows = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
    return rows[0] ?? null;
  },
};
