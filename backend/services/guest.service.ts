/**
 * GUEST SERVICE
 */

import { guestRepository } from '../repositories/guest.repository';
import { invitationRepository } from '../repositories/invitation.repository';
import { ForbiddenError, NotFoundError } from '../lib/errors';
import type { CreateGuestInput } from '../../shared/validation/guest.schema';

export const guestService = {
  async listByInvitation(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.findByInvitationId(invitationId);
  },

  async listByStatus(invitationId: string, ownerId: string, status: 'invited' | 'viewed' | 'responded' | 'attended') {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.findByStatus(invitationId, status);
  },

  async create(invitationId: string, ownerId: string, input: CreateGuestInput) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.create({ invitationId, ...input });
  },

  async createMany(invitationId: string, ownerId: string, guests: CreateGuestInput[]) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.createMany(guests.map(g => ({ invitationId, ...g })));
  },

  async update(guestId: string, ownerId: string, data: Record<string, unknown>) {
    const guest = await guestRepository.findByIdForOwner(guestId, ownerId);
    if (!guest) throw new NotFoundError('Tamu tidak ditemukan');
    const invitation = await invitationRepository.findByIdWithRelations(guest.invitationId);
    if (!invitation || invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.update(guestId, data);
  },

  async delete(guestId: string, ownerId: string) {
    const guest = await guestRepository.findByIdForOwner(guestId, ownerId);
    if (!guest) throw new NotFoundError('Tamu tidak ditemukan');
    const invitation = await invitationRepository.findByIdWithRelations(guest.invitationId);
    if (!invitation || invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.softDelete(guestId);
  },

  async search(invitationId: string, ownerId: string, query: string) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.searchByName(invitationId, query);
  },

  async countByStatus(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findByIdWithRelations(invitationId);
    if (!invitation) throw new NotFoundError('Invitation tidak ditemukan');
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return guestRepository.countByStatus(invitationId);
  },
};
