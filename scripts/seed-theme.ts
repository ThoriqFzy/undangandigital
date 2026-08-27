/**
 * Seed "tropical-elegant" theme (maroon/gold/cream, serif) and assign it to an
 * invitation slug. Idempotent: skips if theme slug already exists.
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

const TARGET_SLUG = process.env.TARGET_SLUG || "fauzan-indah";

const { db } = await import("../backend/db/client.ts");
const schema = await import("../backend/db/index.ts");
const { themes, invitations } = schema;
const { eq } = await import("drizzle-orm");

const THEME = {
  slug: "tropical-elegant",
  name: "Tropical Elegant",
  description: "Maroon, gold, and cream with elegant serif typography — Javanese-Balinese wedding feel.",
  config: {
    colors: {
      primary: "#7B2D26",      // deep maroon
      secondary: "#B8860B",    // gold
      accent: "#9C2A2A",       // brighter maroon accent
      background: "#FBF6EC",   // warm cream
      surface: "#FFFFFF",
      surfaceSoft: "#F3E9D8",
      text: "#3A2E2B",         // dark warm brown
      textMuted: "#8A7B6F",
      textLight: "#B8A99C",
      border: "#E6D9C5",
      borderSoft: "#F0E8DA",
    },
    typography: {
      heading: "'Cormorant Garamond', 'Playfair Display', serif",
      body: "'Inter', 'Helvetica Neue', sans-serif",
      display: "'Playfair Display', 'Cormorant Garamond', serif",
      accent: "'Great Vibes', cursive",
    },
    buttons: { radius: "0.5rem" },
    animation: { intensity: "medium" },
  },
};

const existing = await db.select({ id: themes.id }).from(themes).where(eq(themes.slug, THEME.slug)).limit(1);
let themeId: string;
if (existing.length > 0) {
  themeId = existing[0].id;
  console.log(`ℹ️  Theme ${THEME.slug} already exists (${themeId})`);
} else {
  const [created] = await db.insert(themes).values(THEME).returning();
  themeId = created.id;
  console.log(`✅ Created theme ${THEME.slug} (${themeId})`);
}

const inv = await db.select({ id: invitations.id, slug: invitations.slug }).from(invitations).where(eq(invitations.slug, TARGET_SLUG)).limit(1);
if (inv.length === 0) {
  console.log(`⚠️  Invitation ${TARGET_SLUG} not found — skipping assignment`);
} else {
  await db.update(invitations).set({ themeId, updatedAt: new Date() }).where(eq(invitations.id, inv[0].id));
  console.log(`✅ Assigned ${THEME.slug} to invitation ${TARGET_SLUG}`);
}
process.exit(0);
