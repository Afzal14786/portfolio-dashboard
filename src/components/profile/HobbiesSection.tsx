import React, { useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { type UserProfile, type UpdateType, getErrorMessage } from './index';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface HobbiesSectionProps {
  hobbies: UserProfile['hobbies'];
  onUpdate: (type: UpdateType, data: unknown) => void;
}

const HobbiesSection: React.FC<HobbiesSectionProps> = ({ hobbies, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const displayHobbies = Array.isArray(hobbies) ? hobbies : [];

  const handleDeleteHobby = async (hobbyToDelete: string): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedHobbies = displayHobbies.filter(h => h !== hobbyToDelete);
      await api.patch('/admin/profile/update/hobbies', { hobbies: updatedHobbies });
      toast.success('Removed successfully!');
      onUpdate('hobbies', updatedHobbies);
    } catch (error: unknown) {
      toast.error(`Failed to remove: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-pink-100/80 rounded-2xl"><Heart className="w-5 h-5 text-pink-600" /></div>
          <div><h2 className="text-xl font-bold">Hobbies & Interests</h2></div>
        </div>
        <button onClick={() => onUpdate('hobby', {})} disabled={isLoading} className="p-3 bg-pink-600 text-white rounded-2xl"><Plus className="w-5 h-5" /></button>
      </div>

      {displayHobbies.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {displayHobbies.map((hobby, idx) => (
            <div key={idx} className="group relative px-4 py-2 rounded-2xl bg-pink-100 text-pink-800 font-medium">
              {hobby}
              <button onClick={() => handleDeleteHobby(hobby)} disabled={isLoading} className="absolute -top-2 -right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 text-red-600"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      ) : (
        <button onClick={() => onUpdate('hobby', {})} className="w-full py-12 border-2 border-dashed rounded-2xl text-center text-gray-500">Add Hobbies</button>
      )}
    </div>
  );
};
export default HobbiesSection;