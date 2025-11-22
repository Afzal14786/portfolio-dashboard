import React from 'react';
import { type Blog } from '../../types/blog';
import BlogCard from './BlogCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onViewAnalytics: (blog: Blog) => void;
  loading?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ 
  blogs, 
  onEdit, 
  onDelete, 
  onViewAnalytics, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs found</h3>
        <p className="text-gray-600 mb-4">Get started by creating your first blog post.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewAnalytics={onViewAnalytics}
        />
      ))}
    </div>
  );
};

export default BlogList;