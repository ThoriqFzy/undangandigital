/**
 * ADMIN THEMES API — list/create entry
 */

import type { APIRoute } from "astro";
import { db } from "@db/client";
import { themes } from "@db/index";
import { desc, eq } from "drizzle-orm";
import { successResponse, errorResponse, createdResponse } from "@lib/response";
import { AppError } from "@lib/errors";
import { getAdminUserId } from "@backend/middleware/admin-auth";
import { themeConfigSchema } from "@shared/validation/theme.schema";

export const GET: APIRoute = async ({ request }) => {
  try {
    await getAdminUserId(request);
    const rows = await db.select().from(themes).orderBy(desc(themes.createdAt));
    return successResponse(rows);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal memuat tema", 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await getAdminUserId(request);
    const body = await request.json();
    const { name, slug, description, config } = body;

    if (!name || !slug) {
      return errorResponse("VALIDATION_ERROR", "name dan slug wajib diisi", 400);
    }

    const parsed = themeConfigSchema.safeParse(config);
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Config tema tidak valid", 400);
    }

    const existing = await db.select({ id: themes.id }).from(themes).where(eq(themes.slug, slug)).limit(1);
    if (existing.length > 0) {
      return errorResponse("CONFLICT", "Slug tema sudah digunakan", 409);
    }

    const [created] = await db
      .insert(themes)
      .values({ name, slug, description: description ?? null, config: parsed.data })
      .returning();

    return createdResponse(created);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    console.error("Theme create error:", error);
    return errorResponse("INTERNAL_ERROR", "Gagal membuat tema", 500);
  }
};
