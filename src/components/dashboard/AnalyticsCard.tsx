import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  description, 
  color,
  trend 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        
        {/* Mini progress indicator */}
        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`}
            style={{ width: '75%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;