import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { portfolioService } from '../../services/portfolioService';
import type { Journey, CreateJourneyPayload } from '../../types/journey';
import { AlertCircle, Loader2, Calendar, MapPin } from 'lucide-react';

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Journey | null;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  response?: { data?: { message?: string; }; };
  message?: string;
}

export default function JourneyModal({ isOpen, onClose, event, onSuccess }: JourneyModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [year, setYear] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (event) {
      setYear(event.year);
      setTitle(event.title);
      setDescription(event.description);
    } else {
      setYear('');
      setTitle('');
      setDescription('');
      setError('');
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: CreateJourneyPayload = {
        year: year.trim(),
        title: title.trim(),
        description: description.trim()
      };

      if (event && event._id) {
        await portfolioService.updateJourneyEvent(event._id, payload);
      } else {
        await portfolioService.createJourneyEvent(payload);
      }
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.response?.data?.message || apiError.message || 'Error saving timeline event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Milestone' : 'Add New Milestone'} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {error && (
          <div className="p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start shadow-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> 
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year / Duration <span className="text-red-500">*</span></label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" required value={year} onChange={(e) => setYear(e.target.value)} 
                placeholder="e.g. 2023 - Present"
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900" 
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Milestone Title <span className="text-red-500">*</span></label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Enrolled in IGNOU BCA"
                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900" 
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
          <textarea 
            required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} 
            placeholder="Describe your achievements, coursework, or responsibilities during this time..."
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-gray-900 leading-relaxed" 
          />
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
            {loading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Saving...</> : (event ? 'Update Milestone' : 'Save Milestone')}
          </button>
        </div>
      </form>
    </Modal>
  );
}