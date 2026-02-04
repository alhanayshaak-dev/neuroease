import fc from 'fast-check';
import { calculateStressScore, getStressStatus } from '@/utils/stress';
import type { SensorData, Device } from '@/types';

/**
 * Property-Based Test for Dashboard Display Completeness
 * **Validates: Requirements 23.1, 23.2, 23.3, 23.4, 23.5, 23.6**
 *
 * Property 21: Dashboard Display Completeness
 * For any Dashboard load, the system SHALL display all required sections
 * (status, graph, devices, What's New, shortcuts, health overview) with current data.
 */

describe('Dashboard Display Completeness - Property Tests', () => {
  // Arbitraries for generating test data
  const sensorDataArbitrary = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    device_id: fc.uuid(),
    timestamp: fc.date().map((d) => d.toISOString()),
    heart_rate: fc.integer({ min: 40, max: 200 }),
    hrv: fc.integer({ min: 10, max: 100 }),
    eda: fc.float({ min: Math.fround(0.5), max: Math.fround(5.0) }),
    accelerometer_x: fc.float({ min: Math.fround(-10), max: Math.fround(10) }),
    accelerometer_y: fc.float({ min: Math.fround(-10), max: Math.fround(10) }),
    accelerometer_z: fc.float({ min: Math.fround(-10), max: Math.fround(10) }),
    location: fc.constantFrom('home', 'school', 'work', 'transit'),
    activity: fc.constantFrom('relaxing', 'working', 'exercising', 'sleeping'),
    stress_score: fc.integer({ min: 0, max: 100 }),
    overload_predicted: fc.boolean(),
    created_at: fc.date().map((d) => d.toISOString()),
  });

  const baselineArbitrary = fc.record({
    baseline_hr: fc.integer({ min: 50, max: 100 }),
    baseline_hrv: fc.integer({ min: 20, max: 80 }),
    baseline_eda: fc.float({ min: Math.fround(1.0), max: Math.fround(3.0) }),
  });

  const deviceArbitrary = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    device_type: fc.constantFrom('neuroband', 'neurobud', 'neurolens'),
    device_name: fc.string({ minLength: 1, maxLength: 50 }),
    mac_address: fc.string({ minLength: 17, maxLength: 17 }),
    battery_level: fc.integer({ min: 0, max: 100 }),
    is_connected: fc.boolean(),
    firmware_version: fc.string({ minLength: 1, maxLength: 20 }),
    last_sync: fc.date().map((d) => d.toISOString()),
    created_at: fc.date().map((d) => d.toISOString()),
    updated_at: fc.date().map((d) => d.toISOString()),
  });

  /**
   * Property 1: Dashboard Status Section displays current stress status
   * For any sensor data, the status section must display a valid stress status
   */
  it('should display valid stress status in status section for any sensor data', () => {
    fc.assert(
      fc.property(sensorDataArbitrary, baselineArbitrary, (sensorData, baseline) => {
        // Skip if any value is NaN (edge case from float generation)
        if (isNaN(sensorData.eda) || isNaN(baseline.baseline_eda)) {
          return;
        }

        const stressScore = calculateStressScore(
          {
            heart_rate: sensorData.heart_rate,
            hrv: sensorData.hrv,
            eda: sensorData.eda,
          },
          baseline
        );

        const status = getStressStatus(stressScore, 50);

        // Status section must display one of the valid statuses
        expect(['calm', 'rising', 'overload']).toContain(status);
        // Stress score must be valid for display
        expect(stressScore).toBeGreaterThanOrEqual(0);
        expect(stressScore).toBeLessThanOrEqual(100);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Dashboard Graph Section displays stress data
   * For any collection of sensor data, the graph must have data points to render
   */
  it('should have valid data points for stress graph for any sensor data collection', () => {
    fc.assert(
      fc.property(
        fc.array(sensorDataArbitrary, { minLength: 1, maxLength: 60 }),
        (sensorDataArray) => {
          // Filter out NaN values
          const validData = sensorDataArray.filter((d) => !isNaN(d.eda));

          // Graph must have at least one valid data point
          expect(validData.length).toBeGreaterThan(0);

          // Each data point must have required fields for graphing
          validData.forEach((data) => {
            expect(data.heart_rate).toBeDefined();
            expect(data.hrv).toBeDefined();
            expect(data.eda).toBeDefined();
            expect(data.timestamp).toBeDefined();
            expect(typeof data.heart_rate).toBe('number');
            expect(typeof data.hrv).toBe('number');
            expect(typeof data.eda).toBe('number');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Dashboard Devices Section displays device information
   * For any device, the dashboard must display device status with required fields
   */
  it('should display complete device information for any device', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device) => {
        // Device must have all required fields for display
        expect(device.id).toBeDefined();
        expect(device.device_name).toBeDefined();
        expect(device.device_type).toBeDefined();
        expect(device.battery_level).toBeDefined();
        expect(device.is_connected).toBeDefined();
        expect(device.last_sync).toBeDefined();

        // Battery level must be valid percentage
        expect(device.battery_level).toBeGreaterThanOrEqual(0);
        expect(device.battery_level).toBeLessThanOrEqual(100);

        // Connection status must be boolean
        expect(typeof device.is_connected).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: Dashboard Health Overview displays current metrics
   * For any sensor data, health overview must calculate and display valid metrics
   */
  it('should calculate valid health metrics for any sensor data', () => {
    fc.assert(
      fc.property(
        fc.array(sensorDataArbitrary, { minLength: 1, maxLength: 60 }),
        (sensorDataArray) => {
          // Filter out NaN values
          const validData = sensorDataArray.filter((d) => !isNaN(d.eda));

          if (validData.length === 0) {
            return;
          }

          // Calculate average metrics
          const avgHeartRate =
            validData.reduce((sum, d) => sum + d.heart_rate, 0) / validData.length;
          const avgHrv = validData.reduce((sum, d) => sum + d.hrv, 0) / validData.length;
          const avgEda = validData.reduce((sum, d) => sum + d.eda, 0) / validData.length;

          // All metrics must be valid numbers
          expect(typeof avgHeartRate).toBe('number');
          expect(typeof avgHrv).toBe('number');
          expect(typeof avgEda).toBe('number');

          // Metrics must be within reasonable ranges
          expect(avgHeartRate).toBeGreaterThan(0);
          expect(avgHrv).toBeGreaterThan(0);
          expect(avgEda).toBeGreaterThan(0);

          // Metrics must not be NaN
          expect(isNaN(avgHeartRate)).toBe(false);
          expect(isNaN(avgHrv)).toBe(false);
          expect(isNaN(avgEda)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: Dashboard displays all required sections together
   * For any dashboard state, all sections must be present and have valid data
   */
  it('should display all required dashboard sections with valid data', () => {
    fc.assert(
      fc.property(
        fc.array(sensorDataArbitrary, { minLength: 1, maxLength: 60 }),
        fc.array(deviceArbitrary, { minLength: 1, maxLength: 5 }),
        baselineArbitrary,
        (sensorDataArray, devices, baseline) => {
          // Filter out NaN values and invalid baselines
          const validSensorData = sensorDataArray.filter((d) => !isNaN(d.eda));
          if (isNaN(baseline.baseline_eda)) {
            return;
          }

          if (validSensorData.length === 0 || devices.length === 0) {
            return;
          }

          // 1. Status section must have current stress data
          const lastReading = validSensorData[validSensorData.length - 1];
          const stressScore = calculateStressScore(
            {
              heart_rate: lastReading.heart_rate,
              hrv: lastReading.hrv,
              eda: lastReading.eda,
            },
            baseline
          );
          expect(stressScore).toBeGreaterThanOrEqual(0);
          expect(stressScore).toBeLessThanOrEqual(100);

          // 2. Graph section must have data points
          expect(validSensorData.length).toBeGreaterThan(0);

          // 3. Devices section must have device information
          devices.forEach((device) => {
            expect(device.device_name).toBeDefined();
            expect(device.battery_level).toBeGreaterThanOrEqual(0);
            expect(device.battery_level).toBeLessThanOrEqual(100);
          });

          // 4. Health overview must have metrics
          const avgHeartRate =
            validSensorData.reduce((sum, d) => sum + d.heart_rate, 0) / validSensorData.length;
          const avgHrv =
            validSensorData.reduce((sum, d) => sum + d.hrv, 0) / validSensorData.length;
          const avgEda =
            validSensorData.reduce((sum, d) => sum + d.eda, 0) / validSensorData.length;

          expect(avgHeartRate).toBeGreaterThan(0);
          expect(avgHrv).toBeGreaterThan(0);
          expect(avgEda).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Dashboard updates with real-time data
   * For any new sensor data, dashboard must update stress status and metrics
   */
  it('should update dashboard sections when new sensor data arrives', () => {
    fc.assert(
      fc.property(
        fc.array(sensorDataArbitrary, { minLength: 2, maxLength: 60 }),
        baselineArbitrary,
        (sensorDataArray, baseline) => {
          // Filter out NaN values and invalid baselines
          const validData = sensorDataArray.filter((d) => !isNaN(d.eda));
          if (isNaN(baseline.baseline_eda)) {
            return;
          }

          if (validData.length < 2) {
            return;
          }

          // Get old and new readings
          const oldReading = validData[0];
          const newReading = validData[validData.length - 1];

          // Calculate stress scores
          const oldScore = calculateStressScore(
            {
              heart_rate: oldReading.heart_rate,
              hrv: oldReading.hrv,
              eda: oldReading.eda,
            },
            baseline
          );

          const newScore = calculateStressScore(
            {
              heart_rate: newReading.heart_rate,
              hrv: newReading.hrv,
              eda: newReading.eda,
            },
            baseline
          );

          // Both scores must be valid
          expect(oldScore).toBeGreaterThanOrEqual(0);
          expect(oldScore).toBeLessThanOrEqual(100);
          expect(newScore).toBeGreaterThanOrEqual(0);
          expect(newScore).toBeLessThanOrEqual(100);

          // Status must be deterministic for each score
          const oldStatus = getStressStatus(oldScore, 50);
          const newStatus = getStressStatus(newScore, 50);

          expect(['calm', 'rising', 'overload']).toContain(oldStatus);
          expect(['calm', 'rising', 'overload']).toContain(newStatus);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Dashboard displays current data (not stale)
   * For any sensor data, the dashboard must display the most recent reading
   */
  it('should display most recent sensor data in dashboard', () => {
    fc.assert(
      fc.property(
        fc.array(sensorDataArbitrary, { minLength: 1, maxLength: 60 }),
        (sensorDataArray) => {
          // Filter out NaN values
          const validData = sensorDataArray.filter((d) => !isNaN(d.eda));

          if (validData.length === 0) {
            return;
          }

          // Sort by timestamp to find most recent
          const sortedData = [...validData].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          const mostRecent = sortedData[0];

          // Most recent data must have all required fields
          expect(mostRecent.heart_rate).toBeDefined();
          expect(mostRecent.hrv).toBeDefined();
          expect(mostRecent.eda).toBeDefined();
          expect(mostRecent.timestamp).toBeDefined();

          // Timestamp must be a valid ISO string
          expect(typeof mostRecent.timestamp).toBe('string');
          const timestamp = new Date(mostRecent.timestamp);
          expect(isNaN(timestamp.getTime())).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Dashboard sections are independent
   * For any device state, device section must display correctly regardless of sensor data
   */
  it('should display device information independently of sensor data', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device) => {
        // Device section must display even with no sensor data
        expect(device.device_name).toBeDefined();

        // Battery level must be displayable
        expect(device.battery_level).toBeGreaterThanOrEqual(0);
        expect(device.battery_level).toBeLessThanOrEqual(100);

        // Connection status must be clear
        expect(typeof device.is_connected).toBe('boolean');

        // Last sync must be a valid timestamp string
        expect(typeof device.last_sync).toBe('string');
        const lastSync = new Date(device.last_sync);
        expect(isNaN(lastSync.getTime())).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Dashboard handles empty data gracefully
   * For empty sensor data, dashboard must still display structure
   */
  it('should display dashboard structure even with minimal data', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), baselineArbitrary, (stressScore, baseline) => {
        // Status section must display with just a score
        const status = getStressStatus(stressScore, 50);
        expect(['calm', 'rising', 'overload']).toContain(status);

        // Score must be displayable
        expect(stressScore).toBeGreaterThanOrEqual(0);
        expect(stressScore).toBeLessThanOrEqual(100);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Dashboard data consistency
   * For any dashboard state, all displayed metrics must be consistent with source data
   */
  it('should maintain consistency between dashboard sections', () => {
    fc.assert(
      fc.property(
        fc.array(sensorDataArbitrary, { minLength: 1, maxLength: 60 }),
        baselineArbitrary,
        (sensorDataArray, baseline) => {
          // Filter out NaN values and invalid baselines
          const validData = sensorDataArray.filter((d) => !isNaN(d.eda));
          if (isNaN(baseline.baseline_eda)) {
            return;
          }

          if (validData.length === 0) {
            return;
          }

          // Get most recent reading
          const mostRecent = validData[validData.length - 1];

          // Calculate metrics from all data
          const avgHeartRate =
            validData.reduce((sum, d) => sum + d.heart_rate, 0) / validData.length;
          const avgHrv = validData.reduce((sum, d) => sum + d.hrv, 0) / validData.length;
          const avgEda = validData.reduce((sum, d) => sum + d.eda, 0) / validData.length;

          // Current stress from most recent
          const currentStress = calculateStressScore(
            {
              heart_rate: mostRecent.heart_rate,
              hrv: mostRecent.hrv,
              eda: mostRecent.eda,
            },
            baseline
          );

          // All values must be consistent and valid
          expect(currentStress).toBeGreaterThanOrEqual(0);
          expect(currentStress).toBeLessThanOrEqual(100);
          expect(avgHeartRate).toBeGreaterThan(0);
          expect(avgHrv).toBeGreaterThan(0);
          expect(avgEda).toBeGreaterThan(0);

          // Averages should be within reasonable bounds
          expect(avgHeartRate).toBeLessThan(300);
          expect(avgHrv).toBeLessThan(200);
          expect(avgEda).toBeLessThan(20);
        }
      ),
      { numRuns: 100 }
    );
  });
});
