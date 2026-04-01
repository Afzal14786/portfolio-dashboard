import React, { useEffect, useState } from 'react';
import { Eye, Heart, MessageCircle, Share, Clock, AlertCircle } from 'lucide-react';
import { type Blog } from '../../types/blog';
import { analyticsService } from '../../services/analyticsService';
import { 
    type BlogAnalytics, 
    type InteractionRecord, 
    type CommentRecord, 
    type PlatformStat, 
    type PopulatedUser 
} from '../../types/analytics';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BlogAnalyticsProps {
  blog: Blog;
  onClose: () => void;
}

type ExtendedBlog = Blog & {
  readTime?: string;
  publishedAt?: string;
  shares?: number;
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

const BlogAnalyticsComponent: React.FC<BlogAnalyticsProps> = ({ blog, onClose }) => {
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<BlogAnalytics | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      if (!blog._id) return;
      
      setLocalLoading(true);
      setLocalError(null);
      
      try {
        const data = await analyticsService.getBlogAnalytics(blog._id);
        
        if (isMounted) {
            setAnalyticsData(data);
        }
      } catch (err: unknown) {
        console.error("Failed to load blog analytics:", err);
        const errorObj = err as ApiError;
        
        if (isMounted) {
            setLocalError(
                errorObj?.response?.data?.message || 
                errorObj?.response?.data?.error || 
                "Could not load analytics for this blog post."
            );
        }
      } finally {
        if (isMounted) {
            setLocalLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [blog._id]);

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 10) return 'text-emerald-600';
    if (rate >= 5) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getUserName = (userField: PopulatedUser | string | undefined | null): string => {
    if (!userField) return 'Anonymous';
    if (typeof userField === 'string') return 'User'; 
    return userField.name || 'Anonymous';
  };

  const extendedBlog = blog as ExtendedBlog;

  if (localLoading) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Blog Analytics" size="lg">
        <div className="flex flex-col justify-center items-center py-16">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500 font-medium animate-pulse">Gathering insights...</p>
        </div>
      </Modal>
    );
  }

  if (localError || !analyticsData) {
      return (
        <Modal isOpen={true} onClose={onClose} title="Blog Analytics" size="lg">
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Unavailable</h3>
            <p className="text-gray-600 mb-6 max-w-sm">{localError}</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
                Close Analytics
            </button>
          </div>
        </Modal>
      );
  }

  const { analytics, breakdown } = analyticsData;

  const safeAnalytics = analytics || {
    engagementRate: "0",
    totalEngagements: 0,
    platformStats: [] as PlatformStat[]
  };

  const safeBreakdown = breakdown || {
    likes: [] as InteractionRecord[],
    comments: [] as CommentRecord[],
    shares: []
  };

  const recentLikes = safeBreakdown.likes || [];
  const recentComments = safeBreakdown.comments || [];

  return (
    <Modal isOpen={true} onClose={onClose} title="Blog Analytics" size="lg">
      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar bg-slate-50">
        
        {/* Header Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{blog.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <div className="flex items-center space-x-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              <Clock size={14} className="text-blue-500" />
              <span>{extendedBlog.readTime || '5 min read'}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              <Eye size={14} className="text-emerald-500" />
              <span>{formatNumber(blog.views)} views</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>Published: {new Date(extendedBlog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Eye className="w-5 h-5 text-blue-600" />}
            label="Total Views"
            value={formatNumber(blog.views)}
          />
          <MetricCard
            icon={<Heart className="w-5 h-5 text-red-600" />}
            label="Total Likes"
            value={formatNumber(blog.likesCount)}
          />
          <MetricCard
            icon={<MessageCircle className="w-5 h-5 text-emerald-600" />}
            label="Comments"
            value={formatNumber(blog.commentsCount)}
          />
          <MetricCard
            icon={<Share className="w-5 h-5 text-purple-600" />}
            label="Shares"
            value={formatNumber(extendedBlog.shares || 0)}
          />
        </div>

        {/* Engagement Rate Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Overall Engagement</h3>
                <p className="text-gray-500 text-sm mt-1">Percentage of readers who interacted</p>
            </div>
            <div className="flex items-baseline space-x-1">
                <span className={`text-4xl font-black tracking-tight ${getEngagementColor(parseFloat(safeAnalytics.engagementRate || "0") || 0)}`}>
                {safeAnalytics.engagementRate || "0"}
                </span>
                <span className="text-xl font-bold text-gray-400">%</span>
            </div>
        </div>

        {/* Recent Interactions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Activity</h3>
          
          {recentLikes.length === 0 && recentComments.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-slate-50 rounded-xl border-2 border-dashed border-gray-200 font-medium">
                  No interactions recorded recently.
              </div>
          )}

          <div className="space-y-4">
            {recentLikes.slice(0, 3).map((like, index) => (
              <div key={`like-${index}`} className="flex items-start space-x-4 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-red-100">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">New Like</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5 truncate">from {getUserName(like.user)}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                  {new Date(like.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            
            {recentComments.slice(0, 3).map((comment, index) => (
              <div key={`comment-${index}`} className="flex items-start space-x-4 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-emerald-100">
                  <MessageCircle className="w-4 h-4 text-emerald-500 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                     <p className="font-bold text-gray-900 text-sm">{getUserName(comment.user)}</p>
                     <span className="text-xs text-slate-400 font-medium">commented</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-1.5 italic bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm leading-relaxed">
                      "{comment.content?.substring(0, 80)}{comment.content?.length > 80 ? '...' : ''}"
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
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
}> = ({ icon, label, value }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-center mb-3">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">{icon}</div>
    </div>
    <div className="text-3xl font-black tracking-tight text-gray-900 mb-1">{value}</div>
    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">{label}</div>
  </div>
);

export default BlogAnalyticsComponent;