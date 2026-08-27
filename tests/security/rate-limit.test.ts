import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@backend/middleware/rate-limit.middleware";

describe("checkRateLimit (in-memory fallback)", () => {
  it("allows up to maxRequests then blocks", async () => {
    const key = `test:${Math.random()}`;
    const cfg = { windowMs: 1000, maxRequests: 3 };
    expect((await checkRateLimit(key, cfg)).allowed).toBe(true);
    expect((await checkRateLimit(key, cfg)).allowed).toBe(true);
    expect((await checkRateLimit(key, cfg)).allowed).toBe(true);
    expect((await checkRateLimit(key, cfg)).allowed).toBe(false);
  });

  it("treats different keys independently", async () => {
    const a = `a:${Math.random()}`;
    const b = `b:${Math.random()}`;
    const cfg = { windowMs: 1000, maxRequests: 1 };
    expect((await checkRateLimit(a, cfg)).allowed).toBe(true);
    expect((await checkRateLimit(a, cfg)).allowed).toBe(false);
    expect((await checkRateLimit(b, cfg)).allowed).toBe(true);
  });
});
