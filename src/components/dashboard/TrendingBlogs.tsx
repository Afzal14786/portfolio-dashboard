import React from 'react';
import { Eye, Heart, MessageCircle, TrendingUp, ArrowUp } from 'lucide-react';
import { type Blog } from '../../types/blog';

interface TrendingBlogsProps {
  blogs: Blog[];
}

const TrendingBlogs: React.FC<TrendingBlogsProps> = ({ blogs }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Sort by views and take top 5
  const trendingBlogs = blogs
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Trending Blogs
        </h3>
        <span className="text-sm text-gray-500">By views</span>
      </div>

      <div className="space-y-4">
        {trendingBlogs.map((blog, index) => (
          <div key={blog._id} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h4>
              <p className="text-sm text-gray-500 truncate">{blog.topic}</p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1" title="Views">
                <Eye size={14} />
                <span className="font-medium">{formatNumber(blog.views || 0)}</span>
              </div>
              <div className="flex items-center space-x-1" title="Likes">
                <Heart size={14} />
                <span className="font-medium">{formatNumber(blog.likesCount || 0)}</span>
              </div>
              <div className="flex items-center space-x-1" title="Comments">
                <MessageCircle size={14} />
                <span className="font-medium">{formatNumber(blog.commentsCount || 0)}</span>
              </div>
            </div>

            {index === 0 && (
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  <ArrowUp size={12} />
                  <span>Top</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingBlogs;