import api from '../api/api';
import type { DashboardStats, BlogAnalytics, TrendingBlog, BlogStatusMetrics } from '../types/analytics';
import type { Blog, BlogUpdateData } from '../types/blog';

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/blogs/stats');
    const overview = response.data?.data?.overview || {};
    
    return {
      totalBlogs: overview.totalBlogs || 0,
      totalViews: overview.totalViews || 0,
      totalProjects: overview.totalProjects || 0,
      totalSkills: overview.totalSkills || 0,
      totalCertificates: overview.totalCertificates || 0,
      totalComments: overview.totalComments || 0,
      totalLikes: overview.totalLikes || 0,
      publishedBlogs: overview.publishedBlogs || 0,
      draftBlogs: overview.draftBlogs || 0,
    };
  },

  getAnalyticsOverview: async (): Promise<{ trending: TrendingBlog[], metrics: BlogStatusMetrics[] }> => {
    const response = await api.get('/admin/blogs/stats');
    const data = response.data?.data || {};
    const overview = data.overview || {};
    
    return {
      trending: data.trending || [],
      metrics: [
        { status: 'Published', count: overview.publishedBlogs || 0 },
        { status: 'Draft', count: overview.draftBlogs || 0 }
      ]
    };
  },

  getBlogsByStatus: async (status: string): Promise<Blog[]> => {
    const response = await api.get(`/admin/blogs/status/${status}`);
    return response.data?.data || response.data;
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