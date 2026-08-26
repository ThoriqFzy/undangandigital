/**
 * BETTER AUTH CLIENT
 * Client-side auth helpers for Astro pages.
 */

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined"
    ? window.location.origin
    : process.env.PUBLIC_SITE_URL || "http://localhost:4321",
});

export const { signIn, signOut, useSession } = authClient;
