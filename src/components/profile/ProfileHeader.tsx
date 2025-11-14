import React, { useRef, useState, useEffect } from "react";
import {
  Download,
  Edit2,
  Camera,
  Plus,
  X,
  FileText,
  Image as ImageIcon,
  Book,
} from "lucide-react";
import { type UserProfile, type UpdateType } from "./index";
import ReactDOM from "react-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Separate modal component for file updates
interface FileUpdateModalProps {
  selectedFile: { file: File; type: "banner" | "profile" | "resume" } | null;
  onConfirm: () => void;
  onCancel: () => void;
  onReselect: (type: "banner" | "profile" | "resume") => void;
  isUploading: boolean;
}

const FileUpdateModal: React.FC<FileUpdateModalProps> = ({
  selectedFile,
  onConfirm,
  onCancel,
  onReselect,
  isUploading,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [selectedFile]);

  if (!selectedFile) return null;

  const getModalTitle = (): string => {
    switch (selectedFile.type) {
      case "banner":
        return "Update Banner Image";
      case "profile":
        return "Update Profile Image";
      case "resume":
        return "Update Resume";
      default:
        return "Update File";
    }
  };

  const getFileIcon = (): React.ReactElement => {
    switch (selectedFile.type) {
      case "banner":
      case "profile":
        return <ImageIcon className="w-5 h-5" />;
      case "resume":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getFileTypeText = (): string => {
    switch (selectedFile.type) {
      case "banner":
        return "banner image";
      case "profile":
        return "profile image";
      case "resume":
        return "resume file";
      default:
        return "file";
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onCancel}
      />

      <div
        className={`relative bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        } border border-white/50`}
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100/80 rounded-lg border border-gray-200/50">
              {getFileIcon()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {getModalTitle()}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Upload your {getFileTypeText()}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="p-1.5 hover:bg-gray-200/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="space-y-4">
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200/50">
                  {getFileIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.file.name}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-600">
                      {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-600 capitalize">
                      {selectedFile.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onReselect(selectedFile.type)}
              disabled={isUploading}
              className="w-full py-2.5 bg-white/50 border border-gray-300/50 rounded-lg hover:bg-gray-100/50 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Choose Different File
              </span>
            </button>
          </div>

          <div className="flex space-x-3 mt-6 pt-5 border-t border-gray-200/50">
            <button
              type="button"
              onClick={onCancel}
              disabled={isUploading}
              className="flex-1 px-4 py-2.5 bg-transparent border border-gray-300/70 text-gray-700 rounded-lg hover:bg-gray-100/50 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isUploading}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

// Quote Update Modal Component
interface QuoteUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuote: string;
  onSubmit: (quote: string) => void;
  isLoading: boolean;
}

const QuoteUpdateModal: React.FC<QuoteUpdateModalProps> = ({
  isOpen,
  onClose,
  currentQuote,
  onSubmit,
  isLoading,
}) => {
  const [quote, setQuote] = useState(currentQuote || "");

  useEffect(() => {
    if (isOpen) {
      setQuote(currentQuote || "");
    }
  }, [isOpen, currentQuote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quote.trim() && quote.length <= 200) {
      onSubmit(quote.trim());
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
      setQuote(currentQuote || "");
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
              {currentQuote ? "Update Quote" : "Add Quote"}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100/50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Quote {quote.length > 0 && `(${quote.length}/200)`}
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-colors resize-none disabled:opacity-50"
                placeholder="Share an inspiring quote or thought..."
                disabled={isLoading}
                required
              />
              {quote.length >= 190 && (
                <p className="text-red-500 text-xs mt-1">
                  {200 - quote.length} characters remaining
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
              disabled={!quote.trim() || quote.length > 200 || isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {currentQuote ? "Updating..." : "Adding..."}
                </>
              ) : currentQuote ? (
                "Update Quote"
              ) : (
                "Add Quote"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

interface ProfileHeaderProps {
  userData: UserProfile;
  onUpdate?: (type: UpdateType, data: any) => void; // ✅ Make optional
  onUserDataUpdate?: (updatedData: Partial<UserProfile>) => void; // ✅ Make optional
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  onUpdate,
  onUserDataUpdate,
}) => {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    type: "banner" | "profile" | "resume";
  } | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Add debug logging to see what props are received
  useEffect(() => {
    console.log("🔧 ProfileHeader Debug:");
    console.log("userData:", userData);
    console.log("onUpdate exists:", !!onUpdate);
    console.log("onUserDataUpdate exists:", !!onUserDataUpdate);
    console.log("onUserDataUpdate type:", typeof onUserDataUpdate);
  }, [userData, onUpdate, onUserDataUpdate]);

  const handleBannerUpdate = (): void => {
    bannerInputRef.current?.click();
  };

  const handleProfileUpdate = (): void => {
    profileInputRef.current?.click();
  };

  const handleQuoteUpdate = (): void => {
    setShowQuoteModal(true);
  };

  const handleResumeUpdate = (): void => {
    if (userData.resume) {
      window.open(userData.resume, "_blank");
    } else {
      resumeInputRef.current?.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "profile" | "resume"
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file types
      if (type === "banner" || type === "profile") {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Only JPEG, JPG, PNG & WebP images are allowed");
          return;
        }
      } else if (type === "resume") {
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Only PDF and Word documents are allowed");
          return;
        }
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile({ file, type });
    }
    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = "";
    }
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === "string") return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return "An unexpected error occurred. Please try again.";
  };

  const uploadFile = async (
    file: File,
    type: "banner" | "profile" | "resume"
  ): Promise<string> => {
    const formData = new FormData();

    let fieldName = "";
    let endpoint = "";

    switch (type) {
      case "banner":
        endpoint = "/admin/profile/banner";
        fieldName = "banner_image";
        break;
      case "profile":
        endpoint = "/admin/profile/image";
        fieldName = "profile_image";
        break;
      case "resume":
        endpoint = "/admin/profile/resume";
        fieldName = "resume";
        break;
      default:
        throw new Error("Invalid file type");
    }

    formData.append(fieldName, file);

    const response = await api.patch(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.user) {
      let imageData;

      switch (type) {
        case "banner":
          imageData = response.data.user.banner_image;
          break;
        case "profile":
          imageData = response.data.user.profile_image;
          break;
        case "resume":
          imageData = response.data.user.resume;
          break;
      }

      if (typeof imageData === "object" && imageData.url) {
        return imageData.url;
      } else if (typeof imageData === "string") {
        return imageData;
      }
    }

    throw new Error("Invalid response from server");
  };

  const handleConfirmUpdate = async (): Promise<void> => {
    if (selectedFile && !isUploading) {
      setIsUploading(true);

      const toastId = toast.loading(`Uploading ${selectedFile.type}...`);

      try {
        const fileUrl = await uploadFile(selectedFile.file, selectedFile.type);

        if (!fileUrl) {
          throw new Error("No URL returned from server");
        }

        const updateData: Partial<UserProfile> = {};
        switch (selectedFile.type) {
          case "banner":
            updateData.banner_image = fileUrl;
            break;
          case "profile":
            updateData.profile_image = fileUrl;
            break;
          case "resume":
            updateData.resume = fileUrl;
            break;
        }

        // ✅ SAFE CHECK: Only call if function exists
        if (typeof onUserDataUpdate === 'function') {
          onUserDataUpdate(updateData);
        } else {
          console.warn('onUserDataUpdate is not available');
          // Fallback: Update localStorage directly
          const updatedUserData = { ...userData, ...updateData };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }

        setSelectedFile(null);

        toast.update(toastId, {
          render: `${
            selectedFile.type.charAt(0).toUpperCase() +
            selectedFile.type.slice(1)
          } updated successfully!`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error: any) {
        console.error("Upload failed:", error);
        const errorMessage = getErrorMessage(error);

        toast.update(toastId, {
          render: `Failed to upload ${selectedFile.type}: ${errorMessage}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleQuoteSubmit = async (quote: string): Promise<void> => {
    setIsUploading(true);

    try {
      const response = await api.patch("/admin/profile/quote", { quote });

      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      // ✅ SAFE CHECK: Only call if function exists
      if (typeof onUserDataUpdate === 'function') {
        onUserDataUpdate({ quote });
      } else {
        console.warn('onUserDataUpdate is not available');
        // Fallback: Update localStorage directly
        const updatedUserData = { ...userData, quote };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      }

      setShowQuoteModal(false);

      toast.success(
        userData.quote
          ? "Quote updated successfully!"
          : "Quote added successfully!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } catch (error: any) {
      console.error("Error updating quote:", error);
      const errorMessage = getErrorMessage(error);

      toast.error(`Failed to update quote: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpdate = (): void => {
    if (!isUploading) {
      setSelectedFile(null);
    }
  };

  const handleReselectFile = (type: "banner" | "profile" | "resume"): void => {
    if (isUploading) return;

    if (type === "banner") {
      bannerInputRef.current?.click();
    } else if (type === "profile") {
      profileInputRef.current?.click();
    } else {
      resumeInputRef.current?.click();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl overflow-hidden mb-8">
      {/* Banner Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20">
        {userData.banner_image ? (
          <img
            src={userData.banner_image}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200/50 to-gray-300/50 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-60" />
              <p className="text-sm">No banner image</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleFileChange(e, "banner")}
        />

        <button
          onClick={handleBannerUpdate}
          disabled={isUploading}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center space-x-2 shadow-lg hover:shadow-xl border border-gray-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="w-4 h-4" />
          <span className="font-medium text-sm">Update Banner</span>
        </button>
      </div>

      {/* Profile Info Section */}
      <div className="px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end lg:space-x-8">
          {/* Profile Image */}
          <div className="relative flex-shrink-0 -mt-20 lg:-mt-24 mx-auto lg:mx-0 lg:mr-8">
            <div className="relative group">
              {userData.profile_image ? (
                <img
                  src={userData.profile_image}
                  alt="Profile"
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl border-4 border-white object-cover shadow-2xl transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl border-4 border-white bg-gray-100 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-20 h-20 lg:w-24 lg:h-24 opacity-60" />
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={profileInputRef}
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, "profile")}
              />

              <button
                onClick={handleProfileUpdate}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-gray-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Text Content and Resume Button */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-end lg:justify-between min-w-0 mt-6 lg:mt-0">
            <div className="flex-1 min-w-0 text-center lg:text-left mb-6 lg:mb-0 lg:mr-8">
              {/* Name and Username */}
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {userData.name || "No Name"}
                </h1>
                <p className="text-lg lg:text-xl text-gray-600">
                  @{userData.user_name || "username"}
                </p>
              </div>

              {/* Quote Section */}
              <div className="relative group max-w-2xl">
                {userData.quote ? (
                  <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                    <div className="flex-1">
                      <p className="text-gray-700 text-base lg:text-lg italic border-l-4 border-blue-500 pl-4 py-3 bg-blue-50/30 rounded-r-xl backdrop-blur-sm break-words">
                        "{userData.quote}"
                      </p>
                    </div>
                    <button
                      onClick={handleQuoteUpdate}
                      disabled={isUploading}
                      className="p-2 hover:bg-gray-100/60 rounded-lg transition-colors cursor-pointer flex-shrink-0 backdrop-blur-sm border border-gray-200/30 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-0 self-center"
                      aria-label="Edit quote"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                    <button
                      onClick={handleQuoteUpdate}
                      disabled={isUploading}
                      className="text-gray-500 text-base lg:text-lg italic border-l-4 border-gray-300 pl-4 py-3 bg-gray-50/30 rounded-r-xl backdrop-blur-sm hover:bg-gray-100/40 transition-colors cursor-pointer break-words flex-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      "Add a quote about yourself..."
                    </button>
                    <button
                      onClick={handleQuoteUpdate}
                      disabled={isUploading}
                      className="p-2 hover:bg-gray-100/60 rounded-lg transition-colors cursor-pointer flex-shrink-0 backdrop-blur-sm border border-gray-200/30 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-0 self-center"
                      aria-label="Add quote"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Button */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start mt-6 lg:mt-0">
              <input
                type="file"
                ref={resumeInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileChange(e, "resume")}
              />

              {userData.resume ? (
                <button
                  onClick={handleResumeUpdate}
                  disabled={isUploading}
                  className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer group border border-gray-200/50 hover:border-gray-300/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-semibold text-base whitespace-nowrap">
                    Resume
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleResumeUpdate}
                  disabled={isUploading}
                  className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer group border border-gray-200/50 hover:border-gray-300/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-semibold text-base whitespace-nowrap">
                    Add Resume
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Update Modal */}
      <FileUpdateModal
        selectedFile={selectedFile}
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
        onReselect={handleReselectFile}
        isUploading={isUploading}
      />

      {/* Quote Update Modal */}
      <QuoteUpdateModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        currentQuote={userData.quote || ""}
        onSubmit={handleQuoteSubmit}
        isLoading={isUploading}
      />
    </div>
  );
};

export default ProfileHeader;