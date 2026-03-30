import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { portfolioService } from '../../services/portfolioService';
import type { Certificate } from '../../types/certificate';
import { UploadCloud, AlertCircle, Loader2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate?: Certificate | null; // Added prop
  onSuccess: () => void;
}

interface ApiErrorResponse {
  response?: { data?: { message?: string; }; };
  message?: string;
}

export default function CertificateModal({ isOpen, onClose, certificate, onSuccess }: CertificateModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [courseName, setCourseName] = useState<string>('');
  const [instituteName, setInstituteName] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  
  const [certificateImage, setCertificateImage] = useState<File | null>(null);
  const [certPreview, setCertPreview] = useState<string | null>(null);
  
  const [teacherImage, setTeacherImage] = useState<File | null>(null);
  const [teacherPreview, setTeacherPreview] = useState<string | null>(null);

  // Populate data if editing
  useEffect(() => {
    if (certificate) {
      setCourseName(certificate.courseName);
      setInstituteName(certificate.instituteName);
      setTeacherName(certificate.teacherName || '');
      setSkills(certificate.skills?.join(', ') || '');
      setCertPreview(certificate.certificateImage || null);
      setTeacherPreview(certificate.teacherImage || null);
    } else {
      setCourseName('');
      setInstituteName('');
      setTeacherName('');
      setSkills('');
      setCertificateImage(null);
      setCertPreview(null);
      setTeacherImage(null);
      setTeacherPreview(null);
      setError('');
    }
  }, [certificate, isOpen]);

  useEffect(() => {
    if (certificateImage) {
      const url = URL.createObjectURL(certificateImage);
      setCertPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [certificateImage]);

  useEffect(() => {
    if (teacherImage) {
      const url = URL.createObjectURL(teacherImage);
      setTeacherPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [teacherImage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Only throw error for missing image if we are creating a NEW certificate
    if (!certificate && !certificateImage) {
      setError("A certificate image is required.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('courseName', courseName.trim());
      formData.append('instituteName', instituteName.trim());
      if (teacherName) formData.append('teacherName', teacherName.trim());
      
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      formData.append('skills', JSON.stringify(skillsArray));

      if (certificateImage) formData.append('certificateImage', certificateImage);
      if (teacherImage) formData.append('teacherImage', teacherImage);

      // Call API based on mode
      if (certificate && certificate._id) {
        await portfolioService.updateCertificate(certificate._id, formData);
      } else {
        await portfolioService.createCertificate(formData);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.response?.data?.message || apiError.message || 'Error saving certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={certificate ? "Edit Certificate" : "Add New Certificate"} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* ... The rest of the form UI remains EXACTLY identical to what you currently have ... */}
        
        {error && (
          <div className="p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start shadow-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course Name <span className="text-red-500">*</span></label>
            <input 
              type="text" required value={courseName} onChange={(e) => setCourseName(e.target.value)} 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issuing Institute <span className="text-red-500">*</span></label>
            <input 
              type="text" required value={instituteName} onChange={(e) => setInstituteName(e.target.value)} 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills Learned</label>
          <input 
            type="text" value={skills} onChange={(e) => setSkills(e.target.value)} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instructor Name (Optional)</label>
            <input 
              type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} 
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          
          <div className="w-full sm:w-32">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Instructor Avatar</label>
            <div className="relative w-full h-[46px] bg-white border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer overflow-hidden flex items-center justify-center">
              <input 
                type="file" accept="image/*" onChange={(e) => setTeacherImage(e.target.files?.[0] || null)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              />
              {teacherPreview ? (
                <img src={teacherPreview} alt="Teacher" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gray-500 flex items-center"><UploadCloud className="w-3.5 h-3.5 mr-1" /> Add</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Certificate Image {(!certificate || !certificate.certificateImage) && <span className="text-red-500">*</span>}</label>
          <div className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden group transition-colors">
            <input 
              type="file" accept="image/*" onChange={(e) => setCertificateImage(e.target.files?.[0] || null)} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            {certPreview ? (
               <img src={certPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Upload Certificate</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl z-30 mt-2">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl outline-none hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm hover:bg-blue-700 disabled:opacity-70">
            {loading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Saving...</> : (certificate ? 'Update Certificate' : 'Save Certificate')}
          </button>
        </div>
      </form>
    </Modal>
  );
}