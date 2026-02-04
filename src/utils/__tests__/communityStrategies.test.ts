import {
  filterStrategiesByAgeGroup,
  filterStrategiesByCategory,
  filterStrategiesBySearch,
  sortStrategiesByRating,
  sortStrategiesByPopularity,
  filterStrategies,
  calculateAverageRating,
  isValidRating,
} from '../communityStrategies';
import { CommunityStrategy } from '@/types';

const mockStrategies: CommunityStrategy[] = [
  {
    id: '1',
    name: 'Deep Breathing',
    description: 'A simple breathing technique',
    category: 'breathwork',
    duration_minutes: 5,
    age_group: 'all',
    contributed_by: 'therapist1',
    is_therapist_verified: true,
    rating: 4.5,
    rating_count: 10,
    times_used: 100,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Grounding Technique',
    description: '5-4-3-2-1 sensory grounding',
    category: 'grounding',
    duration_minutes: 10,
    age_group: 'teen',
    contributed_by: 'user1',
    is_therapist_verified: false,
    rating: 3.8,
    rating_count: 5,
    times_used: 50,
    created_at: '2024-01-02',
    updated_at: '2024-01-02',
  },
  {
    id: '3',
    name: 'Body Scan',
    description: 'Progressive muscle relaxation',
    category: 'body_awareness',
    duration_minutes: 15,
    age_group: 'adult',
    contributed_by: 'therapist2',
    is_therapist_verified: true,
    rating: 4.2,
    rating_count: 8,
    times_used: 75,
    created_at: '2024-01-03',
    updated_at: '2024-01-03',
  },
  {
    id: '4',
    name: 'Sensory Play',
    description: 'Fidget toy activities',
    category: 'sensory',
    duration_minutes: 5,
    age_group: 'child',
    contributed_by: 'user2',
    is_therapist_verified: false,
    rating: 4.0,
    rating_count: 3,
    times_used: 30,
    created_at: '2024-01-04',
    updated_at: '2024-01-04',
  },
];

describe('Community Strategies Utilities', () => {
  describe('filterStrategiesByAgeGroup', () => {
    it('should return all strategies when age group is "all"', () => {
      const result = filterStrategiesByAgeGroup(mockStrategies, 'all');
      expect(result).toHaveLength(4);
    });

    it('should filter strategies by specific age group', () => {
      const result = filterStrategiesByAgeGroup(mockStrategies, 'teen');
      expect(result).toHaveLength(2); // teen + all
      expect(result.every((s) => s.age_group === 'teen' || s.age_group === 'all')).toBe(true);
    });

    it('should include "all" age group strategies with any filter', () => {
      const result = filterStrategiesByAgeGroup(mockStrategies, 'child');
      expect(result.some((s) => s.age_group === 'all')).toBe(true);
    });

    it('should return empty array when no strategies match', () => {
      const result = filterStrategiesByAgeGroup([], 'teen');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterStrategiesByCategory', () => {
    it('should filter strategies by category', () => {
      const result = filterStrategiesByCategory(mockStrategies, 'breathwork');
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('breathwork');
    });

    it('should return empty array when no strategies match category', () => {
      const result = filterStrategiesByCategory(mockStrategies, 'other');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterStrategiesBySearch', () => {
    it('should search by strategy name', () => {
      const result = filterStrategiesBySearch(mockStrategies, 'breathing');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Deep Breathing');
    });

    it('should search by description', () => {
      const result = filterStrategiesBySearch(mockStrategies, 'sensory');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const result = filterStrategiesBySearch(mockStrategies, 'BREATHING');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no match', () => {
      const result = filterStrategiesBySearch(mockStrategies, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortStrategiesByRating', () => {
    it('should sort strategies by rating in descending order', () => {
      const result = sortStrategiesByRating(mockStrategies);
      expect(result[0].rating).toBe(4.5);
      expect(result[result.length - 1].rating).toBe(3.8);
    });

    it('should not mutate original array', () => {
      const original = [...mockStrategies];
      sortStrategiesByRating(mockStrategies);
      expect(mockStrategies).toEqual(original);
    });
  });

  describe('sortStrategiesByPopularity', () => {
    it('should sort strategies by times_used in descending order', () => {
      const result = sortStrategiesByPopularity(mockStrategies);
      expect(result[0].times_used).toBe(100);
      expect(result[result.length - 1].times_used).toBe(30);
    });
  });

  describe('filterStrategies', () => {
    it('should apply multiple filters', () => {
      const result = filterStrategies(mockStrategies, {
        ageGroup: 'all',
        category: 'breathwork',
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Deep Breathing');
    });

    it('should filter by minimum rating', () => {
      const result = filterStrategies(mockStrategies, {
        minRating: 4.2,
      });
      expect(result.every((s) => s.rating >= 4.2)).toBe(true);
    });

    it('should filter by therapist verification', () => {
      const result = filterStrategies(mockStrategies, {
        isTherapistVerified: true,
      });
      expect(result.every((s) => s.is_therapist_verified)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('should combine all filters', () => {
      const result = filterStrategies(mockStrategies, {
        ageGroup: 'adult',
        category: 'body_awareness',
        isTherapistVerified: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Body Scan');
    });
  });

  describe('calculateAverageRating', () => {
    it('should calculate average rating correctly', () => {
      const ratings = [5, 4, 3, 4, 5];
      const result = calculateAverageRating(ratings);
      expect(result).toBe(4.2);
    });

    it('should return 0 for empty array', () => {
      const result = calculateAverageRating([]);
      expect(result).toBe(0);
    });

    it('should round to one decimal place', () => {
      const ratings = [1, 2, 3];
      const result = calculateAverageRating(ratings);
      expect(result).toBe(2);
    });
  });

  describe('isValidRating', () => {
    it('should validate ratings between 1 and 5', () => {
      expect(isValidRating(1)).toBe(true);
      expect(isValidRating(3)).toBe(true);
      expect(isValidRating(5)).toBe(true);
    });

    it('should reject ratings outside range', () => {
      expect(isValidRating(0)).toBe(false);
      expect(isValidRating(6)).toBe(false);
      expect(isValidRating(-1)).toBe(false);
    });

    it('should reject non-integer ratings', () => {
      expect(isValidRating(3.5)).toBe(false);
      expect(isValidRating(2.1)).toBe(false);
    });
  });
});
