/**
 * ADMIN API: Gallery management
 * GET    — List gallery items for an invitation
 * POST   — Create gallery item (link asset to gallery)
 */

import type { APIRoute } from 'astro';
import { galleryRepository } from '@repos/gallery.repository';
import { assetRepository } from '@repos/asset.repository';
import { successResponse, errorResponse, createdResponse } from '@lib/response';
import { AppError } from '@lib/errors';

export const GET: APIRoute = async ({ url }) => {
  try {
    const invitationId = url.searchParams.get("invitationId");
    if (!invitationId) return errorResponse("VALIDATION_ERROR", "invitationId wajib diisi", 400);

    const items = await galleryRepository.findAllByInvitation(invitationId);

    // Attach public URLs
    const itemsWithUrls = await Promise.all(
      items.map(async (item) => {
        const asset = await assetRepository.findById(item.assetId);
        return {
          ...item,
          imageUrl: asset ? uploadService.getAssetUrl(asset.objectKey) : "",
          thumbUrl: asset ? uploadService.getAssetUrl(asset.objectKey) : "",
        };
      })
    );

    return successResponse(itemsWithUrls);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal memuat galeri", 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { invitationId, assetId, caption, altText, sortOrder } = body;

    if (!invitationId || !assetId) {
      return errorResponse("VALIDATION_ERROR", "invitationId dan assetId wajib diisi", 400);
    }

    const item = await galleryRepository.create({
      invitationId,
      assetId,
      caption,
      altText,
      sortOrder,
    });

    return createdResponse(item);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal menambah galeri", 500);
  }
};
