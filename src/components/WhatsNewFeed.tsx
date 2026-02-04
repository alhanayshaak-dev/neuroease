'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Bell, Zap, Target } from 'lucide-react';

export interface FeatureUpdate {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'fix' | 'announcement';
  date: string;
  icon?: React.ReactNode;
  isNew?: boolean;
}

interface WhatsNewFeedProps {
  updates?: FeatureUpdate[];
  onDismiss?: (updateId: string) => void;
}

const DEFAULT_UPDATES: FeatureUpdate[] = [
  {
    id: 'update-1',
    title: 'Real-Time Stress Monitoring',
    description:
      'Now get instant updates on your stress levels with our improved sensor integration.',
    category: 'feature',
    date: '2024-01-15',
    icon: <Zap className="w-5 h-5" />,
    isNew: true,
  },
  {
    id: 'update-2',
    title: 'Therapist Collaboration Tools',
    description: 'Share insights with your therapist and get personalized recommendations&apos;.',
    category: 'feature',
    date: '2024-01-10',
    icon: <Target className="w-5 h-5" />,
    isNew: true,
  },
  {
    id: 'update-3',
    title: 'Improved Performance',
    description: 'Dashboard now loads 50% faster with optimized data queries.',
    category: 'improvement',
    date: '2024-01-08',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 'update-4',
    title: 'Emergency Mode Enhancements',
    description: 'Better escape mode navigation and faster alert delivery.',
    category: 'improvement',
    date: '2024-01-05',
  },
];

export function WhatsNewFeed({ updates = DEFAULT_UPDATES, onDismiss }: WhatsNewFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedUpdates, setDismissedUpdates] = useState<Set<string>>(new Set());

  const visibleUpdates = updates.filter((u) => !dismissedUpdates.has(u.id));

  if (visibleUpdates.length === 0) {
    return null;
  }

  const currentUpdate = visibleUpdates[currentIndex % visibleUpdates.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleUpdates.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + visibleUpdates.length) % visibleUpdates.length);
  };

  const handleDismiss = (updateId: string) => {
    setDismissedUpdates((prev) => new Set([...prev, updateId]));
    onDismiss?.(updateId);
    if (visibleUpdates.length > 1) {
      setCurrentIndex((prev) => prev % (visibleUpdates.length - 1));
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature':
        return 'bg-primary-400/10 text-primary-400 border-primary-400/30';
      case 'improvement':
        return 'bg-calm/10 text-calm border-calm/30';
      case 'fix':
        return 'bg-rising/10 text-rising border-rising/30';
      case 'announcement':
        return 'bg-neutral-700/10 text-neutral-300 border-neutral-700/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-primary-400" />
        <h2 className="text-xl font-semibold text-neutral-100">What&apos;s New</h2>
      </div>

      {/* Carousel */}
      <div className="space-y-4">
        {/* Update Card */}
        <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              {currentUpdate.icon && (
                <div className="text-primary-400 mt-1">{currentUpdate.icon}</div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-100">{currentUpdate.title}</h3>
                  {currentUpdate.isNew && (
                    <span className="px-2 py-0.5 bg-primary-400/20 text-primary-400 text-xs font-medium rounded">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 mb-2">{currentUpdate.description}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(
                      currentUpdate.category
                    )}`}
                  >
                    {getCategoryLabel(currentUpdate.category)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(currentUpdate.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button type="button"
              onClick={handlePrev}
              className="p-2 hover:bg-neutral-800 rounded transition-colors"
              aria-label="Previous update"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            </button>
            <button type="button"
              onClick={handleNext}
              className="p-2 hover:bg-neutral-800 rounded transition-colors"
              aria-label="Next update"
            >
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex gap-1">
            {visibleUpdates.map((_, index) => (
              <button type="button"
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex % visibleUpdates.length
                    ? 'bg-primary-400 w-6'
                    : 'bg-neutral-700 w-2'
                }`}
                aria-label={`Go to update ${index + 1}`}
              />
            ))}
          </div>

          {/* Dismiss Button */}
          <button type="button"
            onClick={() => handleDismiss(currentUpdate.id)}
            className="px-3 py-1 text-sm text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 rounded transition-colors"
          >
            Dismiss
          </button>
        </div>

        {/* Counter */}
        <div className="text-center text-xs text-neutral-500">
          {currentIndex + 1} of {visibleUpdates.length}
        </div>
      </div>
    </div>
  );
}

