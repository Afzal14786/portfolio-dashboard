import { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import { analyticsService } from '../../services/analyticsService';
import type { DashboardStats } from '../../types/analytics';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { AlertCircle, FileText, Eye, Briefcase, Award, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (err: unknown) {
        setError('Failed to load dashboard data. Ensure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <div className="min-h-[500px] flex items-center justify-center"><LoadingSpinner /></div>;

  const safeStats: DashboardStats = stats || {
    totalBlogs: 0, totalViews: 0, totalProjects: 0, totalSkills: 0,
    totalCertificates: 0, totalComments: 0, totalLikes: 0, publishedBlogs: 0, draftBlogs: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">A quick glance at your portfolio's key metrics.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center shadow-sm font-medium text-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Top Row: Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Views" value={safeStats.totalViews} icon={Eye} color="blue" />
        <StatsCard title="Total Blogs" value={safeStats.totalBlogs} icon={FileText} color="green" />
        <StatsCard title="Projects" value={safeStats.totalProjects} icon={Briefcase} color="purple" />
        <StatsCard title="Certificates" value={safeStats.totalCertificates} icon={Award} color="amber" />
      </div>

      {/* Middle Row: Interaction & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Status Block */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
             <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Portfolio is Active</h2>
          <p className="text-gray-500 max-w-md">
            You currently have <span className="font-semibold text-gray-900">{safeStats.publishedBlogs} published articles</span> and <span className="font-semibold text-gray-900">{safeStats.draftBlogs} drafts</span> in progress. Keep creating!
          </p>
        </div>

        {/* Engagement Block */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center gap-4">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Engagement</h3>
           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
             <span className="font-medium text-gray-600">Total Likes</span>
             <span className="text-xl font-extrabold text-gray-900">{safeStats.totalLikes}</span>
           </div>
           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
             <span className="font-medium text-gray-600">Total Comments</span>
             <span className="text-xl font-extrabold text-gray-900">{safeStats.totalComments}</span>
           </div>
        </div>

      </div>
    </div>
  );
}