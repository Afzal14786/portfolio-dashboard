import React, { useState, useEffect } from "react";
import {
  ProfileHeader,
  ReadingResources,
  SocialMediaLinks,
  HobbiesSection,
  UpdateModal,
} from "../../components/profile/index";
import { profileService } from "../../services/profileService";
import type { 
  UserProfile, 
  UpdateType, 
  ModalDataState, 
  ReadingResource, 
  SocialLinks 
} from "../../types/user";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [updateModal, setUpdateModal] = useState<{
    isOpen: boolean;
    type: UpdateType;
    existingData?: ModalDataState;
  }>({ isOpen: false, type: "profile" });

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProfile = await profileService.getProfile();
      setUserData(fetchedProfile);
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please ensure you are logged in and the server is running.");
      toast.error("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUserDataUpdate = (updatedData: Partial<UserProfile>) => {
    if (userData) {
      setUserData({ ...userData, ...updatedData });
    }
  };

  const openUpdateModal = (type: UpdateType, payload?: unknown) => {
    if (type === "banner" || type === "profile" || type === "resume") return;

    const existingData: ModalDataState = {};

    switch (type) {
      case "quote":
        existingData.currentQuote = userData?.quote || "";
        break;
      case "reading-resource":
        existingData.reading_resources = userData?.reading_resources || [];
        // Support edit mode pre-filling
        if (payload && typeof payload === 'object' && 'isEdit' in payload) {
            Object.assign(existingData, payload);
        }
        break;
      case "social-media":
        existingData.social_media = userData?.social_media || {};
        if (payload && typeof payload === 'object' && 'isEdit' in payload) {
            Object.assign(existingData, payload);
        }
        break;
      case "hobby":
      case "hobbies":
        existingData.hobbies = userData?.hobbies || [];
        break;
    }

    setUpdateModal({ isOpen: true, type, existingData });
  };

  const closeUpdateModal = () => {
    setUpdateModal({ isOpen: false, type: "profile" });
  };

  const handleModalSubmit = async (type: UpdateType, data: unknown) => {
    try {
      let updatedProfile: UserProfile | null = null;

      switch (type) {
        case "quote": {
          const payload = data as { quote: string };
          updatedProfile = await profileService.updateQuote(payload.quote);
          toast.success("Quote updated successfully!");
          break;
        }
        case "reading-resource": {
          const payload = data as ReadingResource[];
          updatedProfile = await profileService.updateReadingResources(payload);
          toast.success("Reading resources updated!");
          break;
        }
        case "social-media": {
          const payload = data as SocialLinks;
          updatedProfile = await profileService.updateSocialMedia(payload);
          toast.success("Social links updated!");
          break;
        }
        case "hobby":
        case "hobbies": {
          const payload = data as string[];
          updatedProfile = await profileService.updateHobbies(payload);
          toast.success("Hobbies updated!");
          break;
        }
      }

      // FIX: Shallow merge prevents the UI from wiping other sections if the backend selects limited fields
      if (updatedProfile) {
        setUserData((prev) => prev ? { ...prev, ...updatedProfile } : updatedProfile);
      }
      closeUpdateModal();
    } catch (err: unknown) {
      console.error(`Error updating ${type}:`, err);
      toast.error(`Failed to update ${type.replace('-', ' ')}. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="w-14 h-14 text-blue-600 animate-spin relative z-10" />
        </div>
        <p className="text-gray-600 text-lg font-medium mt-6 tracking-wide animate-pulse">Preparing your workspace...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-red-100 border border-red-50 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Profile Unavailable</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{error || "We couldn't load your profile information. Please check your connection."}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl transition-all font-semibold w-full flex items-center justify-center gap-2 hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header / Banner / Info */}
        <ProfileHeader
          userData={userData}
          onUpdate={openUpdateModal}
          onUserDataUpdate={handleUserDataUpdate}
        />

        {/* Modules Grid */}
        <div className="space-y-6 lg:space-y-8 mt-8">
          <ReadingResources
            resources={userData.reading_resources}
            onUpdate={openUpdateModal}
            onUserDataUpdate={handleUserDataUpdate}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <SocialMediaLinks
              socialMedia={userData.social_media}
              onUpdate={openUpdateModal}
            />
            <HobbiesSection
              hobbies={userData.hobbies}
              onUpdate={openUpdateModal}
            />
          </div>
        </div>

      </div>

      <UpdateModal
        isOpen={updateModal.isOpen}
        onClose={closeUpdateModal}
        type={updateModal.type}
        onSubmit={handleModalSubmit}
        existingData={updateModal.existingData}
      />
    </div>
  );
};

export default Profile;