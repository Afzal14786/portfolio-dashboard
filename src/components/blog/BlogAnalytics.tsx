import React, { useEffect } from 'react';
import { Eye, Heart, MessageCircle, Share, Clock } from 'lucide-react';
import { type Blog } from '../../types/blog';
import { useAnalytics } from '../../hooks/useAnalytics';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BlogAnalyticsProps {
  blog: Blog;
  onClose: () => void;
}

const BlogAnalytics: React.FC<BlogAnalyticsProps> = ({ blog, onClose }) => {
  const { blogAnalytics, fetchBlogAnalytics, blogAnalyticsLoading } = useAnalytics();

  useEffect(() => {
    if (blog._id) {
      fetchBlogAnalytics(blog._id);
    }
  }, [blog._id, fetchBlogAnalytics]);

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 10) return 'text-green-600';
    if (rate >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (blogAnalyticsLoading || !blogAnalytics) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Blog Analytics" size="lg">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Modal>
    );
  }

  const { analytics, breakdown } = blogAnalytics;

  // Safe defaults for analytics data
  const safeAnalytics = analytics || {
    engagementRate: "0",
    totalEngagements: 0,
    platformStats: []
  };

  const safeBreakdown = breakdown || {
    likes: [],
    comments: [],
    shares: []
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Blog Analytics" size="lg">
      <div className="p-6 space-y-6">
        {/* Blog Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{blog.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{formatNumber(blog.views)} views</span>
            </div>
            <span>Published: {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Eye className="w-5 h-5 text-blue-600" />}
            label="Views"
            value={formatNumber(blog.views)}
            change="+12%"
          />
          <MetricCard
            icon={<Heart className="w-5 h-5 text-red-600" />}
            label="Likes"
            value={formatNumber(blog.likesCount)}
            change="+8%"
          />
          <MetricCard
            icon={<MessageCircle className="w-5 h-5 text-green-600" />}
            label="Comments"
            value={formatNumber(blog.commentsCount)}
            change="+15%"
          />
          <MetricCard
            icon={<Share className="w-5 h-5 text-purple-600" />}
            label="Shares"
            value={formatNumber(blog.shares)}
            change="+20%"
          />
        </div>

        {/* Engagement Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Engagement Rate</h3>
            <span className={`text-2xl font-bold ${getEngagementColor(parseFloat(safeAnalytics.engagementRate) || 0)}`}>
              {safeAnalytics.engagementRate}%
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Percentage of readers who engaged (liked or commented)
          </p>
        </div>

        {/* Platform Stats */}
        {safeAnalytics.platformStats && safeAnalytics.platformStats.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shares by Platform</h3>
            <div className="space-y-3">
              {safeAnalytics.platformStats.map((platform) => (
                <div key={platform._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Share className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900 capitalize">{platform._id}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatNumber(platform.count)} shares</div>
                    <div className="text-sm text-gray-500">{formatNumber(platform.totalClicks)} clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Engagement */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Engagement</h3>
          <div className="space-y-4">
            {safeBreakdown.likes.slice(0, 3).map((like, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New like</p>
                  <p className="text-sm text-gray-500">from {like.user?.name || 'Anonymous'}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(like.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {safeBreakdown.comments.slice(0, 3).map((comment, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New comment</p>
                  <p className="text-sm text-gray-500">"{comment.content?.substring(0, 50)}..."</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}> = ({ icon, label, value, change }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className={`text-xs font-medium ${
      change.startsWith('+') ? 'text-green-600' : 'text-red-600'
    }`}>
      {change} from last period
    </div>
  </div>
);

export default BlogAnalytics;