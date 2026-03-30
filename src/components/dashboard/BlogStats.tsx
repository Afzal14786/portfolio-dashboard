import { CheckCircle2, Edit3 } from 'lucide-react';

interface BlogStatsProps {
  published: number;
  drafts: number;
}

export default function BlogStats({ published, drafts }: BlogStatsProps) {
  const total = published + drafts;
  const publishedPercent = total === 0 ? 0 : Math.round((published / total) * 100);
  const draftsPercent = total === 0 ? 0 : Math.round((drafts / total) * 100);

  return (
    <div>
      <div className="flex justify-between items-end mb-3">
        <div>
          <span className="text-4xl font-extrabold text-gray-900">{total}</span>
          <span className="text-sm font-medium text-gray-500 ml-2">Total Posts</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex mb-6">
        <div style={{ width: `${publishedPercent}%` }} className="h-full bg-green-500 transition-all duration-1000" />
        <div style={{ width: `${draftsPercent}%` }} className="h-full bg-amber-400 transition-all duration-1000" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Published</p>
            <p className="text-xl font-bold text-gray-900">{published} <span className="text-sm font-medium text-gray-400">({publishedPercent}%)</span></p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
          <Edit3 className="w-5 h-5 text-amber-500 mr-3" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Drafts</p>
            <p className="text-xl font-bold text-gray-900">{drafts} <span className="text-sm font-medium text-gray-400">({draftsPercent}%)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}