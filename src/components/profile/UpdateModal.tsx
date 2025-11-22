import React, { useState, useEffect } from 'react';
import { X, Book, Globe, Heart, Plus } from 'lucide-react';
import { type UpdateType, isValidUrl, formatUrl, getErrorMessage } from './index';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: UpdateType;
  onSubmit: (type: UpdateType, data: any) => void;
  existingData?: any;
}

// Platform configuration for social media
const platformConfig = {
  github: { label: 'GitHub' },
  linkedin: { label: 'LinkedIn' },
  twitter: { label: 'Twitter' },
  instagram: { label: 'Instagram' },
  facebook: { label: 'Facebook' },
  leetcode: { label: 'LeetCode' },
  medium: { label: 'Medium' },
  blogSite: { label: 'Blog' },
  portfolio: { label: 'Portfolio' }
} as const;

type PlatformKey = keyof typeof platformConfig;

// Common hobby suggestions
const hobbySuggestions = [
  'Coding', 'Reading', 'Travel', 'Music', 'Sports', 'Cooking', 
  'Gaming', 'Art', 'Photography', 'Writing', 'Dancing', 'Yoga',
  'Gardening', 'Hiking', 'Cycling', 'Swimming', 'Chess', 'Movies',
  'Podcasts', 'Learning', 'Volunteering', 'DIY Projects', 'Fitness'
];

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmit,
  existingData
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Initialize empty form based on type
      const initialFormData = {
        'quote': { quote: existingData?.currentQuote || '' },
        'reading-resource': { title: '', url: '' },
        'social-media': { platform: '', url: '' },
        'hobby': { name: '' }
      }[type] || {};
      
      setFormData(initialFormData);
    }
  }, [isOpen, type, existingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      let updatePayload;

      switch (type) {
        case 'quote':
          if (!formData.quote?.trim()) {
            toast.error('Please enter a quote.');
            setIsLoading(false);
            return;
          }
          
          if (formData.quote.length > 200) {
            toast.error('Quote cannot exceed 200 characters');
            setIsLoading(false);
            return;
          }

          response = await api.patch("/admin/profile/update/quote", { 
            quote: formData.quote 
          });
          
          updatePayload = { quote: formData.quote };
          break;

        case 'reading-resource':
          if (!formData.title?.trim() || !isValidUrl(formData.url)) {
            toast.error("Please fill in all required fields with valid data.");
            setIsLoading(false);
            return;
          }
          
          const newResource = {
            title: formData.title.trim(),
            url: formatUrl(formData.url.trim())
          };

          // Get current resources from existingData
          const currentResources = Array.isArray(existingData?.reading_resources) 
            ? existingData.reading_resources 
            : [];

          // Create updated array by adding the new resource
          const updatedReadingResources = [...currentResources, newResource];

          // Send the complete array to backend as required
          response = await api.patch("/admin/profile/update/reading-resources", {
            readingResources: updatedReadingResources
          });

          updatePayload = updatedReadingResources;
          break;

        case 'social-media':
          if (!formData.platform || !isValidUrl(formData.url)) {
            toast.error('Please select a platform and enter a valid URL.');
            setIsLoading(false);
            return;
          }

          const formattedUrl = formatUrl(formData.url.trim());
          const currentSocialMedia = existingData?.social_media || {};
          const updatedSocialMedia = {
            ...currentSocialMedia,
            [formData.platform]: formattedUrl
          };

          response = await api.patch('/admin/profile/update/social-media', {
            socialMedia: updatedSocialMedia
          });

          updatePayload = updatedSocialMedia;
          break;

        case 'hobby':
          if (!formData.name?.trim()) {
            toast.error('Please enter a hobby.');
            setIsLoading(false);
            return;
          }

          const currentHobbies = Array.isArray(existingData?.hobbies) 
            ? existingData.hobbies 
            : [];
          const updatedHobbies = [...currentHobbies, formData.name.trim()];
          
          response = await api.patch('/admin/profile/update/hobbies', {
            hobbies: updatedHobbies
          });

          updatePayload = updatedHobbies;
          break;

        default:
          setIsLoading(false);
          return;
      }

      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      toast.success(`${getModalTitle()} successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });

      onSubmit(type, updatePayload);
      onClose();
      
    } catch (error: any) {
      console.error(`Error updating ${type}:`, error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to ${type === 'quote' ? 'update quote' : `add ${type}`}: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prev: any) => ({ ...prev, name: suggestion }));
  };

  const getModalTitle = () => {
    const titles = {
      'quote': existingData?.currentQuote ? 'Update Quote' : 'Add Quote',
      'reading-resource': 'Add Reading Resource',
      'social-media': existingData?.isEdit ? 'Edit Social Media Link' : 'Add Social Media Link',
      'hobby': 'Add Hobby'
    };
    return titles[type] || 'Update';
  };

  const getModalIcon = () => {
    const icons = {
      'quote': <Plus className="w-6 h-6" />,
      'reading-resource': <Book className="w-6 h-6" />,
      'social-media': <Globe className="w-6 h-6" />,
      'hobby': <Heart className="w-6 h-6" />
    };
    return icons[type] || <Plus className="w-6 h-6" />;
  };

  const renderFormContent = () => {
    switch (type) {
      case 'quote':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Quote {formData.quote?.length > 0 && `(${formData.quote.length}/200)`}
              </label>
              <textarea
                value={formData.quote || ''}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                rows={4}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-colors resize-none disabled:opacity-50"
                placeholder="Share an inspiring quote or thought..."
                disabled={isLoading}
                required
              />
              {formData.quote?.length >= 190 && (
                <p className="text-red-500 text-xs mt-1">{200 - (formData.quote?.length || 0)} characters remaining</p>
              )}
            </div>
          </div>
        );

      case 'reading-resource':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 hover:bg-white/80 focus:bg-white/80"
                placeholder="Enter resource title"
                required
                autoFocus
                disabled={isLoading}
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <input
                type="text"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 hover:bg-white/80 focus:bg-white/80"
                placeholder="https://example.com or example.com"
                required
                disabled={isLoading}
                maxLength={500}
              />
              {formData.url && !isValidUrl(formData.url) && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>
              )}
            </div>
          </div>
        );

      case 'social-media':
        const availablePlatforms = Object.keys(platformConfig) as PlatformKey[];
        
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform {!existingData?.isEdit && '*'}
              </label>
              <select
                value={formData.platform || ''}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 hover:bg-white/80 focus:bg-white/80"
                required={!existingData?.isEdit}
                disabled={isLoading || existingData?.isEdit}
              >
                <option value="">Select Platform</option>
                {availablePlatforms.map((key) => (
                  <option key={key} value={key}>
                    {platformConfig[key].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile URL *
              </label>
              <input
                type="text"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 hover:bg-white/80 focus:bg-white/80"
                placeholder="https://example.com/username"
                required
                disabled={isLoading}
                maxLength={500}
              />
              {formData.url && !isValidUrl(formData.url) && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>
              )}
            </div>
          </div>
        );

      case 'hobby':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hobby Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/60 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 hover:bg-white/80 focus:bg-white/80"
                placeholder="Enter hobby name"
                required
                autoFocus
                disabled={isLoading}
                maxLength={50}
              />
            </div>

            {/* Hobby Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Suggestions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {hobbySuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                    className="px-3 py-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl text-sm transition-all duration-300 disabled:opacity-50 text-left hover:scale-105 border border-white/40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      return type === 'quote' ? 'Updating...' : 'Adding...';
    }
    
    const texts = {
      'quote': existingData?.currentQuote ? 'Update Quote' : 'Add Quote',
      'reading-resource': 'Add Resource',
      'social-media': existingData?.isEdit ? 'Update Link' : 'Add Link',
      'hobby': 'Add Hobby'
    };
    return texts[type] || 'Add';
  };

  const isFormValid = () => {
    switch (type) {
      case 'quote':
        return formData.quote?.trim() && formData.quote.length <= 200;
      case 'reading-resource':
        return formData.title?.trim() && isValidUrl(formData.url);
      case 'social-media':
        return formData.platform && isValidUrl(formData.url);
      case 'hobby':
        return formData.name?.trim();
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/40 p-6 transition-all duration-300 hover:bg-white/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              {getModalIcon()}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getModalTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100/80 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {renderFormContent()}

          {/* Actions */}
          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300/60 text-gray-700 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 backdrop-blur-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {getSubmitButtonText()}
                </>
              ) : (
                getSubmitButtonText()
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;