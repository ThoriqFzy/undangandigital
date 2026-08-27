/**
 * ADMIN API: Media upload
 * POST — Upload file to R2 + create asset record
 * Auth: Required + ownership verified via invitationId
 */

import type { APIRoute } from "astro";
import { uploadService } from "@backend/media/upload.service";
import { successResponse, errorResponse } from "@lib/response";
import { AppError } from "@lib/errors";
import { getAdminUserId } from "@backend/middleware/admin-auth";
import { requireInvitationOwnership } from "@backend/middleware/owner-check.middleware";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Authentication
    const userId = await getAdminUserId(request);

    // Parse form data
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

    // Ownership check — verify user owns this invitation
    await requireInvitationOwnership(invitationId, userId);

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
