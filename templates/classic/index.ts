/**
 * CLASSIC TEMPLATE — Template Engine Entry
 * Source of truth: ARCHITECTURE.md Section 20
 * 
 * Template contract: receives InvitationViewModel, renders sections.
 * Template MUST NOT access database directly.
 */

import type { InvitationPublicVM } from '../../backend/viewmodels/types';

export interface TemplateSection {
  id: string;
  name: string;
  component: string;  // Astro/React component path
  visible: boolean;
}

export interface TemplateConfig {
  id: string;
  name: string;
  version: string;
  sections: TemplateSection[];
}

/**
 * Classic template configuration.
 * Sections are rendered in order from top to bottom.
 */
export const classicTemplate: TemplateConfig = {
  id: 'classic',
  name: 'Classic Floral Blue',
  version: '1.0.0',
  sections: [
    { id: 'cover',     name: 'Cover',     component: 'Cover',     visible: true },
    { id: 'quote',     name: 'Quote',     component: 'Quote',     visible: true },
    { id: 'couple',    name: 'Couple',    component: 'Couple',    visible: true },
    { id: 'countdown', name: 'Countdown', component: 'Countdown', visible: true },
    { id: 'events',    name: 'Events',    component: 'Events',    visible: true },
    { id: 'story',     name: 'Story',     component: 'Story',     visible: true },
    { id: 'gallery',   name: 'Gallery',   component: 'Gallery',   visible: true },
    { id: 'gift',      name: 'Gift',      component: 'Gift',      visible: true },
    { id: 'rsvp',      name: 'RSVP',      component: 'RSVP',      visible: true },
    { id: 'wishes',    name: 'Wishes',    component: 'Wishes',    visible: true },
    { id: 'closing',   name: 'Closing',   component: 'Closing',   visible: true },
  ],
};

/**
 * Get visible sections based on invitation settings.
 */
export function getVisibleSections(settings: Record<string, unknown>): TemplateSection[] {
  const sectionVisibility: Record<string, string> = {
    countdown: 'showCountdown',
    story: 'showStory',
    gallery: 'showGallery',
    gift: 'showGift',
    rsvp: 'showRsvp',
    wishes: 'showWishes',
  };

  return classicTemplate.sections.map(section => {
    const settingKey = sectionVisibility[section.id];
    if (settingKey && settings[settingKey] === false) {
      return { ...section, visible: false };
    }
    return section;
  });
}
