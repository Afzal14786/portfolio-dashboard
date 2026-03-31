import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Instagram, Facebook, Globe, Plus, Edit2, Trash2 } from 'lucide-react';
import { type UserProfile, type UpdateType, getErrorMessage } from './index';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface SocialMediaLinksProps {
  socialMedia: UserProfile['social_media'];
  onUpdate: (type: UpdateType, data: unknown) => void;
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
  
  const getAvailablePlatforms = (): PlatformKey[] => {
    const usedPlatforms = socialMedia ? Object.keys(socialMedia) as PlatformKey[] : [];
    return (Object.keys(platformConfig) as PlatformKey[]).filter(
      platform => !usedPlatforms.includes(platform)
    );
  };

  const getPlatformEntries = (): [PlatformKey, string][] => {
    if (!socialMedia) return [];
    return (Object.entries(socialMedia) as [string, string][])
      .filter((entry): entry is [PlatformKey, string] => entry[0] in platformConfig)
      .map(([platform, url]) => [platform, url]);
  };

  const socialLinks = getPlatformEntries();
  const hasSocialLinks = socialLinks.length > 0;
  const availablePlatforms = getAvailablePlatforms();

  const handleAddClick = (): void => {
    if (availablePlatforms.length === 0) return;
    onUpdate('social-media', { platform: availablePlatforms[0], url: '' });
  };

  const handleEditClick = (platform: PlatformKey, url: string): void => {
    onUpdate('social-media', { platform, url, isEdit: true });
  };

  const handleDeleteClick = async (platform: PlatformKey): Promise<void> => {
    if (!socialMedia) return;
    try {
      setIsLoading(true);
      const updatedSocialMedia = { ...socialMedia };
      delete updatedSocialMedia[platform];

      await api.patch('/admin/profile/update/social-media', { socialMedia: updatedSocialMedia });
      toast.success('Removed successfully!');
      onUpdate('social-media', updatedSocialMedia);
    } catch (error: unknown) {
      toast.error(`Failed to remove link: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 mb-8 transition-all duration-300 hover:bg-white/70">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100/80 rounded-2xl"><Globe className="w-5 h-5 text-purple-600" /></div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Social Media</h2>
            <p className="text-gray-600 mt-1 text-sm">Connect through various platforms</p>
          </div>
        </div>
        {hasSocialLinks && availablePlatforms.length > 0 && (
          <button onClick={handleAddClick} disabled={isLoading} className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:scale-105"><Plus className="w-5 h-5" /></button>
        )}
      </div>

      {hasSocialLinks ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialLinks.map(([platform, url]) => {
            const config = platformConfig[platform];
            const IconComponent = config.icon;
            return (
              <div key={platform} className="group p-4 bg-white/50 rounded-2xl border hover:shadow-xl relative">
                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleEditClick(platform, url)} disabled={isLoading} className="p-1.5 bg-white/80 rounded-lg hover:bg-white"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => handleDeleteClick(platform)} disabled={isLoading} className="p-1.5 bg-white/80 rounded-lg hover:bg-red-50"><Trash2 className="w-3 h-3 text-red-600" /></button>
                </div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${config.color}`}><IconComponent className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{config.label}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500"><Globe className="w-3 h-3" /><span>Visit</span></div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <button onClick={handleAddClick} disabled={isLoading} className="w-full text-center py-12 border-2 border-dashed rounded-2xl hover:border-purple-300">Add Social Links</button>
      )}
    </div>
  );
};
export default SocialMediaLinks;