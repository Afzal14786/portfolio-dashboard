import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { type DashboardStats, type BlogAnalytics } from '../types/blog';

export const useAnalytics = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [blogAnalytics, setBlogAnalytics] = useState<BlogAnalytics | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [blogAnalyticsLoading, setBlogAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setError(null);
      const response = await analyticsService.getDashboardStats();
      
      // Handle response structure
      const statsData = response.data?.data || response.data;
      setDashboardStats(statsData);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch analytics');
      setDashboardStats(null);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const fetchBlogAnalytics = useCallback(async (blogId: string) => {
    if (!blogId) return;
    
    try {
      setBlogAnalyticsLoading(true);
      setError(null);
      const response = await analyticsService.getBlogAnalytics(blogId);
      
      // Handle response structure
      const analyticsData = response.data?.data || response.data;
      setBlogAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch blog analytics');
      setBlogAnalytics(null);
      throw err;
    } finally {
      setBlogAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    dashboardStats,
    blogAnalytics,
    loading: dashboardLoading || blogAnalyticsLoading,
    dashboardLoading,
    blogAnalyticsLoading,
    error,
    refetchDashboard: fetchDashboardStats,
    fetchBlogAnalytics,
  };
};