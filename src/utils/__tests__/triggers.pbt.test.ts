import fc from 'fast-check';
import {
  recordTrigger,
  detectTriggerType,
  analyzeTriggers,
  TriggerRecord,
  StressEvent,
  TriggerType,
} from '../triggers';

/**
 * Property-Based Tests for Trigger Recording and Analysis
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 *
 * Property 3: Trigger Recording and Analysis
 * For any stress event, the system SHALL record trigger type (auditory, visual, social, unknown)
 * and context (location, activity, time), and make this data available for analytics and correlation.
 */

describe('Trigger Recording and Analysis - Property-Based Tests', () => {
  // Generators for realistic trigger data
  const triggerTypeGenerator = () =>
    fc.oneof(
      fc.constant('auditory' as const),
      fc.constant('visual' as const),
      fc.constant('social' as const),
      fc.constant('unknown' as const)
    );

  const contextGenerator = () =>
    fc.record({
      activity: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
      location: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
      time: fc.option(
        fc.oneof(
          fc.constant('morning'),
          fc.constant('afternoon'),
          fc.constant('evening'),
          fc.constant('night')
        )
      ),
    });

  const stressEventGenerator = () =>
    fc.record({
      stress_score: fc.integer({ min: 0, max: 100 }),
      timestamp: fc.integer({ min: 0 }),
      context: contextGenerator(),
    });

  const triggerRecordGenerator = () =>
    fc.record({
      id: fc.string({ minLength: 1 }),
      trigger_type: triggerTypeGenerator(),
      stress_score: fc.integer({ min: 0, max: 100 }),
      context: contextGenerator(),
      timestamp: fc.integer({ min: 0 }),
      created_at: fc.string(),
    });

  describe('Property 3.1: Trigger Recording', () => {
    it('should record trigger with valid structure for any stress event', () => {
      fc.assert(
        fc.property(stressEventGenerator(), (stressEvent) => {
          const trigger = recordTrigger(stressEvent);

          // Verify all required fields are present
          return (
            typeof trigger.id === 'string' &&
            trigger.id.length > 0 &&
            ['auditory', 'visual', 'social', 'unknown'].includes(trigger.trigger_type) &&
            typeof trigger.stress_score === 'number' &&
            trigger.stress_score >= 0 &&
            trigger.stress_score <= 100 &&
            typeof trigger.context === 'object' &&
            typeof trigger.timestamp === 'number' &&
            typeof trigger.created_at === 'string'
          );
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve stress score in recorded trigger', () => {
      fc.assert(
        fc.property(stressEventGenerator(), (stressEvent) => {
          const trigger = recordTrigger(stressEvent);
          return trigger.stress_score === stressEvent.stress_score;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve timestamp in recorded trigger', () => {
      fc.assert(
        fc.property(stressEventGenerator(), (stressEvent) => {
          const trigger = recordTrigger(stressEvent);
          return trigger.timestamp === stressEvent.timestamp;
        }),
        { numRuns: 100 }
      );
    });

    it('should merge context from event and additional context', () => {
      fc.assert(
        fc.property(
          stressEventGenerator(),
          contextGenerator(),
          (stressEvent, additionalContext) => {
            const trigger = recordTrigger(stressEvent, additionalContext);

            // Verify merged context contains both original and additional context
            const mergedContext = { ...stressEvent.context, ...additionalContext };
            for (const key of Object.keys(mergedContext)) {
              if (mergedContext[key] !== null && mergedContext[key] !== undefined) {
                if (trigger.context[key] !== mergedContext[key]) {
                  return false;
                }
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate unique IDs for each recorded trigger', () => {
      fc.assert(
        fc.property(
          fc.array(stressEventGenerator(), { minLength: 2, maxLength: 10 }),
          (stressEvents) => {
            const triggers = stressEvents.map((event) => recordTrigger(event));
            const ids = triggers.map((t) => t.id);
            const uniqueIds = new Set(ids);
            return uniqueIds.size === ids.length;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should set created_at to valid ISO timestamp', () => {
      fc.assert(
        fc.property(stressEventGenerator(), (stressEvent) => {
          const trigger = recordTrigger(stressEvent);
          const date = new Date(trigger.created_at);
          return !isNaN(date.getTime());
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3.2: Trigger Type Detection', () => {
    it('should always return valid trigger type for any context', () => {
      fc.assert(
        fc.property(contextGenerator(), (context) => {
          const triggerType = detectTriggerType(context);
          return ['auditory', 'visual', 'social', 'unknown'].includes(triggerType);
        }),
        { numRuns: 100 }
      );
    });

    it('should detect auditory triggers consistently', () => {
      const auditoryActivities = [
        'loud noise',
        'sound',
        'music',
        'alarm',
        'bell',
        'crowd',
      ];

      fc.assert(
        fc.property(fc.constantFrom(...auditoryActivities), (activity) => {
          const context = { activity };
          return detectTriggerType(context) === 'auditory';
        }),
        { numRuns: 100 }
      );
    });

    it('should detect visual triggers consistently', () => {
      const visualActivities = [
        'bright lights',
        'light',
        'flash',
        'screen',
        'visual',
      ];

      fc.assert(
        fc.property(fc.constantFrom(...visualActivities), (activity) => {
          const context = { activity };
          return detectTriggerType(context) === 'visual';
        }),
        { numRuns: 100 }
      );
    });

    it('should detect social triggers consistently', () => {
      const socialActivities = [
        'social meeting',
        'meeting',
        'presentation',
        'conversation',
        'group',
        'class',
      ];

      fc.assert(
        fc.property(fc.constantFrom(...socialActivities), (activity) => {
          const context = { activity };
          return detectTriggerType(context) === 'social';
        }),
        { numRuns: 100 }
      );
    });

    it('should be case-insensitive for trigger detection', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('loud noise', 'bright lights', 'social meeting'),
          (activity) => {
            const lowerContext = { activity: activity.toLowerCase() };
            const upperContext = { activity: activity.toUpperCase() };
            return detectTriggerType(lowerContext) === detectTriggerType(upperContext);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3.3: Trigger Analysis', () => {
    it('should analyze any collection of triggers without error', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { maxLength: 100 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);
            return analysis.total_triggers === triggers.length;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should count trigger frequencies correctly', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // Sum all frequencies should equal total triggers
            const totalFrequency =
              analysis.trigger_patterns.auditory.frequency +
              analysis.trigger_patterns.visual.frequency +
              analysis.trigger_patterns.social.frequency +
              analysis.trigger_patterns.unknown.frequency;

            return totalFrequency === analysis.total_triggers;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate average stress scores within valid range', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // All average stress scores should be between 0 and 100
            for (const triggerType of ['auditory', 'visual', 'social', 'unknown'] as TriggerType[]) {
              const avg = analysis.average_stress_by_trigger[triggerType];
              if (analysis.trigger_patterns[triggerType].frequency > 0) {
                if (avg < 0 || avg > 100) {
                  return false;
                }
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should identify most common trigger correctly', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // Find the trigger type with highest frequency
            let maxFrequency = 0;
            let expectedMostCommon: TriggerType = 'unknown';

            for (const triggerType of ['auditory', 'visual', 'social', 'unknown'] as TriggerType[]) {
              if (analysis.trigger_patterns[triggerType].frequency > maxFrequency) {
                maxFrequency = analysis.trigger_patterns[triggerType].frequency;
                expectedMostCommon = triggerType;
              }
            }

            return analysis.most_common_trigger === expectedMostCommon;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should identify highest stress trigger correctly', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // Find the trigger type with highest average stress
            let maxStress = 0;
            let expectedHighestStress: TriggerType = 'unknown';

            for (const triggerType of ['auditory', 'visual', 'social', 'unknown'] as TriggerType[]) {
              const avg = analysis.average_stress_by_trigger[triggerType];
              if (avg > maxStress) {
                maxStress = avg;
                expectedHighestStress = triggerType;
              }
            }

            return analysis.highest_stress_trigger === expectedHighestStress;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should track location stress averages correctly', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // Verify location stress map values are within valid range
            for (const [location, stress] of Object.entries(analysis.location_stress_map)) {
              if (stress < 0 || stress > 100) {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should track time stress averages correctly', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // Verify time stress map values are within valid range
            for (const [time, stress] of Object.entries(analysis.time_stress_map)) {
              if (stress < 0 || stress > 100) {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3.4: Trigger Context Preservation', () => {
    it('should preserve all context fields in recorded trigger', () => {
      fc.assert(
        fc.property(stressEventGenerator(), (stressEvent) => {
          const trigger = recordTrigger(stressEvent);

          // Verify all context fields from event are in trigger
          for (const [key, value] of Object.entries(stressEvent.context)) {
            if (trigger.context[key] !== value) {
              return false;
            }
          }
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('should handle missing context fields gracefully', () => {
      fc.assert(
        fc.property(
          fc.record({
            stress_score: fc.integer({ min: 0, max: 100 }),
            timestamp: fc.integer({ min: 0 }),
            context: fc.record({
              activity: fc.option(fc.string()),
              location: fc.option(fc.string()),
              time: fc.option(fc.string()),
            }),
          }),
          (stressEvent) => {
            const trigger = recordTrigger(stressEvent);
            return (
              typeof trigger.context === 'object' &&
              trigger.trigger_type !== undefined
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3.5: Trigger Analysis Consistency', () => {
    it('should produce consistent analysis for same trigger set', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis1 = analyzeTriggers(triggers);
            const analysis2 = analyzeTriggers(triggers);

            return (
              analysis1.total_triggers === analysis2.total_triggers &&
              analysis1.most_common_trigger === analysis2.most_common_trigger &&
              analysis1.highest_stress_trigger === analysis2.highest_stress_trigger
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty trigger array consistently', () => {
      const analysis1 = analyzeTriggers([]);
      const analysis2 = analyzeTriggers([]);

      expect(analysis1.total_triggers).toBe(analysis2.total_triggers);
      expect(analysis1.most_common_trigger).toBe(analysis2.most_common_trigger);
    });
  });

  describe('Property 3.6: Trigger Data Availability', () => {
    it('should make trigger data available for analytics', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // Verify all required analytics fields are present
            return (
              analysis.total_triggers !== undefined &&
              analysis.trigger_patterns !== undefined &&
              analysis.most_common_trigger !== undefined &&
              analysis.highest_stress_trigger !== undefined &&
              analysis.average_stress_by_trigger !== undefined &&
              analysis.location_stress_map !== undefined &&
              analysis.time_stress_map !== undefined
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should provide trigger patterns for each trigger type', () => {
      fc.assert(
        fc.property(
          fc.array(triggerRecordGenerator(), { minLength: 1, maxLength: 50 }),
          (triggers) => {
            const analysis = analyzeTriggers(triggers);

            // Verify patterns exist for all trigger types
            for (const triggerType of ['auditory', 'visual', 'social', 'unknown'] as TriggerType[]) {
              const pattern = analysis.trigger_patterns[triggerType];
              if (
                pattern.trigger_type !== triggerType ||
                pattern.frequency === undefined ||
                pattern.average_stress_score === undefined ||
                pattern.locations === undefined ||
                pattern.times_of_day === undefined ||
                pattern.activities === undefined
              ) {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
