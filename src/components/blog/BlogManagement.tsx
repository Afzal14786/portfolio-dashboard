import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { useBlogs } from '../../hooks/useBlogs';
import { useBlogMutations } from '../../hooks/useBlogMutations';
import BlogList from './BlogList';
import  BlogForm from './BlogForm';
import  BlogAnalytics from './BlogAnalytics';
import  ConfirmDialog  from '../ui/ConfirmDialog';
import { type Blog } from '../../types/blog';

const BlogManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { blogs, loading, error, refetch } = useBlogs();
  const { deleteBlog } = useBlogMutations();

  const handleCreate = () => {
    setSelectedBlog(null);
    setShowForm(true);
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowForm(true);
  };

  const handleDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedBlog) {
      await deleteBlog(selectedBlog._id);
      refetch();
      setShowDeleteDialog(false);
      setSelectedBlog(null);
    }
  };

  const handleViewAnalytics = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowAnalytics(true);
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Blog Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create, manage, and analyze your blog posts
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors cursor-pointer w-full lg:w-auto"
        >
          <Plus size={20} />
          <span>New Blog</span>
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search blogs by title, topic, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } transition-colors cursor-pointer`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } transition-colors cursor-pointer`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </span>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter size={16} />
            <span>Filtered</span>
          </div>
        </div>
      </div>

      {/* Blog List/Grid */}
      <BlogList
        blogs={filteredBlogs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewAnalytics={handleViewAnalytics}
        loading={loading}
      />

      {/* Modals */}
      {showForm && (
        <BlogForm
          blog={selectedBlog}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            refetch();
          }}
        />
      )}

      {showAnalytics && selectedBlog && (
        <BlogAnalytics
          blog={selectedBlog}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showDeleteDialog && selectedBlog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Blog"
          message={`Are you sure you want to delete "${selectedBlog.title}"? This action cannot be undone.`}
          confirmText="Delete Blog"
          variant="danger"
        />
      )}
    </div>
  );
};

export default BlogManagement;