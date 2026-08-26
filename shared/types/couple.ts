/**
 * TYPES — Couple
 */

export interface Couple {
  id: string;
  invitationId: string;
  groomName: string;
  groomNickname: string | null;
  groomPhotoAssetId: string | null;
  groomFatherName: string | null;
  groomMotherName: string | null;
  groomSocialLinks: SocialLinks;
  brideName: string;
  brideNickname: string | null;
  bridePhotoAssetId: string | null;
  brideFatherName: string | null;
  brideMotherName: string | null;
  brideSocialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}
