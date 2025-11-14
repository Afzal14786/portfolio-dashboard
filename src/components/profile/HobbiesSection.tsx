import React, { useState } from 'react';
import { Heart, Plus, X, Trash2 } from 'lucide-react';
import { type UserProfile, type UpdateType } from './index';
import api from '../../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HobbiesSectionProps {
  hobbies: UserProfile['hobbies'];
  onUpdate: (type: UpdateType, data: any) => void;
}

// Common hobby suggestions
const hobbySuggestions = [
  'Coding', 'Reading', 'Travel', 'Music', 'Sports', 'Cooking', 
  'Gaming', 'Art', 'Photography', 'Writing', 'Dancing', 'Yoga',
  'Gardening', 'Hiking', 'Cycling', 'Swimming', 'Chess', 'Movies',
  'Podcasts', 'Learning', 'Volunteering', 'DIY Projects', 'Fitness'
];

const HobbiesSection: React.FC<HobbiesSectionProps> = ({ hobbies, onUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHobby, setNewHobby] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const hasHobbies = hobbies && hobbies.length > 0;

  // Color variants for hobby tags
  const colorVariants = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-teal-100 text-teal-800 border-teal-200'
  ];

  const getColorVariant = (index: number) => {
    return colorVariants[index % colorVariants.length];
  };

  const handleAddClick = (): void => {
    setNewHobby('');
    setShowAddModal(true);
  };

  const handleSuggestionClick = (suggestion: string): void => {
    setNewHobby(suggestion);
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newHobby.trim()) {
      toast.error('Please enter a hobby.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create updated hobbies array by adding the new hobby
      const currentHobbies = Array.isArray(hobbies) ? hobbies : [];
      const updatedHobbies = [...currentHobbies, newHobby.trim()];

      // Use the correct endpoint with user_type = 'admin'
      const response = await api.patch('/admin/profile/hobbies', {
        hobbies: updatedHobbies
      });
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      toast.success('Hobby added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Call onUpdate to refresh the parent component data
      onUpdate('hobbies', updatedHobbies);
      
      // Close modal and reset form
      setShowAddModal(false);
      setNewHobby('');
      
    } catch (error: any) {
      console.error('Error adding hobby:', error);
      
      const errorMessage = getErrorMessage(error);
      
      if (error?.response?.status) {
        switch (error.response.status) {
          case 400:
            toast.error(`Bad Request: ${errorMessage}`, {
              position: "top-right",
              autoClose: 5000,
            });
            break;
          case 401:
            toast.error('Unauthorized: Please log in again.', {
              position: "top-right",
              autoClose: 5000,
            });
            break;
          case 403:
            toast.error('Forbidden: You do not have permission to perform this action.', {
              position: "top-right",
              autoClose: 5000,
            });
            break;
          case 422:
            toast.error(`Validation Error: ${errorMessage}`, {
              position: "top-right",
              autoClose: 5000,
            });
            break;
          case 500:
            toast.error('Server error. Please try again later.', {
              position: "top-right",
              autoClose: 5000,
            });
            break;
          default:
            toast.error(`Error: ${errorMessage}`, {
              position: "top-right",
              autoClose: 5000,
            });
        }
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        toast.error('Network error. Please check your connection and try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error(`Failed to add hobby: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHobby = async (hobbyToDelete: string): Promise<void> => {
    if (!hobbies) return;

    try {
      setIsLoading(true);
      
      // Create updated hobbies array without the deleted hobby
      const updatedHobbies = hobbies.filter(hobby => hobby !== hobbyToDelete);

      // Use the correct endpoint with user_type = 'admin'
      const response = await api.patch('/admin/profile/hobbies', {
        hobbies: updatedHobbies
      });
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      toast.success('Hobby removed successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

      onUpdate('hobbies', updatedHobbies);

    } catch (error: any) {
      console.error('Error deleting hobby:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to remove hobby: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    if (!isLoading) {
      setShowAddModal(false);
      setNewHobby('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !isLoading && newHobby.trim()) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Safe hobbies handling with fallback
  const displayHobbies = Array.isArray(hobbies) ? hobbies : [];

  return (
    <>
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl p-6 lg:p-8 mb-8">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-pink-100/80 rounded-2xl backdrop-blur-sm">
              <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Hobbies & Interests</h2>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Personal interests and activities</p>
            </div>
          </div>
          
          {hasHobbies && (
            <button
              onClick={handleAddClick}
              disabled={isLoading}
              className="p-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add new hobby"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {hasHobbies ? (
          <div className="flex flex-wrap gap-3 lg:gap-4">
            {displayHobbies.map((hobby, index) => (
              <div
                key={index}
                className={`group relative px-3 py-2 lg:px-4 lg:py-3 rounded-2xl border-2 font-medium transition-all duration-200 hover:scale-105 cursor-default text-sm lg:text-base ${getColorVariant(index)}`}
              >
                {hobby}
                <button
                  onClick={() => handleDeleteHobby(hobby)}
                  disabled={isLoading}
                  className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-50 shadow-md"
                  aria-label={`Delete ${hobby}`}
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            disabled={isLoading}
            className="w-full text-center py-12 lg:py-16 bg-gradient-to-br from-gray-50/50 to-pink-50/50 rounded-2xl border-2 border-dashed border-gray-300/50 hover:border-pink-300/50 transition-all duration-200 cursor-pointer backdrop-blur-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add hobbies"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
              <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 group-hover:text-pink-600 transition-colors" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Add Hobbies & Interests</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm lg:text-base">
              Share your passions, activities, and things you enjoy doing.
            </p>
          </button>
        )}
      </div>

      {/* Add Hobby Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <div 
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-white/50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-xl">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Hobby
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

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hobby Name *
                  </label>
                  <input
                    type="text"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-colors disabled:opacity-50"
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
                        className="px-3 py-2 bg-gray-100/50 hover:bg-gray-200/50 rounded-xl text-sm transition-colors disabled:opacity-50 text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
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
                  disabled={!newHobby.trim() || isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-2xl hover:from-pink-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-pink-600 disabled:hover:to-red-600 font-medium flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    'Add Hobby'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HobbiesSection;