export interface ReadingResource {
  title: string;
  url: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  portfolio?: string;
  medium?: string;
  leetcode?: string;
  blogSite?: string;
}

export interface CloudinaryImage {
  public_id: string;
  url: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  user_name: string;
  email: string;
  profile_image?: CloudinaryImage | string;
  banner_image?: CloudinaryImage | string;
  resume?: CloudinaryImage | string;
  social_media: SocialLinks;
  hobbies: string[];
  reading_resources: ReadingResource[];
  quote: string;
  blog_count?: number;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

// Explicit types for the update modes
export type UpdateType = 
  | 'profile' 
  | 'banner' 
  | 'resume' 
  | 'basic-info' 
  | 'social-media' 
  | 'reading-resource' 
  | 'quote' 
  | 'hobby' 
  | 'hobbies';

export interface ModalDataState {
  currentQuote?: string;
  reading_resources?: ReadingResource[];
  social_media?: SocialLinks;
  hobbies?: string[];
  [key: string]: unknown; 
}

// Standard Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  userName: string;
  email: string;
  password: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}

/**
 * Validates if a given string is a properly formatted URL.
 * Accepts http://, https://, and www. prefixes.
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    // If it doesn't have a protocol, add a dummy one just for validation
    const urlToTest = urlString.startsWith('http://') || urlString.startsWith('https://') 
      ? urlString 
      : `https://${urlString}`;
      
    const url = new URL(urlToTest);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    console.error(`Error : ${e}`);
    return false;
  }
};

/**
 * Formats a URL string to ensure it has a valid protocol.
 * If the user types "github.com/username", it returns "https://github.com/username"
 */
export const formatUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmedUrl = url.trim();
  
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  return `https://${trimmedUrl}`;
};