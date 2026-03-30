import { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import BlogStats from '../../components/dashboard/BlogStats';
import TrendingBlogs from '../../components/dashboard/TrendingBlogs';
import { analyticsService } from '../../services/analyticsService';
import type { DashboardStats, TrendingBlog } from '../../types/analytics';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { AlertCircle, FileText, Eye, Briefcase, Award, Heart, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trending, setTrending] = useState<TrendingBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both endpoints simultaneously for speed
        const [statusData, blogData] = await Promise.all([
          // Property 'getDashboardStatus' does not exist on type '{ getDashboardStats: () => Promise<DashboardStats>; getBlogAnalytics: () => Promise<{ trending: TrendingBlog[]; visitorData: VisitorData[]; }>; getBlogsByStatus: () => Promise<...>; }'. Did you mean 'getDashboardStats' <a href="command:prettyTsErrors.revealSelection?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2Fhome%2Fiamafal%2Ffinal_year_project%2Fportfolio-dashboard%2Fsrc%2Fservices%2FanalyticsService.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22start%22%3A%7B%22line%22%3A13%2C%22character%22%3A2%7D%2C%22end%22%3A%7B%22line%22%3A17%2C%22character%22%3A3%7D%7D%5D" title="Go to symbol"><span class="codicon codicon-go-to-file" ></span></a>&nbsp;?
          analyticsService.getDashboardStatus(),
          analyticsService.getBlogAnalytics()
        ]);
        
        setStats(statusData);
        setTrending(blogData.trending);
      } catch (err: unknown) {
        setError('Failed to load analytics data. Ensure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="min-h-[500px] flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Overview Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Track your portfolio's performance and blog engagement.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center shadow-sm font-medium text-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Top Row: Primary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Views" value={stats.totalViews} icon={Eye} trend="+12%" trendUp={true} color="blue" />
            <StatsCard title="Total Blogs" value={stats.totalBlogs} icon={FileText} trend="+3" trendUp={true} color="green" />
            <StatsCard title="Projects" value={stats.totalProjects} icon={Briefcase} color="purple" />
            <StatsCard title="Certificates" value={stats.totalCertificates} icon={Award} color="amber" />
          </div>

          {/* Middle Row: Interaction Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 mb-6">Blog Status Distribution</h3>
               <BlogStats published={stats.publishedBlogs} drafts={stats.draftBlogs} />
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center gap-6">
              <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm mr-4"><Heart className="w-6 h-6 text-red-500 fill-red-50" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm mr-4"><MessageSquare className="w-6 h-6 text-indigo-500 fill-indigo-50" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Trending */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Trending Blogs</h3>
              <p className="text-sm text-gray-500 mt-1">Your most interacted content right now.</p>
            </div>
            <TrendingBlogs blogs={trending} />
          </div>
        </>
      )}
    </div>
  );
}