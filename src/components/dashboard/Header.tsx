import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

interface ApiError {
  response?: {
    data?: {
      message: string;
    };
  };
  message: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async (): Promise<void> => {
    try {
      // show loading toast
      const toastId = toast.loading('Logging out...');
      
      // call logout API
      const response = await api.post('/admin-auth/signin/logout');
      
      // clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      // update toast
      toast.update(toastId, {
        render: response.data.message || 'Logged out successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      
      // redirect to login page
      navigate('/login');
    } catch (error: unknown) {
      console.error('Logout error:', error);
      console.log(error);
      
      // even if the api call fails due to any reasons we can clear the local storage and let user logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      // Type-safe error handling
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const apiError = error as ApiError;
        if (apiError.response?.data?.message) {
          toast.error(apiError.response.data.message);
        } else {
          toast.info('Logged out successfully!');
        }
      } else {
        toast.info('Logged out successfully!');
      }
      
      // redirect to login page
      navigate('/login');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div></div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          
          <div 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer hover:border-blue-300"
          >
            {userData?.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {userData?.name || 'User'}
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;