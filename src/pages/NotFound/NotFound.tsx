import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, HelpCircle, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Handle back button click
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/login');
    }
  };

  // Handle dashboard redirect
  const handleDashboardRedirect = () => {
    navigate('/dashboard');
  };

  // Handle login redirect (only for unauthenticated users)
  const handleLoginRedirect = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Get appropriate redirect options based on authentication
  const getRedirectOptions = () => {
    if (isAuthenticated) {
      return [
        {
          icon: <Home className="w-5 h-5" />,
          label: 'Go to Dashboard',
          onClick: handleDashboardRedirect,
          primary: true
        },
        {
          icon: <ArrowLeft className="w-5 h-5" />,
          label: 'Go Back',
          onClick: handleBack,
          primary: false
        }
      ];
    } else {
      return [
        {
          icon: <Shield className="w-5 h-5" />,
          label: 'Go to Login',
          onClick: handleLoginRedirect,
          primary: true
        },
        {
          icon: <ArrowLeft className="w-5 h-5" />,
          label: 'Go Back',
          onClick: handleBack,
          primary: false
        }
      ];
    }
  };

  const redirectOptions = getRedirectOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/50">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">404</span>
          </div>
        </div>
        
        {/* Error Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Lost in the digital space?
          </h2>
          
          <p className="text-gray-500 mb-2">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          
          {isAuthenticated && user && (
            <p className="text-sm text-blue-600 font-medium">
              Welcome back, {user.name || user.user_name || 'User'}! 
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {redirectOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.onClick}
              className={`w-full flex items-center justify-center space-x-3 py-3 px-4 font-semibold rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                option.primary
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Need Help?</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            If you believe this is an error or need assistance, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="mailto:support@terminalx.com"
              className="flex-1 text-center py-2 px-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Email Support
            </a>
            <a
              href="/help"
              className="flex-1 text-center py-2 px-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Help Center
            </a>
          </div>
        </div>

        {/* Technical Details (for developers) */}
        <details className="mt-6 text-sm text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">
            Technical Details
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p><strong>Current Path:</strong> {window.location.pathname}</p>
            <p><strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent.split(' ')[0]}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default NotFound;