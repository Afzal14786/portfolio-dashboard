import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: StatsCardProps) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
            trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}