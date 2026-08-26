/**
 * LOGOUT API — Sign out and clear session
 */

import type { APIRoute } from "astro";
import { auth } from "../../../../backend/auth/config";

export const POST: APIRoute = async ({ request }) => {
  try {
    await auth.api.signOut({ headers: request.headers });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
