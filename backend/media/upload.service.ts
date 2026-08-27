/**
 * MEDIA UPLOAD SERVICE
 * Orchestrates file upload: validate → process → store → record.
 */

import { R2 } from "./r2";
import { isAllowedImageType, isAllowedAudioType, validateFileSize } from "./image-processor";
import { assetRepository } from "../repositories/asset.repository";
import { ConflictError, ValidationError } from "../lib/errors";

const MAX_FILE_SIZE_MB = 10;

export interface UploadResult {
  assetId: string;
  objectKey: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
}

export const uploadService = {
  /**
   * Upload a file and create asset record.
   */
  async uploadFile(params: {
    file: File;
    invitationId: string;
    folder?: string;
    altText?: string;
  }): Promise<UploadResult> {
    const { file, invitationId, folder = "uploads", altText } = params;

    // Validate file type
    if (!isAllowedImageType(file.type) && !isAllowedAudioType(file.type)) {
      throw new ValidationError(
        `Tipe file tidak didukung. Gunakan: JPEG, PNG, WebP, AVIF, atau MP3/WAV.`
      );
    }

    // Validate file size
    if (!validateFileSize(file.size, MAX_FILE_SIZE_MB)) {
      throw new ValidationError(
        `Ukuran file maksimal ${MAX_FILE_SIZE_MB}MB. File Anda: ${(file.size / 1024 / 1024).toFixed(1)}MB`
      );
    }

    // Generate unique key
    const key = R2.generateKey(invitationId, file.name, folder);

    // Read file as buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to R2
    const result = await R2.upload({
      key,
      body: buffer,
      contentType: file.type,
      metadata: {
        invitationId,
        originalName: file.name,
        altText: altText || "",
      },
    });

    // Determine asset type
    const assetType = file.type.startsWith("image/") ? "image"
      : file.type.startsWith("audio/") ? "audio"
      : "other";

    // Create asset record in database
    const asset = await assetRepository.create({
      invitationId,
      type: assetType as "image" | "audio" | "video" | "other",
      objectKey: key,
      mimeType: file.type,
      fileSize: file.size,
      originalFilename: file.name,
      altText,
    });

    return {
      assetId: asset.id,
      objectKey: key,
      publicUrl: R2.getPublicUrl(key),
      mimeType: file.type,
      fileSize: file.size,
    };
  },

  /**
   * Upload multiple files.
   */
  async uploadMultiple(params: {
    files: File[];
    invitationId: string;
    folder?: string;
  }): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (const file of params.files) {
      const result = await this.uploadFile({
        file,
        invitationId: params.invitationId,
        folder: params.folder,
      });
      results.push(result);
    }
    return results;
  },

  /**
   * Delete a file and its asset record.
   * Order: soft-delete DB first (so a failed R2 delete leaves a recoverable record),
   * then remove the R2 object. If R2 deletion fails we still return success but log,
   * because the DB row is already hidden from clients.
   */
  async deleteAsset(assetId: string): Promise<void> {
    const asset = await assetRepository.findById(assetId);
    if (!asset) return;

    // Soft delete DB record first (clients can no longer see it).
    await assetRepository.softDelete(assetId);

    // Best-effort R2 cleanup.
    try {
      await R2.delete(asset.objectKey);
    } catch (err) {
      console.error("R2 delete failed for", asset.objectKey, err);
    }
  },

  /**
   * Get public URL for an asset.
   */
  getAssetUrl(objectKey: string): string {
    return R2.getPublicUrl(objectKey);
  },
};
