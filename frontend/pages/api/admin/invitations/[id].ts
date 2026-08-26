/**
 * ADMIN API: Single invitation
 * GET    — Get invitation details
 * PATCH  — Update invitation
 * DELETE — Soft delete
 */

import type { APIRoute } from 'astro';
import { invitationService } from '@services/invitation.service';
import { validateBody } from '@backend/middleware/validation.middleware';
import { updateInvitationSchema } from '@shared/validation/invitation.schema';
import { successResponse, errorResponse, noContentResponse } from '@lib/response';
import { AppError } from '@lib/errors';
import { getAdminUserId } from '@backend/middleware/admin-auth';

// Auth: get real user ID from session
// (moved to inside each handler)

export const GET: APIRoute = async ({ params }) => {
  try {
    if (!params.id) return errorResponse('VALIDATION_ERROR', 'ID wajib diisi', 400);
    const invitation = await invitationService.getAdminById(params.id, await getAdminUserId(request));
    return successResponse(invitation);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal memuat undangan', 500);
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    if (!params.id) return errorResponse('VALIDATION_ERROR', 'ID wajib diisi', 400);
    const body = await validateBody(request, updateInvitationSchema);
    const updated = await invitationService.update(params.id, await getAdminUserId(request), body);
    return successResponse(updated);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal update undangan', 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    if (!params.id) return errorResponse('VALIDATION_ERROR', 'ID wajib diisi', 400);
    await invitationService.softDelete(params.id, await getAdminUserId(request));
    return noContentResponse();
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal menghapus undangan', 500);
  }
};
