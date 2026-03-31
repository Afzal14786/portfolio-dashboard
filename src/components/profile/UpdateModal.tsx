import React, { useState, useEffect } from "react";
import { X, Book, Globe, Heart, Quote, Loader2, Sparkles } from "lucide-react";
import {
  type UpdateType,
  type ModalDataState,
} from "../../types/user";
import { toast } from "react-toastify";

// Define the URL helpers directly in the file since they were missing
const isValidUrl = (urlString: string): boolean => {
    try {
      const urlToTest = urlString.startsWith('http://') || urlString.startsWith('https://') 
        ? urlString 
        : `https://${urlString}`;
      const url = new URL(urlToTest);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
      console.error(`error: ${e}`);
      return false;
    }
  };
  
const formatUrl = (url: string): string => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) return trimmedUrl;
    return `https://${trimmedUrl}`;
};

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: UpdateType;
  onSubmit: (type: UpdateType, data: unknown) => void;
  existingData?: ModalDataState;
}

const platformConfig = {
  github: { label: "GitHub" },
  linkedin: { label: "LinkedIn" },
  twitter: { label: "Twitter" },
  instagram: { label: "Instagram" },
  facebook: { label: "Facebook" },
  leetcode: { label: "LeetCode" },
  medium: { label: "Medium" },
  blogSite: { label: "Blog" },
  portfolio: { label: "Portfolio" },
} as const;

type PlatformKey = keyof typeof platformConfig;

interface FormDataState {
  quote?: string;
  title?: string;
  url?: string;
  platform?: string;
  name?: string;
}

