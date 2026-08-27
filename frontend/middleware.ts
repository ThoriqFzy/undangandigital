/// <reference path="../.astro/types.d.ts" />

import { defineMiddleware } from "astro:middleware";
import { getCurrentUser } from "@backend/auth/config";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/register"]);

// Top-level path segments that are NOT invitation slugs (system routes).
// Anything else at the root level is treated as a legacy invitation slug and
// redirected to /m/:slug (SaaS separation, Opsi B).
const RESERVED_ROOT_SEGMENTS = new Set([
  "admin",
  "m",
  "api",
  "themes",
  "assets",
  "login",
  "register",
  "robots.txt",
  "favicon.ico",
  "_astro",
  "_headers",
  "_worker.js",
]);

/**
 * Defense-in-depth gate for server-rendered administration routes, plus a legacy
 * redirect that sends old /:slug links to the new /m/:slug location.
 * API routes enforce auth independently because they are callable without this UI.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Admin protection
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (PUBLIC_ADMIN_PATHS.has(pathname)) {
      return next();
    }
    const user = await getCurrentUser(context.request);
    if (!user) {
      const nextPath = `${pathname}${context.url.search}`;
      return context.redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
    }
    context.locals.adminUser = user;
    return next();
  }

  // Legacy invitation redirect: /:slug -> /m/:slug (only for root-level, non-reserved)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !RESERVED_ROOT_SEGMENTS.has(segments[0])) {
    const slug = segments[0];
    return context.redirect(`/m/${slug}`);
  }

  return next();
});

export type AdminPageUser = {
  id: string;
  email: string;
  name: string;
};

declare global {
  namespace App {
    interface Locals {
      adminUser?: AdminPageUser;
    }
  }
}
