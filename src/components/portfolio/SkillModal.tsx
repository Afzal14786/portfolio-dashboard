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
  response?: { data?: { message?: string; }; };
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
      setTitle(skill.title);
      setTags(skill.tags?.join(', ') || '');
      setImagePreview(skill.skill_icon || null);
    } else {
      setTitle('');
      setTags('');
      setImage(null);
      setImagePreview(null);
      setError('');
    }
  }, [skill, isOpen]);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate image only if creating a new skill
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
      
      if (image) formData.append('icon', image);

      if (skill && skill._id) {
        await portfolioService.updateSkill(skill._id, formData);
      } else {
        await portfolioService.createSkill(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.response?.data?.message || apiError.message || 'Error saving skill.');
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
            Skill Icon (SVG/PNG) {(!skill || !skill.skill_icon) && <span className="text-red-500">*</span>}
          </label>
          <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer overflow-hidden group">
            <input 
              type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain p-4" />
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
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

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
          <button 
            type="button" onClick={onClose} 
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 outline-none transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" disabled={loading} 
            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl flex items-center shadow-sm hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            {loading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Saving...</> : (skill ? 'Update Skill' : 'Save Skill')}
          </button>
        </div>
      </form>
    </Modal>
  );
}