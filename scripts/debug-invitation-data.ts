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
const s = await import("../backend/db/index.ts");
const { invitations, stories, galleryItems, gifts, wishes, events, couples, guests, rsvps } = s;
const { eq, count } = await import("drizzle-orm");

const inv = await db.select({ id: invitations.id, slug: invitations.slug }).from(invitations).where(eq(invitations.slug, "fauzan-indah")).limit(1);
const id = inv[0].id;
const c = async (t) => (await db.select({ n: count() }).from(t).where(eq(t.invitationId, id)))[0].n;
console.log("INVITATION:", inv[0].slug);
console.log("  couples:", await c(couples));
console.log("  events:", await c(events));
console.log("  stories:", await c(stories));
console.log("  gallery:", await c(galleryItems));
console.log("  gifts:", await c(gifts));
console.log("  wishes:", await c(wishes));
console.log("  guests:", await c(guests));
console.log("  rsvps:", await c(rsvps));
process.exit(0);
