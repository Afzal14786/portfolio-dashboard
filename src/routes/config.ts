import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Login/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import OtpVerification from '../components/OtpVerification';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import NotFound from '../pages/NotFound/NotFound';
import Profile from '../pages/Profile/ProfilePage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  requireAuth: boolean;
}

// Create a redirect component
const RedirectToDashboard = () => {
  window.location.href = '/dashboard';
  return null;
};

export const routes: RouteConfig[] = [
  // Public routes
  { path: '/login', component: LoginPage, requireAuth: false },
  { path: '/register', component: RegisterPage, requireAuth: false },
  { path: '/verify-otp', component: OtpVerification, requireAuth: false },
  { path: '/forgot-password', component: ForgotPassword, requireAuth: false },
  { path: '/reset-password', component: ResetPassword, requireAuth: false },
  
  // Protected routes
  { path: '/dashboard', component: DashboardPage, requireAuth: true },
  { path: '/profile', component: Profile, requireAuth: true },
  
  // Default route
  { path: '/', component: RedirectToDashboard, requireAuth: true },
  
  // 404 route
  { path: '*', component: NotFound, requireAuth: false },
];