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