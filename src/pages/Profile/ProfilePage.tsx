import React, { useState, useEffect } from 'react';
import {
  ProfileHeader,
  ReadingResources,
  SocialMediaLinks,
  HobbiesSection,
  UpdateModal,
  type UserProfile,
  type UpdateType
} from '../../components/profile/index';

import api from '../../api/api';

const mockUserData: UserProfile = {
  user_name: 'mdafzal14786',
  name: 'Md Afzal Ansari',
  email: 'afzal@example.com',
  profile_image: '/images/user_icon.png',
  banner_image: '/images/default_banner.png',
  resume: '/resumes/afzal_resume.pdf',
  social_media: {},
  hobbies: [],
  reading_resources: [],
  quote: '',
  blog_count: 0
};

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState<{
    isOpen: boolean;
    type: UpdateType;
    data?: any;
  }>({ isOpen: false, type: 'profile' });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userProfile: UserProfile = {
          user_name: parsedUser.user_name || 'user',
          name: parsedUser.name || 'User Name',
          email: parsedUser.email || 'user@example.com',
          profile_image: parsedUser.profile_image || '/images/user_icon.png',
          banner_image: parsedUser.banner_image || '/images/default_banner.png',
          resume: parsedUser.resume || null,
          social_media: parsedUser.social_media || {},
          hobbies: parsedUser.hobbies || [],
          reading_resources: parsedUser.reading_resources || [],
          quote: parsedUser.quote || '',
          blog_count: parsedUser.blog_count || 0
        };
        setUserData(userProfile);
      } else {
        setUserData(mockUserData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserData(mockUserData);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type: UpdateType, data: any) => {
    try {
      // Here you would make API calls to update the data
      console.log(`Updating ${type}:`, data);
      
      // For now, just update local state
      if (userData) {
        let updatedData = { ...userData };
        
        switch (type) {
          case 'banner':
          case 'profile':
            if (data.file) {
              // Handle file upload - in real app, you'd upload to server
              const fileUrl = URL.createObjectURL(data.file);
              if (type === 'banner') {
                updatedData.banner_image = fileUrl;
              } else {
                updatedData.profile_image = fileUrl;
              }
            }
            break;
            
          case 'reading-resource':
            updatedData.reading_resources = [
              ...updatedData.reading_resources,
              { title: data.title, url: data.url }
            ];
            break;
            
          case 'social-media':
            updatedData.social_media = {
              ...updatedData.social_media,
              [data.platform]: data.url
            };
            break;
            
          case 'hobby':
            updatedData.hobbies = [...updatedData.hobbies, data.name];
            break;
            
          case 'quote':
            updatedData.quote = data.quote;
            break;
        }
        
        setUserData(updatedData);
        
        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const openUpdateModal = (type: UpdateType, data?: any) => {
    setUpdateModal({ isOpen: true, type, data });
  };

  const closeUpdateModal = () => {
    setUpdateModal({ isOpen: false, type: 'profile' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Not Available</h3>
          <p className="text-gray-600 mb-6">We couldn't load your profile information.</p>
          <button
            onClick={fetchUserProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 py-4 lg:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        <ProfileHeader 
          userData={userData} 
          onUpdate={openUpdateModal}
        />
        
        <div className="space-y-6 lg:space-y-8">
          <ReadingResources 
            resources={userData.reading_resources} 
            onUpdate={openUpdateModal}
          />
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

      <UpdateModal
        isOpen={updateModal.isOpen}
        onClose={closeUpdateModal}
        type={updateModal.type}
        onSubmit={(data) => handleUpdate(updateModal.type, data)}
        existingData={updateModal.data}
      />
    </div>
  );
};

export default Profile;