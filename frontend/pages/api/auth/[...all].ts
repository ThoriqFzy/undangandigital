/**
 * AUTH API HANDLER
 * Catches all /api/auth/* routes and forwards to Better Auth.
 */

import type { APIRoute } from "astro";
import { auth } from "../../../../backend/auth/config";
import { isPublicRegistrationAllowed } from "../../../../backend/auth/registration-policy";

const SIGN_UP_PATHS = new Set([
  "/api/auth/sign-up/email",
  "/api/auth/sign-up",
]);

export const ALL: APIRoute = async ({ request, url }) => {
  // Better Auth exposes sign-up through this catch-all route. Block it before
  // it reaches the provider unless self-service registration is explicitly enabled.
  if (request.method === "POST" && SIGN_UP_PATHS.has(url.pathname) && !isPublicRegistrationAllowed()) {
    return new Response(JSON.stringify({
      code: "PUBLIC_REGISTRATION_DISABLED",
      message: "Pendaftaran publik sedang tidak tersedia.",
    }), {
      status: 403,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  return auth.handler(request);
};
