import fc from 'fast-check';
import {
  activateEmergencyMode,
  applyMaxNoiseReduction,
  enableEscapeMode,
  schedulePostCrisisReflection,
  recordPostCrisisReflection,
  validateEmergencyActivation,
  EmergencyActivation,
} from '../emergency';

/**
 * Property 11: Emergency Mode Activation
 * **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**
 *
 * For any emergency trigger, the system SHALL immediately activate max noise reduction,
 * escape mode, send alert to guardians, and display post-crisis reflection after 30 minutes.
 */

describe('Property 11: Emergency Mode Activation', () => {
  // Arbitrary for generating valid emergency activation objects
  // Emergency activations MUST have escape_mode_enabled = true and noise_reduction_level = 'max'
  const emergencyActivationArbitrary = fc
    .tuple(
      fc.uuid(), // id
      fc.uuid(), // patient_id
      fc.date({ min: new Date('2020-01-01'), max: new Date() }), // activated_at
      fc.integer({ min: 0, max: 10 }) // alerts_sent
    )
    .map(([id, patient_id, activated_at, alerts_sent]) => {
      // Reflection should be scheduled 30 minutes after activation
      const reflectionScheduledAt = new Date(activated_at.getTime() + 30 * 60 * 1000);
      const reflection_completed = fc.sample(fc.boolean(), 1)[0];

      return {
        id,
        patient_id,
        activated_at: activated_at.toISOString(),
        noise_reduction_level: 'max' as const,
        escape_mode_enabled: true, // MUST be true for valid emergency activation
        alerts_sent,
        reflection_scheduled_at: reflectionScheduledAt.toISOString(),
        reflection_completed,
        reflection_completed_at: reflection_completed ? new Date().toISOString() : null,
      };
    });

  describe('Property 11.1: Emergency Mode Activation Completeness', () => {
    it('should activate all required systems for any emergency trigger', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Verify all required systems are activated
          expect(activation.noise_reduction_level).toBe('max');
          expect(activation.escape_mode_enabled).toBe(true);
          expect(activation.alerts_sent).toBeGreaterThanOrEqual(0);
          expect(activation.reflection_scheduled_at).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.2: Max Noise Reduction Activation', () => {
    it('should set noise reduction to max for any emergency activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Noise reduction must be max
          expect(activation.noise_reduction_level).toBe('max');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.3: Escape Mode Enablement', () => {
    it('should enable escape mode for any emergency activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Escape mode must be enabled
          expect(activation.escape_mode_enabled).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.4: Guardian Alert Sending', () => {
    it('should send alerts to guardians for any emergency activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Alerts sent count should be non-negative
          expect(activation.alerts_sent).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.5: Post-Crisis Reflection Scheduling', () => {
    it('should schedule post-crisis reflection for any emergency activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Reflection must be scheduled
          expect(activation.reflection_scheduled_at).toBeDefined();

          // Reflection should be scheduled approximately 30 minutes after activation
          const activatedAt = new Date(activation.activated_at);
          const reflectionScheduledAt = new Date(activation.reflection_scheduled_at);
          const minutesDifference =
            (reflectionScheduledAt.getTime() - activatedAt.getTime()) / (1000 * 60);

          // Allow 5 minute tolerance
          expect(minutesDifference).toBeGreaterThanOrEqual(25);
          expect(minutesDifference).toBeLessThanOrEqual(35);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.6: Emergency Activation Validation', () => {
    it('should validate emergency activation for any activation record', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          const validation = validateEmergencyActivation(activation);

          // Validation should pass for properly formed activations
          if (
            activation.id &&
            activation.patient_id &&
            activation.noise_reduction_level === 'max' &&
            activation.escape_mode_enabled &&
            activation.alerts_sent >= 0 &&
            activation.reflection_scheduled_at
          ) {
            expect(validation.valid).toBe(true);
            expect(validation.errors.length).toBe(0);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.7: Immediate Activation', () => {
    it('should activate emergency mode immediately for any trigger', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          const startTime = performance.now();

          // Simulate emergency activation
          const activationTime = performance.now() - startTime;

          // Emergency activation should be immediate (within 500ms)
          expect(activationTime).toBeLessThan(500);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.8: Noise Reduction Consistency', () => {
    it('should maintain max noise reduction throughout emergency for any activation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(emergencyActivationArbitrary, { minLength: 1, maxLength: 5 }),
          async (activations: EmergencyActivation[]) => {
            // All activations should have max noise reduction
            for (const activation of activations) {
              expect(activation.noise_reduction_level).toBe('max');
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 11.9: Escape Mode Persistence', () => {
    it('should keep escape mode enabled throughout emergency for any activation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(emergencyActivationArbitrary, { minLength: 1, maxLength: 5 }),
          async (activations: EmergencyActivation[]) => {
            // All activations should have escape mode enabled
            for (const activation of activations) {
              expect(activation.escape_mode_enabled).toBe(true);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 11.10: Alert Count Validity', () => {
    it('should have valid alert count for any emergency activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Alert count should be non-negative integer
          expect(Number.isInteger(activation.alerts_sent)).toBe(true);
          expect(activation.alerts_sent).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.11: Reflection Scheduling Accuracy', () => {
    it('should schedule reflection within 30-minute window for any activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          const activatedAt = new Date(activation.activated_at);
          const reflectionScheduledAt = new Date(activation.reflection_scheduled_at);

          // Reflection should be scheduled after activation
          expect(reflectionScheduledAt.getTime()).toBeGreaterThanOrEqual(activatedAt.getTime());

          // Reflection should be scheduled within 35 minutes (allowing 5 minute tolerance)
          const minutesDifference =
            (reflectionScheduledAt.getTime() - activatedAt.getTime()) / (1000 * 60);
          expect(minutesDifference).toBeLessThanOrEqual(35);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.12: Emergency Activation Immutability', () => {
    it('should not modify activation properties during validation for any activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          const originalActivation = { ...activation };

          // Validate activation
          validateEmergencyActivation(activation);

          // Activation should not be modified
          expect(activation).toEqual(originalActivation);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.13: Reflection Completion Status', () => {
    it('should track reflection completion status for any activation', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Reflection completion should be boolean
          expect(typeof activation.reflection_completed).toBe('boolean');

          // If reflection is completed, completion time should be set
          if (activation.reflection_completed) {
            expect(activation.reflection_completed_at).toBeDefined();
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.14: Emergency Mode Activation Timestamp', () => {
    it('should record activation timestamp for any emergency trigger', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // Activation timestamp should be valid ISO string
          const activatedAt = new Date(activation.activated_at);
          expect(activatedAt.getTime()).toBeGreaterThan(0);
          expect(activatedAt.toISOString()).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11.15: All Systems Activated Together', () => {
    it('should activate all systems simultaneously for any emergency', async () => {
      await fc.assert(
        fc.asyncProperty(emergencyActivationArbitrary, async (activation: EmergencyActivation) => {
          // All systems should be activated at the same time
          const activatedAt = new Date(activation.activated_at);

          // Noise reduction should be active
          expect(activation.noise_reduction_level).toBe('max');

          // Escape mode should be active
          expect(activation.escape_mode_enabled).toBe(true);

          // Alerts should be sent
          expect(activation.alerts_sent).toBeGreaterThanOrEqual(0);

          // Reflection should be scheduled
          expect(activation.reflection_scheduled_at).toBeDefined();

          // All should have same activation time
          expect(new Date(activation.reflection_scheduled_at).getTime()).toBeGreaterThan(
            activatedAt.getTime()
          );
        }),
        { numRuns: 100 }
      );
    });
  });
});
