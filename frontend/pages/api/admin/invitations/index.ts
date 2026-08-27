/**
 * ADMIN API: Invitation management
 * GET    — List all invitations for owner
 * POST   — Create new invitation
 */

import type { APIRoute } from 'astro';
import { invitationService } from '@services/invitation.service';
import { validateBody } from '@backend/middleware/validation.middleware';
import { createInvitationSchema } from '@shared/validation/invitation.schema';
import { successResponse, errorResponse, createdResponse } from '@lib/response';
import { AppError } from '@lib/errors';
import { getAdminUserId } from '@backend/middleware/admin-auth';

// TODO: Replace with real auth when Better Auth is integrated
// Auth: get real user ID from session
// (moved to inside each handler)

export const GET: APIRoute = async ({ request }) => {
  try {
    const invitations = await invitationService.listByOwner(await getAdminUserId(request));
    return successResponse(invitations);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal memuat undangan', 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await validateBody(request, createInvitationSchema);
    const invitation = await invitationService.create(await getAdminUserId(request), body);
    return createdResponse(invitation);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal membuat undangan', 500);
  }
};
