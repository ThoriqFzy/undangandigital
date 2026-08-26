/**
 * BUILD PUBLIC VIEW MODEL
 * Transforms database data into presentation-ready public DTO.
 * Never exposes: owner_id, internal IDs, private data.
 */

import type { InvitationPublicVM } from './types';
import { invitationRepository } from '../repositories/invitation.repository';
import { coupleRepository } from '../repositories/couple.repository';
import { eventRepository } from '../repositories/event.repository';
import { storyRepository } from '../repositories/story.repository';
import { galleryRepository } from '../repositories/gallery.repository';
import { giftRepository } from '../repositories/gift.repository';
import { wishRepository } from '../repositories/wish.repository';
import type { Invitation, ThemeConfig } from '../../shared/types/invitation';

export async function buildPublicViewModel(invitation: Invitation): Promise<InvitationPublicVM> {
  const [couple, events, stories, galleryItems, gifts, wishes] = await Promise.all([
    coupleRepository.findByInvitationId(invitation.id),
    eventRepository.findVisible(invitation.id),
    storyRepository.findVisible(invitation.id),
    galleryRepository.findVisible(invitation.id),
    giftRepository.findVisible(invitation.id),
    wishRepository.findApproved(invitation.id),
  ]);

  const themeConfig = (invitation.themeOverrides && Object.keys(invitation.themeOverrides).length > 0)
    ? { ...((await import('../repositories/theme.repository')).themeRepository.findById(invitation.themeId).then(t => t?.config as ThemeConfig ?? {} as ThemeConfig)), ...invitation.themeOverrides }
    : {} as ThemeConfig;

  return {
    slug: invitation.slug,
    title: invitation.title,
    template: {
      slug: 'classic',  // Resolved from template table
      name: 'Classic Floral Blue',
      config: invitation.settings,
    },
    theme: {
      config: themeConfig,
    },
    couple: couple ? {
      groomName: couple.groomName,
      groomNickname: couple.groomNickname,
      groomPhotoUrl: null, // Resolved from assets
      groomFatherName: couple.groomFatherName,
      groomMotherName: couple.groomMotherName,
      brideName: couple.brideName,
      brideNickname: couple.brideNickname,
      bridePhotoUrl: null,
      brideFatherName: couple.brideFatherName,
      brideMotherName: couple.brideMotherName,
    } : null,
    events: events.map(e => ({
      type: e.type,
      title: e.title,
      eventDate: e.eventDate,
      startTime: e.startTime,
      endTime: e.endTime,
      timezone: e.timezone,
      venueName: e.venueName,
      address: e.address,
      mapsUrl: e.mapsUrl,
    })),
    stories: stories.map(s => ({
      yearLabel: s.yearLabel,
      title: s.title,
      description: s.description,
      imageUrl: null, // Resolved from assets
    })),
    gallery: galleryItems.map(g => ({
      imageUrl: '',  // Resolved from R2 URL
      thumbUrl: '',
      caption: g.caption,
      altText: g.altText,
    })),
    gifts: gifts.map(g => ({
      type: g.type,
      label: g.label,
      bankName: g.bankName,
      accountNumber: g.accountNumber,
      accountHolder: g.accountHolder,
      ewalletProvider: g.ewalletProvider,
      ewalletNumber: g.ewalletNumber,
      recipientName: g.recipientName,
      address: g.address,
      instructions: g.instructions,
    })),
    wishes: wishes.map(w => ({
      name: w.name,
      message: w.message,
      createdAt: w.createdAt,
    })),
    settings: {
      music: { enabled: (invitation.settings as Record<string, unknown>)?.music ? ((invitation.settings as Record<string, Record<string, unknown>>).music?.enabled as boolean) ?? false : false },
      showCountdown: true,
      showStory: true,
      showGallery: true,
      showGift: true,
      showRsvp: true,
      showWishes: true,
      ...((invitation.settings as Record<string, unknown>) || {}),
    } as InvitationPublicVM['settings'],
  };
}
