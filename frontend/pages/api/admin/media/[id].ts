/**
 * ADMIN API: Single asset management
 * DELETE — Delete asset + R2 object
 */

import type { APIRoute } from 'astro';
import { uploadService } from '@backend/media/upload.service';
import { assetRepository } from '@repos/asset.repository';
import { successResponse, errorResponse, noContentResponse } from '@lib/response';
import { AppError } from '@lib/errors';

export const GET: APIRoute = async ({ params }) => {
  try {
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);
    const asset = await assetRepository.findById(params.id);
    if (!asset) return errorResponse("NOT_FOUND", "Asset tidak ditemukan", 404);

    const publicUrl = uploadService.getAssetUrl(asset.objectKey);
    return successResponse({ ...asset, publicUrl });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal memuat asset", 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);
    await uploadService.deleteAsset(params.id);
    return noContentResponse();
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal menghapus asset", 500);
  }
};
