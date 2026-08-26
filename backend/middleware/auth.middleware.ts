/**
 * AUTH MIDDLEWARE — Delegates to admin-auth.ts
 * 
 * Import from admin-auth.ts for the real implementation.
 * This file is kept for backward compatibility.
 */

export { getAdminUser, getAdminUserId } from './admin-auth';
export type { AdminUser } from './admin-auth';
