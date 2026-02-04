/**
 * Coping strategy utilities
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

export interface CopingStrategy {
  id: string;
  patient_id: string;
  name: string;
  category: 'breathwork' | 'grounding' | 'body_awareness' | 'sensory' | 'other';
  description?: string;
  duration_minutes?: number;
  success_rate: number;
  last_used?: string;
  times_used: number;
  created_by: 'user' | 'system' | 'therapist';
  created_at: string;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: CopingStrategy['category']): string {
  const names: Record<CopingStrategy['category'], string> = {
    breathwork: 'Breathwork',
    grounding: 'Grounding',
    body_awareness: 'Body Awareness',
    sensory: 'Sensory',
    other: 'Other',
  };

  return names[category] || category;
}

/**
 * Get success rate status
 */
export function getSuccessRateStatus(
  successRate: number
): 'excellent' | 'good' | 'fair' | 'poor' | 'untested' {
  if (successRate >= 0.8) return 'excellent';
  if (successRate >= 0.6) return 'good';
  if (successRate >= 0.4) return 'fair';
  if (successRate > 0) return 'poor';
  return 'untested';
}

/**
 * Get success rate color
 */
export function getSuccessRateColor(status: string): string {
  switch (status) {
    case 'excellent':
      return 'text-green-400';
    case 'good':
      return 'text-teal-400';
    case 'fair':
      return 'text-yellow-400';
    case 'poor':
      return 'text-red-400';
    case 'untested':
      return 'text-neutral-400';
    default:
      return 'text-neutral-400';
  }
}

/**
 * Sort strategies by success rate (highest first)
 */
export function sortBySuccessRate(strategies: CopingStrategy[]): CopingStrategy[] {
  return [...strategies].sort((a, b) => b.success_rate - a.success_rate);
}

/**
 * Sort strategies by times used (most used first)
 */
export function sortByTimesUsed(strategies: CopingStrategy[]): CopingStrategy[] {
  return [...strategies].sort((a, b) => b.times_used - a.times_used);
}

/**
 * Sort strategies by recently used
 */
export function sortByRecentlyUsed(strategies: CopingStrategy[]): CopingStrategy[] {
  return [...strategies].sort((a, b) => {
    const dateA = a.last_used ? new Date(a.last_used).getTime() : 0;
    const dateB = b.last_used ? new Date(b.last_used).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Filter strategies by category
 */
export function filterByCategory(
  strategies: CopingStrategy[],
  category: CopingStrategy['category']
): CopingStrategy[] {
  return strategies.filter((s) => s.category === category);
}

/**
 * Get top strategies by success rate
 */
export function getTopStrategies(strategies: CopingStrategy[], count: number = 3): CopingStrategy[] {
  return sortBySuccessRate(strategies).slice(0, count);
}

/**
 * Calculate average success rate
 */
export function calculateAverageSuccessRate(strategies: CopingStrategy[]): number {
  if (strategies.length === 0) return 0;

  const sum = strategies.reduce((acc, s) => acc + s.success_rate, 0);
  return sum / strategies.length;
}

/**
 * Get strategies that need more testing
 */
export function getUntestedStrategies(strategies: CopingStrategy[]): CopingStrategy[] {
  return strategies.filter((s) => s.times_used === 0);
}

/**
 * Get strategies with low success rate
 */
export function getLowSuccessStrategies(strategies: CopingStrategy[], threshold: number = 0.3): CopingStrategy[] {
  return strategies.filter((s) => s.times_used > 0 && s.success_rate < threshold);
}

/**
 * Suggest next strategy to try
 */
export function suggestNextStrategy(strategies: CopingStrategy[]): CopingStrategy | null {
  // First, try untested strategies
  const untested = getUntestedStrategies(strategies);
  if (untested.length > 0) {
    return untested[0];
  }

  // Then, try high success rate strategies
  const topStrategies = getTopStrategies(strategies, 5);
  if (topStrategies.length > 0) {
    return topStrategies[Math.floor(Math.random() * topStrategies.length)];
  }

  return null;
}

/**
 * Validate coping strategy data
 */
export function validateCopingStrategy(strategy: Partial<CopingStrategy>): boolean {
  if (!strategy.name || typeof strategy.name !== 'string' || strategy.name.trim() === '') {
    return false;
  }

  if (!strategy.category || typeof strategy.category !== 'string') {
    return false;
  }

  const validCategories = ['breathwork', 'grounding', 'body_awareness', 'sensory', 'other'];
  if (!validCategories.includes(strategy.category)) {
    return false;
  }

  if (strategy.duration_minutes !== undefined) {
    if (typeof strategy.duration_minutes !== 'number' || strategy.duration_minutes < 0) {
      return false;
    }
  }

  if (strategy.success_rate !== undefined) {
    if (typeof strategy.success_rate !== 'number' || strategy.success_rate < 0 || strategy.success_rate > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Calculate effectiveness rating from user feedback
 */
export function calculateEffectivenessRating(
  userFeedback: 'very_helpful' | 'helpful' | 'neutral' | 'unhelpful' | 'very_unhelpful'
): number {
  const ratings: Record<string, number> = {
    very_helpful: 1.0,
    helpful: 0.75,
    neutral: 0.5,
    unhelpful: 0.25,
    very_unhelpful: 0.0,
  };

  return ratings[userFeedback] ?? 0.5;
}

/**
 * Format duration for display
 */
export function formatDuration(minutes?: number): string {
  if (!minutes) return 'Variable';

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}
