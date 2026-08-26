/**
 * INVITATION SERVICE
 * Business logic for invitation management.
 * Orchestrates repositories, enforces authorization, validates data.
 */

import { invitationRepository } from '../repositories/invitation.repository';
import { coupleRepository } from '../repositories/couple.repository';
import { SlugConflictError, InvitationNotFoundError, ForbiddenError } from '../lib/errors';
import { isValidSlug } from '../../shared/utils/slug';
import type { CreateInvitationInput, UpdateInvitationInput } from '../../shared/validation/invitation.schema';

export const invitationService = {
  /**
   * Get invitation for public view (by slug).
   * Only returns published invitations.
   */
  async getPublicBySlug(slug: string) {
    const invitation = await invitationRepository.findBySlug(slug);
    if (!invitation) throw new InvitationNotFoundError(slug);
    return invitation;
  },

  /**
   * Get invitation with full relations (admin view).
   * Enforces ownership.
   */
  async getAdminById(id: string, ownerId: string) {
    const invitation = await invitationRepository.findByIdWithRelations(id);
    if (!invitation) throw new InvitationNotFoundError();
    if (invitation.ownerId !== ownerId) throw new ForbiddenError();
    return invitation;
  },

  /**
   * List all invitations for an owner.
   */
  async listByOwner(ownerId: string) {
    return invitationRepository.findByOwnerId(ownerId);
  },

  /**
   * Create a new invitation.
   */
  async create(ownerId: string, input: CreateInvitationInput) {
    if (!isValidSlug(input.slug)) {
      throw new Error('Format slug tidak valid');
    }
    const available = await invitationRepository.isSlugAvailable(input.slug);
    if (!available) throw new SlugConflictError(input.slug);

    const invitation = await invitationRepository.create({
      ownerId,
      templateId: input.templateId,
      themeId: input.themeId,
      slug: input.slug,
      title: input.title,
      settings: input.settings,
    });

    // Create empty couple profile
    await coupleRepository.create({
      invitationId: invitation.id,
      groomName: 'Mempelai Pria',
      brideName: 'Mempelai Wanita',
    });

    return invitation;
  },

  /**
   * Update an invitation.
   */
  async update(id: string, ownerId: string, input: UpdateInvitationInput) {
    const existing = await invitationRepository.findByIdWithRelations(id);
    if (!existing) throw new InvitationNotFoundError();
    if (existing.ownerId !== ownerId) throw new ForbiddenError();

    if (input.slug && input.slug !== existing.slug) {
      if (!isValidSlug(input.slug)) throw new Error('Format slug tidak valid');
      const available = await invitationRepository.isSlugAvailable(input.slug, id);
      if (!available) throw new SlugConflictError(input.slug);
    }

    return invitationRepository.update(id, input);
  },

  /**
   * Publish an invitation.
   */
  async publish(id: string, ownerId: string) {
    const existing = await invitationRepository.findByIdWithRelations(id);
    if (!existing) throw new InvitationNotFoundError();
    if (existing.ownerId !== ownerId) throw new ForbiddenError();
    return invitationRepository.publish(id);
  },

  /**
   * Unpublish an invitation.
   */
  async unpublish(id: string, ownerId: string) {
    const existing = await invitationRepository.findByIdWithRelations(id);
    if (!existing) throw new InvitationNotFoundError();
    if (existing.ownerId !== ownerId) throw new ForbiddenError();
    return invitationRepository.unpublish(id);
  },

  /**
   * Soft delete an invitation.
   */
  async softDelete(id: string, ownerId: string) {
    const existing = await invitationRepository.findByIdWithRelations(id);
    if (!existing) throw new InvitationNotFoundError();
    if (existing.ownerId !== ownerId) throw new ForbiddenError();
    return invitationRepository.softDelete(id);
  },
};
