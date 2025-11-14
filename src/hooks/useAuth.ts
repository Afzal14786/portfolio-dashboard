import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('userData');
        
        const isAuthenticated = !!token;
        let user = null;
        
        if (userData) {
          try {
            user = JSON.parse(userData);
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('userData');
          }
        }

        setAuthState({
          isAuthenticated,
          user,
          isLoading: false
        });
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return authState;
};