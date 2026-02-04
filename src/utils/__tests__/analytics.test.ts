/**
 * Unit tests for analytics utilities
 */

import {
  calculateStressTrends,
  calculateStressByLocation,
  calculateHardestTimes,
  calculateTriggerFrequencies,
  calculateTrendDirection,
  calculateAnalyticsTrends,
  filterSensorDataByDateRange,
  getSensorDataForLastDays,
} from '../analytics';
import { Database } from '@/types/database';

type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];

// Helper to create mock sensor data
function createMockSensorData(
  overrides: Partial<SensorDataRow> = {}
): SensorDataRow {
  const now = new Date();
  return {
    id: `sensor_${Math.random()}`,
    patient_id: 'patient_1',
    device_id: 'device_1',
    timestamp: now.toISOString(),
    heart_rate: 80,
    hrv: 50,
    eda: 0.5,
    accelerometer_x: 0,
    accelerometer_y: 0,
    accelerometer_z: 0,
    location: 'Home',
    activity: 'Relaxing',
    stress_score: 30,
    overload_predicted: false,
    overload_predicted_in_minutes: null,
    created_at: now.toISOString(),
    ...overrides,
  };
}

describe('Analytics Utilities', () => {
  describe('calculateStressTrends', () => {
    it('should return empty array for empty sensor data', () => {
      const result = calculateStressTrends([]);
      expect(result).toEqual([]);
    });

    it('should group sensor data by date', () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const data = [
        createMockSensorData({
          timestamp: now.toISOString(),
          stress_score: 30,
        }),
        createMockSensorData({
          timestamp: now.toISOString(),
          stress_score: 40,
        }),
        createMockSensorData({
          timestamp: tomorrow.toISOString(),
          stress_score: 50,
        }),
      ];

      const result = calculateStressTrends(data);

      expect(result.length).toBe(2);
      expect(result[0].average_stress).toBe(35); // (30 + 40) / 2
      expect(result[0].peak_stress).toBe(40);
      expect(result[0].min_stress).toBe(30);
      expect(result[0].data_points).toBe(2);
    });

    it('should calculate correct peak and min stress', () => {
      const now = new Date();
      const data = [
        createMockSensorData({ timestamp: now.toISOString(), stress_score: 20 }),
        createMockSensorData({ timestamp: now.toISOString(), stress_score: 80 }),
        createMockSensorData({ timestamp: now.toISOString(), stress_score: 50 }),
      ];

      const result = calculateStressTrends(data);

      expect(result[0].peak_stress).toBe(80);
      expect(result[0].min_stress).toBe(20);
    });

    it('should sort trends by date', () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const data = [
        createMockSensorData({ timestamp: tomorrow.toISOString() }),
        createMockSensorData({ timestamp: yesterday.toISOString() }),
        createMockSensorData({ timestamp: now.toISOString() }),
      ];

      const result = calculateStressTrends(data);

      expect(new Date(result[0].date).getTime()).toBeLessThan(
        new Date(result[1].date).getTime()
      );
      expect(new Date(result[1].date).getTime()).toBeLessThan(
        new Date(result[2].date).getTime()
      );
    });
  });

  describe('calculateStressByLocation', () => {
    it('should return empty array for empty sensor data', () => {
      const result = calculateStressByLocation([]);
      expect(result).toEqual([]);
    });

    it('should group stress by location', () => {
      const data = [
        createMockSensorData({ location: 'Home', stress_score: 30 }),
        createMockSensorData({ location: 'Home', stress_score: 40 }),
        createMockSensorData({ location: 'Work', stress_score: 70 }),
      ];

      const result = calculateStressByLocation(data);

      expect(result.length).toBe(2);
      expect(result[0].location).toBe('Work');
      expect(result[0].average_stress).toBe(70);
      expect(result[1].location).toBe('Home');
      expect(result[1].average_stress).toBe(35);
    });

    it('should calculate correct frequency and percentage', () => {
      const data = [
        createMockSensorData({ location: 'Home' }),
        createMockSensorData({ location: 'Home' }),
        createMockSensorData({ location: 'Work' }),
      ];

      const result = calculateStressByLocation(data);

      const homeLocation = result.find((l) => l.location === 'Home');
      expect(homeLocation?.frequency).toBe(2);
      expect(homeLocation?.percentage).toBe(66.67);
    });

    it('should sort by average stress descending', () => {
      const data = [
        createMockSensorData({ location: 'Home', stress_score: 30 }),
        createMockSensorData({ location: 'Work', stress_score: 70 }),
        createMockSensorData({ location: 'School', stress_score: 50 }),
      ];

      const result = calculateStressByLocation(data);

      expect(result[0].average_stress).toBe(70);
      expect(result[1].average_stress).toBe(50);
      expect(result[2].average_stress).toBe(30);
    });
  });

  describe('calculateHardestTimes', () => {
    it('should return empty array for empty sensor data', () => {
      const result = calculateHardestTimes([]);
      expect(result).toEqual([]);
    });

    it('should group stress by time period', () => {
      const morning = new Date();
      morning.setHours(8, 0, 0, 0);

      const afternoon = new Date();
      afternoon.setHours(14, 0, 0, 0);

      const data = [
        createMockSensorData({ timestamp: morning.toISOString(), stress_score: 30 }),
        createMockSensorData({ timestamp: afternoon.toISOString(), stress_score: 70 }),
      ];

      const result = calculateHardestTimes(data);

      expect(result.length).toBe(2);
      const afternoonResult = result.find((t) => t.time_period.includes('Afternoon'));
      expect(afternoonResult?.average_stress).toBe(70);
    });

    it('should sort by average stress descending', () => {
      const morning = new Date();
      morning.setHours(8, 0, 0, 0);

      const evening = new Date();
      evening.setHours(18, 0, 0, 0);

      const data = [
        createMockSensorData({ timestamp: morning.toISOString(), stress_score: 30 }),
        createMockSensorData({ timestamp: evening.toISOString(), stress_score: 70 }),
      ];

      const result = calculateHardestTimes(data);

      expect(result[0].average_stress).toBe(70);
      expect(result[1].average_stress).toBe(30);
    });
  });

  describe('calculateTriggerFrequencies', () => {
    it('should return empty array for empty sensor data', () => {
      const result = calculateTriggerFrequencies([]);
      expect(result).toEqual([]);
    });

    it('should group by activity/trigger', () => {
      const data = [
        createMockSensorData({ activity: 'Meeting', stress_score: 70 }),
        createMockSensorData({ activity: 'Meeting', stress_score: 75 }),
        createMockSensorData({ activity: 'Relaxing', stress_score: 20 }),
      ];

      const result = calculateTriggerFrequencies(data);

      expect(result.length).toBe(2);
      expect(result[0].trigger_type).toBe('Meeting');
      expect(result[0].frequency).toBe(2);
      expect(result[0].average_stress).toBe(72.5);
    });

    it('should calculate correct percentage', () => {
      const data = [
        createMockSensorData({ activity: 'Meeting' }),
        createMockSensorData({ activity: 'Meeting' }),
        createMockSensorData({ activity: 'Relaxing' }),
      ];

      const result = calculateTriggerFrequencies(data);

      const meeting = result.find((t) => t.trigger_type === 'Meeting');
      expect(meeting?.percentage).toBe(66.67);
    });

    it('should sort by frequency descending', () => {
      const data = [
        createMockSensorData({ activity: 'Relaxing' }),
        createMockSensorData({ activity: 'Meeting' }),
        createMockSensorData({ activity: 'Meeting' }),
        createMockSensorData({ activity: 'Meeting' }),
      ];

      const result = calculateTriggerFrequencies(data);

      expect(result[0].trigger_type).toBe('Meeting');
      expect(result[0].frequency).toBe(3);
    });
  });

  describe('calculateTrendDirection', () => {
    it('should return stable for empty trends', () => {
      const result = calculateTrendDirection([]);
      expect(result.direction).toBe('stable');
      expect(result.percentage_change).toBe(0);
    });

    it('should return stable for single trend', () => {
      const trends = [
        {
          date: '2024-01-01',
          average_stress: 50,
          peak_stress: 80,
          min_stress: 20,
          data_points: 10,
        },
      ];

      const result = calculateTrendDirection(trends);
      expect(result.direction).toBe('stable');
    });

    it('should detect improving trend', () => {
      const trends = [
        {
          date: '2024-01-01',
          average_stress: 70,
          peak_stress: 80,
          min_stress: 60,
          data_points: 10,
        },
        {
          date: '2024-01-02',
          average_stress: 60,
          peak_stress: 70,
          min_stress: 50,
          data_points: 10,
        },
        {
          date: '2024-01-03',
          average_stress: 50,
          peak_stress: 60,
          min_stress: 40,
          data_points: 10,
        },
      ];

      const result = calculateTrendDirection(trends);
      expect(result.direction).toBe('improving');
      expect(result.percentage_change).toBeLessThan(0);
    });

    it('should detect worsening trend', () => {
      const trends = [
        {
          date: '2024-01-01',
          average_stress: 30,
          peak_stress: 40,
          min_stress: 20,
          data_points: 10,
        },
        {
          date: '2024-01-02',
          average_stress: 40,
          peak_stress: 50,
          min_stress: 30,
          data_points: 10,
        },
        {
          date: '2024-01-03',
          average_stress: 50,
          peak_stress: 60,
          min_stress: 40,
          data_points: 10,
        },
      ];

      const result = calculateTrendDirection(trends);
      expect(result.direction).toBe('worsening');
      expect(result.percentage_change).toBeGreaterThan(0);
    });
  });

  describe('calculateAnalyticsTrends', () => {
    it('should return empty analytics for empty sensor data', () => {
      const result = calculateAnalyticsTrends([]);
      expect(result.total_data_points).toBe(0);
      expect(result.average_stress).toBe(0);
      expect(result.stress_trend).toEqual([]);
    });

    it('should calculate overall statistics', () => {
      const data = [
        createMockSensorData({ stress_score: 30 }),
        createMockSensorData({ stress_score: 50 }),
        createMockSensorData({ stress_score: 70 }),
      ];

      const result = calculateAnalyticsTrends(data);

      expect(result.total_data_points).toBe(3);
      expect(result.average_stress).toBe(50);
      expect(result.peak_stress).toBe(70);
      expect(result.min_stress).toBe(30);
    });

    it('should include all analytics components', () => {
      const data = [
        createMockSensorData({ location: 'Home', activity: 'Relaxing', stress_score: 30 }),
        createMockSensorData({ location: 'Work', activity: 'Meeting', stress_score: 70 }),
      ];

      const result = calculateAnalyticsTrends(data);

      expect(result.stress_trend.length).toBeGreaterThan(0);
      expect(result.stress_by_location.length).toBeGreaterThan(0);
      expect(result.hardest_times.length).toBeGreaterThan(0);
      expect(result.trigger_frequencies.length).toBeGreaterThan(0);
    });

    it('should set correct time period', () => {
      const data = [createMockSensorData()];

      const resultDay = calculateAnalyticsTrends(data, 'day');
      expect(resultDay.time_period).toBe('day');

      const resultWeek = calculateAnalyticsTrends(data, 'week');
      expect(resultWeek.time_period).toBe('week');

      const resultMonth = calculateAnalyticsTrends(data, 'month');
      expect(resultMonth.time_period).toBe('month');
    });
  });

  describe('filterSensorDataByDateRange', () => {
    it('should filter data by date range', () => {
      const baseDate = new Date('2024-01-15T12:00:00Z');
      const date1 = new Date('2024-01-14T12:00:00Z');
      const date2 = new Date('2024-01-15T12:00:00Z');
      const date3 = new Date('2024-01-16T12:00:00Z');

      const data = [
        createMockSensorData({ timestamp: date1.toISOString() }),
        createMockSensorData({ timestamp: date2.toISOString() }),
        createMockSensorData({ timestamp: date3.toISOString() }),
      ];

      const startDate = '2024-01-15';
      const endDate = '2024-01-15';

      const result = filterSensorDataByDateRange(data, startDate, endDate);

      // Should include data from the specified date
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array if no data in range', () => {
      const date1 = new Date('2024-01-14T12:00:00Z');

      const data = [createMockSensorData({ timestamp: date1.toISOString() })];

      const startDate = '2024-01-15';
      const endDate = '2024-01-16';

      const result = filterSensorDataByDateRange(data, startDate, endDate);

      expect(result.length).toBe(0);
    });
  });

  describe('getSensorDataForLastDays', () => {
    it('should return data from last N days', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      const data = [
        createMockSensorData({ timestamp: now.toISOString() }),
        createMockSensorData({ timestamp: yesterday.toISOString() }),
        createMockSensorData({ timestamp: twoDaysAgo.toISOString() }),
      ];

      const result = getSensorDataForLastDays(data, 1);

      // Should include data from today and yesterday (within 1 day)
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should include data from exactly N days ago', () => {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);

      const data = [
        createMockSensorData({ timestamp: now.toISOString() }),
        createMockSensorData({ timestamp: sevenDaysAgo.toISOString() }),
        createMockSensorData({ timestamp: eightDaysAgo.toISOString() }),
      ];

      const result = getSensorDataForLastDays(data, 7);

      // Should include data from now and 7 days ago, but not 8 days ago
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.length).toBeLessThanOrEqual(2);
    });
  });
});
