/**
 * IMAGE PROCESSING
 * Resize and optimize images for different use cases.
 * 
 * Uses sharp (which works in Node.js, but for Cloudflare Workers
 * we'll process on upload and store variants in R2).
 * 
 * For MVP: store original + generate metadata.
 * Full sharp integration available in Node.js runtime.
 */

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  blurhash?: string;
}

/**
 * Detect image format from MIME type.
 */
export function getFormatFromMime(mimeType: string): string {
  const formats: Record<string, string> = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  return formats[mimeType] || "jpeg";
}

/**
 * Validate file type is an allowed image.
 */
export function isAllowedImageType(mimeType: string): boolean {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  return allowed.includes(mimeType);
}

/**
 * Validate file type is an allowed audio.
 */
export function isAllowedAudioType(mimeType: string): boolean {
  const allowed = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"];
  return allowed.includes(mimeType);
}

/**
 * Validate file size against limit.
 */
export function validateFileSize(size: number, maxMb: number = 10): boolean {
  return size <= maxMb * 1024 * 1024;
}

/**
 * Generate object key variants for responsive images.
 */
export function getVariantKeys(baseKey: string): Record<string, string> {
  const ext = baseKey.split(".").pop() || "jpg";
  const base = baseKey.replace(/\.${ext}$/, "");
  return {
    original: baseKey,
    thumb: `${base}-thumb.${ext}`,
    medium: `${base}-medium.${ext}`,
    large: `${base}-large.${ext}`,
  };
}
