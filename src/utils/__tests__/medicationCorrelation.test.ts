/**
 * Unit tests for medication-stress correlation utilities
 */

import {
  calculateMedicationAdherence,
  calculateOnTimeRate,
  calculateAverageStressForTimestamps,
  calculatePearsonCorrelation,
  analyzeMedicationStressCorrelation,
  getMedicationImpactSummary,
} from '../medicationCorrelation';
import { Database } from '@/types/database';

type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];
type MedicationLog = {
  id: string;
  medication_id: string;
  medication_name: string;
  taken_at: string;
  scheduled_time: string;
  on_time: boolean;
  timestamp: number;
};

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

// Helper to create mock medication log
function createMockMedicationLog(
  overrides: Partial<MedicationLog> = {}
): MedicationLog {
  const now = Date.now();
  return {
    id: `med_${Math.random()}`,
    medication_id: 'med_1',
    medication_name: 'Medication A',
    taken_at: new Date(now).toISOString(),
    scheduled_time: new Date(now).toISOString(),
    on_time: true,
    timestamp: now,
    ...overrides,
  };
}

describe('Medication Correlation Utilities', () => {
  describe('calculateMedicationAdherence', () => {
    it('should return 0 for no scheduled doses', () => {
      const logs: MedicationLog[] = [];
      const result = calculateMedicationAdherence(logs, 0);
      expect(result).toBe(0);
    });

    it('should calculate adherence rate correctly', () => {
      const logs = [
        createMockMedicationLog({ on_time: true }),
        createMockMedicationLog({ on_time: true }),
        createMockMedicationLog({ on_time: false }),
      ];

      const result = calculateMedicationAdherence(logs, 3);
      expect(result).toBeCloseTo(66.67, 1);
    });

    it('should return 100 for perfect adherence', () => {
      const logs = [
        createMockMedicationLog({ on_time: true }),
        createMockMedicationLog({ on_time: true }),
      ];

      const result = calculateMedicationAdherence(logs, 2);
      expect(result).toBe(100);
    });

    it('should return 0 for no doses taken', () => {
      const logs = [
        createMockMedicationLog({ on_time: false }),
        createMockMedicationLog({ on_time: false }),
      ];

      const result = calculateMedicationAdherence(logs, 2);
      expect(result).toBe(0);
    });
  });

  describe('calculateOnTimeRate', () => {
    it('should return 0 for empty logs', () => {
      const result = calculateOnTimeRate([]);
      expect(result).toBe(0);
    });

    it('should calculate on-time rate correctly', () => {
      const logs = [
        createMockMedicationLog({ on_time: true }),
        createMockMedicationLog({ on_time: true }),
        createMockMedicationLog({ on_time: false }),
      ];

      const result = calculateOnTimeRate(logs);
      expect(result).toBeCloseTo(66.67, 1);
    });

    it('should return 100 for all on-time doses', () => {
      const logs = [
        createMockMedicationLog({ on_time: true }),
        createMockMedicationLog({ on_time: true }),
      ];

      const result = calculateOnTimeRate(logs);
      expect(result).toBe(100);
    });
  });

  describe('calculateAverageStressForTimestamps', () => {
    it('should return 0 for empty timestamps', () => {
      const sensorData = [createMockSensorData()];
      const result = calculateAverageStressForTimestamps(sensorData, []);
      expect(result).toBe(0);
    });

    it('should calculate average stress for timestamps', () => {
      const now = Date.now();
      const sensorData = [
        createMockSensorData({
          timestamp: new Date(now).toISOString(),
          stress_score: 30,
        }),
        createMockSensorData({
          timestamp: new Date(now + 30 * 60 * 1000).toISOString(),
          stress_score: 40,
        }),
      ];

      const result = calculateAverageStressForTimestamps(sensorData, [now]);
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 if no data within time window', () => {
      const now = Date.now();
      const sensorData = [
        createMockSensorData({
          timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        }),
      ];

      const result = calculateAverageStressForTimestamps(sensorData, [now]);
      expect(result).toBe(0);
    });
  });

  describe('calculatePearsonCorrelation', () => {
    it('should return 0 for empty arrays', () => {
      const result = calculatePearsonCorrelation([], []);
      expect(result).toBe(0);
    });

    it('should return 0 for mismatched array lengths', () => {
      const result = calculatePearsonCorrelation([1, 2, 3], [1, 2]);
      expect(result).toBe(0);
    });

    it('should calculate positive correlation', () => {
      const adherence = [100, 100, 50, 50];
      const stress = [20, 25, 60, 65];

      const result = calculatePearsonCorrelation(adherence, stress);
      expect(result).toBeLessThan(0); // Negative correlation (high adherence = low stress)
    });

    it('should calculate correlation between -1 and 1', () => {
      const adherence = [100, 80, 60, 40, 20];
      const stress = [30, 40, 50, 60, 70];

      const result = calculatePearsonCorrelation(adherence, stress);
      expect(result).toBeGreaterThanOrEqual(-1);
      expect(result).toBeLessThanOrEqual(1);
    });
  });

  describe('analyzeMedicationStressCorrelation', () => {
    it('should return empty analysis for no data', () => {
      const result = analyzeMedicationStressCorrelation([], [], 0);

      expect(result.overall_adherence_rate).toBe(0);
      expect(result.overall_on_time_rate).toBe(0);
      expect(result.medications).toEqual([]);
    });

    it('should calculate overall statistics', () => {
      const now = Date.now();
      const logs = [
        createMockMedicationLog({
          medication_name: 'Med A',
          on_time: true,
          timestamp: now,
        }),
        createMockMedicationLog({
          medication_name: 'Med A',
          on_time: false,
          timestamp: now + 24 * 60 * 60 * 1000,
        }),
      ];

      const sensorData = [
        createMockSensorData({
          timestamp: new Date(now).toISOString(),
          stress_score: 30,
        }),
        createMockSensorData({
          timestamp: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
          stress_score: 70,
        }),
      ];

      const result = analyzeMedicationStressCorrelation(logs, sensorData, 2);

      expect(result.overall_adherence_rate).toBe(50);
      expect(result.overall_on_time_rate).toBe(50);
      expect(result.medications.length).toBe(1);
    });

    it('should identify positive stress impact', () => {
      const now = Date.now();
      const logs = [
        createMockMedicationLog({
          medication_name: 'Med A',
          on_time: true,
          timestamp: now,
        }),
        createMockMedicationLog({
          medication_name: 'Med A',
          on_time: false,
          timestamp: now + 24 * 60 * 60 * 1000,
        }),
      ];

      const sensorData = [
        createMockSensorData({
          timestamp: new Date(now).toISOString(),
          stress_score: 20,
        }),
        createMockSensorData({
          timestamp: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
          stress_score: 80,
        }),
      ];

      const result = analyzeMedicationStressCorrelation(logs, sensorData, 2);

      expect(result.stress_impact).toBe('positive');
      expect(result.stress_reduction_percentage).toBeGreaterThan(0);
    });

    it('should group medications correctly', () => {
      const now = Date.now();
      const logs = [
        createMockMedicationLog({
          medication_name: 'Med A',
          on_time: true,
          timestamp: now,
        }),
        createMockMedicationLog({
          medication_name: 'Med B',
          on_time: true,
          timestamp: now,
        }),
      ];

      const sensorData = [createMockSensorData()];

      const result = analyzeMedicationStressCorrelation(logs, sensorData, 2);

      expect(result.medications.length).toBe(2);
      expect(result.medications.map((m) => m.medication_name)).toContain('Med A');
      expect(result.medications.map((m) => m.medication_name)).toContain('Med B');
    });
  });

  describe('getMedicationImpactSummary', () => {
    it('should return positive impact message', () => {
      const analysis = {
        overall_adherence_rate: 100,
        overall_on_time_rate: 100,
        average_stress_with_adherence: 30,
        average_stress_without_adherence: 70,
        correlation_coefficient: -0.8,
        medications: [],
        stress_impact: 'positive' as const,
        stress_reduction_percentage: 57.14,
      };

      const result = getMedicationImpactSummary(analysis);
      expect(result).toContain('reduces your stress');
      expect(result).toContain('57.1');
    });

    it('should return negative impact message', () => {
      const analysis = {
        overall_adherence_rate: 100,
        overall_on_time_rate: 100,
        average_stress_with_adherence: 70,
        average_stress_without_adherence: 30,
        correlation_coefficient: 0.8,
        medications: [],
        stress_impact: 'negative' as const,
        stress_reduction_percentage: -133.33,
      };

      const result = getMedicationImpactSummary(analysis);
      expect(result).toContain('higher');
      expect(result).toContain('healthcare provider');
    });

    it('should return neutral impact message', () => {
      const analysis = {
        overall_adherence_rate: 50,
        overall_on_time_rate: 50,
        average_stress_with_adherence: 50,
        average_stress_without_adherence: 50,
        correlation_coefficient: 0,
        medications: [],
        stress_impact: 'neutral' as const,
        stress_reduction_percentage: 0,
      };

      const result = getMedicationImpactSummary(analysis);
      expect(result).toContain('neutral');
      expect(result).toContain('monitoring');
    });
  });
});
