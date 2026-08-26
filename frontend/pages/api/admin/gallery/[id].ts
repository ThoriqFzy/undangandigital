/**
 * ADMIN API: Single gallery item
 * PATCH  — Update caption, altText, sortOrder
 * DELETE — Remove from gallery
 */

import type { APIRoute } from 'astro';
import { galleryRepository } from '@repos/gallery.repository';
import { successResponse, errorResponse, noContentResponse } from '@lib/response';
import { AppError } from '@lib/errors';

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);
    const body = await request.json();
    const updated = await galleryRepository.update(params.id, body);
    return successResponse(updated);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal update galeri", 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    if (!params.id) return errorResponse("VALIDATION_ERROR", "ID wajib diisi", 400);
    await galleryRepository.delete(params.id);
    return noContentResponse();
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    return errorResponse("INTERNAL_ERROR", "Gagal menghapus galeri", 500);
  }
};
