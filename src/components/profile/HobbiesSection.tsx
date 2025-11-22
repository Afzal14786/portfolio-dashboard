import React, { useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { type UserProfile, type UpdateType, getErrorMessage } from './index';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface HobbiesSectionProps {
  hobbies: UserProfile['hobbies'];
  onUpdate: (type: UpdateType, data: any) => void;
}

const HobbiesSection: React.FC<HobbiesSectionProps> = ({ hobbies, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const hasHobbies = hobbies && hobbies.length > 0;

  const colorVariants = [
    'bg-blue-100/80 text-blue-800 border-blue-200/60 backdrop-blur-sm',
    'bg-green-100/80 text-green-800 border-green-200/60 backdrop-blur-sm',
    'bg-purple-100/80 text-purple-800 border-purple-200/60 backdrop-blur-sm',
    'bg-yellow-100/80 text-yellow-800 border-yellow-200/60 backdrop-blur-sm',
    'bg-pink-100/80 text-pink-800 border-pink-200/60 backdrop-blur-sm',
    'bg-indigo-100/80 text-indigo-800 border-indigo-200/60 backdrop-blur-sm',
    'bg-red-100/80 text-red-800 border-red-200/60 backdrop-blur-sm',
    'bg-teal-100/80 text-teal-800 border-teal-200/60 backdrop-blur-sm'
  ];

  const getColorVariant = (index: number) => {
    return colorVariants[index % colorVariants.length];
  };

  const handleAddClick = (): void => {
    onUpdate('hobby', {});
  };

  const handleDeleteHobby = async (hobbyToDelete: string): Promise<void> => {
    if (!hobbies) return;

    try {
      setIsLoading(true);
      
      // Create updated hobbies array without the deleted hobby
      const updatedHobbies = hobbies.filter(hobby => hobby !== hobbyToDelete);

      const response = await api.patch('/admin/profile/update/hobbies', {
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

  // Safe hobbies handling with fallback
  const displayHobbies = Array.isArray(hobbies) ? hobbies : [];

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 mb-8 transition-all duration-300 hover:bg-white/70">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-pink-100/80 rounded-2xl backdrop-blur-md border border-pink-200/50">
            <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Hobbies & Interests
            </h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Personal interests and activities
            </p>
          </div>
        </div>
        
        {hasHobbies && (
          <button
            onClick={handleAddClick}
            disabled={isLoading}
            className="p-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
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
              className={`group relative px-3 py-2 lg:px-4 lg:py-3 rounded-2xl border-2 font-medium transition-all duration-300 hover:scale-105 cursor-default text-sm lg:text-base backdrop-blur-sm shadow-lg hover:shadow-xl ${getColorVariant(index)}`}
            >
              {hobby}
              <button
                onClick={() => handleDeleteHobby(hobby)}
                disabled={isLoading}
                className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 p-1 bg-white/90 backdrop-blur-md rounded-full hover:bg-red-50 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-50 shadow-md hover:scale-110 border border-white/60"
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
          className="w-full text-center py-12 lg:py-16 bg-white/50 backdrop-blur-md rounded-2xl border-2 border-dashed border-white/60 hover:border-pink-300/60 transition-all duration-300 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
          aria-label="Add hobbies"
        >
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 group-hover:text-pink-600 transition-colors" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
            Add Hobbies & Interests
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm lg:text-base">
            Share your passions, activities, and things you enjoy doing.
          </p>
        </button>
      )}
    </div>
  );
};

export default HobbiesSection;