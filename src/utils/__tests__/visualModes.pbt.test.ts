import fc from 'fast-check';
import {
  applyVisualMode,
  validateVisualModeConfig,
  VisualModeConfig,
  VisualModeType,
} from '../visualModes';

/**
 * Property 13: Visual Mode Application
 * **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6**
 *
 * For any selected visual mode, the system SHALL apply correct visual adjustments
 * (brightness, contrast, blur, cues) and allow custom mode creation.
 */
describe('Property 13: Visual Mode Application', () => {
  // Generator for valid brightness values
  const brightnessBetween0And150 = fc.integer({ min: 0, max: 150 });

  // Generator for valid contrast values
  const contrastBetween0And150 = fc.integer({ min: 0, max: 150 });

  // Generator for valid blur values
  const blurBetween0And100 = fc.integer({ min: 0, max: 100 });

  // Generator for valid font size values
  const fontSizeBetween50And150 = fc.integer({ min: 50, max: 150 });

  // Generator for color filters
  const colorFilterArbitrary = fc.constantFrom('none', 'warm', 'cool', 'sepia');

  // Generator for visual mode types
  const visualModeTypeArbitrary = fc.constantFrom(
    'reading',
    'outdoor',
    'crowd',
    'task',
    'meeting'
  ) as fc.Arbitrary<VisualModeType>;

  // Generator for valid visual mode configurations
  const validVisualModeConfigArbitrary = fc.record({
    mode: visualModeTypeArbitrary,
    brightness: brightnessBetween0And150,
    contrast: contrastBetween0And150,
    blur: blurBetween0And100,
    colorFilter: colorFilterArbitrary as fc.Arbitrary<
      'none' | 'warm' | 'cool' | 'sepia'
    >,
    cuesEnabled: fc.boolean(),
    fontSize: fontSizeBetween50And150,
    highContrast: fc.boolean(),
  });

  it('should apply visual mode and generate valid CSS variables', () => {
    fc.assert(
      fc.property(validVisualModeConfigArbitrary, (config: VisualModeConfig) => {
        const cssVars = applyVisualMode(config);

        // CSS variables should be defined
        expect(cssVars['--visual-filter']).toBeDefined();
        expect(cssVars['--color-filter']).toBeDefined();
        expect(cssVars['--font-scale']).toBeDefined();
        expect(cssVars['--high-contrast']).toBeDefined();

        // CSS variables should be strings
        expect(typeof cssVars['--visual-filter']).toBe('string');
        expect(typeof cssVars['--color-filter']).toBe('string');
        expect(typeof cssVars['--font-scale']).toBe('string');
        expect(typeof cssVars['--high-contrast']).toBe('string');
      }),
      { numRuns: 100 }
    );
  });

  it('should always include brightness and contrast in filter', () => {
    fc.assert(
      fc.property(validVisualModeConfigArbitrary, (config: VisualModeConfig) => {
        const cssVars = applyVisualMode(config);
        const filter = cssVars['--visual-filter'];

        // Filter should contain brightness and contrast
        expect(filter).toContain('brightness');
        expect(filter).toContain('contrast');
      }),
      { numRuns: 100 }
    );
  });

  it('should include blur in filter only when blur > 0', () => {
    fc.assert(
      fc.property(validVisualModeConfigArbitrary, (config: VisualModeConfig) => {
        const cssVars = applyVisualMode(config);
        const filter = cssVars['--visual-filter'];

        if (config.blur > 0) {
          expect(filter).toContain('blur');
        } else {
          expect(filter).not.toContain('blur');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should apply color filter based on configuration', () => {
    fc.assert(
      fc.property(validVisualModeConfigArbitrary, (config: VisualModeConfig) => {
        const cssVars = applyVisualMode(config);
        const colorFilter = cssVars['--color-filter'];

        if (config.colorFilter === 'warm') {
          expect(colorFilter).toContain('sepia');
        } else if (config.colorFilter === 'cool') {
          expect(colorFilter).toContain('hue-rotate');
        } else if (config.colorFilter === 'sepia') {
          expect(colorFilter).toContain('sepia');
        } else {
          expect(colorFilter).toBe('');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should set high contrast flag correctly', () => {
    fc.assert(
      fc.property(validVisualModeConfigArbitrary, (config: VisualModeConfig) => {
        const cssVars = applyVisualMode(config);
        const highContrastFlag = cssVars['--high-contrast'];

        if (config.highContrast) {
          expect(highContrastFlag).toBe('1');
        } else {
          expect(highContrastFlag).toBe('0');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should scale font size correctly', () => {
    fc.assert(
      fc.property(validVisualModeConfigArbitrary, (config: VisualModeConfig) => {
        const cssVars = applyVisualMode(config);
        const fontScale = parseFloat(cssVars['--font-scale']);

        // Font scale should be between 0.5 and 1.5 (50% to 150%)
        expect(fontScale).toBeGreaterThanOrEqual(0.5);
        expect(fontScale).toBeLessThanOrEqual(1.5);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate all generated configurations', () => {
    fc.assert(
      fc.property(validVisualModeConfigArbitrary, (config: VisualModeConfig) => {
        const validation = validateVisualModeConfig(config);
        expect(validation.valid).toBe(true);
        expect(validation.errors.length).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject invalid brightness values', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 151, max: 300 }),
        (brightness: number) => {
          const validation = validateVisualModeConfig({ brightness });
          expect(validation.valid).toBe(false);
          expect(validation.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject invalid contrast values', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 151, max: 300 }),
        (contrast: number) => {
          const validation = validateVisualModeConfig({ contrast });
          expect(validation.valid).toBe(false);
          expect(validation.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject invalid blur values', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 101, max: 200 }),
        (blur: number) => {
          const validation = validateVisualModeConfig({ blur });
          expect(validation.valid).toBe(false);
          expect(validation.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject invalid font size values', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: 0, max: 49 }),
          fc.integer({ min: 151, max: 300 })
        ),
        (fontSize: number) => {
          const validation = validateVisualModeConfig({ fontSize });
          expect(validation.valid).toBe(false);
          expect(validation.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle edge case values correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          brightness: fc.constantFrom(0, 150),
          contrast: fc.constantFrom(0, 150),
          blur: fc.constantFrom(0, 100),
          fontSize: fc.constantFrom(50, 150),
        }),
        (edgeCaseValues: any) => {
          const config: VisualModeConfig = {
            mode: 'reading',
            ...edgeCaseValues,
            colorFilter: 'none',
            cuesEnabled: true,
            highContrast: false,
          };

          const cssVars = applyVisualMode(config);
          expect(cssVars['--visual-filter']).toBeDefined();
          expect(cssVars['--font-scale']).toBeDefined();
        }
      ),
      { numRuns: 50 }
    );
  });
});
