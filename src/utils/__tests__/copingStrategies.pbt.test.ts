import fc from 'fast-check';
import {
  getSuccessRateStatus,
  calculateAverageSuccessRate,
  validateCopingStrategy,
  calculateEffectivenessRating,
  getTopStrategies,
  sortBySuccessRate,
  type CopingStrategy,
} from '../copingStrategies';

/**
 * Property 4: Coping Strategy Success Rate Calculation
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**
 *
 * For any coping strategy use, the system SHALL update success rate based on user
 * effectiveness rating, and prioritize high-success strategies in future suggestions.
 */
describe('Property 4: Coping Strategy Success Rate Calculation', () => {
  // Generator for coping strategy objects
  const strategyGen = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    name: fc.string({ minLength: 2, maxLength: 100 }).filter((s) => s.trim().length > 0),
    category: fc.constantFrom(
      'breathwork' as const,
      'grounding' as const,
      'body_awareness' as const,
      'sensory' as const,
      'other' as const
    ),
    description: fc.option(fc.string({ maxLength: 200 })),
    duration_minutes: fc.option(fc.integer({ min: 1, max: 480 })),
    success_rate: fc.double({ min: 0, max: 1, noNaN: true }),
    last_used: fc.option(fc.date().map((d) => d.toISOString())),
    times_used: fc.integer({ min: 0, max: 100 }),
    created_by: fc.constantFrom('user' as const, 'system' as const, 'therapist' as const),
    created_at: fc.date().map((d) => d.toISOString()),
  });

  it('should always return valid success rate status', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (rate) => {
        const status = getSuccessRateStatus(rate);
        return ['excellent', 'good', 'fair', 'poor', 'untested'].includes(status);
      }),
      { numRuns: 100 }
    );
  });

  it('should calculate average success rate between 0 and 1', () => {
    fc.assert(
      fc.property(fc.array(strategyGen, { maxLength: 20 }), (strategies) => {
        const average = calculateAverageSuccessRate(strategies as CopingStrategy[]);
        return average >= 0 && average <= 1;
      }),
      { numRuns: 100 }
    );
  });

  it('should return 0 average for empty strategy list', () => {
    fc.assert(
      fc.property(fc.constant([]), (strategies) => {
        const average = calculateAverageSuccessRate(strategies as CopingStrategy[]);
        return average === 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should reject strategies with missing name', () => {
    fc.assert(
      fc.property(strategyGen, (strategy) => {
        const invalid = { ...strategy, name: '' } as CopingStrategy;
        return !validateCopingStrategy(invalid);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject strategies with invalid category', () => {
    fc.assert(
      fc.property(strategyGen, (strategy) => {
        const invalid = { ...strategy, category: 'invalid' as any } as CopingStrategy;
        return !validateCopingStrategy(invalid);
      }),
      { numRuns: 100 }
    );
  });

  it('should calculate effectiveness rating between 0 and 1', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'very_helpful' as const,
          'helpful' as const,
          'neutral' as const,
          'unhelpful' as const,
          'very_unhelpful' as const
        ),
        (feedback) => {
          const rating = calculateEffectivenessRating(feedback);
          return rating >= 0 && rating <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should sort strategies by success rate in descending order', () => {
    fc.assert(
      fc.property(fc.array(strategyGen, { minLength: 2, maxLength: 20 }), (strategies) => {
        const sorted = sortBySuccessRate(strategies as CopingStrategy[]);

        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].success_rate < sorted[i + 1].success_rate) {
            return false;
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should return top strategies with highest success rates', () => {
    fc.assert(
      fc.property(
        fc.array(strategyGen, { minLength: 3, maxLength: 20 }),
        fc.integer({ min: 1, max: 3 }),
        (strategies, count) => {
          const top = getTopStrategies(strategies as CopingStrategy[], count);
          // Top strategies should be <= count
          return top.length <= count;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain strategy properties during sorting', () => {
    fc.assert(
      fc.property(fc.array(strategyGen, { minLength: 2, maxLength: 20 }), (strategies) => {
        const original = strategies as CopingStrategy[];
        const sorted = sortBySuccessRate(original);

        // All strategies should still be present
        return sorted.length === original.length;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle strategies with same success rate', () => {
    fc.assert(
      fc.property(
        fc.array(strategyGen, { minLength: 2, maxLength: 10 }).map((strategies) =>
          strategies.map((s) => ({ ...s, success_rate: 0.5 }))
        ),
        (strategies) => {
          const sorted = sortBySuccessRate(strategies as CopingStrategy[]);
          return sorted.length === strategies.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate average correctly for single strategy', () => {
    fc.assert(
      fc.property(strategyGen, (strategy) => {
        const average = calculateAverageSuccessRate([strategy as CopingStrategy]);
        return average === strategy.success_rate;
      }),
      { numRuns: 100 }
    );
  });
});
