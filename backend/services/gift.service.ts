import { giftRepository } from '../repositories/gift.repository';
import { invitationRepository } from '../repositories/invitation.repository';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import type { CreateGiftInput } from '../../shared/validation/gift.schema';

export const giftService = {
  async listVisible(invitationSlug: string) {
    const invitation = await invitationRepository.findBySlug(invitationSlug);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    return giftRepository.findVisible(invitation.id);
  },

  async listAll(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return giftRepository.findAllByInvitation(invitationId);
  },

  async create(invitationId: string, ownerId: string, input: CreateGiftInput) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return giftRepository.create({ invitationId, ...input });
  },

  async update(giftId: string, ownerId: string, data: Record<string, unknown>) {
    const gift = await giftRepository.findById(giftId);
    if (!gift) throw new NotFoundError('Gift tidak ditemukan');
    const invitation = await invitationRepository.findByIdWithRelations(gift.invitationId);
    if (!invitation || invitation.ownerId !== ownerId) throw new ForbiddenError();
    return giftRepository.update(giftId, data);
  },

  async delete(giftId: string, ownerId: string) {
    const gift = await giftRepository.findById(giftId);
    if (!gift) throw new NotFoundError('Gift tidak ditemukan');
    const invitation = await invitationRepository.findByIdWithRelations(gift.invitationId);
    if (!invitation || invitation.ownerId !== ownerId) throw new ForbiddenError();
    return giftRepository.delete(giftId);
  },
};
