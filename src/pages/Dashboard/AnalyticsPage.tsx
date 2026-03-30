import { useState, useEffect } from 'react';
import TrendingBlogs from '../../components/dashboard/TrendingBlogs';
import { analyticsService } from '../../services/analyticsService';
import type { TrendingBlog, BlogStatusMetrics } from '../../types/analytics';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { AlertCircle, TrendingUp, BarChart2, FileText } from 'lucide-react';

export default function AnalyticsPage() {
  const [trending, setTrending] = useState<TrendingBlog[]>([]);
  const [statusMetrics, setStatusMetrics] = useState<BlogStatusMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailedAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [blogData, statusData] = await Promise.all([
          analyticsService.getBlogAnalytics(),
          analyticsService.getBlogsByStatus()
        ]);
        
        setTrending(blogData.trending || []);
        setStatusMetrics(statusData || []);
      } catch (err: unknown) {
        setError('Failed to load detailed analytics. Ensure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedAnalytics();
  }, []);

  if (loading) return <div className="min-h-[500px] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <BarChart2 className="w-8 h-8 mr-3 text-blue-600" /> Deep Analytics
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Detailed breakdown of your content performance.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center shadow-sm font-medium text-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Top Performing Content Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" /> Trending Blogs
            </h3>
            <p className="text-sm text-gray-500 mt-1">Your most viewed and interacted posts.</p>
          </div>
        </div>
        
        {/* Handle Empty State Gracefully */}
        {trending.length === 0 ? (
           <div className="p-12 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <TrendingUp className="w-8 h-8 text-gray-300" />
             </div>
             <h4 className="text-gray-900 font-semibold">No trending data yet</h4>
             <p className="text-gray-500 text-sm mt-1">Publish more blogs to start generating engagement data.</p>
           </div>
        ) : (
          <TrendingBlogs blogs={trending} />
        )}
      </div>

      {/* Status Breakdown (Visualizing getBlogsByStatus) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {statusMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                 {metric.status} Content
               </p>
               <p className="text-3xl font-extrabold text-gray-900">{metric.count}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.status === 'Published' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
              <FileText className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}