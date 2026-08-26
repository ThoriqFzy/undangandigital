import { db } from '../db/client';
import { themes } from '../db/index';
import { eq } from 'drizzle-orm';

export const themeRepository = {
  async findAll() {
    return db.select().from(themes).where(eq(themes.isActive, true));
  },
  async findBySlug(slug: string) {
    const rows = await db.select().from(themes).where(eq(themes.slug, slug)).limit(1);
    return rows[0] ?? null;
  },
  async findById(id: string) {
    const rows = await db.select().from(themes).where(eq(themes.id, id)).limit(1);
    return rows[0] ?? null;
  },
};
