import { describe, expect, it } from "vitest";
import { slugSchema, createInvitationSchema } from "@shared/validation/invitation.schema";
import { submitRsvpSchema } from "@shared/validation/rsvp.schema";
import { themeConfigSchema } from "@shared/validation/theme.schema";

describe("slugSchema", () => {
  it("accepts lowercase dash slug", () => {
    expect(slugSchema.safeParse("budi-ahmad").success).toBe(true);
  });
  it("rejects uppercase and spaces", () => {
    expect(slugSchema.safeParse("Budi Ahmad").success).toBe(false);
  });
});

describe("createInvitationSchema", () => {
  it("requires valid template and theme uuid", () => {
    const res = createInvitationSchema.safeParse({
      slug: "test",
      templateId: "not-uuid",
      themeId: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(res.success).toBe(false);
  });

  it("accepts valid uuids", () => {
    const res = createInvitationSchema.safeParse({
      slug: "test",
      templateId: "123e4567-e89b-12d3-a456-426614174000",
      themeId: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(res.success).toBe(true);
  });
});

describe("submitRsvpSchema", () => {
  it("defaults guestCount to 1 when omitted", () => {
    const res = submitRsvpSchema.safeParse({
      guestId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Budi",
      status: "attending",
    });
    expect(res.success).toBe(true);
  });

  it("rejects missing guestId", () => {
    const res = submitRsvpSchema.safeParse({ name: "Budi", status: "attending" });
    expect(res.success).toBe(false);
  });
});

describe("themeConfigSchema", () => {
  it("rejects invalid hex color", () => {
    const res = themeConfigSchema.safeParse({
      colors: { primary: "red", secondary: "#0ea5e9", background: "#fff", surface: "#f8fafc", text: "#111" },
      typography: { heading: "Playfair", body: "Inter" },
      buttons: { radius: "0.75rem" },
      animation: { intensity: "medium" },
    });
    expect(res.success).toBe(false);
  });

  it("accepts valid config", () => {
    const res = themeConfigSchema.safeParse({
      colors: { primary: "#4f46e5", secondary: "#0ea5e9", background: "#ffffff", surface: "#f8fafc", text: "#1f2937" },
      typography: { heading: "Playfair", body: "Inter" },
      buttons: { radius: "0.75rem" },
      animation: { intensity: "medium" },
    });
    expect(res.success).toBe(true);
  });
});
