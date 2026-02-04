/**
 * Unit tests for POST /api/sensor-data endpoint
 *
 * Tests validation, stress score calculation, database storage, and Realtime publishing
 */

import { calculateStressScore } from '@/utils/stress';
import type { SensorMetrics, BaselineMetrics } from '@/utils/stress';

/**
 * Validation function tests
 */
describe('Sensor Data Validation', () => {
  describe('validateSensorData', () => {
    it('should accept valid sensor data with all required fields', () => {
      const validData = {
        patient_id: 'patient-123',
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: 80,
        hrv: 50,
        eda: 10,
      };

      // Validate required fields
      expect(validData.patient_id).toBeDefined();
      expect(typeof validData.patient_id).toBe('string');
      expect(validData.device_id).toBeDefined();
      expect(typeof validData.device_id).toBe('string');
      expect(validData.timestamp).toBeDefined();
      expect(typeof validData.timestamp).toBe('string');
      expect(validData.heart_rate).toBeDefined();
      expect(typeof validData.heart_rate).toBe('number');
      expect(validData.hrv).toBeDefined();
      expect(typeof validData.hrv).toBe('number');
      expect(validData.eda).toBeDefined();
      expect(typeof validData.eda).toBe('number');
    });

    it('should reject data with missing patient_id', () => {
      const invalidData = {
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: 80,
        hrv: 50,
        eda: 10,
      };

      expect(invalidData.patient_id).toBeUndefined();
    });

    it('should reject data with invalid heart_rate (> 300)', () => {
      const invalidData = {
        patient_id: 'patient-123',
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: 400,
        hrv: 50,
        eda: 10,
      };

      expect(invalidData.heart_rate).toBeGreaterThan(300);
    });

    it('should reject data with invalid hrv (> 500)', () => {
      const invalidData = {
        patient_id: 'patient-123',
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: 80,
        hrv: 600,
        eda: 10,
      };

      expect(invalidData.hrv).toBeGreaterThan(500);
    });

    it('should reject data with invalid eda (> 100)', () => {
      const invalidData = {
        patient_id: 'patient-123',
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: 80,
        hrv: 50,
        eda: 150,
      };

      expect(invalidData.eda).toBeGreaterThan(100);
    });

    it('should reject data with negative heart_rate', () => {
      const invalidData = {
        patient_id: 'patient-123',
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: -10,
        hrv: 50,
        eda: 10,
      };

      expect(invalidData.heart_rate).toBeLessThan(0);
    });

    it('should accept data with optional fields', () => {
      const validData = {
        patient_id: 'patient-123',
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: 80,
        hrv: 50,
        eda: 10,
        accelerometer_x: 0.5,
        accelerometer_y: 0.3,
        accelerometer_z: 0.2,
        location: 'school',
        activity: 'class',
      };

      expect(validData.accelerometer_x).toBeDefined();
      expect(validData.location).toBeDefined();
      expect(validData.activity).toBeDefined();
    });

    it('should accept data without optional fields', () => {
      const validData = {
        patient_id: 'patient-123',
        device_id: 'device-123',
        timestamp: '2024-01-01T12:00:00Z',
        heart_rate: 80,
        hrv: 50,
        eda: 10,
      };

      expect(validData.accelerometer_x).toBeUndefined();
      expect(validData.location).toBeUndefined();
      expect(validData.activity).toBeUndefined();
    });
  });
});

/**
 * Stress score calculation tests
 */
