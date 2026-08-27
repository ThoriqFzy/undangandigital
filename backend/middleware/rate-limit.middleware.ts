/**
 * RATE LIMIT MIDDLEWARE
 * Source of truth: ARCHITECTURE.md Section 37
 *
 * Cloudflare Workers are ephemeral and isolate-per-request, so an in-memory
 * store does NOT persist across requests in production. When a Workers KV
 * namespace is bound (env.RATE_LIMIT_KV), we use it so limits are enforced
 * globally. Otherwise we fall back to the in-memory store (dev / local only),
 * which still protects a single warm instance.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Dev/local fallback store (NOT reliable on Cloudflare Workers).
const memoryStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes (only relevant for the memory fallback).
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt < now) memoryStore.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 10,
};

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

/**
 * Resolve the KV binding. Accepts either the Workers `env` object or a global.
 * Returns undefined when KV is not configured (falls back to memory).
 */
function getKV(env?: unknown): KVNamespace | undefined {
  // Only trust an explicit env binding passed at request time.
  if (env && typeof env === "object" && "RATE_LIMIT_KV" in env) {
    const kv = (env as Record<string, unknown>).RATE_LIMIT_KV;
    if (kv && typeof (kv as KVNamespace).get === "function") return kv as KVNamespace;
  }
  return undefined;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {},
  env?: unknown,
): Promise<RateLimitResult> {
  const { windowMs, maxRequests } = { ...DEFAULT_CONFIG, ...config };
  const kv = getKV(env);

  if (kv) {
    const now = Date.now();
    const resetAt = now + windowMs;
    const raw = await kv.get(key);
    let count = 0;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as RateLimitEntry;
        if (parsed.resetAt > now) count = parsed.count;
      } catch { /* corrupt entry, treat as 0 */ }
    }
    if (count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt };
    }
    const nextCount = count + 1;
    await kv.put(key, JSON.stringify({ count: nextCount, resetAt }), {
      expirationTtl: Math.ceil(windowMs / 1000) + 5,
    });
    return { allowed: true, remaining: maxRequests - nextCount, resetAt };
  }

  // Memory fallback (single instance only).
  const now = Date.now();
  const resetAt = now + windowMs;
  const existing = memoryStore.get(key);
  if (existing && existing.resetAt > now) {
    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt: existing.resetAt };
    }
    existing.count++;
    return { allowed: true, remaining: maxRequests - existing.count, resetAt: existing.resetAt };
  }
  memoryStore.set(key, { count: 1, resetAt });
  return { allowed: true, remaining: maxRequests - 1, resetAt };
}

export function rateLimitHeaders(remaining: number, resetAt: number) {
  return {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };
}
