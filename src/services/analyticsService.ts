import api from '../api/api';
import { type DashboardStats, type BlogAnalytics } from '../types/blog';

export const analyticsService = {
  getDashboardStats: (): Promise<{ data: { data: DashboardStats } }> => 
    api.get('/admin/blogs/stats'),
  
  getBlogAnalytics: (blogId: string): Promise<{ data: { data: BlogAnalytics } }> => 
    api.get(`/admin/blogs/analytics/${blogId}`),
};