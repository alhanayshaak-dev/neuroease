/**
 * Property-based tests for analytics utilities
 * **Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5, 17.6**
 */

import fc from 'fast-check';
import {
  calculateStressTrends,
  calculateStressByLocation,
  calculateHardestTimes,
  calculateTriggerFrequencies,
  calculateTrendDirection,
  calculateAnalyticsTrends,
} from '../analytics';
import { Database } from '@/types/database';

type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];

// Arbitraries for generating test data
const sensorDataArbitrary = (): fc.Arbitrary<SensorDataRow> => {
  return fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    device_id: fc.uuid(),
    timestamp: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
      d.toISOString()
    ),
    heart_rate: fc.integer({ min: 40, max: 200 }),
    hrv: fc.integer({ min: 10, max: 200 }),
    eda: fc.float({ min: 0, max: 5 }),
    accelerometer_x: fc.float({ min: -10, max: 10 }),
    accelerometer_y: fc.float({ min: -10, max: 10 }),
    accelerometer_z: fc.float({ min: -10, max: 10 }),
    location: fc.oneof(
      fc.constant('Home'),
      fc.constant('Work'),
      fc.constant('School'),
      fc.constant('Park'),
      fc.constant('Unknown')
    ),
    activity: fc.oneof(
      fc.constant('Relaxing'),
      fc.constant('Meeting'),
      fc.constant('Exercise'),
      fc.constant('Studying'),
      fc.constant('Unknown')
    ),
    stress_score: fc.integer({ min: 0, max: 100 }),
    overload_predicted: fc.boolean(),
    overload_predicted_in_minutes: fc.oneof(fc.constant(null), fc.integer({ min: 1, max: 60 })),
    created_at: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
      d.toISOString()
    ),
  });
};

