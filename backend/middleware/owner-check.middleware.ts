/**
 * OWNER CHECK MIDDLEWARE
 * Source of truth: DATABASE.md Section 25
 * 
 * Every authenticated request to admin API must verify:
 *   session → authenticated user
 *   → invitation.owner_id = session.user.id
 *   → resource.invitation_id = authorized invitation.id
 */

import { ForbiddenError, NotFoundError } from '../lib/errors';
import { invitationRepository } from '../repositories/invitation.repository';

/**
 * Verify that a user owns an invitation.
 * Returns the invitation if authorized, throws if not.
 */
export async function requireInvitationOwnership(
  invitationId: string,
  userId: string,
) {
  const invitation = await invitationRepository.findByIdWithRelations(invitationId);
  if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
  if (invitation.ownerId !== userId) throw new ForbiddenError();
  return invitation;
}

/**
 * Verify that a resource belongs to an invitation owned by the user.
 * Tenant isolation check.
 */
export async function requireResourceOwnership(
  resourceInvitationId: string,
  userId: string,
) {
  const invitation = await invitationRepository.findByIdWithRelations(resourceInvitationId);
  if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
  if (invitation.ownerId !== userId) throw new ForbiddenError();
  return invitation;
}
