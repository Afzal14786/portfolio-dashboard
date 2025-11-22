import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface VisitorChartProps {
  data: Array<{ name: string; value: number; color: string }>;
}

const VisitorChart: React.FC<VisitorChartProps> = ({ data }) => {
  const hasData = data.some(item => item.value > 0);

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: data.map(item => item.color),
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '70%',
  };

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-lg font-semibold mb-2">No Engagement Data</p>
        <p className="text-sm text-gray-400">Start getting likes, comments, and shares to see analytics</p>
      </div>
    );
  }

  // Calculate total for center text
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-64 relative">
      <Doughnut data={chartData} options={options} />
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-2xl font-bold text-gray-900">{total}</div>
        <div className="text-sm text-gray-500">Total</div>
      </div>
    </div>
  );
};

export default VisitorChart;