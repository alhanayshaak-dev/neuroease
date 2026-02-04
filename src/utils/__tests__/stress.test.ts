import { calculateStressScore, getStressStatus, getStressStatusLabel } from '../stress';

describe('Stress Calculation', () => {
  const baseline = {
    baseline_hr: 70,
    baseline_hrv: 50,
    baseline_eda: 2,
  };

  describe('calculateStressScore', () => {
    it('should return 50 when metrics match baseline', () => {
      const metrics = {
        heart_rate: 70,
        hrv: 50,
        eda: 2,
      };

      const score = calculateStressScore(metrics, baseline);
      expect(score).toBeCloseTo(50, 1);
    });

    it('should return a value between 0 and 100', () => {
      const metrics = {
        heart_rate: 120,
        hrv: 20,
        eda: 5,
      };

      const score = calculateStressScore(metrics, baseline);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should increase with higher heart rate deviation', () => {
      const lowStress = calculateStressScore(
        { heart_rate: 75, hrv: 50, eda: 2 },
        baseline
      );
      const highStress = calculateStressScore(
        { heart_rate: 120, hrv: 50, eda: 2 },
        baseline
      );

      expect(highStress).toBeGreaterThan(lowStress);
    });
  });

  describe('getStressStatus', () => {
    it('should return calm when increase is less than 30%', () => {
      const status = getStressStatus(55, 50);
      expect(status).toBe('calm');
    });

    it('should return rising when increase is 30-60%', () => {
      const status = getStressStatus(70, 50);
      expect(status).toBe('rising');
    });

    it('should return overload when increase is 60% or more', () => {
      const status = getStressStatus(85, 50);
      expect(status).toBe('overload');
    });
  });

  describe('getStressStatusLabel', () => {
    it('should return correct labels', () => {
      expect(getStressStatusLabel('calm')).toBe('Calm');
      expect(getStressStatusLabel('rising')).toBe('Rising');
      expect(getStressStatusLabel('overload')).toBe('Overload Predicted');
    });
  });
});
