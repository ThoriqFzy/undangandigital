/**
 * ADMIN THEME APPLY API
 * POST /api/admin/theme/apply
 * Applies a theme preset to one or all owned invitations.
 */

import type { APIRoute } from "astro";
import { db } from "@db/client";
import { invitations, themes } from "@db/index";
import { eq, and, isNull } from "drizzle-orm";
import { successResponse, errorResponse } from "@lib/response";
import { AppError } from "@lib/errors";
import { getAdminUserId } from "@backend/middleware/admin-auth";
import { requireInvitationOwnership } from "@backend/middleware/owner-check.middleware";

export const POST: APIRoute = async ({ request }) => {
  try {
    const userId = await getAdminUserId(request);
    const { themeId, invitationId } = await request.json();

    if (!themeId) {
      return errorResponse("VALIDATION_ERROR", "themeId wajib diisi", 400);
    }

    const [theme] = await db.select().from(themes).where(eq(themes.id, themeId)).limit(1);
    if (!theme) return errorResponse("NOT_FOUND", "Tema tidak ditemukan", 404);

    if (invitationId) {
      await requireInvitationOwnership(invitationId, userId);
      await db.update(invitations).set({ themeId, updatedAt: new Date() }).where(eq(invitations.id, invitationId));
      return successResponse({ count: 1 });
    }

    // Apply to all owned invitations.
    const owned = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(and(eq(invitations.ownerId, userId), isNull(invitations.deletedAt)));

    for (const row of owned) {
      await db.update(invitations).set({ themeId, updatedAt: new Date() }).where(eq(invitations.id, row.id));
    }

    return successResponse({ count: owned.length });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    console.error("Theme apply error:", error);
    return errorResponse("INTERNAL_ERROR", "Gagal menerapkan tema", 500);
  }
};
