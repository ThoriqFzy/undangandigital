import { describe, expect, it } from "vitest";
import { isPublicRegistrationAllowed } from "@backend/auth/registration-policy";

describe("isPublicRegistrationAllowed", () => {
  it("denies public registration unless the environment flag is exactly true", () => {
    expect(isPublicRegistrationAllowed(undefined)).toBe(false);
    expect(isPublicRegistrationAllowed("")).toBe(false);
    expect(isPublicRegistrationAllowed("false")).toBe(false);
    expect(isPublicRegistrationAllowed("TRUE")).toBe(false);
    expect(isPublicRegistrationAllowed("true")).toBe(true);
  });
});
