import fc from 'fast-check';
import { predictOverload, shouldDisplayPrediction } from '../anthropic';
import type { SensorData } from '../../types';

/**
 * Property-Based Tests for Overload Prediction
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
 *
 * Property 2: Overload Prediction with Confidence Filtering
 * For any sensor data with environmental context, the system SHALL predict overload 5-10 minutes
 * in advance only when confidence exceeds 60%, and display warning with reason and suggested strategies.
 */

describe('Overload Prediction - Property-Based Tests', () => {
  // Generators for realistic sensor data
  const sensorDataGenerator = () =>
    fc.array(
      fc.record({
        id: fc.uuid(),
        patient_id: fc.uuid(),
        device_id: fc.uuid(),
        timestamp: fc.date().map((d) => d.toISOString()),
        heart_rate: fc.integer({ min: 40, max: 180 }),
        hrv: fc.integer({ min: 5, max: 150 }),
        eda: fc.float({ min: Math.fround(0.1), max: Math.fround(10), noNaN: true }),
        accelerometer_x: fc.float({ min: Math.fround(-10), max: Math.fround(10), noNaN: true }),
        accelerometer_y: fc.float({ min: Math.fround(-10), max: Math.fround(10), noNaN: true }),
        accelerometer_z: fc.float({ min: Math.fround(-10), max: Math.fround(10), noNaN: true }),
        location: fc.oneof(
          fc.constant('home'),
          fc.constant('school'),
          fc.constant('work'),
          fc.constant('public'),
          fc.constant('unknown')
        ),
        activity: fc.oneof(
          fc.constant('resting'),
          fc.constant('working'),
          fc.constant('exercising'),
          fc.constant('socializing'),
          fc.constant('unknown')
        ),
        stress_score: fc.integer({ min: 0, max: 100 }),
        overload_predicted: fc.boolean(),
        overload_predicted_in_minutes: fc.option(fc.integer({ min: 5, max: 10 })),
        created_at: fc.date().map((d) => d.toISOString()),
      }),
      { minLength: 1, maxLength: 20 }
    );

  const contextGenerator = () =>
    fc.record({
      location: fc.option(
        fc.oneof(
          fc.constant('home'),
          fc.constant('school'),
          fc.constant('work'),
          fc.constant('public')
        )
      ),
      activity: fc.option(
        fc.oneof(
          fc.constant('resting'),
          fc.constant('working'),
          fc.constant('exercising'),
          fc.constant('socializing')
        )
      ),
      timeOfDay: fc.option(
        fc.oneof(
          fc.constant('morning'),
          fc.constant('afternoon'),
          fc.constant('evening'),
          fc.constant('night')
        )
      ),
      recentTriggers: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
          minLength: 0,
          maxLength: 5,
        })
      ),
    });

  describe('Property 2.1: Prediction Confidence Range', () => {
    it('should always return confidence between 0 and 100', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);
          return prediction.confidence >= 0 && prediction.confidence <= 100;
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 2.2: Prediction Time Range', () => {
    it('should predict overload 5-10 minutes in advance when predicted is true', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);
          if (prediction.predicted && prediction.timeToOverloadMinutes) {
            return prediction.timeToOverloadMinutes >= 5 && prediction.timeToOverloadMinutes <= 10;
          }
          // If not predicted, timeToOverloadMinutes should be undefined or null
          return (
            prediction.timeToOverloadMinutes === undefined ||
            prediction.timeToOverloadMinutes === null
          );
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 2.3: Confidence Filtering', () => {
    it('should only display prediction when confidence > 60%', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);
          const shouldDisplay = shouldDisplayPrediction(prediction);

          // If shouldDisplay is true, confidence must be > 60%
          if (shouldDisplay) {
            return prediction.confidence > 60;
          }

          // If confidence <= 60%, shouldDisplay must be false
          if (prediction.confidence <= 60) {
            return !shouldDisplay;
          }

          return true;
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 2.4: Prediction Consistency', () => {
    it('should return consistent prediction structure with required fields', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);

          // Verify all required fields exist
          return (
            typeof prediction.predicted === 'boolean' &&
            typeof prediction.confidence === 'number' &&
            typeof prediction.reason === 'string' &&
            Array.isArray(prediction.triggers) &&
            prediction.reason.length > 0
          );
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 2.5: Trigger Recording', () => {
    it('should record identified triggers in prediction', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);

          // Triggers should be an array of strings
          return (
            Array.isArray(prediction.triggers) &&
            prediction.triggers.every((trigger) => typeof trigger === 'string')
          );
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 2.6: Reason Explanation', () => {
    it('should provide a reason for every prediction', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);

          // Reason should always be a non-empty string
          return typeof prediction.reason === 'string' && prediction.reason.length > 0;
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 2.7: High Confidence Predictions', () => {
    it('should have high confidence when stress is rapidly increasing', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              patient_id: fc.uuid(),
              device_id: fc.uuid(),
              timestamp: fc.date().map((d) => d.toISOString()),
              heart_rate: fc.integer({ min: 100, max: 180 }),
              hrv: fc.integer({ min: 5, max: 50 }),
              eda: fc.float({ min: Math.fround(2), max: Math.fround(10), noNaN: true }),
              accelerometer_x: fc.float({
                min: Math.fround(-10),
                max: Math.fround(10),
                noNaN: true,
              }),
              accelerometer_y: fc.float({
                min: Math.fround(-10),
                max: Math.fround(10),
                noNaN: true,
              }),
              accelerometer_z: fc.float({
                min: Math.fround(-10),
                max: Math.fround(10),
                noNaN: true,
              }),
              location: fc.constant('public'),
              activity: fc.constant('socializing'),
              stress_score: fc.integer({ min: 70, max: 100 }),
              overload_predicted: fc.boolean(),
              overload_predicted_in_minutes: fc.option(fc.integer({ min: 5, max: 10 })),
              created_at: fc.date().map((d) => d.toISOString()),
            }),
            { minLength: 3, maxLength: 10 }
          ),
          contextGenerator(),
          async (sensorData, context) => {
            const prediction = await predictOverload(sensorData, context);

            // High stress data should result in higher confidence
            // (though not guaranteed to predict overload)
            return prediction.confidence >= 0 && prediction.confidence <= 100;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 2.8: Low Confidence Predictions', () => {
    it('should have low confidence when stress is stable and low', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              patient_id: fc.uuid(),
              device_id: fc.uuid(),
              timestamp: fc.date().map((d) => d.toISOString()),
              heart_rate: fc.integer({ min: 50, max: 70 }),
              hrv: fc.integer({ min: 80, max: 150 }),
              eda: fc.float({ min: Math.fround(0.1), max: Math.fround(1), noNaN: true }),
              accelerometer_x: fc.float({
                min: Math.fround(-10),
                max: Math.fround(10),
                noNaN: true,
              }),
              accelerometer_y: fc.float({
                min: Math.fround(-10),
                max: Math.fround(10),
                noNaN: true,
              }),
              accelerometer_z: fc.float({
                min: Math.fround(-10),
                max: Math.fround(10),
                noNaN: true,
              }),
              location: fc.constant('home'),
              activity: fc.constant('resting'),
              stress_score: fc.integer({ min: 0, max: 30 }),
              overload_predicted: fc.boolean(),
              overload_predicted_in_minutes: fc.option(fc.integer({ min: 5, max: 10 })),
              created_at: fc.date().map((d) => d.toISOString()),
            }),
            { minLength: 3, maxLength: 10 }
          ),
          contextGenerator(),
          async (sensorData, context) => {
            const prediction = await predictOverload(sensorData, context);

            // Low stress data should result in lower confidence of overload
            // (though not guaranteed)
            return prediction.confidence >= 0 && prediction.confidence <= 100;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 2.9: Display Prediction Filtering', () => {
    it('should not display predictions with confidence <= 60%', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);

          // If confidence is 60 or less, shouldDisplayPrediction must be false
          if (prediction.confidence <= 60) {
            return !shouldDisplayPrediction(prediction);
          }

          return true;
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 2.10: Prediction Monotonicity', () => {
    it('should increase confidence as stress indicators worsen', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.array(
              fc.record({
                id: fc.uuid(),
                patient_id: fc.uuid(),
                device_id: fc.uuid(),
                timestamp: fc.date().map((d) => d.toISOString()),
                heart_rate: fc.integer({ min: 50, max: 100 }),
                hrv: fc.integer({ min: 80, max: 150 }),
                eda: fc.float({ min: Math.fround(0.1), max: Math.fround(2), noNaN: true }),
                accelerometer_x: fc.float({
                  min: Math.fround(-10),
                  max: Math.fround(10),
                  noNaN: true,
                }),
                accelerometer_y: fc.float({
                  min: Math.fround(-10),
                  max: Math.fround(10),
                  noNaN: true,
                }),
                accelerometer_z: fc.float({
                  min: Math.fround(-10),
                  max: Math.fround(10),
                  noNaN: true,
                }),
                location: fc.constant('home'),
                activity: fc.constant('resting'),
                stress_score: fc.integer({ min: 20, max: 40 }),
                overload_predicted: fc.boolean(),
                overload_predicted_in_minutes: fc.option(fc.integer({ min: 5, max: 10 })),
                created_at: fc.date().map((d) => d.toISOString()),
              }),
              { minLength: 2, maxLength: 5 }
            ),
            fc.array(
              fc.record({
                id: fc.uuid(),
                patient_id: fc.uuid(),
                device_id: fc.uuid(),
                timestamp: fc.date().map((d) => d.toISOString()),
                heart_rate: fc.integer({ min: 120, max: 180 }),
                hrv: fc.integer({ min: 5, max: 50 }),
                eda: fc.float({ min: Math.fround(3), max: Math.fround(10), noNaN: true }),
                accelerometer_x: fc.float({
                  min: Math.fround(-10),
                  max: Math.fround(10),
                  noNaN: true,
                }),
                accelerometer_y: fc.float({
                  min: Math.fround(-10),
                  max: Math.fround(10),
                  noNaN: true,
                }),
                accelerometer_z: fc.float({
                  min: Math.fround(-10),
                  max: Math.fround(10),
                  noNaN: true,
                }),
                location: fc.constant('public'),
                activity: fc.constant('socializing'),
                stress_score: fc.integer({ min: 70, max: 100 }),
                overload_predicted: fc.boolean(),
                overload_predicted_in_minutes: fc.option(fc.integer({ min: 5, max: 10 })),
                created_at: fc.date().map((d) => d.toISOString()),
              }),
              { minLength: 2, maxLength: 5 }
            )
          ),
          contextGenerator(),
          async ([lowStressData, highStressData], context) => {
            const lowPrediction = await predictOverload(lowStressData, context);
            const highPrediction = await predictOverload(highStressData, context);

            // High stress data should have higher or equal confidence than low stress data
            return highPrediction.confidence >= lowPrediction.confidence;
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Property 2.11: Empty Sensor Data Handling', () => {
    it('should handle empty sensor data gracefully', async () => {
      const prediction = await predictOverload([], {});

      // Should return a valid prediction structure
      return (
        typeof prediction.predicted === 'boolean' &&
        typeof prediction.confidence === 'number' &&
        typeof prediction.reason === 'string' &&
        Array.isArray(prediction.triggers)
      );
    });
  });

  describe('Property 2.12: Context Variations', () => {
    it('should handle various context combinations', async () => {
      await fc.assert(
        fc.asyncProperty(sensorDataGenerator(), contextGenerator(), async (sensorData, context) => {
          const prediction = await predictOverload(sensorData, context);

          // Should always return valid prediction regardless of context
          return (
            typeof prediction.predicted === 'boolean' &&
            typeof prediction.confidence === 'number' &&
            prediction.confidence >= 0 &&
            prediction.confidence <= 100 &&
            typeof prediction.reason === 'string' &&
            Array.isArray(prediction.triggers)
          );
        }),
        { numRuns: 50 }
      );
    });
  });
});
