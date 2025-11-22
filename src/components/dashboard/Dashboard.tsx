import React from 'react';
import StatsCard from './StatsCard';
import VisitorChart from './VisitorChart';
import BlogStats from './BlogStats';
import TrendingBlogs from './TrendingBlogs';
import { FileText, Users, TrendingUp, Calendar, Target, Zap, Eye, Heart, MessageCircle } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import LoadingSpinner from '../ui/LoadingSpinner';

// Helper function to safely get number values
const safeNumber = (value: any): number => {
  if (value === undefined || value === null) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Helper function to format numbers - FIXED VERSION
const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

interface StatsDataItem {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  description: string;
  color: string;
  bgColor: string;
  trend: 'up' | 'down' | 'neutral' | 'active' | 'none';
}

interface PerformanceMetric {
  label: string;
  value: number | string;
  change: string;
  positive: boolean;
}

interface RecentActivityItem {
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  title: string;
  value: number;
  time: string;
}

const Dashboard: React.FC = () => {
  const { dashboardStats, loading, error, refetchDashboard } = useAnalytics();

  // Calculate derived metrics from real data
  const overview = dashboardStats?.overview || {
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    scheduledBlogs: 0,
    totalViews: 0,
    totalWords: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalReaders: 0
  };

  const trending = dashboardStats?.trending || [];

  // Calculate engagement metrics
  const totalEngagements = safeNumber(overview.totalLikes) + 
                          safeNumber(overview.totalComments) + 
                          safeNumber(overview.totalShares);
  
  const engagementRate = safeNumber(overview.totalViews) > 0 
    ? (totalEngagements / safeNumber(overview.totalViews) * 100)
    : 0;

  const avgReadTime = safeNumber(overview.totalBlogs) > 0 
    ? Math.round(safeNumber(overview.totalWords) / safeNumber(overview.totalBlogs) / 200) 
    : 0;

  // Stats data using real metrics - FIXED TYPE DEFINITION
  const statsData: StatsDataItem[] = [
    {
      icon: FileText,
      label: 'Total Blogs',
      value: formatNumber(safeNumber(overview.totalBlogs)),
      description: `${overview.publishedBlogs} published, ${overview.draftBlogs} drafts`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: overview.totalBlogs > 0 ? 'active' : 'none'
    },
    {
      icon: Users,
      label: 'Total Readers',
      value: formatNumber(safeNumber(overview.totalReaders)),
      description: 'All time unique visitors',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: overview.totalReaders > 0 ? 'active' : 'none'
    },
    {
      icon: Target,
      label: 'Engagement Rate',
      value: `${engagementRate.toFixed(1)}%`,
      description: 'Likes, comments & shares',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: engagementRate > 0 ? 'active' : 'none'
    },
    {
      icon: Zap,
      label: 'Avg. Read Time',
      value: `${avgReadTime || 0} min`,
      description: 'Per blog post',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: avgReadTime > 0 ? 'active' : 'none'
    }
  ];

  // Performance metrics based on real data
  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Views per Post',
      value: overview.totalBlogs > 0 ? Math.round(overview.totalViews / overview.totalBlogs) : 0,
      change: '+12%',
      positive: true
    },
    {
      label: 'Engagement per Post',
      value: overview.totalBlogs > 0 ? Math.round(totalEngagements / overview.totalBlogs) : 0,
      change: '+8%',
      positive: true
    }
  ];

  // Recent activity based on real data
  const recentActivity: RecentActivityItem[] = [
    {
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'Blogs Created',
      value: overview.totalBlogs,
      time: 'All time'
    },
    {
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'Total Views',
      value: overview.totalViews,
      time: 'All time'
    },
    {
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      title: 'Total Likes',
      value: overview.totalLikes,
      time: 'All time'
    },
    {
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      title: 'Total Comments',
      value: overview.totalComments,
      time: 'All time'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading your dashboard analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-lg mr-4">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Unable to Load Analytics</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={refetchDashboard}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      {/* Welcome Section */}
      <div className="mb-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Welcome Back, Afzal! 👋
            </h1>
            <p className="text-lg text-gray-600 mb-4 max-w-2xl">
              {overview.totalBlogs > 0 
                ? `Your ${overview.totalBlogs} blogs have generated ${formatNumber(overview.totalViews)} views and ${formatNumber(totalEngagements)} engagements. Keep creating amazing content!`
                : "Welcome to your blog dashboard! Start creating your first blog post to see analytics here."
              }
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {overview.totalViews > 0 && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              )}
            </div>
          </div>
          {overview.totalBlogs > 0 && (
            <div className="mt-4 lg:mt-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
                <div className="text-sm font-medium opacity-90">Content Performance</div>
                <div className="text-2xl font-bold mt-1">
                  {overview.publishedBlogs > 0 ? `${Math.round((overview.publishedBlogs / overview.totalBlogs) * 100)}%` : '0%'}
                </div>
                <div className="text-sm opacity-80 mt-1">Blogs Published</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard 
            key={index} 
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            color={stat.color}
            bgColor={stat.bgColor}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Charts & Analytics */}
        <div className="xl:col-span-2 space-y-8">
          {/* Blog Analytics Overview */}
          {overview.totalBlogs > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                  Blog Performance Analytics
                </h2>
                <div className="text-sm text-gray-500">
                  Real-time data
                </div>
              </div>
              <BlogStats stats={overview} />
            </div>
          )}

          {/* Engagement Analytics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Engagement Analytics
                </h3>
                <p className="text-gray-600">
                  {overview.totalViews > 0 
                    ? `Based on ${formatNumber(overview.totalViews)} total views`
                    : 'Start publishing blogs to see engagement data'
                  }
                </p>
              </div>
              {overview.totalViews > 0 && (
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(totalEngagements)}
                    </div>
                    <div className="text-sm text-gray-500">Total Engagements</div>
                  </div>
                </div>
              )}
            </div>
            <VisitorChart 
              data={[
                { name: 'Likes', value: overview.totalLikes, color: '#ef4444' },
                { name: 'Comments', value: overview.totalComments, color: '#8b5cf6' },
                { name: 'Shares', value: overview.totalShares, color: '#10b981' }
              ]}
            />
          </div>

          {/* Trending Blogs */}
          {trending.length > 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <TrendingBlogs blogs={trending} />
            </div>
          ) : overview.totalBlogs > 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trending Blogs Yet</h3>
                <p className="text-gray-600">Your blogs need more engagement to appear in trending</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Column - Insights & Activity */}
        <div className="space-y-8">
          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h3>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                  metric.positive ? 'bg-green-50' : 'bg-blue-50'
                }`}>
                  <div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    metric.positive ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Content Overview</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(activity.value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors cursor-pointer">
                Create New Blog
              </button>
              <button className="w-full bg-transparent border border-white py-2 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors cursor-pointer">
                View All Blogs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State for New Users */}
      {overview.totalBlogs === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Blogs Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start creating your first blog post to unlock powerful analytics and track your content performance.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
            Create Your First Blog
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;