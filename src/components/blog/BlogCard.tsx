import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, MessageCircle, Share, Edit, Trash2, BarChart, Calendar, Clock } from 'lucide-react';
import { type Blog } from '../../types/blog';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onViewAnalytics: (blog: Blog) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete, onViewAnalytics }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on an action button
    if (!(e.target as HTMLElement).closest('.action-button')) {
      // Use the correct path with /read
      navigate(`/admin/blogs/read/${blog.slug}`);
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      {blog.coverImage?.url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={blog.coverImage.url} 
            alt={blog.coverImage.alt || blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(blog.status)}`}>
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Topic */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {blog.topic}
          </span>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Eye size={14} />
            <span>{blog.views || 0}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt || 'No excerpt available'}
        </p>
        
        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{blog.readTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
        </div>
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-400 rounded-full">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Engagement Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <Heart size={16} className="text-red-500" />
              <span className="font-medium">{blog.likesCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} className="text-blue-500" />
              <span className="font-medium">{blog.commentsCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share size={16} className="text-green-500" />
              <span className="font-medium">{blog.shares || 0}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 action-button">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewAnalytics(blog);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
              title="View Analytics"
            >
              <BarChart size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(blog);
              }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 cursor-pointer"
              title="Edit Blog"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(blog);
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
              title="Delete Blog"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;