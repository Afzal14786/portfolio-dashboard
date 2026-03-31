import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, MessageCircle, Edit, Trash2, BarChart, Calendar } from 'lucide-react';
import { type Blog } from '../../types/blog';

type ExtendedBlog = Blog & {
  readTime?: string;
  publishedAt?: string;
};

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onViewAnalytics: (blog: Blog) => void;
  viewMode?: 'grid' | 'list'; 
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete, onViewAnalytics, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const extendedBlog = blog as ExtendedBlog;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.action-button')) {
      navigate(`/admin/blogs/read/${blog.slug}`);
    }
  };

  const getImageUrl = (coverImage: Blog['coverImage']) => {
    if (!coverImage) return undefined;
    if (typeof coverImage === 'string') return coverImage;
    return coverImage.url;
  };

  const imageUrl = getImageUrl(blog.coverImage);
  const isList = viewMode === 'list';

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex ${isList ? 'flex-col sm:flex-row min-h-[14rem]' : 'flex-col h-full'}`}
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      {imageUrl && (
        <div className={`relative overflow-hidden flex-shrink-0 bg-gray-100 ${isList ? 'w-full sm:w-72 h-48 sm:h-auto' : 'w-full h-48'}`}>
          <img 
            src={imageUrl} 
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(blog.status)}`}>
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Topic & Views */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            {blog.topic || 'Uncategorized'}
          </span>
          <div className="flex items-center space-x-1.5 text-gray-400 text-sm font-medium">
            <Eye size={14} />
            <span>{blog.views || 0}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className={`font-bold text-xl text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors ${isList ? 'line-clamp-2' : 'line-clamp-2'}`}>
          {blog.title}
        </h3>
        
        {/* Excerpt - Allowed to grow in list mode */}
        <p className={`text-gray-500 text-sm mb-4 leading-relaxed flex-grow ${isList ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {blog.excerpt || 'No excerpt available for this blog post.'}
        </p>
        
        {/* Meta & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 mt-auto gap-3 sm:gap-0">
          
          <div className="flex items-center space-x-4 text-xs font-medium text-gray-400">
            <div className="flex items-center space-x-1.5">
              <Calendar size={14} />
              <span>{formatDate(extendedBlog.publishedAt || blog.createdAt)}</span>
            </div>
            {!isList && (
              <>
                <div className="flex items-center space-x-1.5 hover:text-red-500 transition-colors">
                  <Heart size={16} />
                  <span className="font-bold">{blog.likesCount || 0}</span>
                </div>
                <div className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} />
                  <span className="font-bold">{blog.commentsCount || 0}</span>
                </div>
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1 action-button self-end sm:self-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); onViewAnalytics(blog); }}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 cursor-pointer"
              title="View Analytics"
            >
              <BarChart size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(blog); }}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 cursor-pointer"
              title="Edit Blog"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(blog); }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
              title="Delete Blog"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;