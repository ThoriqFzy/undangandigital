/**
 * Remove an orphaned/incomplete user (no linked account / password) by email.
 * Targets a single email only. Safe to re-run.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

const email = process.env.PURGE_EMAIL;
if (!email) {
  console.error("❌ Set PURGE_EMAIL=target@example.com");
  process.exit(1);
}

const { db } = await import("../backend/db/client");
const { users, accounts, sessions } = await import("../backend/db/schema/auth");
const { eq } = await import("drizzle-orm");

const u = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
if (u.length === 0) {
  console.log(`NOTHING_TO_DO: ${email} not found`);
  process.exit(0);
}
const userId = u[0].id;

// Cascade delete related rows (FK onDelete cascade would also handle this, but be explicit).
await db.delete(sessions).where(eq(sessions.userId, userId));
await db.delete(accounts).where(eq(accounts.userId, userId));
await db.delete(users).where(eq(users.id, userId));
console.log(`✅ Purged orphaned user ${email} (id: ${userId})`);
process.exit(0);
