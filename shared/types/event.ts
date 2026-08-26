/**
 * TYPES — Event
 */

import type { EventType } from '../constants/enum-values';

export interface WeddingEvent {
  id: string;
  invitationId: string;
  type: EventType;
  title: string;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  timezone: string;
  venueName: string | null;
  address: string | null;
  mapsUrl: string | null;
  description: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
