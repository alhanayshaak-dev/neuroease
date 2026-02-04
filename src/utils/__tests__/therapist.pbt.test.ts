/**
 * Property-based tests for therapist collaboration features
 * **Validates: Requirements 25.1, 25.2, 25.3, 25.4, 25.5, 25.6**
 * **Property 23: Therapist Collaboration Data Access**
 */

import fc from 'fast-check';
import {
  calculatePatientInsights,
  calculateAggregatedInsights,
  suggestStrategiesForPatient,
  getPatientsNeedingAttention,
  type PatientInsight,
} from '../therapist';
import type { Database } from '@/types/database';

type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];
type CopingStrategyRow = Database['public']['Tables']['coping_strategies']['Row'];

// Generators for test data
const sensorDataGenerator = (): fc.Arbitrary<SensorDataRow> => {
  return fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    device_id: fc.uuid(),
    timestamp: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
      d.toISOString()
    ),
    heart_rate: fc.integer({ min: 40, max: 150 }),
    hrv: fc.integer({ min: 10, max: 100 }),
    eda: fc.float({ min: 0.5, max: 5.0 }),
    accelerometer_x: fc.float({ min: -10, max: 10 }),
    accelerometer_y: fc.float({ min: -10, max: 10 }),
    accelerometer_z: fc.float({ min: -10, max: 10 }),
    location: fc.constantFrom('home', 'work', 'school', 'transit'),
    activity: fc.constantFrom('relaxing', 'working', 'exercising', 'sleeping'),
    stress_score: fc.integer({ min: 0, max: 100 }),
    overload_predicted: fc.boolean(),
    overload_predicted_in_minutes: fc.option(fc.integer({ min: 1, max: 30 })),
    created_at: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
      d.toISOString()
    ),
  }) as any as fc.Arbitrary<SensorDataRow>;
};

const copingStrategyGenerator = (): fc.Arbitrary<CopingStrategyRow> => {
  return fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    category: fc.constantFrom('breathwork', 'grounding', 'body_awareness', 'sensory', 'other'),
    description: fc.string({ minLength: 1, maxLength: 200 }),
    duration_minutes: fc.integer({ min: 1, max: 60 }),
    success_rate: fc.float({ min: 0, max: 1, noNaN: true }),
    last_used: fc.option(fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
      d.toISOString()
    )),
    times_used: fc.integer({ min: 0, max: 100 }),
    created_by: fc.constantFrom('user', 'system', 'therapist'),
    created_at: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
      d.toISOString()
    ),
  }) as any as fc.Arbitrary<CopingStrategyRow>;
};

