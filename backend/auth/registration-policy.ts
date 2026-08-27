/**
 * Registration policy is server-controlled. Public registration is OFF by default.
 * Set ALLOW_PUBLIC_REGISTRATION=true only after enabling the SaaS onboarding,
 * email-verification, and abuse-protection flow.
 */
export function isPublicRegistrationAllowed(value = process.env.ALLOW_PUBLIC_REGISTRATION): boolean {
  return value === "true";
}

export function assertPublicRegistrationAllowed(value = process.env.ALLOW_PUBLIC_REGISTRATION): void {
  if (!isPublicRegistrationAllowed(value)) {
    throw new Error("PUBLIC_REGISTRATION_DISABLED");
  }
}
