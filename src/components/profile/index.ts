export { default as ProfileHeader } from './ProfileHeader';
export { default as ReadingResources } from './ReadingResources';
export { default as SocialMediaLinks } from './SocialMediaLinks';
export { default as HobbiesSection } from './HobbiesSection';
export { default as UpdateModal } from './UpdateModal';

export interface UserProfile {
  user_name: string;
  name: string;
  email: string;
  resume?: string;
  profile_image?: string;
  banner_image?: string;
  social_media?: Record<string, string>;
  hobbies: string[];
  reading_resources: Array<{ title: string; url: string }>;
  quote?: string;
  blog_count: number;
}

export type UpdateType = 'banner' | 'profile' | 'reading-resource' | 'social-media' | 'hobby' | 'quote' | 'resume';

// Common utility functions
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  return error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again.";
};

export const isValidUrl = (urlString: string): boolean => {
  if (!urlString.trim()) return false;
  try {
    const urlWithProtocol = urlString.includes("://") ? urlString : `https://${urlString}`;
    new URL(urlWithProtocol);
    return true;
  } catch (_) {
    return false;
  }
};

export const formatUrl = (urlString: string): string => {
  if (!urlString.trim()) return "";
  return urlString.includes("://") ? urlString : `https://${urlString}`;
};

// Constants
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB