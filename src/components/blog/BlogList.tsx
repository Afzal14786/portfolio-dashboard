import React from 'react';
import { type Blog } from '../../types/blog';
import BlogCard from './BlogCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FileText, Sparkles } from 'lucide-react';

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onViewAnalytics: (blog: Blog) => void;
  loading?: boolean;
  viewMode?: 'grid' | 'list'; // Added viewMode prop
}

const BlogList: React.FC<BlogListProps> = ({ 
  blogs, 
  onEdit, 
  onDelete, 
  onViewAnalytics, 
  loading = false,
  viewMode = 'grid'
}) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24">
        <LoadingSpinner size="lg" />
        <p className="mt-6 text-gray-500 font-medium animate-pulse tracking-wide">Fetching blogs...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
            <FileText size={48} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-amber-400 w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No blogs found</h3>
        <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed">
          It looks like there aren't any blog posts here yet. Create your first post to start sharing!
        </p>
      </div>
    );
  }

  // Dynamically switch the wrapper container class
  const containerClass = viewMode === 'list' 
    ? "flex flex-col gap-4" 
    : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8";

  return (
    <div className={containerClass}>
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewAnalytics={onViewAnalytics}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default BlogList;