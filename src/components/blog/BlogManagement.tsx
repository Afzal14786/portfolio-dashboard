import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, RefreshCw } from 'lucide-react';
import { useBlogs } from '../../hooks/useBlogs';
import { useBlogMutations } from '../../hooks/useBlogMutations';
import BlogList from './BlogList';
import BlogForm from './BlogForm';
import BlogAnalytics from './BlogAnalytics';
import ConfirmDialog from '../ui/ConfirmDialog';
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

  // Safe filtering logic
  const filteredBlogs = blogs.filter(blog => {
    const safeTopic = blog.topic || '';
    const safeTags = blog.tags || [];
    
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || blog.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl shadow-sm flex items-start space-x-4">
          <div className="p-2 bg-red-100 rounded-lg">
             <RefreshCw className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-red-800 font-bold text-lg mb-1">Failed to load blogs</h3>
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={() => refetch()} className="mt-3 text-sm font-bold text-red-600 hover:text-red-800 underline">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1">
            Blog Management
          </h1>
          <p className="text-gray-500 font-medium">
            Create, manage, and analyze your content.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 cursor-pointer w-full sm:w-auto font-bold"
        >
          <Plus size={20} />
          <span>New Blog Post</span>
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by title, topic, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none outline-none font-semibold text-gray-700 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden lg:flex bg-gray-100 p-1.5 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              } transition-all cursor-pointer`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              } transition-all cursor-pointer`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Showing <span className="text-gray-900">{filteredBlogs.length}</span> of <span className="text-gray-900">{blogs.length}</span> results
          </span>
        </div>
      </div>

      {/* Blog Grid */}
      <div className={viewMode === 'list' ? 'flex flex-col gap-4' : ''}>
        <BlogList
          blogs={filteredBlogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewAnalytics={handleViewAnalytics}
          loading={loading}
          viewMode={viewMode} // FIX: Added the missing prop here!
        />
      </div>

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
          title="Delete Blog Post"
          message={`Are you sure you want to permanently delete "${selectedBlog.title}"? This action cannot be undone.`}
          confirmText="Yes, Delete Post"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
};

export default BlogManagement;