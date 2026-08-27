/**
 * Read-only check: does the given admin email have a user row AND an account
 * with a password hash? Prints booleans only — never the password.
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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

const email = process.env.CHECK_EMAIL || "thoriqfauzi666@gmail.com";

const { db } = await import("../backend/db/client");
const { users, accounts } = await import("../backend/db/schema/auth");
const { eq } = await import("drizzle-orm");

const u = await db.select({ id: users.id, email: users.email, createdAt: users.createdAt }).from(users).where(eq(users.email, email)).limit(1);
if (u.length === 0) {
  console.log(`USER_NOT_FOUND: ${email}`);
  process.exit(0);
}
const acct = await db.select({ id: accounts.id, hasPassword: accounts.password }).from(accounts).where(eq(accounts.userId, u[0].id)).limit(5);
console.log(`USER_FOUND: ${email}`);
console.log(`  user.id = ${u[0].id}`);
console.log(`  user.createdAt = ${u[0].createdAt}`);
console.log(`  accounts linked = ${acct.length}`);
console.log(`  has password hash = ${acct.some((a: any) => a.hasPassword && a.hasPassword.length > 0)}`);
process.exit(0);
