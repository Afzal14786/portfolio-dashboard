import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  description, 
  color 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-all duration-200 cursor-pointer hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default AnalyticsCard;