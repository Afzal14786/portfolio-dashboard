import api from '../api/api';
import type { UserProfile, SocialLinks, ReadingResource } from '../types/user';

export interface ProfileApiResponse {
  success: boolean;
  user: UserProfile;
  message?: string;
}

export const profileService = {
  // Fetch complete profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<ProfileApiResponse>('/admin/profile/info');
    return response.data.user;
  },

  updateSocialMedia: async (socialMedia: SocialLinks): Promise<UserProfile> => {
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/social-media', { socialMedia });
    return response.data.user;
  },

  updateReadingResources: async (readingResources: ReadingResource[]): Promise<UserProfile> => {
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/reading-resources', { readingResources });
    return response.data.user;
  },

  updateQuote: async (quote: string): Promise<UserProfile> => {
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/quote', { quote });
    return response.data.user;
  },

  updateHobbies: async (hobbies: string[]): Promise<UserProfile> => {
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/hobbies', { hobbies });
    return response.data.user;
  },

  updateProfileImage: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('profile_image', file);
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.user;
  },

  updateBannerImage: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('banner_image', file);
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.user;
  },

  updateResume: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.user;
  },

  updateBasicInfo: async (basicInfo: { name?: string; user_name?: string }): Promise<UserProfile> => {
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/basic-info', basicInfo);
    return response.data.user;
  },

  updateProfileBulk: async (bulkData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch<ProfileApiResponse>('/admin/profile/update/bulk-update', bulkData);
    return response.data.user;
  },
};