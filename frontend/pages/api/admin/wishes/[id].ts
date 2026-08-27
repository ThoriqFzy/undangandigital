/**
 * ADMIN API: Wish moderation
 * PATCH  — Approve or hide wish
 * DELETE — Soft delete wish
 */

import type { APIRoute } from 'astro';
import { wishService } from '@services/wish.service';
import { moderateWishSchema } from '@shared/validation/wish.schema';
import { validateBody } from '@backend/middleware/validation.middleware';
import { successResponse, errorResponse, noContentResponse } from '@lib/response';
import { AppError } from '@lib/errors';
import { getAdminUserId } from '@backend/middleware/admin-auth';

// Auth: get real user ID from session
// (moved to inside each handler)

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    if (!params.id) return errorResponse('VALIDATION_ERROR', 'ID wajib diisi', 400);
    const body = await validateBody(request, moderateWishSchema);
    const updated = await wishService.moderate(params.id, await getAdminUserId(request), body.status);
    return successResponse(updated);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal moderasi ucapan', 500);
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    if (!params.id) return errorResponse('VALIDATION_ERROR', 'ID wajib diisi', 400);
    await wishService.delete(params.id, await getAdminUserId(request));
    return noContentResponse();
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal menghapus ucapan', 500);
  }
};
