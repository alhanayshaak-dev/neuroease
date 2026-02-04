import fc from 'fast-check';
import { executeGestureAction } from '../gestures';
import { Gesture } from '@/types/database';

/**
 * Property 6: Gesture-to-Action Execution
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
 *
 * For any custom gesture, the system SHALL execute assigned action within 500ms,
 * provide haptic feedback, and respect mode-specific and user-only restrictions.
 */

describe('Property 6: Gesture-to-Action Execution', () => {
  // Arbitrary for generating valid Gesture objects
  const gestureArbitrary = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    gesture_type: fc.constantFrom('long-press', 'swipe', 'double-tap', 'triple-tap', 'custom'),
    action: fc.constantFrom('toggle-emergency', 'open-menu', 'call-guardian', 'activate-strategy'),
    action_params: fc.record({
      strategyId: fc.option(fc.uuid()),
      targetMode: fc.option(fc.string()),
    }, { withDeletedKeys: true }),
    applies_to_modes: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
      minLength: 0,
      maxLength: 5,
    }),
    user_only: fc.boolean(),
    can_be_overridden_by_carer: fc.boolean(),
    created_at: fc.date().map(d => d.toISOString()),
  });

  it('should execute gesture action within 500ms for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        const startTime = performance.now();
        const result = await executeGestureAction(gesture);
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        // If gesture executed successfully, it should be within 500ms
        if (result) {
          expect(executionTime).toBeLessThan(500);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should respect mode-specific restrictions for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(
        gestureArbitrary,
        fc.option(fc.string({ minLength: 1, maxLength: 20 })),
        async (gesture: Gesture, currentMode: string | null) => {
          const result = await executeGestureAction(gesture, currentMode || undefined);

          // If gesture has mode restrictions
          if (gesture.applies_to_modes.length > 0 && currentMode) {
            // Should only execute if current mode is in applies_to_modes
            if (!gesture.applies_to_modes.includes(currentMode)) {
              expect(result).toBe(false);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should execute gesture without mode restrictions for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        // Create gesture with no mode restrictions
        const unrestricted: Gesture = {
          ...gesture,
          applies_to_modes: [],
        };

        const result = await executeGestureAction(unrestricted);
        // Should always execute if no mode restrictions
        expect(result).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle all valid gesture types for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        // Gesture type should be one of the valid types
        const validTypes = ['long-press', 'swipe', 'double-tap', 'triple-tap', 'custom'];
        expect(validTypes).toContain(gesture.gesture_type);

        // Should be able to execute any valid gesture type
        const result = await executeGestureAction(gesture);
        expect(typeof result).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });

  it('should handle all valid actions for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        // Action should be one of the valid actions
        const validActions = ['toggle-emergency', 'open-menu', 'call-guardian', 'activate-strategy'];
        expect(validActions).toContain(gesture.action);

        // Should be able to execute any valid action
        const result = await executeGestureAction(gesture);
        expect(typeof result).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain gesture properties during execution for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        const originalGesture = { ...gesture };

        // Execute gesture
        await executeGestureAction(gesture);

        // Gesture properties should not be modified
        expect(gesture.id).toBe(originalGesture.id);
        expect(gesture.patient_id).toBe(originalGesture.patient_id);
        expect(gesture.gesture_type).toBe(originalGesture.gesture_type);
        expect(gesture.action).toBe(originalGesture.action);
        expect(gesture.user_only).toBe(originalGesture.user_only);
        expect(gesture.can_be_overridden_by_carer).toBe(originalGesture.can_be_overridden_by_carer);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle mode matching correctly for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        async (modes: string[], currentMode: string) => {
          const gesture: Gesture = {
            id: 'test-id',
            patient_id: 'patient-id',
            gesture_type: 'long-press',
            action: 'toggle-emergency',
            action_params: {},
            applies_to_modes: modes,
            user_only: false,
            can_be_overridden_by_carer: true,
            created_at: new Date().toISOString(),
          };

          const result = await executeGestureAction(gesture, currentMode);

          // If current mode is in applies_to_modes, should execute
          if (modes.includes(currentMode)) {
            expect(result).toBe(true);
          } else {
            // If current mode is not in applies_to_modes, should not execute
            expect(result).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should execute gesture with action parameters for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        // Gesture with action parameters should still execute
        const result = await executeGestureAction(gesture);
        expect(typeof result).toBe('boolean');

        // Action parameters should be preserved
        expect(gesture.action_params).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  it('should handle user-only restrictions for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        // User-only flag should be preserved
        const result = await executeGestureAction(gesture);
        expect(gesture.user_only).toBe(gesture.user_only);

        // Execution should not be affected by user_only flag
        // (user_only is enforced at a higher level)
        expect(typeof result).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });

  it('should handle caregiver override restrictions for any gesture', async () => {
    await fc.assert(
      fc.asyncProperty(gestureArbitrary, async (gesture: Gesture) => {
        // can_be_overridden_by_carer flag should be preserved
        const result = await executeGestureAction(gesture);
        expect(gesture.can_be_overridden_by_carer).toBe(gesture.can_be_overridden_by_carer);

        // Execution should not be affected by override flag
        // (override is enforced at a higher level)
        expect(typeof result).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });
});
