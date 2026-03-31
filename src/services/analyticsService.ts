import api from '../api/api';
import type { DashboardStats, BlogAnalytics } from '../types/analytics';
import type { Blog, BlogUpdateData } from '../types/blog';

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/blogs/stats');
    return response.data;
  },

  getBlogsByStatus: async (status: string): Promise<Blog[]> => {
    const response = await api.get(`/admin/blogs/status/${status}`);
    return response.data;
  },

  getBlogAnalytics: async (id: string): Promise<BlogAnalytics> => {
    const response = await api.get(`/admin/blogs/analytics/${id}`);
    if (response.data && response.data.data) {
        return response.data.data;
    }
    return response.data;
  },

  updateBlog: (id: string, data: Partial<BlogUpdateData>) => api.put(`/admin/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete(`/admin/blogs/${id}`),
};