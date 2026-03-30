import api from '../api/api';
import type { 
  DashboardStatsResponse, 
  BlogAnalyticsResponse, 
  BlogsByStatusResponse,
  DashboardStats,
  TrendingBlog,
  VisitorData,
  BlogStatusMetrics
} from '../types/analytics';

export const analyticsService = {
  
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStatsResponse>('/analytics/dashboard-status');
    if (!response.data.stats) throw new Error('Failed to load dashboard stats');
    return response.data.stats;
  },

  getBlogAnalytics: async (): Promise<{ trending: TrendingBlog[]; visitorData: VisitorData[] }> => {
    const response = await api.get<BlogAnalyticsResponse>('/analytics/blog-analytics');
    return {
      trending: response.data.trending || [],
      visitorData: response.data.visitorData || []
    };
  },

  getBlogsByStatus: async (): Promise<BlogStatusMetrics[]> => {
    const response = await api.get<BlogsByStatusResponse>('/analytics/blogs-by-status');
    return response.data.data || [];
  }

};