import { useState, useEffect } from 'react';
import CertificateModal from '../../components/portfolio/CertificateModal'; 
import { portfolioService } from '../../services/portfolioService';
import type { Certificate } from '../../types/certificate';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Plus, Trash2, Award, User, Edit } from 'lucide-react';

export default function CertificatePage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getCertificates();
      setCertificates(response.certificates || []);
    } catch (err: unknown) {
      setError('Failed to fetch certificates. Ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleCreate = () => {
    setSelectedCertificate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await portfolioService.deleteCertificate(id);
      setCertificates((prev) => prev.filter(c => c._id !== id));
    } catch (err: unknown) {
      alert('Failed to delete certificate.');
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Certifications</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Showcase your academic achievements and course completions.</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm font-medium transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Certificate
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 font-medium text-sm shadow-sm">
          {error}
        </div>
      )}

      {certificates.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No certificates yet</h3>
          <p className="text-gray-500 mb-4 font-medium">Add your credentials to display on your portfolio.</p>
          <button onClick={handleCreate} className="text-blue-600 font-semibold hover:text-blue-700">
            + Upload a Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden flex flex-col transform hover:-translate-y-1 transition-all duration-300 relative">
              
              {/* Overlay Action Buttons */}
              <div className="absolute top-3 right-3 z-10 flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => handleEdit(cert)} className="p-2 bg-white/95 text-blue-600 hover:bg-blue-50 rounded-lg shadow-md border border-gray-200 backdrop-blur-sm transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cert._id)} className="p-2 bg-white/95 text-red-600 hover:bg-red-50 rounded-lg shadow-md border border-gray-200 backdrop-blur-sm transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="h-48 overflow-hidden bg-gray-100 border-b border-gray-100 relative">
                {cert.certificateImage ? (
                  <img src={cert.certificateImage} alt={cert.courseName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {/* Subtle gradient overlay to make buttons pop */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 leading-tight">{cert.courseName}</h3>
                <p className="text-sm font-semibold text-blue-600 mb-4">{cert.instituteName}</p>
                
                {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                    {cert.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {cert.teacherName && (
                  <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                    {cert.teacherImage ? (
                      <img src={cert.teacherImage} alt={cert.teacherName} className="w-7 h-7 rounded-full object-cover mr-2.5 border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center mr-2.5 border border-gray-200 shadow-sm">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-600">Instructor: {cert.teacherName}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CertificateModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          certificate={selectedCertificate} 
          onSuccess={fetchCertificates} 
        />
      )}
    </div>
  );
}