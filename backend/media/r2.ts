/**
 * CLOUDFLARE R2 CLIENT
 * S3-compatible object storage for media assets.
 * 
 * Architecture: Cloudflare Workers → R2 via S3 API.
 * Uses @aws-sdk/client-s3 (Web-compatible).
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials not configured. Check R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env");
  }

  _client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return _client;
}

export const R2 = {
  /**
   * Upload a file to R2.
   * Returns the object key (path in bucket).
   */
  async upload(params: {
    key: string;
    body: Buffer | Uint8Array | ReadableStream;
    contentType: string;
    metadata?: Record<string, string>;
  }): Promise<{ key: string; size: number }> {
    const client = getClient();
    const bucket = process.env.R2_BUCKET_NAME || "wedding-assets";

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body as any,
      ContentType: params.contentType,
      Metadata: params.metadata,
    }));

    return { key: params.key, size: (params.body as any).byteLength || 0 };
  },

  /**
   * Delete a file from R2.
   */
  async delete(key: string): Promise<void> {
    const client = getClient();
    const bucket = process.env.R2_BUCKET_NAME || "wedding-assets";

    await client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }));
  },

  /**
   * Check if a file exists in R2.
   */
  async exists(key: string): Promise<boolean> {
    try {
      const client = getClient();
      const bucket = process.env.R2_BUCKET_NAME || "wedding-assets";
      await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Generate public URL for an R2 object.
   * Uses R2 public domain or custom domain.
   */
  getPublicUrl(key: string): string {
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl}/${key}`;
    }
    // Fallback: direct R2 URL (may need custom domain for public access)
    const accountId = process.env.R2_ACCOUNT_ID;
    const bucket = process.env.R2_BUCKET_NAME || "wedding-assets";
    return `https://${bucket}.${accountId}.r2.dev/${key}`;
  },

  /**
   * Generate a unique object key for an uploaded file.
   */
  generateKey(invitationId: string, filename: string, folder: string = "uploads"): string {
    const ext = filename.split(".").pop() || "bin";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${folder}/${invitationId}/${timestamp}-${random}.${ext}`;
  },
};