describe('Therapist Collaboration - Property-Based Tests', () => {
  describe('Property 23: Therapist Collaboration Data Access', () => {
    it('should calculate patient insights with valid stress levels', () => {
      fc.assert(
        fc.property(
          fc.array(sensorDataGenerator(), { minLength: 1, maxLength: 100 }),
          fc.array(copingStrategyGenerator(), { minLength: 0, maxLength: 10 }),
          (sensorData, strategies) => {
            const insights = calculatePatientInsights(
              'patient-1',
              'Test Patient',
              sensorData,
              strategies
            );

            // Stress level should be one of the valid values
            expect(['calm', 'rising', 'overload']).toContain(insights.current_stress_level);

            // Average stress should be between 0 and 100
            expect(insights.average_stress_score).toBeGreaterThanOrEqual(0);
            expect(insights.average_stress_score).toBeLessThanOrEqual(100);

            // Peak stress should be between 0 and 100
            expect(insights.peak_stress_score).toBeGreaterThanOrEqual(0);
            expect(insights.peak_stress_score).toBeLessThanOrEqual(100);

            // Peak should be >= average
            expect(insights.peak_stress_score).toBeGreaterThanOrEqual(
              insights.average_stress_score
            );

            // Trend direction should be valid
            expect(['improving', 'stable', 'worsening']).toContain(insights.trend_direction);

            // Data points should match input length
            expect(insights.data_points_this_week).toBe(sensorData.length);
          }
        )
      );
    });

    it('should calculate aggregated insights across multiple patients', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              patient_id: fc.uuid(),
              patient_name: fc.string({ minLength: 1, maxLength: 50 }),
              sensorData: fc.array(sensorDataGenerator(), { minLength: 1, maxLength: 50 }),
              strategies: fc.array(copingStrategyGenerator(), { minLength: 0, maxLength: 5 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (patientDataArray) => {
            const insights = patientDataArray.map((patient) =>
              calculatePatientInsights(
                patient.patient_id,
                patient.patient_name,
                patient.sensorData,
                patient.strategies
              )
            );

            const aggregated = calculateAggregatedInsights(insights);

            // Total patients should match input
            expect(aggregated.total_patients).toBe(insights.length);

            // Average stress should be between 0 and 100
            expect(aggregated.average_stress_across_patients).toBeGreaterThanOrEqual(0);
            expect(aggregated.average_stress_across_patients).toBeLessThanOrEqual(100);

            // Patients in overload should not exceed total
            expect(aggregated.patients_in_overload).toBeLessThanOrEqual(aggregated.total_patients);

            // Patients improving should not exceed total
            expect(aggregated.patients_improving).toBeLessThanOrEqual(aggregated.total_patients);

            // Patients worsening should not exceed total
            expect(aggregated.patients_worsening).toBeLessThanOrEqual(aggregated.total_patients);

            // Total data points should be sum of all patient data points
            const expectedTotal = insights.reduce((sum, p) => sum + p.data_points_this_week, 0);
            expect(aggregated.total_data_points).toBe(expectedTotal);
          }
        )
      );
    });

    it('should suggest strategies based on effectiveness', () => {
      fc.assert(
        fc.property(
          fc.record({
            patient_id: fc.uuid(),
            patient_name: fc.string({ minLength: 1, maxLength: 50 }),
            sensorData: fc.array(sensorDataGenerator(), { minLength: 1, maxLength: 50 }),
            strategies: fc.array(copingStrategyGenerator(), { minLength: 1, maxLength: 10 }),
          }),
          (patientData) => {
            const insights = calculatePatientInsights(
              patientData.patient_id,
              patientData.patient_name,
              patientData.sensorData,
              patientData.strategies
            );

            const suggestions = suggestStrategiesForPatient(insights, patientData.strategies);

            // Should suggest up to 3 strategies
            expect(suggestions.length).toBeLessThanOrEqual(3);

            // Should not suggest more than available strategies
            expect(suggestions.length).toBeLessThanOrEqual(patientData.strategies.length);

            // All suggestions should have valid effectiveness scores
            for (const suggestion of suggestions) {
              expect(suggestion.effectiveness_score).toBeGreaterThanOrEqual(0);
              expect(suggestion.effectiveness_score).toBeLessThanOrEqual(1);
            }

            // Suggestions should be sorted by effectiveness (descending)
            for (let i = 1; i < suggestions.length; i++) {
              expect(suggestions[i - 1].effectiveness_score).toBeGreaterThanOrEqual(
                suggestions[i].effectiveness_score
              );
            }
          }
        )
      );
    });

    it('should identify patients needing attention correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              patient_id: fc.uuid(),
              patient_name: fc.string({ minLength: 1, maxLength: 50 }),
              sensorData: fc.array(sensorDataGenerator(), { minLength: 1, maxLength: 50 }),
              strategies: fc.array(copingStrategyGenerator(), { minLength: 0, maxLength: 5 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (patientDataArray) => {
            const insights = patientDataArray.map((patient) =>
              calculatePatientInsights(
                patient.patient_id,
                patient.patient_name,
                patient.sensorData,
                patient.strategies
              )
            );

            const needingAttention = getPatientsNeedingAttention(insights);

            // All patients needing attention should meet at least one criterion
            for (const patient of needingAttention) {
              const meetsOverloadCriterion = patient.current_stress_level === 'overload';
              const meetsWorsening = patient.trend_direction === 'worsening';
              const meetsHighStress = patient.average_stress_score > 70;

              expect(
                meetsOverloadCriterion || meetsWorsening || meetsHighStress
              ).toBe(true);
            }

            // Should not include patients that don't meet any criterion
            for (const patient of insights) {
              const meetsOverloadCriterion = patient.current_stress_level === 'overload';
              const meetsWorsening = patient.trend_direction === 'worsening';
              const meetsHighStress = patient.average_stress_score > 70;

              if (!meetsOverloadCriterion && !meetsWorsening && !meetsHighStress) {
                expect(needingAttention).not.toContainEqual(patient);
              }
            }
          }
        )
      );
    });

    it('should handle empty patient data gracefully', () => {
      fc.assert(
        fc.property(fc.array(copingStrategyGenerator(), { minLength: 0, maxLength: 5 }), (strategies) => {
          const insights = calculatePatientInsights('patient-1', 'Test Patient', [], strategies);

          // Should return valid default values
          expect(insights.patient_id).toBe('patient-1');
          expect(insights.patient_name).toBe('Test Patient');
          expect(insights.current_stress_level).toBe('calm');
          expect(insights.average_stress_score).toBe(0);
          expect(insights.peak_stress_score).toBe(0);
          expect(insights.data_points_this_week).toBe(0);
        })
      );
    });

    it('should maintain data consistency across calculations', () => {
      fc.assert(
        fc.property(
          fc.array(sensorDataGenerator(), { minLength: 1, maxLength: 100 }),
          fc.array(copingStrategyGenerator(), { minLength: 0, maxLength: 10 }),
          (sensorData, strategies) => {
            // Calculate insights twice with same data
            const insights1 = calculatePatientInsights(
              'patient-1',
              'Test Patient',
              sensorData,
              strategies
            );
            const insights2 = calculatePatientInsights(
              'patient-1',
              'Test Patient',
              sensorData,
              strategies
            );

            // Results should be identical
            expect(insights1).toEqual(insights2);
          }
        )
      );
    });

    it('should correctly identify stress level based on score', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          (stressScore) => {
            const sensorData: SensorDataRow[] = [
              {
                id: 'sensor-1',
                patient_id: 'patient-1',
                device_id: 'device-1',
                timestamp: new Date().toISOString(),
                heart_rate: 70,
                hrv: 50,
                eda: 2.0,
                accelerometer_x: 0,
                accelerometer_y: 0,
                accelerometer_z: 0,
                location: 'home',
                activity: 'relaxing',
                stress_score: stressScore,
                overload_predicted: false,
                overload_predicted_in_minutes: null,
                created_at: new Date().toISOString(),
              },
            ];

            const insights = calculatePatientInsights(
              'patient-1',
              'Test Patient',
              sensorData,
              []
            );

            // Verify stress level matches score
            if (stressScore < 40) {
              expect(insights.current_stress_level).toBe('calm');
            } else if (stressScore < 70) {
              expect(insights.current_stress_level).toBe('rising');
            } else {
              expect(insights.current_stress_level).toBe('overload');
            }
          }
        )
      );
    });
  });
});
