/**
 * Read-only: list invitations + themes. No secrets.
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

const { db } = await import("../backend/db/client.ts");
const schema = await import("../backend/db/index.ts");
const { invitations, themes } = schema;
const { desc } = await import("drizzle-orm");

const invs = await db.select({ id: invitations.id, slug: invitations.slug, status: invitations.status, themeId: invitations.themeId, title: invitations.title }).from(invitations).orderBy(desc(invitations.createdAt)).limit(20);
console.log(`INVITATIONS (${invs.length}):`);
for (const i of invs) console.log(`  - slug="${i.slug}" status=${i.status} themeId=${i.themeId ?? "null"} title=${i.title ?? "null"}`);

const th = await db.select({ id: themes.id, name: themes.name, slug: themes.slug }).from(themes).limit(20);
console.log(`THEMES (${th.length}):`);
for (const t of th) console.log(`  - ${t.slug} (${t.id}) ${t.name}`);
process.exit(0);
