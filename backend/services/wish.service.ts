/**
 * WISH SERVICE
 */

import { wishRepository } from '../repositories/wish.repository';
import { invitationRepository } from '../repositories/invitation.repository';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import type { SubmitWishInput } from '../../shared/validation/wish.schema';

export const wishService = {
  async submit(invitationSlug: string, input: SubmitWishInput) {
    const invitation = await invitationRepository.findBySlug(invitationSlug);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    return wishRepository.create({
      invitationId: invitation.id,
      name: input.name,
      message: input.message,
    });
  },

  async listApproved(invitationId: string) {
    return wishRepository.findApproved(invitationId);
  },

  async listAll(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return wishRepository.findAllByInvitation(invitationId);
  },

  async moderate(wishId: string, ownerId: string, status: 'approved' | 'hidden') {
    const wish = await wishRepository.findById(wishId);
    if (!wish) throw new NotFoundError('Ucapan tidak ditemukan');
    const invitation = await invitationRepository.findByIdWithRelations(wish.invitationId);
    if (!invitation || invitation.ownerId !== ownerId) throw new ForbiddenError();
    return wishRepository.updateStatus(wishId, status);
  },

  async delete(wishId: string, ownerId: string) {
    const wish = await wishRepository.findById(wishId);
    if (!wish) throw new NotFoundError('Ucapan tidak ditemukan');
    const invitation = await invitationRepository.findByIdWithRelations(wish.invitationId);
    if (!invitation || invitation.ownerId !== ownerId) throw new ForbiddenError();
    return wishRepository.softDelete(wishId);
  },
};
