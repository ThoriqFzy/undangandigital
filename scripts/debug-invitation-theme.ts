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
const { eq } = await import("drizzle-orm");

const inv = await db.select({ id: invitations.id, slug: invitations.slug, themeId: invitations.themeId, themeOverrides: invitations.themeOverrides }).from(invitations).where(eq(invitations.slug, "fauzan-indah")).limit(1);
console.log("INVITATION:", JSON.stringify(inv[0], null, 2));
if (inv[0]?.themeId) {
  const th = await db.select({ id: themes.id, slug: themes.slug, config: themes.config }).from(themes).where(eq(themes.id, inv[0].themeId)).limit(1);
  console.log("THEME:", JSON.stringify(th[0], null, 2));
}
process.exit(0);
