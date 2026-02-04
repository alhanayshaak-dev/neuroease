import {
  getCategoryDisplayName,
  getSuccessRateStatus,
  getSuccessRateColor,
  sortBySuccessRate,
  sortByTimesUsed,
  sortByRecentlyUsed,
  filterByCategory,
  getTopStrategies,
  calculateAverageSuccessRate,
  getUntestedStrategies,
  getLowSuccessStrategies,
  suggestNextStrategy,
  validateCopingStrategy,
  calculateEffectivenessRating,
  formatDuration,
  type CopingStrategy,
} from '../copingStrategies';

describe('Coping Strategies Utility', () => {
  const baseStrategy: CopingStrategy = {
    id: 'strategy-1',
    patient_id: 'patient-1',
    name: 'Deep Breathing',
    category: 'breathwork',
    description: 'Slow, deep breathing exercise',
    duration_minutes: 5,
    success_rate: 0.8,
    times_used: 10,
    created_by: 'user',
    created_at: new Date().toISOString(),
  };

  describe('getCategoryDisplayName', () => {
    it('should return display name for breathwork', () => {
      expect(getCategoryDisplayName('breathwork')).toBe('Breathwork');
    });

    it('should return display name for all categories', () => {
      expect(getCategoryDisplayName('grounding')).toBe('Grounding');
      expect(getCategoryDisplayName('body_awareness')).toBe('Body Awareness');
      expect(getCategoryDisplayName('sensory')).toBe('Sensory');
      expect(getCategoryDisplayName('other')).toBe('Other');
    });
  });

  describe('getSuccessRateStatus', () => {
    it('should return excellent for 0.8+', () => {
      expect(getSuccessRateStatus(0.8)).toBe('excellent');
      expect(getSuccessRateStatus(1.0)).toBe('excellent');
    });

    it('should return good for 0.6-0.79', () => {
      expect(getSuccessRateStatus(0.6)).toBe('good');
      expect(getSuccessRateStatus(0.75)).toBe('good');
    });

    it('should return fair for 0.4-0.59', () => {
      expect(getSuccessRateStatus(0.4)).toBe('fair');
      expect(getSuccessRateStatus(0.5)).toBe('fair');
    });

    it('should return poor for 0.01-0.39', () => {
      expect(getSuccessRateStatus(0.01)).toBe('poor');
      expect(getSuccessRateStatus(0.3)).toBe('poor');
    });

    it('should return untested for 0', () => {
      expect(getSuccessRateStatus(0)).toBe('untested');
    });
  });

  describe('getSuccessRateColor', () => {
    it('should return correct colors for each status', () => {
      expect(getSuccessRateColor('excellent')).toBe('text-green-400');
      expect(getSuccessRateColor('good')).toBe('text-teal-400');
      expect(getSuccessRateColor('fair')).toBe('text-yellow-400');
      expect(getSuccessRateColor('poor')).toBe('text-red-400');
      expect(getSuccessRateColor('untested')).toBe('text-neutral-400');
    });
  });

  describe('sortBySuccessRate', () => {
    it('should sort strategies by success rate descending', () => {
      const strategies = [
        { ...baseStrategy, id: '1', success_rate: 0.5 },
        { ...baseStrategy, id: '2', success_rate: 0.9 },
        { ...baseStrategy, id: '3', success_rate: 0.7 },
      ];

      const sorted = sortBySuccessRate(strategies);
      expect(sorted[0].success_rate).toBe(0.9);
      expect(sorted[1].success_rate).toBe(0.7);
      expect(sorted[2].success_rate).toBe(0.5);
    });

    it('should not modify original array', () => {
      const strategies = [
        { ...baseStrategy, id: '1', success_rate: 0.5 },
        { ...baseStrategy, id: '2', success_rate: 0.9 },
      ];

      const original = [...strategies];
      sortBySuccessRate(strategies);

      expect(strategies).toEqual(original);
    });
  });

  describe('sortByTimesUsed', () => {
    it('should sort strategies by times used descending', () => {
      const strategies = [
        { ...baseStrategy, id: '1', times_used: 5 },
        { ...baseStrategy, id: '2', times_used: 20 },
        { ...baseStrategy, id: '3', times_used: 10 },
      ];

      const sorted = sortByTimesUsed(strategies);
      expect(sorted[0].times_used).toBe(20);
      expect(sorted[1].times_used).toBe(10);
      expect(sorted[2].times_used).toBe(5);
    });
  });

  describe('filterByCategory', () => {
    it('should filter strategies by category', () => {
      const strategies = [
        { ...baseStrategy, id: '1', category: 'breathwork' as const },
        { ...baseStrategy, id: '2', category: 'grounding' as const },
        { ...baseStrategy, id: '3', category: 'breathwork' as const },
      ];

      const filtered = filterByCategory(strategies, 'breathwork');
      expect(filtered.length).toBe(2);
      expect(filtered.every((s) => s.category === 'breathwork')).toBe(true);
    });
  });

  describe('getTopStrategies', () => {
    it('should return top strategies by success rate', () => {
      const strategies = [
        { ...baseStrategy, id: '1', success_rate: 0.5 },
        { ...baseStrategy, id: '2', success_rate: 0.9 },
        { ...baseStrategy, id: '3', success_rate: 0.7 },
        { ...baseStrategy, id: '4', success_rate: 0.6 },
      ];

      const top = getTopStrategies(strategies, 2);
      expect(top.length).toBe(2);
      expect(top[0].success_rate).toBe(0.9);
      expect(top[1].success_rate).toBe(0.7);
    });

    it('should default to 3 strategies', () => {
      const strategies = Array(5)
        .fill(null)
        .map((_, i) => ({ ...baseStrategy, id: `${i}`, success_rate: 0.5 + i * 0.1 }));

      const top = getTopStrategies(strategies);
      expect(top.length).toBe(3);
    });
  });

  describe('calculateAverageSuccessRate', () => {
    it('should calculate average success rate', () => {
      const strategies = [
        { ...baseStrategy, success_rate: 0.8 },
        { ...baseStrategy, success_rate: 0.6 },
        { ...baseStrategy, success_rate: 0.4 },
      ];

      const average = calculateAverageSuccessRate(strategies);
      expect(average).toBe(0.6);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageSuccessRate([])).toBe(0);
    });
  });

  describe('getUntestedStrategies', () => {
    it('should return strategies with 0 times used', () => {
      const strategies = [
        { ...baseStrategy, id: '1', times_used: 0 },
        { ...baseStrategy, id: '2', times_used: 5 },
        { ...baseStrategy, id: '3', times_used: 0 },
      ];

      const untested = getUntestedStrategies(strategies);
      expect(untested.length).toBe(2);
      expect(untested.every((s) => s.times_used === 0)).toBe(true);
    });
  });

  describe('getLowSuccessStrategies', () => {
    it('should return strategies below threshold', () => {
      const strategies = [
        { ...baseStrategy, id: '1', success_rate: 0.2, times_used: 5 },
        { ...baseStrategy, id: '2', success_rate: 0.8, times_used: 5 },
        { ...baseStrategy, id: '3', success_rate: 0.25, times_used: 5 },
      ];

      const low = getLowSuccessStrategies(strategies, 0.3);
      expect(low.length).toBe(2);
      expect(low.every((s) => s.success_rate < 0.3)).toBe(true);
    });

    it('should exclude untested strategies', () => {
      const strategies = [
        { ...baseStrategy, id: '1', success_rate: 0, times_used: 0 },
        { ...baseStrategy, id: '2', success_rate: 0.2, times_used: 5 },
      ];

      const low = getLowSuccessStrategies(strategies, 0.3);
      expect(low.length).toBe(1);
      expect(low[0].id).toBe('2');
    });
  });

  describe('suggestNextStrategy', () => {
    it('should suggest untested strategy first', () => {
      const strategies = [
        { ...baseStrategy, id: '1', times_used: 0 },
        { ...baseStrategy, id: '2', success_rate: 0.9, times_used: 10 },
      ];

      const suggested = suggestNextStrategy(strategies);
      expect(suggested?.id).toBe('1');
    });

    it('should suggest high success strategy if all tested', () => {
      const strategies = [
        { ...baseStrategy, id: '1', success_rate: 0.5, times_used: 5 },
        { ...baseStrategy, id: '2', success_rate: 0.9, times_used: 10 },
      ];

      const suggested = suggestNextStrategy(strategies);
      expect(suggested?.success_rate).toBeGreaterThanOrEqual(0.5);
    });

    it('should return null for empty array', () => {
      expect(suggestNextStrategy([])).toBeNull();
    });
  });

  describe('validateCopingStrategy', () => {
    it('should validate correct strategy', () => {
      expect(validateCopingStrategy(baseStrategy)).toBe(true);
    });

    it('should reject missing name', () => {
      const strategy = { ...baseStrategy, name: '' };
      expect(validateCopingStrategy(strategy)).toBe(false);
    });

    it('should reject invalid category', () => {
      const strategy = { ...baseStrategy, category: 'invalid' as any };
      expect(validateCopingStrategy(strategy)).toBe(false);
    });

    it('should reject invalid success rate', () => {
      expect(validateCopingStrategy({ ...baseStrategy, success_rate: -0.1 })).toBe(false);
      expect(validateCopingStrategy({ ...baseStrategy, success_rate: 1.1 })).toBe(false);
    });

    it('should reject negative duration', () => {
      expect(validateCopingStrategy({ ...baseStrategy, duration_minutes: -5 })).toBe(false);
    });
  });

  describe('calculateEffectivenessRating', () => {
    it('should calculate rating for very helpful', () => {
      expect(calculateEffectivenessRating('very_helpful')).toBe(1.0);
    });

    it('should calculate rating for helpful', () => {
      expect(calculateEffectivenessRating('helpful')).toBe(0.75);
    });

    it('should calculate rating for neutral', () => {
      expect(calculateEffectivenessRating('neutral')).toBe(0.5);
    });

    it('should calculate rating for unhelpful', () => {
      expect(calculateEffectivenessRating('unhelpful')).toBe(0.25);
    });

    it('should calculate rating for very unhelpful', () => {
      expect(calculateEffectivenessRating('very_unhelpful')).toBe(0.0);
    });
  });

  describe('formatDuration', () => {
    it('should format minutes', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(5)).toBe('5 min');
    });

    it('should format hours', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(120)).toBe('2h');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(75)).toBe('1h 15m');
    });

    it('should return Variable for undefined', () => {
      expect(formatDuration()).toBe('Variable');
    });
  });
});
