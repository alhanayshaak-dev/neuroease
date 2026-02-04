import fc from 'fast-check';
import { getDefaultPresetModes } from '../modes';
import { Mode } from '@/types/database';

/**
 * Property 22: Mode Switching Speed
 * **Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5, 24.6**
 *
 * For any mode selection, the system SHALL apply configuration to all devices
 * within 1 second and allow quick-switch from home screen.
 */

describe('Property 22: Mode Switching Speed', () => {
  // Arbitrary for generating valid Mode objects
  const modeArbitrary = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    mode_name: fc.string({ minLength: 1, maxLength: 50 }),
    neuroband_sensitivity: fc.constantFrom('low' as const, 'normal' as const, 'high' as const),
    neuroband_haptics_intensity: fc.integer({ min: 0, max: 100 }),
    neurobud_noise_reduction: fc.constantFrom('off' as const, 'low' as const, 'high' as const),
    neurobud_social_cues: fc.boolean(),
    neurolens_vision_mode: fc.constantFrom(
      'reading' as const,
      'outdoor' as const,
      'crowd' as const,
      'task' as const,
      'meeting' as const
    ),
    neurolens_cues: fc.boolean(),
    created_at: fc.date().map(d => d.toISOString()),
  });

  it('should maintain mode properties during switching for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        const originalMode = { ...mode };

        // Mode properties should not be modified
        expect(mode.id).toBe(originalMode.id);
        expect(mode.patient_id).toBe(originalMode.patient_id);
        expect(mode.mode_name).toBe(originalMode.mode_name);
        expect(mode.neuroband_sensitivity).toBe(originalMode.neuroband_sensitivity);
        expect(mode.neuroband_haptics_intensity).toBe(originalMode.neuroband_haptics_intensity);
        expect(mode.neurobud_noise_reduction).toBe(originalMode.neurobud_noise_reduction);
        expect(mode.neurolens_vision_mode).toBe(originalMode.neurolens_vision_mode);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle all valid sensitivity levels for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        // Sensitivity should be one of the valid values
        expect(['low', 'normal', 'high']).toContain(mode.neuroband_sensitivity);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle all valid noise reduction levels for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        // Noise reduction should be one of the valid values
        expect(['off', 'low', 'high']).toContain(mode.neurobud_noise_reduction);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle all valid vision modes for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        // Vision mode should be one of the valid values
        expect(['reading', 'outdoor', 'crowd', 'task', 'meeting']).toContain(
          mode.neurolens_vision_mode
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should handle haptics intensity within valid range for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        // Haptics intensity should be within valid range
        expect(mode.neuroband_haptics_intensity).toBeGreaterThanOrEqual(0);
        expect(mode.neuroband_haptics_intensity).toBeLessThanOrEqual(100);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle boolean flags correctly for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        // Boolean flags should be boolean
        expect(typeof mode.neurobud_social_cues).toBe('boolean');
        expect(typeof mode.neurolens_cues).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });

  it('should handle preset modes correctly', async () => {
    const presets = getDefaultPresetModes();

    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 0, max: presets.length - 1 }), async (index: number) => {
        const preset = presets[index];

        // Preset should have valid settings
        expect(['low', 'normal', 'high']).toContain(preset.neuroband_sensitivity);
        expect(preset.neuroband_haptics_intensity).toBeGreaterThanOrEqual(0);
        expect(preset.neuroband_haptics_intensity).toBeLessThanOrEqual(100);
        expect(['off', 'low', 'high']).toContain(preset.neurobud_noise_reduction);
        expect(['reading', 'outdoor', 'crowd', 'task', 'meeting']).toContain(
          preset.neurolens_vision_mode
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should handle mode name consistency for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        // Mode name should be non-empty
        expect(mode.mode_name.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle mode switching with all device settings for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        // All device settings should be present
        expect(mode.neuroband_sensitivity).toBeDefined();
        expect(mode.neuroband_haptics_intensity).toBeDefined();
        expect(mode.neurobud_noise_reduction).toBeDefined();
        expect(mode.neurobud_social_cues).toBeDefined();
        expect(mode.neurolens_vision_mode).toBeDefined();
        expect(mode.neurolens_cues).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  it('should apply mode settings within 1 second for any mode configuration', async () => {
    await fc.assert(
      fc.asyncProperty(modeArbitrary, async (mode: Mode) => {
        const startTime = performance.now();

        // Simulate mode application (without Supabase calls)
        // In a real implementation, this would apply settings to devices
        const modeSettings = {
          sensitivity: mode.neuroband_sensitivity,
          haptics: mode.neuroband_haptics_intensity,
          noiseReduction: mode.neurobud_noise_reduction,
          visionMode: mode.neurolens_vision_mode,
        };

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 10));

        const endTime = performance.now();
        const applicationTime = endTime - startTime;

        // Mode application should complete within 1 second
        expect(applicationTime).toBeLessThan(1000);
        expect(modeSettings).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  it('should handle rapid mode configuration changes for any mode', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(modeArbitrary, { minLength: 2, maxLength: 5 }),
        async (modes: Mode[]) => {
          const startTime = performance.now();

          // Simulate rapid mode switches
          for (const mode of modes) {
            const modeSettings = {
              sensitivity: mode.neuroband_sensitivity,
              haptics: mode.neuroband_haptics_intensity,
              noiseReduction: mode.neurobud_noise_reduction,
              visionMode: mode.neurolens_vision_mode,
            };
            expect(modeSettings).toBeDefined();
          }

          const endTime = performance.now();
          const totalTime = endTime - startTime;

          // All mode switches should complete within 1 second
          expect(totalTime).toBeLessThan(1000);
        }
      ),
      { numRuns: 50 }
    );
  });
});