const hobbySuggestions = ["Coding", "Reading", "Travel", "Music", "Sports", "Cooking", "Gaming", "Art", "Photography"];

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, type, onSubmit, existingData }) => {
  const [formData, setFormData] = useState<FormDataState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
      
      if (type === "quote") setFormData({ quote: existingData?.currentQuote || "" });
      else if (type === "reading-resource") {
          // Changed to support editing
          setFormData({ 
              title: existingData?.title as string || "", 
              url: existingData?.url as string || "" 
            });
      }
      else if (type === "social-media") {
        const platform = existingData?.platform as string || "";
        const url = existingData?.url as string || "";
        setFormData({ platform, url });
      }
      else if (type === "hobby" || type === "hobbies") setFormData({ name: "" });
      else setFormData({});
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, type, existingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let updatePayload: unknown;

      switch (type) {
        case "quote": {
          if (!formData.quote?.trim() || formData.quote.length > 200) {
            toast.warning("Please enter a valid quote (max 200 chars).");
            setIsLoading(false);
            return;
          }
          updatePayload = { quote: formData.quote.trim() };
          break;
        }

        case "reading-resource": {
          if (!formData.title?.trim() || !formData.url || !isValidUrl(formData.url)) {
            toast.warning("Please enter a valid title and URL.");
            setIsLoading(false);
            return;
          }
          const newResource = { title: formData.title.trim(), url: formatUrl(formData.url.trim()) };
          
          // Fix for correctly updating arrays
          const currentResources = [...(existingData?.reading_resources || [])];
          
          if (existingData?.isEdit && existingData?.editIndex !== undefined) {
             currentResources[existingData.editIndex as number] = newResource;
          } else {
             currentResources.push(newResource);
          }
          
          updatePayload = currentResources;
          break;
        }

        case "social-media": {
          if (!formData.platform || !formData.url || !isValidUrl(formData.url)) {
            toast.warning("Please select a platform and enter a valid URL.");
            setIsLoading(false);
            return;
          }
          const currentSocialMedia = existingData?.social_media || {};
          updatePayload = { 
            ...currentSocialMedia, 
            [formData.platform]: formatUrl(formData.url.trim()) 
          };
          break;
        }

        case "hobby":
        case "hobbies": {
          if (!formData.name?.trim()) {
            toast.warning("Please enter a hobby name.");
            setIsLoading(false);
            return;
          }
          const currentHobbies = existingData?.hobbies || [];
          updatePayload = [...currentHobbies, formData.name.trim()];
          break;
        }

        default:
          setIsLoading(false);
          return;
      }

      await onSubmit(type, updatePayload);
      
    } catch (error: unknown) {
      console.error(error);
      toast.error("An unexpected error occurred in the modal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleInputChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTheme = () => {
    if (type === "quote") return { color: "blue", icon: <Quote className="w-5 h-5 text-blue-600" />, title: existingData?.currentQuote ? "Update Quote" : "Add Quote" };
    if (type === "reading-resource") return { color: "emerald", icon: <Book className="w-5 h-5 text-emerald-600" />, title: existingData?.isEdit ? "Edit Reading Resource" : "Add Reading Resource" };
    if (type === "social-media") return { color: "purple", icon: <Globe className="w-5 h-5 text-purple-600" />, title: existingData?.isEdit ? "Edit Social Link" : "Add Social Link" };
    if (type === "hobby" || type === "hobbies") return { color: "pink", icon: <Heart className="w-5 h-5 text-pink-600" />, title: "Add Hobby" };
    return { color: "gray", icon: <Sparkles className="w-5 h-5 text-gray-600" />, title: "Update" };
  };

  const theme = getTheme();
  
  // FIX for button color parsing issues with dynamic classes
  const buttonColors = {
      blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30",
      emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30",
      purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/30",
      pink: "bg-pink-600 hover:bg-pink-700 shadow-pink-500/30",
      gray: "bg-gray-800 hover:bg-gray-900 shadow-gray-500/30"
  };
  const themeBtnColor = buttonColors[theme.color as keyof typeof buttonColors];

  const renderFormContent = () => {
    if (type === "quote") {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 ml-1">Your Quote</label>
          <div className="relative">
            <Quote className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
            <textarea 
              value={formData.quote || ""} 
              onChange={(e) => handleInputChange("quote", e.target.value)} 
              rows={4} 
              maxLength={200} 
              className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 transition-all resize-none`}
              placeholder="Share something inspiring..." 
              disabled={isLoading} 
              required 
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{formData.quote?.length || 0}/200</p>
        </div>
      );
    }

    if (type === "reading-resource") {
      return (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Title</label>
            <input 
              type="text" 
              value={formData.title || ""} 
              onChange={(e) => handleInputChange("title", e.target.value)} 
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all`}
              placeholder="e.g., Clean Code"
              required disabled={isLoading} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">URL</label>
            <input 
              type="url" 
              value={formData.url || ""} 
              onChange={(e) => handleInputChange("url", e.target.value)} 
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all`}
              placeholder="https://..."
              required disabled={isLoading} 
            />
          </div>
        </div>
      );
    }

    if (type === "social-media") {
      const availablePlatforms = Object.keys(platformConfig) as PlatformKey[];
      return (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Platform</label>
            <select 
              value={formData.platform || ""} 
              onChange={(e) => handleInputChange("platform", e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50/50 transition-all appearance-none cursor-pointer" 
              required disabled={isLoading || !!existingData?.isEdit}
            >
              <option value="" disabled>Select Platform</option>
              {availablePlatforms.map((key) => <option key={key} value={key}>{platformConfig[key].label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Profile URL</label>
            <input 
              type="url" 
              value={formData.url || ""} 
              onChange={(e) => handleInputChange("url", e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50/50 transition-all" 
              placeholder="https://..."
              required disabled={isLoading} 
            />
          </div>
        </div>
      );
    }

    if (type === "hobby" || type === "hobbies") {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Hobby Name</label>
            <input 
              type="text" 
              value={formData.name || ""} 
              onChange={(e) => handleInputChange("name", e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-gray-50/50 transition-all" 
              placeholder="e.g., Mountain Biking"
              required disabled={isLoading} 
            />
          </div>
          <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
            <label className="block text-xs font-semibold text-pink-800 mb-3 uppercase tracking-wider">Quick Suggestions</label>
            <div className="flex flex-wrap gap-2">
              {hobbySuggestions.map((sug) => (
                <button 
                  key={sug} 
                  type="button" 
                  onClick={() => handleInputChange("name", sug)} 
                  disabled={isLoading} 
                  className="px-3 py-1.5 bg-white text-pink-700 hover:bg-pink-100 hover:scale-105 rounded-lg text-sm font-medium border border-pink-200 transition-all shadow-sm"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const isFormValid = () => {
    if (type === "quote") return !!formData.quote?.trim();
    if (type === "reading-resource") return !!(formData.title?.trim() && formData.url); 
    if (type === "social-media") return !!(formData.platform && formData.url);
    if (type === "hobby" || type === "hobbies") return !!formData.name?.trim();
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={!isLoading ? handleClose : undefined} 
      />
      
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Modal Header */}
        <div className={`bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-white rounded-xl shadow-sm border border-gray-100`}>
              {theme.icon}
            </div>
            <h2 className={`text-xl font-bold text-gray-900`}>{theme.title}</h2>
          </div>
          <button 
            onClick={handleClose} 
            disabled={isLoading} 
            className={`p-2 bg-white/50 hover:bg-white text-gray-500 hover:text-gray-700 rounded-full transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderFormContent()}
            
            {/* Actions */}
            <div className="flex space-x-3 mt-8">
              <button 
                type="button" 
                onClick={handleClose} 
                disabled={isLoading} 
                className="flex-1 px-4 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!isFormValid() || isLoading} 
                className={`flex-1 px-4 py-3.5 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all ${themeBtnColor}`}
              >
                {isLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;