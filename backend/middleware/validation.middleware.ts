/**
 * VALIDATION MIDDLEWARE
 * Parses and validates request body against Zod schema.
 */

import { type ZodSchema } from 'zod';
import { ValidationError } from '../lib/errors';

/**
 * Validate request body against a Zod schema.
 * Returns parsed and validated data or throws ValidationError.
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError('Request body tidak valid atau kosong');
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const messages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    throw new ValidationError(messages.join('; '));
  }

  return result.data;
}

/**
 * Extract and validate URL params.
 */
export function validateParams<T extends Record<string, string>>(
  params: T,
  requiredKeys: (keyof T)[],
): T {
  for (const key of requiredKeys) {
    if (!params[key]) {
      throw new ValidationError(`Parameter "${String(key)}" wajib diisi`);
    }
  }
  return params;
}
