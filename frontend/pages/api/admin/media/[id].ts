/**
 * ADMIN API: Single asset management
 * GET    — Get asset info
 * DELETE — Delete asset + R2 object
 * Auth: Required + ownership verified via asset.invitationId
 */

import type { APIRoute } from "astro";
import { uploadService } from "@backend/media/upload.service";
import { assetRepository } from "@repos/asset.repository";
import { successResponse, errorResponse, noContentResponse } from "@lib/response";
import { AppError } from "@lib/errors";
import { getAdminUserId } from "@backend/middleware/admin-auth";
import { requireInvitationOwnership } from "@backend/middleware/owner-check.middleware";

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const userId = await getAdminUserId(request);
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);

    const asset = await assetRepository.findById(params.id);
    if (!asset) return errorResponse("NOT_FOUND", "Asset tidak ditemukan", 404);

    // Ownership check
    await requireInvitationOwnership(asset.invitationId, userId);

    const publicUrl = uploadService.getAssetUrl(asset.objectKey);
    return successResponse({ ...asset, publicUrl });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal memuat asset", 500);
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const userId = await getAdminUserId(request);
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);

    const asset = await assetRepository.findById(params.id);
    if (!asset) return errorResponse("NOT_FOUND", "Asset tidak ditemukan", 404);

    // Ownership check
    await requireInvitationOwnership(asset.invitationId, userId);

    await uploadService.deleteAsset(params.id);
    return noContentResponse();
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal menghapus asset", 500);
  }
};
