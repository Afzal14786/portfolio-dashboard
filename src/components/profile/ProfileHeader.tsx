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

// Constants
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// File Update Modal Component
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

  const modalConfig = {
    banner: {
      title: "Update Banner Image",
      icon: <ImageIcon className="w-5 h-5" />,
      text: "banner image"
    },
    profile: {
      title: "Update Profile Image",
      icon: <ImageIcon className="w-5 h-5" />,
      text: "profile image"
    },
    resume: {
      title: "Update Resume",
      icon: <FileText className="w-5 h-5" />,
      text: "resume file"
    }
  };

  const config = modalConfig[selectedFile.type];

  const modalContent = (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onCancel} />
      
      <div className={`relative bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
        isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
      } border border-white/50`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100/80 rounded-lg border border-gray-200/50">
              {config.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
              <p className="text-sm text-gray-600 mt-0.5">Upload your {config.text}</p>
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

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200/50">
                  {config.icon}
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
                    <span className="text-xs text-gray-600 capitalize">{selectedFile.type}</span>
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
              <span className="text-sm font-medium text-gray-700">Choose Different File</span>
            </button>
          </div>

          {/* Actions */}
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
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
    if (isOpen) setQuote(currentQuote || "");
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
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md border border-white/50 p-6" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
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

        {/* Form */}
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
                <p className="text-red-500 text-xs mt-1">{200 - quote.length} characters remaining</p>
              )}
            </div>
          </div>

          {/* Actions */}
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
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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

