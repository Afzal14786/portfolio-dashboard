import React from 'react';

const BlogsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Blogs
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage and create your blog posts.
        </p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Blog content goes here...</p>
      </div>
    </div>
  );
};

export default BlogsPage;