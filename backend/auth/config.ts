/**
 * BETTER AUTH CONFIGURATION
 * Email/password + session-based auth for admin.
 * Uses Drizzle adapter for database.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import {
  users,
  accounts,
  sessions,
  verifications,
} from "../db/schema/auth";
import { isPublicRegistrationAllowed } from "./registration-policy";

/**
 * Better Auth instance.
 * Configured for:
 * - Email/password authentication
 * - Cookie-based sessions
 * - Drizzle ORM adapter (Neon PostgreSQL)
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set true when email is configured
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // Update every 24 hours
  },
  user: {
    additionalFields: {
      // No additional fields needed beyond Better Auth defaults
    },
  },
});

/**
 * Helper: Get current authenticated user from request.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch {
    return null;
  }
}

/**
 * Helper: Require authenticated user or throw.
 */
export async function requireAuth(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
