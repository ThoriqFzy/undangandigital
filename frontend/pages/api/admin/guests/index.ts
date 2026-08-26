/**
 * ADMIN API: Guest management
 * GET    — List guests
 * POST   — Create guest
 * POST (bulk) — Import guests
 */

import type { APIRoute } from 'astro';
import { guestService } from '@services/guest.service';
import { validateBody } from '@backend/middleware/validation.middleware';
import { createGuestSchema, guestImportSchema } from '@shared/validation/guest.schema';
import { successResponse, errorResponse, createdResponse } from '@lib/response';
import { AppError } from '@lib/errors';
import { getAdminUserId } from '@backend/middleware/admin-auth';

// Auth: get real user ID from session
// (moved to inside each handler)

export const GET: APIRoute = async ({ url }) => {
  try {
    const invitationId = url.searchParams.get('invitationId');
    if (!invitationId) return errorResponse('VALIDATION_ERROR', 'invitationId wajib diisi', 400);
    const guests = await guestService.listByInvitation(invitationId, await getAdminUserId(request));
    return successResponse(guests);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal memuat tamu', 500);
  }
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json();

    // Bulk import
    if (Array.isArray(body)) {
      const invitationId = url.searchParams.get('invitationId');
      if (!invitationId) return errorResponse('VALIDATION_ERROR', 'invitationId wajib diisi', 400);
      const parsed = guestImportSchema.parse(body);
      const guests = await guestService.createMany(invitationId, await getAdminUserId(request), parsed);
      return createdResponse(guests);
    }

    // Single create
    const invitationId = url.searchParams.get('invitationId');
    if (!invitationId) return errorResponse('VALIDATION_ERROR', 'invitationId wajib diisi', 400);
    const parsed = createGuestSchema.parse(body);
    const guest = await guestService.create(invitationId, await getAdminUserId(request), parsed);
    return createdResponse(guest);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse('INTERNAL_ERROR', 'Gagal menambah tamu', 500);
  }
};
