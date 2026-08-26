/**
 * AUTH API HANDLER
 * Catches all /api/auth/* routes and forwards to Better Auth.
 */

import type { APIRoute } from "astro";
import { auth } from "../../../../backend/auth/config";

export const ALL: APIRoute = async ({ request }) => {
  return auth.handler(request);
};
