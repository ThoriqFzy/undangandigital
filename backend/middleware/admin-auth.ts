/**
 * ADMIN AUTH MIDDLEWARE
 * Real implementation using Better Auth session.
 * Replaces the placeholder auth middleware.
 */

import { getCurrentUser } from "../auth/config";
import { UnauthorizedError } from "../lib/errors";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Get authenticated admin user from request.
 * Uses Better Auth session cookie.
 */
export async function getAdminUser(request: Request): Promise<AdminUser> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new UnauthorizedError("Silakan login terlebih dahulu");
  }
  return user;
}

/**
 * Get admin user ID or throw.
 */
export async function getAdminUserId(request: Request): Promise<string> {
  const user = await getAdminUser(request);
  return user.id;
}
