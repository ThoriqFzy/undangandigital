/**
 * TOKEN UTILITIES
 * Source of truth: DATABASE.md Section 20
 * 
 * Guest access tokens use SHA-256 hashing.
 * Raw token is NEVER stored in database.
 * Flow: generate -> hash -> store hash -> verify hash on access.
 */

import { createHash, randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure random token.
 * Returns: 48-character hex string
 */
export function generateGuestToken(): string {
  return randomBytes(24).toString('hex');
}

/**
 * Hash a token using SHA-256.
 * Used for both generating stored hash and verifying incoming tokens.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Verify an incoming raw token against a stored hash.
 */
export function verifyToken(rawToken: string, storedHash: string): boolean {
  const computedHash = hashToken(rawToken);
  // Constant-time comparison to prevent timing attacks
  if (computedHash.length !== storedHash.length) return false;
  let result = 0;
  for (let i = 0; i < computedHash.length; i++) {
    result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Build a personalized invitation URL with guest token.
 */
export function buildGuestUrl(slug: string, token: string): string {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';
  return `${baseUrl}/${slug}?guest=${token}`;
}
