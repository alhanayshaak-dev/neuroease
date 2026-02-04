import { CommunityStrategy, AgeGroup, StrategyCategory } from '@/types';

/**
 * Filters community strategies by age group
 * Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5, 15.6
 */
export function filterStrategiesByAgeGroup(
  strategies: CommunityStrategy[],
  ageGroup: AgeGroup
): CommunityStrategy[] {
  if (ageGroup === 'all') {
    return strategies;
  }

  return strategies.filter(
    (strategy) => strategy.age_group === ageGroup || strategy.age_group === 'all'
  );
}

/**
 * Filters community strategies by category
 */
export function filterStrategiesByCategory(
  strategies: CommunityStrategy[],
  category: StrategyCategory
): CommunityStrategy[] {
  return strategies.filter((strategy) => strategy.category === category);
}

/**
 * Filters community strategies by search term
 */
export function filterStrategiesBySearch(
  strategies: CommunityStrategy[],
  searchTerm: string
): CommunityStrategy[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return strategies.filter(
    (strategy) =>
      strategy.name.toLowerCase().includes(lowerSearchTerm) ||
      strategy.description.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Sorts strategies by rating (highest first)
 */
export function sortStrategiesByRating(strategies: CommunityStrategy[]): CommunityStrategy[] {
  return [...strategies].sort((a, b) => b.rating - a.rating);
}

/**
 * Sorts strategies by popularity (most used first)
 */
export function sortStrategiesByPopularity(strategies: CommunityStrategy[]): CommunityStrategy[] {
  return [...strategies].sort((a, b) => b.times_used - a.times_used);
}

/**
 * Applies multiple filters to strategies
 */
export function filterStrategies(
  strategies: CommunityStrategy[],
  filters: {
    ageGroup?: AgeGroup;
    category?: StrategyCategory;
    searchTerm?: string;
    minRating?: number;
    isTherapistVerified?: boolean;
  }
): CommunityStrategy[] {
  let filtered = strategies;

  if (filters.ageGroup) {
    filtered = filterStrategiesByAgeGroup(filtered, filters.ageGroup);
  }

  if (filters.category) {
    filtered = filterStrategiesByCategory(filtered, filters.category);
  }

  if (filters.searchTerm) {
    filtered = filterStrategiesBySearch(filtered, filters.searchTerm);
  }

  if (filters.minRating !== undefined) {
    filtered = filtered.filter((strategy) => strategy.rating >= filters.minRating!);
  }

  if (filters.isTherapistVerified !== undefined) {
    filtered = filtered.filter(
      (strategy) => strategy.is_therapist_verified === filters.isTherapistVerified
    );
  }

  return filtered;
}

/**
 * Calculates average rating from multiple ratings
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

/**
 * Validates a rating value (1-5)
 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}
