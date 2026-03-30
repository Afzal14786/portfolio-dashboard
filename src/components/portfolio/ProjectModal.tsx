import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { portfolioService } from '../../services/portfolioService';
import type { Project } from '../../types/project';
import { UploadCloud, Github, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  response?: { data?: { message?: string; }; };
  message?: string;
}

export default function ProjectModal({ isOpen, onClose, project, onSuccess }: ProjectModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<'complete' | 'inprocess'>('complete');
  const [techStack, setTechStack] = useState<string>('');
  const [demoLink, setDemoLink] = useState<string>('');
  const [codeLink, setCodeLink] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setStatus(project.status);
      setTechStack(project.techStack?.join(', ') || '');
      setDemoLink(project.demoLink || '');
      setCodeLink(project.codeLink || '');
      setImagePreview(project.imageUrl || null);
    } else {
      setTitle('');
      setDescription('');
      setStatus('complete');
      setTechStack('');
      setDemoLink('');
      setCodeLink('');
      setImage(null);
      setImagePreview(null);
      setError('');
    }
  }, [project, isOpen]);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('status', status);
      formData.append('demoLink', demoLink.trim());
      formData.append('codeLink', codeLink.trim());
      
      const tagsArray = techStack.split(',').map(tag => tag.trim()).filter(Boolean);
      formData.append('techStack', JSON.stringify(tagsArray));

      if (image) formData.append('image', image);

      if (project && project._id) {
        await portfolioService.updateProject(project._id, formData);
      } else {
        if (!image) throw new Error("Please upload a project cover image");
        await portfolioService.createProject(formData);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.response?.data?.message || apiError.message || 'An unexpected error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project Details' : 'Create New Project'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {error && (
          <div className="p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center shadow-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next.js E-Commerce Platform"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea 
            required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the project's purpose and your role..."
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status <span className="text-red-500">*</span></label>
            <select 
              value={status} onChange={(e) => setStatus(e.target.value as 'complete' | 'inprocess')}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
            >
              <option value="complete">🚀 Completed</option>
              <option value="inprocess">⏳ In Progress</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tech Stack</label>
            <input 
              type="text" placeholder="React, Node.js, MongoDB" value={techStack} onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
            <p className="text-[11px] text-gray-500 mt-1">Comma separated</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">GitHub Repository</label>
            <div className="relative">
              <Github className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="url" placeholder="https://github.com/..." value={codeLink} onChange={(e) => setCodeLink(e.target.value)}
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Live Demo URL</label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="url" placeholder="https://your-project.com" value={demoLink} onChange={(e) => setDemoLink(e.target.value)}
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Live Image Preview Upload Zone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image {(!project || !project.imageUrl) && <span className="text-red-500">*</span>}
          </label>
          <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group overflow-hidden cursor-pointer">
            <input 
              type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <span className="text-white font-medium flex items-center"><UploadCloud className="mr-2 w-5 h-5" /> Change Image</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Click or drag to upload</p>
                <p className="text-[11px] text-gray-500 mt-1">High quality image formats</p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl z-30 mt-2">
          <button 
            type="button" onClick={onClose} 
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl outline-none transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" disabled={loading} 
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center shadow-sm transition-colors"
          >
            {loading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Saving...</> : (project ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </Modal>
  );
}