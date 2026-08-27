/**
 * PUBLIC API: Get invitation by slug
 * GET /api/invitation/:slug
 * 
 * Returns public view model for a published invitation.
 * No auth required.
 */

import type { APIRoute } from 'astro';
import { invitationService } from '@services/invitation.service';
import { buildPublicViewModel } from '@backend/viewmodels/invitation-public.vm';
import { successResponse, errorResponse } from '@lib/response';
import { AppError } from '@lib/errors';
import type { Invitation, InvitationSettings } from '@shared/types/invitation';

export const GET: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;
    if (!slug) {
      return errorResponse('VALIDATION_ERROR', 'Slug wajib diisi', 400);
    }

    const invitation = await invitationService.getPublicBySlug(slug);
    const safeInvitation = { ...(invitation as unknown as Record<string, unknown>), settings: (invitation.settings ?? {}) as unknown as InvitationSettings } as unknown as Invitation;
    const viewModel = await buildPublicViewModel(safeInvitation);

    return successResponse(viewModel);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error('GET /api/invitation/[slug] error:', error);
    return errorResponse('INTERNAL_ERROR', 'Terjadi kesalahan server', 500);
  }
};