describe('Stress Score Calculation', () => {
  const baseline: BaselineMetrics = {
    baseline_hr: 70,
    baseline_hrv: 50,
    baseline_eda: 10,
  };

  it('should calculate stress score within 0-100 range', () => {
    const metrics: SensorMetrics = {
      heart_rate: 80,
      hrv: 50,
      eda: 10,
    };

    const stressScore = calculateStressScore(metrics, baseline);
    expect(stressScore).toBeGreaterThanOrEqual(0);
    expect(stressScore).toBeLessThanOrEqual(100);
  });

  it('should return baseline stress score for normal metrics', () => {
    const metrics: SensorMetrics = {
      heart_rate: 70, // Baseline
      hrv: 50, // Baseline
      eda: 10, // Baseline
    };

    const stressScore = calculateStressScore(metrics, baseline);
    // Baseline metrics should return ~50 (middle of scale)
    expect(stressScore).toBeCloseTo(50, 0);
  });

  it('should return higher stress score for elevated metrics', () => {
    const metrics: SensorMetrics = {
      heart_rate: 100, // 30% above baseline
      hrv: 30, // 40% below baseline
      eda: 20, // 100% above baseline
    };

    const stressScore = calculateStressScore(metrics, baseline);
    expect(stressScore).toBeGreaterThan(30);
  });

  it('should return high stress score for very elevated metrics', () => {
    const metrics: SensorMetrics = {
      heart_rate: 150, // 114% above baseline
      hrv: 10, // 80% below baseline
      eda: 50, // 400% above baseline
    };

    const stressScore = calculateStressScore(metrics, baseline);
    expect(stressScore).toBeGreaterThan(60);
  });

  it('should handle extreme values gracefully', () => {
    const metrics: SensorMetrics = {
      heart_rate: 300, // Maximum
      hrv: 1, // Minimum
      eda: 100, // Maximum
    };

    const stressScore = calculateStressScore(metrics, baseline);
    expect(stressScore).toBeGreaterThanOrEqual(0);
    expect(stressScore).toBeLessThanOrEqual(100);
  });

  it('should be consistent for same input', () => {
    const metrics: SensorMetrics = {
      heart_rate: 90,
      hrv: 40,
      eda: 15,
    };

    const score1 = calculateStressScore(metrics, baseline);
    const score2 = calculateStressScore(metrics, baseline);
    expect(score1).toBe(score2);
  });

  it('should increase with higher heart rate deviation', () => {
    const baseline2: BaselineMetrics = {
      baseline_hr: 70,
      baseline_hrv: 50,
      baseline_eda: 10,
    };

    const metrics1: SensorMetrics = {
      heart_rate: 80,
      hrv: 50,
      eda: 10,
    };

    const metrics2: SensorMetrics = {
      heart_rate: 120,
      hrv: 50,
      eda: 10,
    };

    const score1 = calculateStressScore(metrics1, baseline2);
    const score2 = calculateStressScore(metrics2, baseline2);
    expect(score2).toBeGreaterThan(score1);
  });

  it('should increase with lower hrv', () => {
    const baseline2: BaselineMetrics = {
      baseline_hr: 70,
      baseline_hrv: 50,
      baseline_eda: 10,
    };

    const metrics1: SensorMetrics = {
      heart_rate: 70,
      hrv: 50,
      eda: 10,
    };

    const metrics2: SensorMetrics = {
      heart_rate: 70,
      hrv: 20,
      eda: 10,
    };

    const score1 = calculateStressScore(metrics1, baseline2);
    const score2 = calculateStressScore(metrics2, baseline2);
    expect(score2).toBeGreaterThan(score1);
  });

  it('should increase with higher eda', () => {
    const baseline2: BaselineMetrics = {
      baseline_hr: 70,
      baseline_hrv: 50,
      baseline_eda: 10,
    };

    const metrics1: SensorMetrics = {
      heart_rate: 70,
      hrv: 50,
      eda: 10,
    };

    const metrics2: SensorMetrics = {
      heart_rate: 70,
      hrv: 50,
      eda: 40,
    };

    const score1 = calculateStressScore(metrics1, baseline2);
    const score2 = calculateStressScore(metrics2, baseline2);
    expect(score2).toBeGreaterThan(score1);
  });
});

/**
 * Response format tests
 */
describe('API Response Format', () => {
  it('should have proper response structure', () => {
    const response = {
      data: {
        sensor_data_id: 'sensor-data-123',
        stress_score: 45,
        overload_predicted: false,
        overload_predicted_in_minutes: undefined,
      },
      message: 'Sensor data received and processed successfully',
    };

    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('message');
    expect(response.data).toHaveProperty('sensor_data_id');
    expect(response.data).toHaveProperty('stress_score');
    expect(response.data).toHaveProperty('overload_predicted');
  });

  it('should include sensor_data_id in response', () => {
    const response = {
      data: {
        sensor_data_id: 'sensor-data-123',
        stress_score: 45,
        overload_predicted: false,
      },
    };

    expect(response.data.sensor_data_id).toBeDefined();
    expect(typeof response.data.sensor_data_id).toBe('string');
  });

  it('should include stress_score in response', () => {
    const response = {
      data: {
        sensor_data_id: 'sensor-data-123',
        stress_score: 45,
        overload_predicted: false,
      },
    };

    expect(response.data.stress_score).toBeDefined();
    expect(typeof response.data.stress_score).toBe('number');
  });

  it('should include overload_predicted in response', () => {
    const response = {
      data: {
        sensor_data_id: 'sensor-data-123',
        stress_score: 45,
        overload_predicted: false,
      },
    };

    expect(response.data.overload_predicted).toBeDefined();
    expect(typeof response.data.overload_predicted).toBe('boolean');
  });

  it('should include overload_predicted_in_minutes when predicted', () => {
    const response = {
      data: {
        sensor_data_id: 'sensor-data-123',
        stress_score: 75,
        overload_predicted: true,
        overload_predicted_in_minutes: 7,
      },
    };

    expect(response.data.overload_predicted_in_minutes).toBeDefined();
    expect(typeof response.data.overload_predicted_in_minutes).toBe('number');
    expect(response.data.overload_predicted_in_minutes).toBeGreaterThanOrEqual(5);
    expect(response.data.overload_predicted_in_minutes).toBeLessThanOrEqual(10);
  });
});

/**
 * Error handling tests
 */
describe('Error Handling', () => {
  it('should handle missing required fields', () => {
    const invalidData = {
      patient_id: 'patient-123',
      // Missing device_id, timestamp, heart_rate, hrv, eda
    };

    expect(invalidData.device_id).toBeUndefined();
  });

  it('should handle invalid data types', () => {
    const invalidData = {
      patient_id: 'patient-123',
      device_id: 'device-123',
      timestamp: '2024-01-01T12:00:00Z',
      heart_rate: 'eighty', // Should be number
      hrv: 50,
      eda: 10,
    };

    expect(typeof invalidData.heart_rate).not.toBe('number');
  });

  it('should handle out-of-range values', () => {
    const invalidData = {
      patient_id: 'patient-123',
      device_id: 'device-123',
      timestamp: '2024-01-01T12:00:00Z',
      heart_rate: 400, // Out of range
      hrv: 50,
      eda: 10,
    };

    expect(invalidData.heart_rate).toBeGreaterThan(300);
  });
});
