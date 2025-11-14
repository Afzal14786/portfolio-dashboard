import React, { useState } from "react";
import { Book, ExternalLink, Plus, X } from "lucide-react";
import { type UserProfile, type UpdateType } from "./index";
import api from "../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ReadingResource {
  title: string;
  url: string;
}

interface ReadingResourcesProps {
  resources: UserProfile["reading_resources"];
  onUpdate: (type: UpdateType, data: any) => void;
}

const ReadingResources: React.FC<ReadingResourcesProps> = ({
  resources,
  onUpdate,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState<ReadingResource>({
    title: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const hasResources = resources && resources.length > 0;

  const handleAddClick = (): void => {
    setNewResource({ title: "", url: "" });
    setShowAddModal(true);
  };

  const isValidUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return false;
    try {
      const urlWithProtocol = urlString.includes("://")
        ? urlString
        : `https://${urlString}`;
      new URL(urlWithProtocol);
      return true;
    } catch (_) {
      return false;
    }
  };

  const formatUrl = (urlString: string): string => {
    if (!urlString.trim()) return "";
    return urlString.includes("://") ? urlString : `https://${urlString}`;
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === "string") {
      return error;
    }

    if (error?.response?.data) {
      const errorData = error.response.data;

      if (typeof errorData === "string") {
        return errorData;
      }
      if (errorData.message) {
        return errorData.message;
      }
      if (errorData.error) {
        return errorData.error;
      }
      if (errorData.detail) {
        return errorData.detail;
      }
      if (Array.isArray(errorData.errors)) {
        return errorData.errors.join(", ");
      }

      return JSON.stringify(errorData);
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.statusText) {
      return error.statusText;
    }

    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    if (!newResource.title.trim() || !isValidUrl(newResource.url)) {
      toast.error("Please fill in all required fields with valid data.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsLoading(true);

    const resourceData = {
      title: newResource.title.trim(),
      url: formatUrl(newResource.url.trim()),
    };

    try {
      // Create updated reading_resources array by adding the new resource
      const currentResources = Array.isArray(resources) ? resources : [];
      const updatedReadingResources = [...currentResources, resourceData];

      // Use the correct endpoint with user_type = 'admin' and correct field name
      const response = await api.patch("/admin/profile/reading-resources", {
        readingResources: updatedReadingResources, // Changed from reading_resources to readingResources
      });

      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      toast.success("Reading resource added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Call onUpdate to refresh the parent component data
      onUpdate("reading-resource", updatedReadingResources);

      // Close modal and reset form
      setShowAddModal(false);
      setNewResource({ title: "", url: "" });
    } catch (error: any) {
      console.error("Error adding reading resource:", error);

      const errorMessage = getErrorMessage(error);

      // Handle specific backend validation errors
      if (error?.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.message?.includes("must be an array")) {
          toast.error("Invalid data format. Please try again.", {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`Validation Error: ${errorMessage}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else if (error?.response?.status === 401) {
        toast.error("Unauthorized: Please log in again.", {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (error?.response?.status === 500) {
        toast.error("Server error. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (
        error?.code === "NETWORK_ERROR" ||
        error?.message?.includes("Network Error")
      ) {
        toast.error(
          "Network error. Please check your connection and try again.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } else {
        toast.error(`Failed to add reading resource: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ReadingResource,
    value: string
  ): void => {
    setNewResource((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = (): void => {
    if (!isLoading) {
      setShowAddModal(false);
      setNewResource({ title: "", url: "" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      if (newResource.title.trim() && isValidUrl(newResource.url)) {
        handleSubmit(e as any);
      }
    }
  };

  // Safe resource handling with fallback
  const displayResources = Array.isArray(resources) ? resources : [];

  return (
    <>
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl p-6 lg:p-8 mb-8">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100/80 rounded-2xl backdrop-blur-sm">
              <Book className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
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
              disabled={isLoading}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="group block p-4 lg:p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/50 rounded-2xl border border-white/50 hover:border-blue-300/50 transition-all duration-200 hover:shadow-lg cursor-pointer backdrop-blur-sm"
              >
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="p-2 lg:p-3 bg-white/80 rounded-xl shadow-sm group-hover:shadow-md transition-shadow backdrop-blur-sm">
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
            disabled={isLoading}
            className="w-full text-center py-12 lg:py-16 bg-gradient-to-br from-gray-50/50 to-blue-50/50 rounded-2xl border-2 border-dashed border-gray-300/50 hover:border-blue-300/50 transition-all duration-200 cursor-pointer backdrop-blur-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add reading resources"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
              <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              Add Reading Resources
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm lg:text-base">
              Share books, articles, tutorials, and other learning materials
              that inspire you.
            </p>
          </button>
        )}
      </div>

      {/* Custom Modal - Completely Independent */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <div
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md border border-white/50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Book className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Reading Resource
                </h2>
              </div>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100/50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-colors disabled:opacity-50"
                    placeholder="Enter resource title"
                    required
                    autoFocus
                    disabled={isLoading}
                    maxLength={200}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="text"
                    value={newResource.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-colors disabled:opacity-50"
                    placeholder="https://example.com or example.com"
                    required
                    disabled={isLoading}
                    maxLength={500}
                  />
                  {newResource.url && !isValidUrl(newResource.url) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid URL
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300/50 text-gray-700 rounded-2xl hover:bg-gray-50/50 transition-colors backdrop-blur-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !newResource.title.trim() ||
                    !isValidUrl(newResource.url) ||
                    isLoading
                  }
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 font-medium flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Resource"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReadingResources;
