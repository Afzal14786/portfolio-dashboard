import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Book, Globe, Heart } from 'lucide-react';
import { type UpdateType } from './index';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: UpdateType;
  onSubmit: (data: any) => void;
  existingData?: any;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmit,
  existingData
}) => {
  const [formData, setFormData] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    } else {
      setFormData({});
    }
    setSelectedFile(null);
  }, [type, existingData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit({ file: selectedFile, ...formData });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const renderFormContent = () => {
    switch (type) {
      case 'banner':
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Upload {type === 'banner' ? 'banner' : 'profile'} image
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors inline-block"
              >
                Choose File
              </label>
              {selectedFile && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        );

      case 'reading-resource':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter resource title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 'social-media':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={formData.platform || ''}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Platform</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="leetcode">LeetCode</option>
                <option value="medium">Medium</option>
                <option value="blogSite">Blog</option>
                <option value="portfolio">Portfolio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile URL
              </label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://platform.com/yourusername"
              />
            </div>
          </div>
        );

      case 'hobby':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hobby Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter hobby name"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Coding', 'Reading', 'Travel', 'Music', 'Sports', 'Cooking', 'Gaming', 'Art'].map((hobby) => (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => setFormData({ ...formData, name: hobby })}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Quote
              </label>
              <textarea
                value={formData.quote || ''}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                rows={4}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share an inspiring quote or thought..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.quote?.length || 0}/200 characters
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const titles = {
      'banner': 'Update Banner Image',
      'profile': 'Update Profile Image',
      'reading-resource': 'Add Reading Resource',
      'social-media': 'Add Social Media',
      'hobby': 'Add Hobby',
      'quote': 'Update Quote'
    };
    return titles[type];
  };

  const getModalIcon = () => {
    const icons = {
      'banner': <Upload className="w-6 h-6" />,
      'profile': <Upload className="w-6 h-6" />,
      'reading-resource': <Book className="w-6 h-6" />,
      'social-media': <Globe className="w-6 h-6" />,
      'hobby': <Heart className="w-6 h-6" />,
      'quote': <Plus className="w-6 h-6" />
    };
    return icons[type];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {getModalIcon()}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getModalTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {renderFormContent()}
          
          <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {existingData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;