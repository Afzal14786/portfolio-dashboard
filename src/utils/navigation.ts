import { useSmartNavigation } from '../hooks/useSmartNavigation';

// Utility function to be used in any component
export const useNavigation = () => {
  const smartNavigate = useSmartNavigation();
  
  const navigateTo = (path: string) => {
    return smartNavigate(path);
  };

  // Pre-defined navigation functions for common routes
  const navigateToProfile = () => navigateTo('/profile');
  const navigateToDashboard = () => navigateTo('/dashboard');
  const navigateToBlogs = () => navigateTo('/blogs');
  const navigateToProjects = () => navigateTo('/projects');
  const navigateToCertificates = () => navigateTo('/certificates');
  const navigateToSkills = () => navigateTo('/skills');

  return {
    navigateTo,
    navigateToProfile,
    navigateToDashboard,
    navigateToBlogs,
    navigateToProjects,
    navigateToCertificates,
    navigateToSkills,
  };
};

// Route configuration for maintainability
export const ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BLOGS: '/admin/blogs',
  BLOG_READING: '/admin/blogs/read/:slug',
  PROJECTS: '/projects',
  CERTIFICATES: '/certificates',
  SKILLS: '/skills',
  SETTINGS: '/settings',
  HELP: '/help',
} as const;

export type AppRoute = keyof typeof ROUTES;