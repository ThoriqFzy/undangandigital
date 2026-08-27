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
const { invitations } = schema;
const { eq } = await import("drizzle-orm");
const { buildPublicViewModel } = await import("../backend/viewmodels/invitation-public.vm.ts");
const { invitationRepository } = await import("../backend/repositories/invitation.repository.ts");

const inv = await db.select().from(invitations).where(eq(invitations.slug, "fauzan-indah")).limit(1);
console.log("raw themeId:", inv[0].themeId);
console.log("raw themeOverrides:", JSON.stringify(inv[0].themeOverrides));
const vm = await buildPublicViewModel(inv[0]);
console.log("VM theme.config:", JSON.stringify(vm.theme.config));
process.exit(0);
