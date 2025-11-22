import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  color: string;
  bgColor: string;
  trend?: 'up' | 'down' | 'neutral' | 'active' | 'none';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  description, 
  color, 
  bgColor,
  trend = 'neutral'
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
      case 'active':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'none':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
      case 'active':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'none':
        return 'text-gray-400';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend !== 'neutral' && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-semibold text-gray-700">{label}</div>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{description}</p>
      </div>

      {/* Animated background effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default StatsCard;