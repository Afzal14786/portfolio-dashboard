import { useState, useEffect } from 'react';
import JourneyModal from '../../components/portfolio/JourneyModal';
import { portfolioService } from '../../services/portfolioService';
import type { Journey } from '../../types/journey';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Plus, Trash2, Edit, MapPin, Calendar, AlertCircle } from 'lucide-react';

export default function JourneyPage() {
  const [journeyEvents, setJourneyEvents] = useState<Journey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Journey | null>(null);

  const fetchJourney = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getJourney();
      setJourneyEvents(response.journey || []);
    } catch (err: unknown) {
      setError('Failed to fetch journey timeline. Ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: Journey) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this timeline event?')) return;
    try {
      await portfolioService.deleteJourneyEvent(id);
      setJourneyEvents((prev) => prev.filter(e => e._id !== id));
    } catch (err: unknown) {
      alert('Failed to delete event.');
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Journey
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Build your professional and educational timeline.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm font-medium transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Milestone
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center shadow-sm font-medium text-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {journeyEvents.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No timeline events</h3>
          <p className="text-gray-500 mb-6">Start building your journey by adding your first milestone.</p>
          <button onClick={handleCreate} className="text-blue-600 font-medium hover:text-blue-700">+ Add Milestone</button>
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-200 ml-3 sm:ml-6 mt-6 space-y-8 pb-8">
          {journeyEvents.map((event) => (
            <div key={event._id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Node */}
              <div className="absolute w-4 h-4 bg-white border-4 border-blue-500 rounded-full -left-[9px] top-1.5 shadow-sm group-hover:scale-125 transition-transform" />
              
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 p-5 sm:p-6 transition-all relative overflow-hidden">
                
                {/* Actions (Edit/Delete) */}
                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(event)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{event.year}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 pr-16">{event.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <JourneyModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          event={selectedEvent} 
          onSuccess={fetchJourney} 
        />
      )}
    </div>
  );
}