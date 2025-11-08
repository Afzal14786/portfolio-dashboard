import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  bgColor 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-all duration-200 cursor-pointer hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-gray-600 text-sm">{label}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;