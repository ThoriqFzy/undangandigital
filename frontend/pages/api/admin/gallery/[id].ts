/**
 * ADMIN API: Single gallery item
 * PATCH  — Update caption, altText, sortOrder
 * DELETE — Remove from gallery
 * Auth: Required + ownership verified
 */

import type { APIRoute } from "astro";
import { galleryRepository } from "@repos/gallery.repository";
import { assetRepository } from "@repos/asset.repository";
import { successResponse, errorResponse, noContentResponse } from "@lib/response";
import { AppError } from "@lib/errors";
import { getAdminUserId } from "@backend/middleware/admin-auth";
import { requireInvitationOwnership } from "@backend/middleware/owner-check.middleware";

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const userId = await getAdminUserId(request);
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);

    const item = await galleryRepository.findById(params.id);
    if (!item) return errorResponse("NOT_FOUND", "Galeri tidak ditemukan", 404);

    // Ownership check
    await requireInvitationOwnership(item.invitationId, userId);

    const body = await request.json();
    const updated = await galleryRepository.update(params.id, body);
    return successResponse(updated);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal update galeri", 500);
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const userId = await getAdminUserId(request);
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);

    const item = await galleryRepository.findById(params.id);
    if (!item) return errorResponse("NOT_FOUND", "Galeri tidak ditemukan", 404);

    // Ownership check
    await requireInvitationOwnership(item.invitationId, userId);

    await galleryRepository.delete(params.id);
    return noContentResponse();
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal menghapus galeri", 500);
  }
};
