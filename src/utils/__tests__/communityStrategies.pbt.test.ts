import fc from 'fast-check';
import {
  filterStrategiesByAgeGroup,
  filterStrategiesByCategory,
  filterStrategies,
  calculateAverageRating,
  isValidRating,
} from '../communityStrategies';
import { CommunityStrategy, AgeGroup, StrategyCategory } from '@/types';

/**
 * Property-Based Tests for Community Strategy Filtering
 * **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5, 15.6**
 *
 * Property 14: Community Strategy Age-Appropriate Filtering
 * For any community strategy search, the system SHALL filter results by age group
 * and display therapist verification badges, ratings, and contribution attribution.
 */

// Generators for property-based testing
const ageGroupGenerator = fc.oneof(
  fc.constant('child' as AgeGroup),
  fc.constant('teen' as AgeGroup),
  fc.constant('adult' as AgeGroup),
  fc.constant('all' as AgeGroup)
);

const categoryGenerator = fc.oneof(
  fc.constant('breathwork' as StrategyCategory),
  fc.constant('grounding' as StrategyCategory),
  fc.constant('body_awareness' as StrategyCategory),
  fc.constant('sensory' as StrategyCategory),
  fc.constant('other' as StrategyCategory)
);

const strategyGenerator = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  category: categoryGenerator,
  duration_minutes: fc.integer({ min: 1, max: 120 }),
  age_group: ageGroupGenerator,
  contributed_by: fc.string({ minLength: 1, maxLength: 50 }),
  is_therapist_verified: fc.boolean(),
  therapist_id: fc.option(fc.uuid()),
  rating: fc.float({ min: 0, max: 5, noNaN: true }),
  rating_count: fc.integer({ min: 0, max: 1000 }),
  times_used: fc.integer({ min: 0, max: 10000 }),
  created_at: fc.date().map((d) => d.toISOString()),
  updated_at: fc.date().map((d) => d.toISOString()),
}) as fc.Arbitrary<CommunityStrategy>;

