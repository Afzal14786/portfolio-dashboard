export { default as ProfileHeader } from './ProfileHeader';
export { default as ReadingResources } from './ReadingResources';
export { default as SocialMediaLinks } from './SocialMediaLinks';
export { default as HobbiesSection } from './HobbiesSection';
export { default as UpdateModal } from './UpdateModal';

// Re-export ALL types from the central source of truth
export type { 
  UserProfile, 
  UpdateType, 
  ModalDataState,
  SocialLinks,
  ReadingResource,
  CloudinaryImage
} from '../../types/user';

// --- Shared Constants ---
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// --- Shared Utilities ---
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message || 'An unknown error occurred';
  }
  return 'An unknown error occurred';
};

export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
};

export const formatUrl = (url: string): string => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};