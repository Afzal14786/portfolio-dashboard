import { useState, useEffect } from 'react';
import type { User } from '../types/user';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
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
        let user: User | null = null;
        
        if (userData) {
          try {
            user = JSON.parse(userData) as User;
          } catch (error: unknown) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('userData');
          }
        }

        setAuthState({
          isAuthenticated,
          user,
          isLoading: false
        });
      } catch (error: unknown) {
        console.error('Error checking authentication:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
      }
    };

    checkAuth();

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