/**
 * PUBLIC API: Submit wish
 * POST /api/invitation/:slug/wishes
 */

import type { APIRoute } from 'astro';
import { wishService } from '@services/wish.service';
import { validateBody } from '@backend/middleware/validation.middleware';
import { checkRateLimit } from '@backend/middleware/rate-limit.middleware';
import { submitWishSchema } from '@shared/validation/wish.schema';
import { successResponse, errorResponse } from '@lib/response';
import { AppError } from '@lib/errors';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const slug = params.slug;
    if (!slug) return errorResponse('VALIDATION_ERROR', 'Slug wajib diisi', 400);

    // Rate limit: 5 wishes per IP per minute
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rl = checkRateLimit(`wish:${ip}`, { windowMs: 60000, maxRequests: 5 });
    if (!rl.allowed) {
      return errorResponse('RATE_LIMITED', 'Terlalu banyak request, coba lagi nanti', 429);
    }

    const body = await validateBody(request, submitWishSchema);
    const result = await wishService.submit(slug, body);

    return successResponse(result);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error('POST /api/invitation/[slug]/wishes error:', error);
    return errorResponse('INTERNAL_ERROR', 'Terjadi kesalahan server', 500);
  }
};
