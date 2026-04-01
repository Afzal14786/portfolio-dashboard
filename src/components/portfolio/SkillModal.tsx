import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { portfolioService } from '../../services/portfolioService';
import type { Skill } from '../../types/skill';
import { UploadCloud, AlertCircle, Loader2 } from 'lucide-react';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: Skill | null;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  response?: { data?: { message?: string; error?: string }; };
  message?: string;
}

export default function SkillModal({ isOpen, onClose, skill, onSuccess }: SkillModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (skill) {
      setTitle(skill.title || '');
      setTags(Array.isArray(skill.tags) ? skill.tags.join(', ') : '');
      setImagePreview(skill.icon || null);
      setImage(null);
    } else {
      setTitle('');
      setTags('');
      setImage(null);
      setImagePreview(null);
      setError('');
    }
  }, [skill, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Icon size must be less than 2MB");
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file");
      return;
    }

    setError('');
    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!skill && !image) {
      setError("Please upload a skill icon");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArray));
      
      if (image) {
        formData.append('icon', image);
      }

      if (skill && skill._id) {
        await portfolioService.updateSkill(skill._id, formData);
      } else {
        await portfolioService.createSkill(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setError(
        apiError.response?.data?.message || 
        apiError.response?.data?.error || 
        apiError.message || 
        'Error saving skill.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={skill ? 'Edit Skill' : 'Add New Skill'} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start shadow-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> 
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skill Name <span className="text-red-500">*</span></label>
          <input 
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. React.js, TypeScript"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Related Tags</label>
          <input 
            type="text" value={tags} onChange={(e) => setTags(e.target.value)} 
            placeholder="Frontend, Framework"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          />
          <p className="text-[11px] text-gray-500 mt-1">Comma separated</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Skill Icon (PNG) {(!skill || !skill.icon) && <span className="text-red-500">*</span>}
          </label>
          <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer overflow-hidden group">
            <input 
              type="file" accept="image/*" onChange={handleImageChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="max-w-full max-h-[80px] object-contain p-2" />
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[1px]">
                  <span className="text-white font-medium flex items-center text-sm"><UploadCloud className="mr-2 w-4 h-4" /> Change</span>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Upload Icon</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl z-30 mt-2">
          <button 
            type="button" onClick={onClose} 
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 outline-none transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" disabled={loading} 
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            {loading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Saving...</> : (skill ? 'Update Skill' : 'Save Skill')}
          </button>
        </div>
      </form>
    </Modal>
  );
}