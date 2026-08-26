/**
 * ADMIN API: RSVP read
 * GET — List all RSVPs for an invitation
 */

import type { APIRoute } from 'astro';
import { rsvpService } from '@services/rsvp.service';
import { successResponse, errorResponse } from '@lib/response';
import { AppError } from '@lib/errors';
import { getAdminUserId } from '@backend/middleware/admin-auth';

// Auth: get real user ID from session
// (moved to inside each handler)

export const GET: APIRoute = async ({ url }) => {
  try {
    const invitationId = url.searchParams.get('invitationId');
    if (!invitationId) return errorResponse('VALIDATION_ERROR', 'invitationId wajib diisi', 400);
    const rsvps = await rsvpService.listByInvitation(invitationId, await getAdminUserId(request));
    return successResponse(rsvps);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal memuat RSVP', 500);
  }
};
