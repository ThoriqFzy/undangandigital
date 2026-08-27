/**
 * ADMIN THEMES API
 * POST   /api/admin/themes        — create theme
 * PATCH  /api/admin/themes/:id     — update theme
 * GET    /api/admin/themes/:id     — get theme
 * DELETE /api/admin/themes/:id     — delete theme (soft via isActive=false)
 *
 * Themes are global presets. Admin UI is protected by frontend/middleware.ts.
 */

import type { APIRoute } from "astro";
import { db } from "@db/client";
import { themes } from "@db/index";
import { eq, and, isNull } from "drizzle-orm";
import { successResponse, errorResponse, createdResponse, noContentResponse } from "@lib/response";
import { AppError } from "@lib/errors";
import { getAdminUserId } from "@backend/middleware/admin-auth";
import { themeConfigSchema } from "@shared/validation/theme.schema";

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

export const GET: APIRoute = async ({ params, request }) => {
  try {
    await getAdminUserId(request);
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);
    const [theme] = await db.select().from(themes).where(eq(themes.id, params.id)).limit(1);
    if (!theme) return errorResponse("NOT_FOUND", "Tema tidak ditemukan", 404);
    return successResponse(theme);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal memuat tema", 500);
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    await getAdminUserId(request);
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);

    const body = await request.json();
    const update: Record<string, unknown> = {};
    if (body.name !== undefined) update.name = body.name;
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.description !== undefined) update.description = body.description;
    if (body.config !== undefined) {
      const parsed = themeConfigSchema.safeParse(body.config);
      if (!parsed.success) {
        return errorResponse("VALIDATION_ERROR", "Config tema tidak valid", 400);
      }
      update.config = parsed.data;
    }
    update.updatedAt = new Date();

    const [updated] = await db.update(themes).set(update).where(eq(themes.id, params.id)).returning();
    if (!updated) return errorResponse("NOT_FOUND", "Tema tidak ditemukan", 404);
    return successResponse(updated);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal update tema", 500);
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    await getAdminUserId(request);
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);
    // Soft-delete by marking inactive to preserve references.
    const [updated] = await db
      .update(themes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(themes.id, params.id)))
      .returning();
    if (!updated) return errorResponse("NOT_FOUND", "Tema tidak ditemukan", 404);
    return noContentResponse();
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal menghapus tema", 500);
  }
};
