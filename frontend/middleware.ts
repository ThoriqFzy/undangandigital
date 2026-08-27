/// <reference path="../.astro/types.d.ts" />

import { defineMiddleware } from "astro:middleware";
import { getCurrentUser } from "@backend/auth/config";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/register"]);

/**
 * Defense-in-depth gate for server-rendered administration routes.
 * API routes enforce auth independently because they are callable without this UI.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

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
