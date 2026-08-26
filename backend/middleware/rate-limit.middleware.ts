/**
 * RATE LIMIT MIDDLEWARE
 * Source of truth: ARCHITECTURE.md Section 37
 * 
 * Simple in-memory rate limiter for public mutation endpoints.
 * For production, use Cloudflare-native rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 10,
};

/**
 * Check rate limit for a given key (usually IP + endpoint).
 * Returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {},
): { allowed: boolean; remaining: number; resetAt: number } {
  const { windowMs, maxRequests } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const resetAt = now + windowMs;

  const existing = store.get(key);
  if (existing && existing.resetAt > now) {
    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt: existing.resetAt };
    }
    existing.count++;
    return { allowed: true, remaining: maxRequests - existing.count, resetAt: existing.resetAt };
  }

  store.set(key, { count: 1, resetAt });
  return { allowed: true, remaining: maxRequests - 1, resetAt };
}

/**
 * Create rate limit response headers.
 */
export function rateLimitHeaders(remaining: number, resetAt: number) {
  return {
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
  };
}
