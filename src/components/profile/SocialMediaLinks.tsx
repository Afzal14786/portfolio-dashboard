import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Instagram, Facebook, Globe, Plus, Edit2, Trash2 } from 'lucide-react';
import { type UserProfile, type UpdateType, getErrorMessage } from './index';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface SocialMediaLinksProps {
  socialMedia: UserProfile['social_media'];
  onUpdate: (type: UpdateType, data: any) => void;
}

const platformConfig = {
  github: { icon: Github, label: 'GitHub', color: 'bg-gray-900 text-white' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-700 text-white' },
  twitter: { icon: Twitter, label: 'Twitter', color: 'bg-blue-400 text-white' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' },
  facebook: { icon: Facebook, label: 'Facebook', color: 'bg-blue-600 text-white' },
  leetcode: { icon: Globe, label: 'LeetCode', color: 'bg-yellow-600 text-white' },
  medium: { icon: Globe, label: 'Medium', color: 'bg-gray-900 text-white' },
  blogSite: { icon: Globe, label: 'Blog', color: 'bg-green-600 text-white' },
  portfolio: { icon: Globe, label: 'Portfolio', color: 'bg-purple-600 text-white' }
} as const;

type PlatformKey = keyof typeof platformConfig;

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socialMedia, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get available platforms (platforms not already in use)
  const getAvailablePlatforms = (): PlatformKey[] => {
    const usedPlatforms = socialMedia ? Object.keys(socialMedia) as PlatformKey[] : [];
    return Object.keys(platformConfig).filter(
      platform => !usedPlatforms.includes(platform as PlatformKey)
    ) as PlatformKey[];
  };

  const getPlatformEntries = (): [PlatformKey, string][] => {
    if (!socialMedia) return [];
    return Object.entries(socialMedia)
      .filter(([platform]): platform is PlatformKey => platform in platformConfig)
      .map(([platform, url]) => [platform as PlatformKey, url]);
  };

  const socialLinks = getPlatformEntries();
  const hasSocialLinks = socialLinks.length > 0;
  const availablePlatforms = getAvailablePlatforms();

  const handleAddClick = (): void => {
    if (availablePlatforms.length === 0) {
      toast.info('All social media platforms have been added.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    onUpdate('social-media', { platform: availablePlatforms[0] || '', url: '' });
  };

  const handleEditClick = (platform: PlatformKey, url: string): void => {
    onUpdate('social-media', { platform, url, isEdit: true });
  };

  const handleDeleteClick = async (platform: PlatformKey): Promise<void> => {
    if (!socialMedia) return;

    try {
      setIsLoading(true);
      
      // Create updated socialMedia object without the deleted platform
      const updatedSocialMedia = { ...socialMedia };
      delete updatedSocialMedia[platform];

      const response = await api.patch('/admin/profile/update/social-media', {
        socialMedia: updatedSocialMedia
      });

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      toast.success('Social media link removed successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

      onUpdate('social-media', updatedSocialMedia);

    } catch (error: any) {
      console.error('Error deleting social media link:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to remove link: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 mb-8 transition-all duration-300 hover:bg-white/70">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100/80 rounded-2xl backdrop-blur-md border border-purple-200/50">
            <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Social Media
            </h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Connect through various platforms
            </p>
          </div>
        </div>
        
        {hasSocialLinks && availablePlatforms.length > 0 && (
          <button
            onClick={handleAddClick}
            disabled={isLoading}
            className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
            aria-label="Add new social media link"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {hasSocialLinks ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {socialLinks.map(([platform, url]) => {
            const config = platformConfig[platform];
            const IconComponent = config.icon;
            
            return (
              <div
                key={platform}
                className="group block p-4 lg:p-6 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 hover:border-purple-300/60 transition-all duration-300 hover:shadow-xl cursor-pointer hover:scale-105 transform relative"
              >
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleEditClick(platform, url)}
                    disabled={isLoading}
                    className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 cursor-pointer disabled:opacity-50 hover:scale-110"
                    aria-label={`Edit ${config.label}`}
                  >
                    <Edit2 className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(platform)}
                    disabled={isLoading}
                    className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:scale-110"
                    aria-label={`Delete ${config.label}`}
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className={`p-2 lg:p-3 rounded-xl ${config.color} transition-all duration-300 group-hover:scale-110 shadow-sm backdrop-blur-sm group-hover:shadow-md`}>
                      <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 text-sm lg:text-base truncate">
                        {config.label}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
                        <Globe className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="truncate">Visit Profile</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <button
          onClick={handleAddClick}
          disabled={isLoading || availablePlatforms.length === 0}
          className="w-full text-center py-12 lg:py-16 bg-white/50 backdrop-blur-md rounded-2xl border-2 border-dashed border-white/60 hover:border-purple-300/60 transition-all duration-300 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
          aria-label="Add social media links"
        >
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
            Add Social Media Links
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm lg:text-base">
            Connect your GitHub, LinkedIn, Twitter, and other platforms to share your profiles.
          </p>
        </button>
      )}
    </div>
  );
};

export default SocialMediaLinks;