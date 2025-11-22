import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, MessageCircle, Share, Calendar, Clock, User, BarChart } from 'lucide-react';
import { type Blog } from '../../types/blog';
import { blogService } from '../../services/blogService';
import LoadingSpinner from '../ui/LoadingSpinner';
import BlogAnalytics from './BlogAnalytics';

const BlogReading: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogService.getBlogBySlug(slug!);
        
        // Handle different response structures
        if (response.data.data) {
          // If response has data property (nested structure)
          setBlog(response.data.data.blog || response.data.data);
        } else {
          // If response is the blog directly
          setBlog(response.data.blog || response.data);
        }
      } catch (err: any) {
        console.error('Error fetching blog:', err);
        setError(err.response?.data?.error || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  // Add debug logging
  useEffect(() => {
    console.log('Blog data:', blog);
    console.log('Error:', error);
    console.log('Loading:', loading);
  }, [blog, error, loading]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The blog you are looking for does not exist.'}</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Trying to access: {slug}</p>
            <p>Make sure the blog is published and the slug is correct.</p>
          </div>
          <button
            onClick={() => navigate('/admin/blogs')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/admin/blogs')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span>Back to Blogs</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAnalytics(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <BarChart size={16} />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          {blog.coverImage?.url && (
            <div className="mb-8">
              <img 
                src={blog.coverImage.url} 
                alt={blog.coverImage.alt || blog.title}
                className="w-full h-64 sm:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="text-center mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {blog.topic}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600 text-sm mb-4">
              <div className="flex items-center space-x-1">
                <User size={16} />
                <span>{typeof blog.author === 'object' ? blog.author.name : 'Author'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-1">
                <Heart size={16} className="text-red-500" />
                <span>{blog.likesCount || 0} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={16} className="text-blue-500" />
                <span>{blog.commentsCount || 0} comments</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share size={16} className="text-green-500" />
                <span>{blog.shares || 0} shares</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="text-center">
              <p className="text-xl text-gray-600 italic leading-relaxed">
                "{blog.excerpt}"
              </p>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      {/* Analytics Modal */}
      {showAnalytics && blog && (
        <BlogAnalytics
          blog={blog}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
};

export default BlogReading;