describe('Analytics Property-Based Tests', () => {
  describe('Property 16: Analytics Trend Calculation', () => {
    it('should calculate stress trends with valid metrics for any sensor data', () => {
      fc.assert(
        fc.property(fc.array(sensorDataArbitrary(), { minLength: 1, maxLength: 100 }), (data) => {
          const trends = calculateStressTrends(data);

          // All trends should have valid metrics
          for (const trend of trends) {
            // Average stress should be between min and max
            expect(trend.average_stress).toBeGreaterThanOrEqual(trend.min_stress);
            expect(trend.average_stress).toBeLessThanOrEqual(trend.peak_stress);

            // Peak should be >= min
            expect(trend.peak_stress).toBeGreaterThanOrEqual(trend.min_stress);

            // All stress values should be in valid range
            expect(trend.average_stress).toBeGreaterThanOrEqual(0);
            expect(trend.average_stress).toBeLessThanOrEqual(100);
            expect(trend.peak_stress).toBeGreaterThanOrEqual(0);
            expect(trend.peak_stress).toBeLessThanOrEqual(100);
            expect(trend.min_stress).toBeGreaterThanOrEqual(0);
            expect(trend.min_stress).toBeLessThanOrEqual(100);

            // Data points should be positive
            expect(trend.data_points).toBeGreaterThan(0);
          }

          // Trends should be sorted by date
          for (let i = 1; i < trends.length; i++) {
            const prevDate = new Date(trends[i - 1].date).getTime();
            const currDate = new Date(trends[i].date).getTime();
            expect(prevDate).toBeLessThanOrEqual(currDate);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should calculate stress by location with valid metrics for any sensor data', () => {
      fc.assert(
        fc.property(fc.array(sensorDataArbitrary(), { minLength: 1, maxLength: 100 }), (data) => {
          const locations = calculateStressByLocation(data);

          // All locations should have valid metrics
          for (const location of locations) {
            // Average stress should be between min and max
            expect(location.average_stress).toBeGreaterThanOrEqual(0);
            expect(location.average_stress).toBeLessThanOrEqual(100);
            expect(location.peak_stress).toBeGreaterThanOrEqual(0);
            expect(location.peak_stress).toBeLessThanOrEqual(100);

            // Frequency should be positive
            expect(location.frequency).toBeGreaterThan(0);

            // Percentage should be between 0 and 100
            expect(location.percentage).toBeGreaterThan(0);
            expect(location.percentage).toBeLessThanOrEqual(100);
          }

          // Locations should be sorted by average stress (descending)
          for (let i = 1; i < locations.length; i++) {
            expect(locations[i - 1].average_stress).toBeGreaterThanOrEqual(
              locations[i].average_stress
            );
          }

          // Total frequency should equal data length
          const totalFrequency = locations.reduce((sum, l) => sum + l.frequency, 0);
          expect(totalFrequency).toBe(data.length);

          // Total percentage should be approximately 100
          const totalPercentage = locations.reduce((sum, l) => sum + l.percentage, 0);
          expect(totalPercentage).toBeCloseTo(100, 1);
        }),
        { numRuns: 100 }
      );
    });

    it('should calculate hardest times with valid metrics for any sensor data', () => {
      fc.assert(
        fc.property(fc.array(sensorDataArbitrary(), { minLength: 1, maxLength: 100 }), (data) => {
          const times = calculateHardestTimes(data);

          // All times should have valid metrics
          for (const time of times) {
            // Average stress should be between min and max
            expect(time.average_stress).toBeGreaterThanOrEqual(0);
            expect(time.average_stress).toBeLessThanOrEqual(100);
            expect(time.peak_stress).toBeGreaterThanOrEqual(0);
            expect(time.peak_stress).toBeLessThanOrEqual(100);

            // Frequency should be positive
            expect(time.frequency).toBeGreaterThan(0);

            // Percentage should be between 0 and 100
            expect(time.percentage).toBeGreaterThan(0);
            expect(time.percentage).toBeLessThanOrEqual(100);
          }

          // Times should be sorted by average stress (descending)
          for (let i = 1; i < times.length; i++) {
            expect(times[i - 1].average_stress).toBeGreaterThanOrEqual(times[i].average_stress);
          }

          // Total frequency should equal data length
          const totalFrequency = times.reduce((sum, t) => sum + t.frequency, 0);
          expect(totalFrequency).toBe(data.length);

          // Total percentage should be approximately 100
          const totalPercentage = times.reduce((sum, t) => sum + t.percentage, 0);
          expect(totalPercentage).toBeCloseTo(100, 1);
        }),
        { numRuns: 100 }
      );
    });

    it('should calculate trigger frequencies with valid metrics for any sensor data', () => {
      fc.assert(
        fc.property(fc.array(sensorDataArbitrary(), { minLength: 1, maxLength: 100 }), (data) => {
          const triggers = calculateTriggerFrequencies(data);

          // All triggers should have valid metrics
          for (const trigger of triggers) {
            // Average stress should be between 0 and 100
            expect(trigger.average_stress).toBeGreaterThanOrEqual(0);
            expect(trigger.average_stress).toBeLessThanOrEqual(100);

            // Frequency should be positive
            expect(trigger.frequency).toBeGreaterThan(0);

            // Percentage should be between 0 and 100
            expect(trigger.percentage).toBeGreaterThan(0);
            expect(trigger.percentage).toBeLessThanOrEqual(100);
          }

          // Triggers should be sorted by frequency (descending)
          for (let i = 1; i < triggers.length; i++) {
            expect(triggers[i - 1].frequency).toBeGreaterThanOrEqual(triggers[i].frequency);
          }

          // Total frequency should equal data length
          const totalFrequency = triggers.reduce((sum, t) => sum + t.frequency, 0);
          expect(totalFrequency).toBe(data.length);

          // Total percentage should be approximately 100
          const totalPercentage = triggers.reduce((sum, t) => sum + t.percentage, 0);
          expect(totalPercentage).toBeCloseTo(100, 1);
        }),
        { numRuns: 100 }
      );
    });

    it('should calculate trend direction correctly for any stress trends', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              date: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
                d.toISOString().split('T')[0]
              ),
              average_stress: fc.integer({ min: 0, max: 100 }),
              peak_stress: fc.integer({ min: 0, max: 100 }),
              min_stress: fc.integer({ min: 0, max: 100 }),
              data_points: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (trends) => {
            const result = calculateTrendDirection(trends);

            // Direction should be one of the valid values
            expect(['improving', 'stable', 'worsening']).toContain(result.direction);

            // Percentage change should be a number
            expect(typeof result.percentage_change).toBe('number');

            // If improving, percentage change should be negative
            if (result.direction === 'improving') {
              expect(result.percentage_change).toBeLessThan(-5);
            }

            // If worsening, percentage change should be positive
            if (result.direction === 'worsening') {
              expect(result.percentage_change).toBeGreaterThan(5);
            }

            // If stable, percentage change should be between -5 and 5
            if (result.direction === 'stable') {
              expect(result.percentage_change).toBeGreaterThanOrEqual(-5);
              expect(result.percentage_change).toBeLessThanOrEqual(5);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate overall analytics with all required fields for any sensor data', () => {
      fc.assert(
        fc.property(fc.array(sensorDataArbitrary(), { minLength: 1, maxLength: 100 }), (data) => {
          const analytics = calculateAnalyticsTrends(data);

          // All required fields should be present
          expect(analytics).toHaveProperty('time_period');
          expect(analytics).toHaveProperty('start_date');
          expect(analytics).toHaveProperty('end_date');
          expect(analytics).toHaveProperty('total_data_points');
          expect(analytics).toHaveProperty('average_stress');
          expect(analytics).toHaveProperty('peak_stress');
          expect(analytics).toHaveProperty('min_stress');
          expect(analytics).toHaveProperty('stress_trend');
          expect(analytics).toHaveProperty('stress_by_location');
          expect(analytics).toHaveProperty('hardest_times');
          expect(analytics).toHaveProperty('trigger_frequencies');
          expect(analytics).toHaveProperty('coping_effectiveness');
          expect(analytics).toHaveProperty('trend_direction');
          expect(analytics).toHaveProperty('trend_percentage_change');

          // Total data points should match input length
          expect(analytics.total_data_points).toBe(data.length);

          // Average stress should be between min and max
          expect(analytics.average_stress).toBeGreaterThanOrEqual(analytics.min_stress);
          expect(analytics.average_stress).toBeLessThanOrEqual(analytics.peak_stress);

          // All stress values should be in valid range
          expect(analytics.average_stress).toBeGreaterThanOrEqual(0);
          expect(analytics.average_stress).toBeLessThanOrEqual(100);
          expect(analytics.peak_stress).toBeGreaterThanOrEqual(0);
          expect(analytics.peak_stress).toBeLessThanOrEqual(100);
          expect(analytics.min_stress).toBeGreaterThanOrEqual(0);
          expect(analytics.min_stress).toBeLessThanOrEqual(100);

          // Trend direction should be valid
          expect(['improving', 'stable', 'worsening']).toContain(analytics.trend_direction);

          // Arrays should not be null
          expect(Array.isArray(analytics.stress_trend)).toBe(true);
          expect(Array.isArray(analytics.stress_by_location)).toBe(true);
          expect(Array.isArray(analytics.hardest_times)).toBe(true);
          expect(Array.isArray(analytics.trigger_frequencies)).toBe(true);
          expect(Array.isArray(analytics.coping_effectiveness)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve data integrity through analytics calculation for any sensor data', () => {
      fc.assert(
        fc.property(fc.array(sensorDataArbitrary(), { minLength: 1, maxLength: 100 }), (data) => {
          const analytics = calculateAnalyticsTrends(data);

          // Calculate expected average manually
          const expectedAverage =
            data.reduce((sum, d) => sum + d.stress_score, 0) / data.length;
          expect(analytics.average_stress).toBeCloseTo(expectedAverage, 1);

          // Calculate expected peak manually
          const expectedPeak = Math.max(...data.map((d) => d.stress_score));
          expect(analytics.peak_stress).toBe(expectedPeak);

          // Calculate expected min manually
          const expectedMin = Math.min(...data.map((d) => d.stress_score));
          expect(analytics.min_stress).toBe(expectedMin);

          // All locations in stress_by_location should exist in data
          const dataLocations = new Set(data.map((d) => d.location));
          for (const location of analytics.stress_by_location) {
            expect(dataLocations.has(location.location)).toBe(true);
          }

          // All triggers in trigger_frequencies should exist in data
          const dataActivities = new Set(data.map((d) => d.activity));
          for (const trigger of analytics.trigger_frequencies) {
            expect(dataActivities.has(trigger.trigger_type)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});
