import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Login/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import OtpVerification from '../components/OtpVerification';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import NotFound from '../pages/NotFound/NotFound';
import Profile from '../pages/Profile/ProfilePage';
import BlogsPage from '../pages/Blogs/BlogsPage';
import ProjectsPage from '../pages/Project/ProjectPage';
import CertificatesPage from '../pages/Certificates/CertificatePage';
import SkillsPage from '../pages/Skills/SkillsPage';
import HelpPage from '../pages/help/HelpPage';
import AccountSetting from '../pages/settings/AccountSetting';

import {ROUTES} from "../utils/navigation";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  requireAuth: boolean;
}


export const routes: RouteConfig[] = [
  // Public routes
  { path: '/login', component: LoginPage, requireAuth: false },
  { path: '/register', component: RegisterPage, requireAuth: false },
  { path: '/verify-otp', component: OtpVerification, requireAuth: false },
  { path: '/forgot-password', component: ForgotPassword, requireAuth: false },
  { path: '/reset-password', component: ResetPassword, requireAuth: false },
  
  // Protected routes (with layout)
  { path: '/', component: DashboardPage, requireAuth: true },
  { path: ROUTES.DASHBOARD, component: DashboardPage, requireAuth: true },
  { path: ROUTES.PROFILE, component: Profile, requireAuth: true },
  { path: ROUTES.BLOGS, component: BlogsPage, requireAuth: true },
  { path: ROUTES.PROJECTS, component: ProjectsPage, requireAuth: true },
  { path: ROUTES.CERTIFICATES, component: CertificatesPage, requireAuth: true },
  { path: ROUTES.SKILLS, component: SkillsPage, requireAuth: true },
  { path: ROUTES.SETTINGS, component: AccountSetting, requireAuth: true },
  { path: ROUTES.HELP, component: HelpPage, requireAuth: true },
    
  // 404 route
  { path: '*', component: NotFound, requireAuth: true },
];