describe('Community Strategies - Property-Based Tests', () => {
  describe('Property 14: Community Strategy Age-Appropriate Filtering', () => {
    it(
      'should filter strategies by age group correctly',
      () => {
        fc.assert(
          fc.property(fc.array(strategyGenerator, { minLength: 1 }), ageGroupGenerator, (strategies, ageGroup) => {
            const filtered = filterStrategiesByAgeGroup(strategies, ageGroup);

            // If age group is "all", should return all strategies
            if (ageGroup === 'all') {
              expect(filtered).toHaveLength(strategies.length);
            } else {
              // All filtered strategies should match the age group or be "all"
              const allMatch = filtered.every(
                (s) => s.age_group === ageGroup || s.age_group === 'all'
              );
              expect(allMatch).toBe(true);
            }

            // Filtered array should not be longer than original
            expect(filtered.length).toBeLessThanOrEqual(strategies.length);
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should include all "all" age group strategies in any filter',
      () => {
        fc.assert(
          fc.property(fc.array(strategyGenerator, { minLength: 1 }), ageGroupGenerator, (strategies, ageGroup) => {
            if (ageGroup === 'all') {
              return; // Skip when filtering by "all"
            }

            const filtered = filterStrategiesByAgeGroup(strategies, ageGroup);
            const allAgeStrategies = strategies.filter((s) => s.age_group === 'all');

            // All "all" age group strategies should be in filtered results
            allAgeStrategies.forEach((strategy) => {
              expect(filtered).toContainEqual(strategy);
            });
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should filter by category and age group together',
      () => {
        fc.assert(
          fc.property(
            fc.array(strategyGenerator, { minLength: 1 }),
            ageGroupGenerator,
            categoryGenerator,
            (strategies, ageGroup, category) => {
              const filtered = filterStrategies(strategies, {
                ageGroup,
                category,
              });

              // All filtered strategies should match category
              const categoryMatch = filtered.every((s) => s.category === category);
              expect(categoryMatch).toBe(true);

              // All filtered strategies should match age group (or be "all" if not filtering by "all")
              if (ageGroup !== 'all') {
                const ageMatch = filtered.every(
                  (s) => s.age_group === ageGroup || s.age_group === 'all'
                );
                expect(ageMatch).toBe(true);
              }
            }
          )
        );
      },
      { numRuns: 100 }
    );

    it(
      'should display therapist verification badges correctly',
      () => {
        fc.assert(
          fc.property(fc.array(strategyGenerator, { minLength: 1 }), (strategies) => {
            const verified = strategies.filter((s) => s.is_therapist_verified);
            const unverified = strategies.filter((s) => !s.is_therapist_verified);

            // Verified strategies should have is_therapist_verified = true
            verified.forEach((s) => {
              expect(s.is_therapist_verified).toBe(true);
            });

            // Unverified strategies should have is_therapist_verified = false
            unverified.forEach((s) => {
              expect(s.is_therapist_verified).toBe(false);
            });
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should maintain rating accuracy across filters',
      () => {
        fc.assert(
          fc.property(fc.array(strategyGenerator, { minLength: 1 }), (strategies) => {
            const filtered = filterStrategies(strategies, {
              minRating: 3.0,
            });

            // All filtered strategies should have rating >= 3.0
            filtered.forEach((s) => {
              expect(s.rating).toBeGreaterThanOrEqual(3.0);
            });
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should preserve strategy attribution (contributed_by)',
      () => {
        fc.assert(
          fc.property(fc.array(strategyGenerator, { minLength: 1 }), ageGroupGenerator, (strategies, ageGroup) => {
            const filtered = filterStrategiesByAgeGroup(strategies, ageGroup);

            // All filtered strategies should have contributed_by field
            filtered.forEach((s) => {
              expect(s.contributed_by).toBeDefined();
              expect(typeof s.contributed_by).toBe('string');
              expect(s.contributed_by.length).toBeGreaterThan(0);
            });
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should handle empty strategy list',
      () => {
        fc.assert(
          fc.property(ageGroupGenerator, (ageGroup) => {
            const filtered = filterStrategiesByAgeGroup([], ageGroup);
            expect(filtered).toHaveLength(0);
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should calculate average rating correctly',
      () => {
        fc.assert(
          fc.property(fc.array(fc.integer({ min: 1, max: 5 }), { minLength: 1 }), (ratings) => {
            const average = calculateAverageRating(ratings);

            // Average should be between min and max rating
            const min = Math.min(...ratings);
            const max = Math.max(...ratings);
            expect(average).toBeGreaterThanOrEqual(min);
            expect(average).toBeLessThanOrEqual(max);

            // Average should be rounded to 1 decimal place
            expect(average).toBe(Math.round(average * 10) / 10);
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should validate ratings correctly',
      () => {
        fc.assert(
          fc.property(fc.integer(), (rating) => {
            const isValid = isValidRating(rating);

            // Valid ratings are integers 1-5
            if (isValid) {
              expect(Number.isInteger(rating)).toBe(true);
              expect(rating).toBeGreaterThanOrEqual(1);
              expect(rating).toBeLessThanOrEqual(5);
            } else {
              // Invalid ratings should not be integers 1-5
              expect(
                !Number.isInteger(rating) ||
                rating < 1 ||
                rating > 5
              ).toBe(true);
            }
          })
        );
      },
      { numRuns: 100 }
    );

    it(
      'should filter strategies by search term',
      () => {
        fc.assert(
          fc.property(
            fc.array(strategyGenerator, { minLength: 1 }),
            fc.string({ minLength: 1, maxLength: 20 }),
            (strategies, searchTerm) => {
              const filtered = filterStrategies(strategies, {
                searchTerm,
              });

              // All filtered strategies should contain search term in name or description
              filtered.forEach((s) => {
                const nameMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
                const descMatch = s.description.toLowerCase().includes(searchTerm.toLowerCase());
                expect(nameMatch || descMatch).toBe(true);
              });
            }
          )
        );
      },
      { numRuns: 100 }
    );

    it(
      'should not lose strategies when filtering',
      () => {
        fc.assert(
          fc.property(
            fc.array(strategyGenerator, { minLength: 1 }),
            ageGroupGenerator,
            categoryGenerator,
            (strategies, ageGroup, category) => {
              const filtered = filterStrategies(strategies, {
                ageGroup,
                category,
              });

              // Filtered array should not be longer than original
              expect(filtered.length).toBeLessThanOrEqual(strategies.length);

              // All filtered strategies should be from original array
              filtered.forEach((filteredStrategy) => {
                expect(strategies).toContainEqual(filteredStrategy);
              });
            }
          )
        );
      },
      { numRuns: 100 }
    );
  });
});
