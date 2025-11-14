import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Instagram, Facebook, Globe, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { type UserProfile, type UpdateType } from './index';
import api from '../../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SocialMediaLink {
  platform: string;
  url: string;
}

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLink, setCurrentLink] = useState<SocialMediaLink>({
    platform: '',
    url: ''
  });
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
    setCurrentLink({ 
      platform: availablePlatforms[0] || '', 
      url: '' 
    });
    setShowAddModal(true);
  };

  const handleEditClick = (platform: PlatformKey, url: string): void => {
    setCurrentLink({ platform, url });
    setShowEditModal(true);
  };

  const handleDeleteClick = async (platform: PlatformKey): Promise<void> => {
    if (!socialMedia) return;

    try {
      setIsLoading(true);
      
      // Create updated socialMedia object without the deleted platform
      const updatedSocialMedia = { ...socialMedia };
      delete updatedSocialMedia[platform];

      // Use the correct endpoint with user_type = 'admin'
      const response = await api.patch('/admin/profile/social-media', {
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

  const isValidUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return false;
    try {
      const urlWithProtocol = urlString.includes('://') ? urlString : `https://${urlString}`;
      new URL(urlWithProtocol);
      return true;
    } catch (_) {
      return false;
    }
  };

  const formatUrl = (urlString: string): string => {
    if (!urlString.trim()) return '';
    return urlString.includes('://') ? urlString : `https://${urlString}`;
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.response?.data) {
      const errorData = error.response.data;
      
      if (typeof errorData === 'string') {
        return errorData;
      }
      if (errorData.message) {
        return errorData.message;
      }
      if (errorData.error) {
        return errorData.error;
      }
      if (errorData.detail) {
        return errorData.detail;
      }
      if (Array.isArray(errorData.errors)) {
        return errorData.errors.join(', ');
      }
      
      return JSON.stringify(errorData);
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.statusText) {
      return error.statusText;
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent, isEdit: boolean = false): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentLink.platform || !isValidUrl(currentLink.url)) {
      toast.error('Please select a platform and enter a valid URL.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsLoading(true);
    
    const formattedUrl = formatUrl(currentLink.url.trim());
    
    try {
      // Create updated socialMedia object according to backend expectations
      const updatedSocialMedia = {
        ...(socialMedia || {}),
        [currentLink.platform]: formattedUrl
      };

      // Use the correct endpoint with user_type = 'admin'
      const response = await api.patch('/admin/profile/social-media', {
        socialMedia: updatedSocialMedia
      });

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      toast.success(
        isEdit ? 'Social media link updated successfully!' : 'Social media link added successfully!',
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      
      // Call onUpdate to refresh the parent component data
      onUpdate('social-media', updatedSocialMedia);
      
      // Close modal and reset form
      setShowAddModal(false);
      setShowEditModal(false);
      setCurrentLink({ platform: '', url: '' });
      
    } catch (error: any) {
      console.error('Error updating social media:', error);
      
      const errorMessage = getErrorMessage(error);
      
      // Handle backend validation errors specifically
      if (error?.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.allowedPlatforms) {
          toast.error(`Invalid platform. Allowed platforms: ${errorData.allowedPlatforms.join(', ')}`, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`Validation Error: ${errorMessage}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else if (error?.response?.status === 401) {
        toast.error('Unauthorized: Please log in again.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        toast.error('Network error. Please check your connection and try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error(`Failed to update social media: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SocialMediaLink, value: string): void => {
    setCurrentLink(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = (): void => {
    if (!isLoading) {
      setShowAddModal(false);
      setShowEditModal(false);
      setCurrentLink({ platform: '', url: '' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      if (currentLink.platform && isValidUrl(currentLink.url)) {
        handleSubmit(e as any, showEditModal);
      }
    }
  };

  const renderModal = (isEdit: boolean = false) => (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div 
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md border border-white/50 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Edit Social Media Link' : 'Add Social Media Link'}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100/50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, isEdit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform {!isEdit && '*'}
              </label>
              <select
                value={currentLink.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-colors disabled:opacity-50"
                required={!isEdit}
                disabled={isLoading || isEdit}
              >
                <option value="">Select Platform</option>
                {(isEdit ? Object.keys(platformConfig) : availablePlatforms).map((key) => {
                  const platformKey = key as PlatformKey;
                  const config = platformConfig[platformKey];
                  return (
                    <option key={platformKey} value={platformKey}>
                      {config.label}
                    </option>
                  );
                })}
              </select>
              {!isEdit && availablePlatforms.length === 0 && (
                <p className="text-red-500 text-xs mt-1">All platforms have been added</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile URL *
              </label>
              <input
                type="text"
                value={currentLink.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-colors disabled:opacity-50"
                placeholder="https://example.com/username"
                required
                disabled={isLoading}
                maxLength={500}
              />
              {currentLink.url && !isValidUrl(currentLink.url) && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200/50">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300/50 text-gray-700 rounded-2xl hover:bg-gray-50/50 transition-colors backdrop-blur-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!currentLink.platform || !isValidUrl(currentLink.url) || isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600 font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEdit ? 'Update Link' : 'Add Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl p-6 lg:p-8 mb-8">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100/80 rounded-2xl backdrop-blur-sm">
              <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Social Media</h2>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Connect through various platforms</p>
            </div>
          </div>
          
          {hasSocialLinks && availablePlatforms.length > 0 && (
            <button
              onClick={handleAddClick}
              disabled={isLoading}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="group block p-4 lg:p-6 bg-gradient-to-br from-gray-50/50 to-purple-50/50 rounded-2xl border border-white/50 hover:border-purple-300/50 transition-all duration-200 hover:shadow-lg cursor-pointer backdrop-blur-sm relative"
                >
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditClick(platform, url)}
                      disabled={isLoading}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
                      aria-label={`Edit ${config.label}`}
                    >
                      <Edit2 className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(platform)}
                      disabled={isLoading}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
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
                      <div className={`p-2 lg:p-3 rounded-xl ${config.color} transition-transform group-hover:scale-110 shadow-sm backdrop-blur-sm`}>
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
            className="w-full text-center py-12 lg:py-16 bg-gradient-to-br from-gray-50/50 to-purple-50/50 rounded-2xl border-2 border-dashed border-gray-300/50 hover:border-purple-300/50 transition-all duration-200 cursor-pointer backdrop-blur-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add social media links"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
              <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Add Social Media Links</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm lg:text-base">
              Connect your GitHub, LinkedIn, Twitter, and other platforms to share your profiles.
            </p>
          </button>
        )}
      </div>

      {/* Add Social Media Modal */}
      {showAddModal && renderModal(false)}

      {/* Edit Social Media Modal */}
      {showEditModal && renderModal(true)}
    </>
  );
};

export default SocialMediaLinks;