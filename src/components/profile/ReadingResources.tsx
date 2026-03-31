import React, { useState } from "react";
import { Book, ExternalLink, Plus, Trash2, Edit2 } from "lucide-react";
import { type UserProfile, type UpdateType, type ReadingResource } from "../../types/user";
import api from "../../api/api";
import { toast } from "react-toastify";

interface ReadingResourcesProps {
  resources: UserProfile["reading_resources"];
  onUpdate: (type: UpdateType, data: unknown) => void;
  onUserDataUpdate: (data: Partial<UserProfile>) => void;
}

const ReadingResources: React.FC<ReadingResourcesProps> = ({ resources, onUpdate, onUserDataUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const displayResources = Array.isArray(resources) ? resources : [];

  const handleDelete = async (indexToDelete: number) => {
    try {
      setIsLoading(true);
      const updatedResources = displayResources.filter((_, idx) => idx !== indexToDelete);
      
      const response = await api.patch<{ success: boolean; user: UserProfile }>('/admin/profile/update/reading-resources', { 
        readingResources: updatedResources 
      });
      
      toast.success('Resource removed successfully!');
      
      if (response.data.user) {
        onUserDataUpdate({ reading_resources: updatedResources });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
         toast.error(error.message || "Failed to remove resource");
      } else {
         toast.error("Failed to remove resource");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (resource: ReadingResource, index: number) => {
    onUpdate('reading-resource', { 
      isEdit: true, 
      editIndex: index, 
      title: resource.title, 
      url: resource.url 
    });
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 mb-8 transition-all duration-300 hover:bg-white/70">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-100/80 rounded-2xl"><Book className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reading Resources</h2>
            <p className="text-gray-600 mt-1 text-sm">Books and articles I recommend</p>
          </div>
        </div>
        <button onClick={() => onUpdate('reading-resource', {})} className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {displayResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayResources.map((res, idx) => (
            <div key={idx} className="group p-4 bg-white/50 rounded-2xl border hover:shadow-xl relative flex flex-col justify-between transition-all">
              
              <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(res, idx)} disabled={isLoading} className="p-1.5 bg-white/80 rounded-lg hover:bg-white shadow-sm border border-gray-100 disabled:opacity-50">
                  <Edit2 className="w-3 h-3 text-gray-600" />
                </button>
                <button onClick={() => handleDelete(idx)} disabled={isLoading} className="p-1.5 bg-white/80 rounded-lg hover:bg-red-50 shadow-sm border border-gray-100 disabled:opacity-50">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>

              <div className="flex items-start space-x-3 mt-1">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100"><Book className="w-4 h-4 text-emerald-600" /></div>
                <div className="pr-12">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{res.title}</h3>
                </div>
              </div>
              
              <a href={res.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center w-full py-2 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-700 text-xs font-medium rounded-xl transition-colors border border-emerald-100/50">
                <ExternalLink className="w-3 h-3 mr-1.5"/> Visit Resource
              </a>
            </div>
          ))}
        </div>
      ) : (
        <button onClick={() => onUpdate('reading-resource', {})} className="w-full py-12 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-500 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors">
          Add Resources
        </button>
      )}
    </div>
  );
};

export default ReadingResources;