// Main Profile Header Component
interface ProfileHeaderProps {
  userData: UserProfile;
  onUpdate?: (type: UpdateType, data: any) => void;
  onUserDataUpdate?: (updatedData: Partial<UserProfile>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  onUpdate,
  onUserDataUpdate,
}) => {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<{ file: File; type: "banner" | "profile" | "resume" } | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File upload configuration
  const uploadConfig = {
    banner: { endpoint: "/admin/profile/banner", fieldName: "banner_image" },
    profile: { endpoint: "/admin/profile/image", fieldName: "profile_image" },
    resume: { endpoint: "/admin/profile/resume", fieldName: "resume" }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "banner" | "profile" | "resume") => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = type === "resume" ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Only ${type === "resume" ? "PDF and Word documents" : "JPEG, JPG, PNG & WebP images"} are allowed`);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile({ file, type });
    event.target.value = ""; // Reset input
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === "string") return error;
    return error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again.";
  };

  const uploadFile = async (file: File, type: "banner" | "profile" | "resume"): Promise<string> => {
    const { endpoint, fieldName } = uploadConfig[type];
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await api.patch(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.user) {
      const imageData = response.data.user[fieldName];
      return (typeof imageData === "object" && imageData.url) ? imageData.url : imageData;
    }

    throw new Error("Invalid response from server");
  };

  const handleConfirmUpdate = async (): Promise<void> => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${selectedFile.type}...`);

    try {
      const fileUrl = await uploadFile(selectedFile.file, selectedFile.type);
      if (!fileUrl) throw new Error("No URL returned from server");

      const updateData: Partial<UserProfile> = {
        [selectedFile.type === "banner" ? "banner_image" : 
         selectedFile.type === "profile" ? "profile_image" : "resume"]: fileUrl
      };

      if (typeof onUserDataUpdate === 'function') {
        onUserDataUpdate(updateData);
      } else {
        const updatedUserData = { ...userData, ...updateData };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      }

      setSelectedFile(null);
      toast.update(toastId, {
        render: `${selectedFile.type.charAt(0).toUpperCase() + selectedFile.type.slice(1)} updated successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.update(toastId, {
        render: `Failed to upload ${selectedFile.type}: ${getErrorMessage(error)}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuoteSubmit = async (quote: string): Promise<void> => {
    setIsUploading(true);

    try {
      const response = await api.patch("/admin/profile/quote", { quote });
      if (!response.data) throw new Error("Invalid response from server");

      if (typeof onUserDataUpdate === 'function') {
        onUserDataUpdate({ quote });
      } else {
        const updatedUserData = { ...userData, quote };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      }

      setShowQuoteModal(false);
      toast.success(userData.quote ? "Quote updated successfully!" : "Quote added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Error updating quote:", error);
      toast.error(`Failed to update quote: ${getErrorMessage(error)}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpdate = () => !isUploading && setSelectedFile(null);

  const handleReselectFile = (type: "banner" | "profile" | "resume") => {
    if (isUploading) return;
    const refs = { banner: bannerInputRef, profile: profileInputRef, resume: resumeInputRef };
    refs[type].current?.click();
  };

  const renderPlaceholder = (type: "banner" | "profile") => (
    <div className={`w-full h-full bg-gradient-to-br from-gray-200/50 to-gray-300/50 flex items-center justify-center ${
      type === "profile" ? "rounded-2xl border-4 border-white/80" : ""
    }`}>
      <div className="text-center text-gray-500">
        <ImageIcon className={`${type === "banner" ? "w-16 h-16" : "w-20 h-20 lg:w-24 lg:h-24"} mx-auto mb-2 opacity-60`} />
        <p className="text-sm">No {type} image</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden mb-8 transition-all duration-300 hover:bg-white/70">
      {/* Banner Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400/30 via-purple-500/30 to-pink-500/30 backdrop-blur-sm">
        {userData.banner_image ? (
          <img 
            src={userData.banner_image} 
            alt="Banner" 
            className="w-full h-full object-cover mix-blend-overlay" 
          />
        ) : (
          renderPlaceholder("banner")
        )}

        {/* Banner Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleFileChange(e, "banner")}
        />

        <button
          onClick={() => bannerInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center space-x-2 shadow-lg hover:shadow-xl border border-white/60 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          <Camera className="w-4 h-4" />
          <span className="font-medium text-sm">Update Banner</span>
        </button>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 lg:px-8 pb-8 pt-4">
        {/* Profile Image Container - Overlapping the banner */}
        <div className="absolute -top-24 left-6 lg:left-8 transform transition-transform duration-300 hover:scale-105">
          <div className="relative group">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl border-4 border-white/80 bg-white/80 backdrop-blur-md shadow-2xl overflow-hidden">
              {userData.profile_image ? (
                <img
                  src={userData.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleFileChange(e, "profile")}
            />

            <button
              onClick={() => profileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-white/60 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
            >
              <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content Area - Adjusted for overlapping profile image */}
        <div className="mt-20 lg:mt-24 flex flex-col lg:flex-row lg:items-start lg:justify-between">
          {/* Left Section - Name, Username, and Quote */}
          <div className="flex-1 lg:mr-8">
            {/* Name and Username */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {userData.name || "No Name"}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-medium">
                @{userData.user_name || "username"}
              </p>
            </div>

            {/* Quote Section */}
            <div className="max-w-2xl">
              {userData.quote ? (
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                  <div className="flex-1">
                    <p className="text-gray-700 text-base lg:text-lg italic border-l-4 border-blue-400 pl-4 py-3 bg-blue-50/50 rounded-r-xl backdrop-blur-sm break-words shadow-inner">
                      "{userData.quote}"
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    disabled={isUploading}
                    className="p-2 hover:bg-gray-100/80 rounded-lg transition-colors cursor-pointer flex-shrink-0 backdrop-blur-sm border border-gray-200/50 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-0 self-start hover:scale-105"
                    aria-label="Edit quote"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    disabled={isUploading}
                    className="text-gray-500 text-base lg:text-lg italic border-l-4 border-gray-300 pl-4 py-3 bg-gray-50/50 rounded-r-xl backdrop-blur-sm hover:bg-gray-100/60 transition-colors cursor-pointer break-words flex-1 text-left disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform transition-transform"
                  >
                    "Add a quote about yourself..."
                  </button>
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    disabled={isUploading}
                    className="p-2 hover:bg-gray-100/80 rounded-lg transition-colors cursor-pointer flex-shrink-0 backdrop-blur-sm border border-gray-200/50 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-0 self-start hover:scale-105"
                    aria-label="Add quote"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Resume Button */}
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
                onClick={() => window.open(userData.resume, "_blank")}
                disabled={isUploading}
                className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-md hover:bg-white/95 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer group border border-white/60 hover:border-gray-300/60 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-semibold text-base whitespace-nowrap">Resume</span>
              </button>
            ) : (
              <button
                onClick={() => resumeInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-md hover:bg-white/95 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer group border border-white/60 hover:border-gray-300/60 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-semibold text-base whitespace-nowrap">Add Resume</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <FileUpdateModal
        selectedFile={selectedFile}
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
        onReselect={handleReselectFile}
        isUploading={isUploading}
      />

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