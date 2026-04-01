import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, Clock, User, BarChart, AlertCircle } from 'lucide-react';
import { type Blog } from '../../types/blog';
import { blogService } from '../../services/blogService';
import LoadingSpinner from '../ui/LoadingSpinner';
import BlogAnalytics from './BlogAnalytics';

type ExtendedBlog = Blog & {
  readTime?: string;
  publishedAt?: string;
  shares?: number;
};

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

const BlogReading: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<ExtendedBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await blogService.getBlogBySlug(slug);
        
        if (response.data?.data) {
          setBlog((response.data.data.blog || response.data.data) as ExtendedBlog);
        } else if (response.data) {
          setBlog((response.data.blog || response.data) as ExtendedBlog);
        } else {
          throw new Error("Invalid response format received from server.");
        }
      } catch (err: unknown) {
        const apiError = err as ApiError;
        console.error('Error fetching blog:', apiError);
        setError(
            apiError.response?.data?.error || 
            apiError.response?.data?.message || 
            apiError.message || 
            'Failed to load the blog post.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Safe image URL extractor
  const getImageUrl = (coverImage: Blog['coverImage']): string | undefined => {
    if (!coverImage) return undefined;
    if (typeof coverImage === 'string') return coverImage;
    return coverImage.url;
  };

  // Safe alt text extractor
  const getImageAlt = (coverImage: Blog['coverImage'], fallbackTitle: string): string => {
    if (!coverImage || typeof coverImage === 'string') return fallbackTitle;
    return coverImage.alt || fallbackTitle;
  };

  // Safe author name extractor
  const getAuthorName = (author: Blog['author']): string => {
    if (!author) return 'Anonymous';
    if (typeof author === 'string') return 'System User';
    return author.name || 'Author';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading article content...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Post Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">{error || 'The blog you are looking for does not exist or has been moved.'}</p>
          
          <button
            onClick={() => navigate('/admin/blogs')}
            className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const coverImageUrl = getImageUrl(blog.coverImage);
  const coverImageAlt = getImageAlt(blog.coverImage, blog.title);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/admin/blogs')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-bold"
            >
              <ArrowLeft size={20} />
              <span>Back to List</span>
            </button>
            
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-bold"
            >
              <BarChart size={18} />
              <span className="hidden sm:inline">View Metrics</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-12 mb-8 overflow-hidden">
          
          {/* Cover Image Header */}
          {coverImageUrl && (
            <div className="mb-10 -mx-6 sm:-mx-12 -mt-6 sm:-mt-12">
              <img 
                src={coverImageUrl} 
                alt={coverImageAlt}
                className="w-full h-64 sm:h-[450px] object-cover"
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            {/* Topic & Status Badges */}
            <div className="flex items-center space-x-3 mb-6">
              {blog.topic && (
                <span className="bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                  {blog.topic}
                </span>
              )}
              <span className="bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                {blog.status}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.15] tracking-tight">
              {blog.title}
            </h1>
            
            {/* Author and Date Meta Data */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-10 font-medium">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
                </div>
                <span className="text-gray-900 font-bold">{getAuthorName(blog.author)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-gray-400" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-gray-400" />
                <span>{blog.readTime || '5 min read'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={18} className="text-blue-500" />
                <span className="text-blue-600 font-bold">{blog.views || 0} Views</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-4 py-1.5 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Excerpt Summary Box */}
            {blog.excerpt && (
              <div className="mb-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-xl text-gray-700 italic font-medium leading-relaxed">
                  "{blog.excerpt}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Prose Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-12 min-h-[500px]">
          <div 
            className="prose prose-lg sm:prose-xl max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-2xl prose-img:shadow-md 
            [&_h1]:text-4xl [&_h1]:font-black [&_h1]:mb-6 [&_h1]:mt-8
            [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-5 [&_h2]:mt-8
            [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-6
            [&_p]:text-gray-700 [&_p]:mb-5 [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-5 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-5 [&_ol]:space-y-2
            [&_li]:text-gray-700
            [&_strong]:font-bold [&_strong]:text-gray-900
            [&_em]:italic
            whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      {/* Analytics Interactive Modal */}
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