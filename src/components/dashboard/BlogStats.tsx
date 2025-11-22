import React from 'react';
import { FileText, Eye, Heart, MessageCircle, Share, Users, Clock } from 'lucide-react';
import { type DashboardStats } from '../../types/blog';

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

interface BlogStatsProps {
  stats: DashboardStats['overview'];
}

const BlogStats: React.FC<BlogStatsProps> = ({ stats }) => {
  const {
    totalBlogs = 0,
    publishedBlogs = 0,
    draftBlogs = 0,
    scheduledBlogs = 0,
    totalViews = 0,
    totalWords = 0,
    totalLikes = 0,
    totalComments = 0,
    totalShares = 0,
    totalReaders = 0
  } = stats || {};

  // Calculate derived metrics
  const totalEngagements = safeNumber(totalLikes) + safeNumber(totalComments) + safeNumber(totalShares);
  const engagementRate = safeNumber(totalViews) > 0 
    ? (totalEngagements / safeNumber(totalViews) * 100)
    : 0;
  const avgReadTime = safeNumber(totalBlogs) > 0 
    ? Math.round(safeNumber(totalWords) / safeNumber(totalBlogs) / 200) 
    : 0;

  const statCards = [
    {
      icon: FileText,
      label: 'Published Blogs',
      value: formatNumber(publishedBlogs),
      description: `${Math.round((publishedBlogs / (totalBlogs || 1)) * 100)}% of total`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: publishedBlogs > 0 ? 'active' : 'none'
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: formatNumber(totalViews),
      description: `${formatNumber(totalReaders)} unique readers`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: totalViews > 0 ? 'active' : 'none'
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: formatNumber(totalLikes),
      description: `${Math.round((totalLikes / (totalViews || 1)) * 100) || 0}% engagement`,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: totalLikes > 0 ? 'active' : 'none'
    },
    {
      icon: MessageCircle,
      label: 'Total Comments',
      value: formatNumber(totalComments),
      description: 'Reader interactions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: totalComments > 0 ? 'active' : 'none'
    },
    {
      icon: Share,
      label: 'Total Shares',
      value: formatNumber(totalShares),
      description: 'Content reach',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: totalShares > 0 ? 'active' : 'none'
    },
    {
      icon: Clock,
      label: 'Avg. Read Time',
      value: `${avgReadTime} min`,
      description: 'Per blog post',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      trend: avgReadTime > 0 ? 'active' : 'none'
    }
  ];

  if (totalBlogs === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Data Available</h3>
        <p className="text-gray-600 mb-6">Create your first blog to start tracking analytics</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.trend === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {stat.trend === 'active' ? 'Active' : 'No Data'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogStats;