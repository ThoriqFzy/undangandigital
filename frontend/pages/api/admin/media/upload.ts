/**
 * ADMIN API: Media upload
 * POST — Upload file to R2 + create asset record
 */

import type { APIRoute } from 'astro';
import { uploadService } from '@backend/media/upload.service';
import { successResponse, errorResponse } from '@lib/response';
import { AppError } from '@lib/errors';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const invitationId = formData.get("invitationId") as string | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const altText = formData.get("altText") as string | null;

    if (!file) {
      return errorResponse("VALIDATION_ERROR", "File wajib diupload", 400);
    }
    if (!invitationId) {
      return errorResponse("VALIDATION_ERROR", "invitationId wajib diisi", 400);
    }

    const result = await uploadService.uploadFile({
      file,
      invitationId,
      folder,
      altText: altText || undefined,
    });

    return successResponse(result);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error.code, error.message, error.statusCode);
    console.error("Upload error:", error);
    return errorResponse("INTERNAL_ERROR", "Gagal upload file", 500);
  }
};
