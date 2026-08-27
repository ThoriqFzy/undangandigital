/**
 * Seed the FIRST admin user.
 *
 * Password is read from the environment (ADMIN_PASSWORD) — never hardcoded,
 * never written to disk. Run locally with:
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='****' \
 *     ALLOW_PUBLIC_REGISTRATION=true npm run seed:admin
 *
 * ALLOW_PUBLIC_REGISTRATION=true is required ONLY for this script's process so
 * the Better Auth signUp call is permitted. It does NOT change the app's policy.
 *
 * This script loads local .env (Astro loads it automatically in-app, but tsx does not),
 * then dynamically imports the auth module so DATABASE_URL is available first.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// --- Minimal .env loader (no extra dependency) ---
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || email?.split("@")[0] || "Admin";

  if (!email || !password) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.");
    console.error("   Example:");
    console.error('   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD="****" ALLOW_PUBLIC_REGISTRATION=true npm run seed:admin');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters.");
    process.exit(1);
  }

  // Import auth AFTER env is loaded.
  const { auth } = await import("../backend/auth/config");

  try {
    const res = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    const created = (res as { user?: { id?: string; email?: string } }).user;
    console.log(`✅ Admin user created: ${created?.email ?? email} (id: ${created?.id ?? "?"})`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (/already|exists|taken/i.test(message)) {
      console.log(`ℹ️  Admin user ${email} already exists — nothing to do.`);
      process.exit(0);
    }
    console.error("❌ Failed to create admin user:", message);
    process.exit(1);
  }

  process.exit(0);
}

main();
