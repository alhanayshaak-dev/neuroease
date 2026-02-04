import fc from 'fast-check';
import { calculateStressScore, getStressStatus, getStressStatusLabel } from '../stress';

/**
 * Property-Based Tests for Stress Score Calculation
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 * 
 * Property 1: Stress Score Calculation and Display
 * For any sensor data from wearable devices, the system SHALL calculate stress score (0-100%)
 * within 2 seconds and display appropriate status indicator (Calm/Rising/Overload) based on
 * patient baseline.
 */

describe('Stress Score Calculation - Property-Based Tests', () => {
  // Generators for realistic sensor data
  const baselineGenerator = () =>
    fc.record({
      baseline_hr: fc.integer({ min: 40, max: 100 }), // Resting HR range
      baseline_hrv: fc.integer({ min: 20, max: 100 }), // HRV range
      baseline_eda: fc.float({ min: Math.fround(0.5), max: Math.fround(5), noNaN: true }), // EDA range
    });

  const metricsGenerator = () =>
    fc.record({
      heart_rate: fc.integer({ min: 40, max: 180 }), // HR range
      hrv: fc.integer({ min: 5, max: 150 }), // HRV range
      eda: fc.float({ min: Math.fround(0.1), max: Math.fround(10), noNaN: true }), // EDA range
    });

  describe('Property 1.1: Stress Score Range', () => {
    it('should always return a stress score between 0 and 100 for any valid sensor data', () => {
      fc.assert(
        fc.property(baselineGenerator(), metricsGenerator(), (baseline, metrics) => {
          const score = calculateStressScore(metrics, baseline);
          return score >= 0 && score <= 100;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1.2: Baseline Comparison', () => {
    it('should return approximately 50 when sensor metrics match baseline', () => {
      fc.assert(
        fc.property(baselineGenerator(), (baseline) => {
          const metrics = {
            heart_rate: baseline.baseline_hr,
            hrv: baseline.baseline_hrv,
            eda: baseline.baseline_eda,
          };
          const score = calculateStressScore(metrics, baseline);
          // Allow some tolerance due to sigmoid function
          return score >= 45 && score <= 55;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1.3: Stress Status Mapping', () => {
    it('should return "calm" status when stress increase is less than 30%', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 40, max: 100, noNaN: true }),
          (baselineScore) => {
            // Calculate a score that's less than 30% increase
            const stressScore = baselineScore * 1.25; // 25% increase
            const status = getStressStatus(stressScore, baselineScore);
            return status === 'calm';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return "rising" status when stress increase is between 30% and 60%', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 40, max: 100, noNaN: true }),
          (baselineScore) => {
            // Calculate a score that's between 30% and 60% increase
            const stressScore = baselineScore * 1.45; // 45% increase
            const status = getStressStatus(stressScore, baselineScore);
            return status === 'rising';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return "overload" status when stress increase is 60% or more', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 40, max: 100, noNaN: true }),
          (baselineScore) => {
            // Calculate a score that's 60% or more increase
            const stressScore = baselineScore * 1.65; // 65% increase
            const status = getStressStatus(stressScore, baselineScore);
            return status === 'overload';
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1.4: Status Label Consistency', () => {
    it('should return consistent labels for all valid status values', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('calm' as const),
            fc.constant('rising' as const),
            fc.constant('overload' as const)
          ),
          (status) => {
            const label = getStressStatusLabel(status);
            // Verify label is a non-empty string
            return typeof label === 'string' && label.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correct label for each status', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('calm' as const),
            fc.constant('rising' as const),
            fc.constant('overload' as const)
          ),
          (status) => {
            const label = getStressStatusLabel(status);
            const expectedLabels: Record<string, string> = {
              calm: 'Calm',
              rising: 'Rising',
              overload: 'Overload Predicted',
            };
            return label === expectedLabels[status];
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1.5: Monotonicity - Higher Deviation = Higher Stress', () => {
    it('should increase stress score as heart rate deviation increases', () => {
      fc.assert(
        fc.property(
          baselineGenerator(),
          fc.integer({ min: 0, max: 50 }),
          (baseline, deviation) => {
            const metrics1 = {
              heart_rate: baseline.baseline_hr + deviation,
              hrv: baseline.baseline_hrv,
              eda: baseline.baseline_eda,
            };
            const metrics2 = {
              heart_rate: baseline.baseline_hr + deviation + 10,
              hrv: baseline.baseline_hrv,
              eda: baseline.baseline_eda,
            };
            const score1 = calculateStressScore(metrics1, baseline);
            const score2 = calculateStressScore(metrics2, baseline);
            return score2 >= score1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should increase stress score as HRV deviation increases', () => {
      fc.assert(
        fc.property(
          baselineGenerator(),
          fc.integer({ min: 0, max: 30 }),
          (baseline, deviation) => {
            const metrics1 = {
              heart_rate: baseline.baseline_hr,
              hrv: Math.max(5, baseline.baseline_hrv - deviation),
              eda: baseline.baseline_eda,
            };
            const metrics2 = {
              heart_rate: baseline.baseline_hr,
              hrv: Math.max(5, baseline.baseline_hrv - deviation - 10),
              eda: baseline.baseline_eda,
            };
            const score1 = calculateStressScore(metrics1, baseline);
            const score2 = calculateStressScore(metrics2, baseline);
            return score2 >= score1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should increase stress score as EDA deviation increases', () => {
      fc.assert(
        fc.property(
          baselineGenerator(),
          fc.float({ min: Math.fround(0), max: Math.fround(2), noNaN: true }),
          (baseline, deviation) => {
            const metrics1 = {
              heart_rate: baseline.baseline_hr,
              hrv: baseline.baseline_hrv,
              eda: baseline.baseline_eda + deviation,
            };
            const metrics2 = {
              heart_rate: baseline.baseline_hr,
              hrv: baseline.baseline_hrv,
              eda: baseline.baseline_eda + deviation + 0.5,
            };
            const score1 = calculateStressScore(metrics1, baseline);
            const score2 = calculateStressScore(metrics2, baseline);
            return score2 >= score1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1.6: Symmetry - Positive and Negative Deviations', () => {
    it('should treat positive and negative deviations symmetrically', () => {
      fc.assert(
        fc.property(
          baselineGenerator(),
          fc.integer({ min: 5, max: 30 }),
          (baseline, deviation) => {
            const metricsAbove = {
              heart_rate: baseline.baseline_hr + deviation,
              hrv: baseline.baseline_hrv,
              eda: baseline.baseline_eda,
            };
            const metricsBelow = {
              heart_rate: baseline.baseline_hr - deviation,
              hrv: baseline.baseline_hrv,
              eda: baseline.baseline_eda,
            };
            const scoreAbove = calculateStressScore(metricsAbove, baseline);
            const scoreBelow = calculateStressScore(metricsBelow, baseline);
            // Scores should be approximately equal (within 1 point due to floating point)
            return Math.abs(scoreAbove - scoreBelow) <= 1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1.7: Status Transitions', () => {
    it('should transition from calm to rising to overload as stress increases', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 40, max: 100, noNaN: true }),
          (baselineScore) => {
            const calmScore = baselineScore * 1.2; // 20% increase
            const risingScore = baselineScore * 1.45; // 45% increase
            const overloadScore = baselineScore * 1.7; // 70% increase

            const calmStatus = getStressStatus(calmScore, baselineScore);
            const risingStatus = getStressStatus(risingScore, baselineScore);
            const overloadStatus = getStressStatus(overloadScore, baselineScore);

            return (
              calmStatus === 'calm' &&
              risingStatus === 'rising' &&
              overloadStatus === 'overload'
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1.8: Boundary Conditions', () => {
    it('should handle very low baseline values correctly', () => {
      fc.assert(
        fc.property(
          fc.record({
            baseline_hr: fc.integer({ min: 40, max: 50 }),
            baseline_hrv: fc.integer({ min: 5, max: 20 }),
            baseline_eda: fc.float({ min: Math.fround(0.1), max: Math.fround(0.5), noNaN: true }),
          }),
          metricsGenerator(),
          (baseline, metrics) => {
            const score = calculateStressScore(metrics, baseline);
            return score >= 0 && score <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle very high baseline values correctly', () => {
      fc.assert(
        fc.property(
          fc.record({
            baseline_hr: fc.integer({ min: 90, max: 100 }),
            baseline_hrv: fc.integer({ min: 80, max: 100 }),
            baseline_eda: fc.float({ min: Math.fround(4), max: Math.fround(5), noNaN: true }),
          }),
          metricsGenerator(),
          (baseline, metrics) => {
            const score = calculateStressScore(metrics, baseline);
            return score >= 0 && score <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
