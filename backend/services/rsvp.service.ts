/**
 * RSVP SERVICE
 */

import { rsvpRepository } from '../repositories/rsvp.repository';
import { guestRepository } from '../repositories/guest.repository';
import { invitationRepository } from '../repositories/invitation.repository';
import { RSVPValidationError, NotFoundError, ForbiddenError } from '../lib/errors';
import type { SubmitRsvpInput } from '../../shared/validation/rsvp.schema';

export const rsvpService = {
  async submit(invitationId: string, input: SubmitRsvpInput) {
    const invitation = await invitationRepository.findBySlug(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');

    // Verify guest belongs to this invitation
    const guest = await guestRepository.findByIdAndInvitation(input.guestId, invitation.id);
    if (!guest) throw new RSVPValidationError('Tamu tidak ditemukan di undangan ini');

    // Validate guest count against max
    if (input.guestCount > guest.maxGuestCount) {
      throw new RSVPValidationError(
        `Jumlah tamu maksimal ${guest.maxGuestCount} orang`
      );
    }

    // Upsert RSVP
    const rsvp = await rsvpRepository.upsert({
      invitationId: invitation.id,
      guestId: input.guestId,
      status: input.status,
      guestCount: input.guestCount ?? 1,
      message: input.message,
    });

    // Update guest status
    await guestRepository.updateStatus(input.guestId, 'responded');

    return rsvp;
  },

  async listByInvitation(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return rsvpRepository.findByInvitationId(invitationId);
  },

  async countByStatus(invitationId: string) {
    return rsvpRepository.countByStatus(invitationId);
  },
};
