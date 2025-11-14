import React from "react";
import { Book, ExternalLink, Plus } from "lucide-react";
import { type UserProfile, type UpdateType } from "./index";

interface ReadingResourcesProps {
  resources: UserProfile["reading_resources"];
  onUpdate: (type: UpdateType, data: any) => void;
}

const ReadingResources: React.FC<ReadingResourcesProps> = ({ resources, onUpdate }) => {
  const hasResources = resources && resources.length > 0;

  const handleAddClick = (): void => {
    onUpdate('reading-resource', {});
  };

  // Safe resource handling with fallback
  const displayResources = Array.isArray(resources) ? resources : [];

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 mb-8 transition-all duration-300 hover:bg-white/70">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100/80 rounded-2xl backdrop-blur-md border border-blue-200/50">
            <Book className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Reading Resources
            </h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Books, articles, and learning materials
            </p>
          </div>
        </div>

        {hasResources && (
          <button
            onClick={handleAddClick}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 transform"
            aria-label="Add new reading resource"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {hasResources ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {displayResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 lg:p-6 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 hover:border-blue-300/60 transition-all duration-300 hover:shadow-xl cursor-pointer hover:scale-105 transform"
            >
              <div className="flex items-start space-x-3 lg:space-x-4">
                <div className="p-2 lg:p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                  <Book className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-sm lg:text-base truncate">
                    {resource.title || "Untitled Resource"}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
                    <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="truncate">Visit Resource</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <button
          onClick={handleAddClick}
          className="w-full text-center py-12 lg:py-16 bg-white/50 backdrop-blur-md rounded-2xl border-2 border-dashed border-white/60 hover:border-blue-300/60 transition-all duration-300 cursor-pointer group hover:scale-105 transform"
          aria-label="Add reading resources"
        >
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
            Add Reading Resources
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm lg:text-base">
            Share books, articles, tutorials, and other learning materials that inspire you.
          </p>
        </button>
      )}
    </div>
  );
};

export default ReadingResources;