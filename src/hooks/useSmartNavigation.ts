import { useCallback } from 'react';
import { useNavigate, useLocation, type To } from 'react-router-dom';

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const smartNavigate = useCallback((to: To) => {
    const targetPath = typeof to === 'string' ? to : to.pathname || '';
    
    // Normalize paths for comparison (remove trailing slashes)
    const currentPath = location.pathname.replace(/\/$/, '');
    const normalizedTargetPath = targetPath.replace(/\/$/, '');
    
    // Prevent navigation if already on the target route
    if (currentPath === normalizedTargetPath) {
      console.log(`Navigation prevented: Already on route ${targetPath}`);
      return false; // Indicate that navigation was prevented
    }
    
    navigate(to);
    return true; // Indicate that navigation was performed
  }, [navigate, location.pathname]);

  return smartNavigate;
};