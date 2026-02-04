'use client';

import { CommunityStrategy } from '@/types';
import { Star, CheckCircle, Clock, Users } from 'lucide-react';

interface StrategyCardProps {
  strategy: CommunityStrategy;
  onRate?: (rating: number) => void;
  onUse?: () => void;
}

export function StrategyCard({ strategy, onRate, onUse }: StrategyCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= Math.round(rating) ? 'fill-teal-400 text-teal-400' : 'text-neutral-600'
            }
          />
        ))}
        <span className="text-sm text-neutral-400 ml-1">
          {rating.toFixed(1)} ({strategy.rating_count})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 hover:border-teal-500/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-100 mb-1">{strategy.name}</h3>
          <p className="text-sm text-neutral-400 capitalize">{strategy.category}</p>
        </div>
        {strategy.is_therapist_verified && (
          <div className="flex items-center gap-1 bg-teal-500/10 px-2 py-1 rounded text-teal-400 text-xs font-medium">
            <CheckCircle size={14} />
            Verified
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-300 mb-3 line-clamp-2">{strategy.description}</p>

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-3 text-sm text-neutral-400">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          {strategy.duration_minutes} min
        </div>
        <div className="flex items-center gap-1">
          <Users size={16} />
          {strategy.times_used} used
        </div>
        <div className="px-2 py-1 bg-neutral-800 rounded text-xs capitalize">
          {strategy.age_group === 'all' ? 'All ages' : strategy.age_group}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-3">{renderStars(strategy.rating)}</div>

      {/* Contributor */}
      <p className="text-xs text-neutral-500 mb-3">
        Contributed by <span className="text-neutral-400">{strategy.contributed_by}</span>
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        {onUse && (
          <button type="button"
            onClick={onUse}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-3 rounded transition-colors text-sm"
          >
            Try Strategy
          </button>
        )}
        {onRate && (
          <button type="button"
            onClick={() => onRate(5)}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium py-2 px-3 rounded transition-colors text-sm"
          >
            Rate
          </button>
        )}
      </div>
    </div>
  );
}

