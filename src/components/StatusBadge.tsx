import { getStressStatusColor, getStressStatusLabel } from '@/utils/stress';

interface StatusBadgeProps {
  status: 'calm' | 'rising' | 'overload';
  score?: number;
}

export function StatusBadge({ status, score }: StatusBadgeProps) {
  const colorClass = getStressStatusColor(status);
  const label = getStressStatusLabel(status);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${colorClass}`}>
      <div className="w-2 h-2 rounded-full bg-current" />
      <span className="font-medium">{label}</span>
      {score !== undefined && <span className="text-sm opacity-75">{Math.round(score)}%</span>}
    </div>
  );
}
