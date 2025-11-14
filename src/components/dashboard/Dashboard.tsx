import React from 'react';
import StatsCard from './StatsCard';
import AnalyticsCard from './AnalyticsCard';
import VisitorChart from './VisitorChart';
import { FileText, Briefcase, Award, Cpu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const statsData = [
    {
      icon: FileText,
      label: 'Blogs',
      value: '10',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Briefcase,
      label: 'Projects',
      value: '12',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Award,
      label: 'Certificates',
      value: '12',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Cpu,
      label: 'Skills',
      value: '8',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back Afzal 👋
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <AnalyticsCard 
          title="Total Blog Views" 
          value="1k" 
          description="All time blog views"
          color="text-blue-600"
        />
        <AnalyticsCard 
          title="Total Visitors" 
          value="1k" 
          description="All time website visitors"
          color="text-green-600"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Number Of Visitors This Month
          </h3>
          <span className="text-green-600 font-bold text-xl">2500</span>
        </div>
        <VisitorChart />
      </div>
    </div>
  );
};

export default Dashboard;