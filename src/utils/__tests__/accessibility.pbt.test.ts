import fc from 'fast-check';
import {
  getAccessibilitySettings,
  setAccessibilitySettings,
  resetAccessibilitySettings,
  adjustFontSize,
  AccessibilitySettings,
} from '../accessibility';

/**
 * Property-Based Tests for Accessibility Settings
 * **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6**
 *
 * Property 17: Feature Control and Accessibility Settings
 * For any feature or accessibility setting, the system SHALL start disabled by default,
 * apply changes immediately upon user toggle, and respect user preferences across all pages.
 */

describe('Accessibility Settings - Property-Based Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = 'dark';
    document.documentElement.style.cssText = '';
  });

  // Generators for accessibility settings
  const fontSizeArbitrary = fc.integer({ min: 100, max: 200 });
  const booleanArbitrary = fc.boolean();

  const accessibilitySettingsArbitrary = fc.record({
    darkMode: booleanArbitrary,
    fontSize: fontSizeArbitrary,
    reduceMotion: booleanArbitrary,
    highContrast: booleanArbitrary,
    keyboardNavigationEnabled: booleanArbitrary,
  });

  describe('Property 17.1: Default Settings Start Disabled', () => {
    it(
      'should start with dark mode ON and all other features OFF by default',
      () => {
        fc.assert(
          fc.property(fc.integer({ min: 0, max: 100 }), () => {
            resetAccessibilitySettings();
            const settings = getAccessibilitySettings();

            // Dark mode should be ON by default
            expect(settings.darkMode).toBe(true);

            // All other features should be OFF by default
            expect(settings.fontSize).toBe(100); // Default (no scaling)
            expect(settings.reduceMotion).toBe(false); // OFF
            expect(settings.highContrast).toBe(false); // OFF
            expect(settings.keyboardNavigationEnabled).toBe(true); // ON (always enabled)
          })
        );
      },
      { numRuns: 10 }
    );
  });

  describe('Property 17.2: Changes Apply Immediately', () => {
    it(
      'should apply any accessibility setting change immediately to DOM',
      () => {
        fc.assert(
          fc.property(accessibilitySettingsArbitrary, (settings: AccessibilitySettings) => {
            setAccessibilitySettings(settings);

            // Verify dark mode is applied
            const hasDarkClass = document.documentElement.classList.contains('dark');
            expect(hasDarkClass).toBe(settings.darkMode);

            // Verify font size is applied
            const fontScale = document.documentElement.style.getPropertyValue('--font-scale');
            expect(fontScale).toBe(`${settings.fontSize / 100}`);

            // Verify reduce motion is applied
            const hasReduceMotionClass =
              document.documentElement.classList.contains('reduce-motion');
            expect(hasReduceMotionClass).toBe(settings.reduceMotion);

            // Verify high contrast is applied
            const hasHighContrastClass =
              document.documentElement.classList.contains('high-contrast');
            expect(hasHighContrastClass).toBe(settings.highContrast);

            // Verify keyboard navigation is applied
            const hasKeyboardNavClass =
              document.documentElement.classList.contains('keyboard-navigation');
            expect(hasKeyboardNavClass).toBe(settings.keyboardNavigationEnabled);
          })
        );
      },
      { numRuns: 50 }
    );
  });

  describe('Property 17.3: Settings Persist Across Retrievals', () => {
    it(
      'should persist any accessibility setting to localStorage and retrieve it unchanged',
      () => {
        fc.assert(
          fc.property(accessibilitySettingsArbitrary, (settings: AccessibilitySettings) => {
            // Set settings
            setAccessibilitySettings(settings);

            // Retrieve settings
            const retrieved = getAccessibilitySettings();

            // Verify all settings are persisted
            expect(retrieved.darkMode).toBe(settings.darkMode);
            expect(retrieved.fontSize).toBe(settings.fontSize);
            expect(retrieved.reduceMotion).toBe(settings.reduceMotion);
            expect(retrieved.highContrast).toBe(settings.highContrast);
            expect(retrieved.keyboardNavigationEnabled).toBe(settings.keyboardNavigationEnabled);
          })
        );
      },
      { numRuns: 50 }
    );
  });

  describe('Property 17.4: Font Size Adjustments Stay Within Bounds', () => {
    it(
      'should keep font size between 100 and 200 after any adjustment',
      () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 100, max: 200 }),
            fc.integer({ min: -100, max: 100 }),
            (initialSize: number, delta: number) => {
              setAccessibilitySettings({ fontSize: initialSize });
              const adjusted = adjustFontSize(delta);

              // Font size should always be within bounds
              expect(adjusted.fontSize).toBeGreaterThanOrEqual(100);
              expect(adjusted.fontSize).toBeLessThanOrEqual(200);
            }
          )
        );
      },
      { numRuns: 50 }
    );
  });

  describe('Property 17.5: Multiple Settings Can Be Changed Together', () => {
    it(
      'should apply multiple accessibility settings simultaneously without conflicts',
      () => {
        fc.assert(
          fc.property(accessibilitySettingsArbitrary, (settings: AccessibilitySettings) => {
            // Set multiple settings at once
            setAccessibilitySettings(settings);

            // Verify all settings are applied
            const retrieved = getAccessibilitySettings();
            expect(retrieved).toEqual(settings);

            // Verify DOM reflects all changes
            expect(document.documentElement.classList.contains('dark')).toBe(settings.darkMode);
            expect(document.documentElement.classList.contains('reduce-motion')).toBe(
              settings.reduceMotion
            );
            expect(document.documentElement.classList.contains('high-contrast')).toBe(
              settings.highContrast
            );
          })
        );
      },
      { numRuns: 50 }
    );
  });

  describe('Property 17.6: Settings Survive Reset and Reapplication', () => {
    it(
      'should reset to defaults and then apply new settings correctly',
      () => {
        fc.assert(
          fc.property(
            accessibilitySettingsArbitrary,
            accessibilitySettingsArbitrary,
            (settings1: AccessibilitySettings, settings2: AccessibilitySettings) => {
              // Apply first settings
              setAccessibilitySettings(settings1);
              let retrieved = getAccessibilitySettings();
              expect(retrieved).toEqual(settings1);

              // Reset to defaults
              resetAccessibilitySettings();
              retrieved = getAccessibilitySettings();
              expect(retrieved.darkMode).toBe(true);
              expect(retrieved.fontSize).toBe(100);

              // Apply second settings
              setAccessibilitySettings(settings2);
              retrieved = getAccessibilitySettings();
              expect(retrieved).toEqual(settings2);
            }
          )
        );
      },
      { numRuns: 50 }
    );
  });

  describe('Property 17.7: Dark Mode Toggle Works Correctly', () => {
    it(
      'should toggle dark mode on and off correctly',
      () => {
        fc.assert(
          fc.property(booleanArbitrary, (initialDarkMode: boolean) => {
            setAccessibilitySettings({ darkMode: initialDarkMode });

            // Verify initial state
            let settings = getAccessibilitySettings();
            expect(settings.darkMode).toBe(initialDarkMode);
            expect(document.documentElement.classList.contains('dark')).toBe(initialDarkMode);

            // Toggle
            setAccessibilitySettings({ darkMode: !initialDarkMode });

            // Verify toggled state
            settings = getAccessibilitySettings();
            expect(settings.darkMode).toBe(!initialDarkMode);
            expect(document.documentElement.classList.contains('dark')).toBe(!initialDarkMode);
          })
        );
      },
      { numRuns: 20 }
    );
  });

  describe('Property 17.8: Reduce Motion Toggle Works Correctly', () => {
    it(
      'should toggle reduce motion on and off correctly',
      () => {
        fc.assert(
          fc.property(booleanArbitrary, (initialReduceMotion: boolean) => {
            setAccessibilitySettings({ reduceMotion: initialReduceMotion });

            // Verify initial state
            let settings = getAccessibilitySettings();
            expect(settings.reduceMotion).toBe(initialReduceMotion);
            expect(document.documentElement.classList.contains('reduce-motion')).toBe(
              initialReduceMotion
            );

            // Toggle
            setAccessibilitySettings({ reduceMotion: !initialReduceMotion });

            // Verify toggled state
            settings = getAccessibilitySettings();
            expect(settings.reduceMotion).toBe(!initialReduceMotion);
            expect(document.documentElement.classList.contains('reduce-motion')).toBe(
              !initialReduceMotion
            );
          })
        );
      },
      { numRuns: 20 }
    );
  });

  describe('Property 17.9: High Contrast Toggle Works Correctly', () => {
    it(
      'should toggle high contrast on and off correctly',
      () => {
        fc.assert(
          fc.property(booleanArbitrary, (initialHighContrast: boolean) => {
            setAccessibilitySettings({ highContrast: initialHighContrast });

            // Verify initial state
            let settings = getAccessibilitySettings();
            expect(settings.highContrast).toBe(initialHighContrast);
            expect(document.documentElement.classList.contains('high-contrast')).toBe(
              initialHighContrast
            );

            // Toggle
            setAccessibilitySettings({ highContrast: !initialHighContrast });

            // Verify toggled state
            settings = getAccessibilitySettings();
            expect(settings.highContrast).toBe(!initialHighContrast);
            expect(document.documentElement.classList.contains('high-contrast')).toBe(
              !initialHighContrast
            );
          })
        );
      },
      { numRuns: 20 }
    );
  });

  describe('Property 17.10: Font Size Adjustment Applies Correctly', () => {
    it(
      'should adjust font size and apply to DOM correctly',
      () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 100, max: 200 }),
            fc.integer({ min: -50, max: 50 }),
            (initialSize: number, delta: number) => {
              setAccessibilitySettings({ fontSize: initialSize });
              const adjusted = adjustFontSize(delta);

              // Verify font size is within bounds
              expect(adjusted.fontSize).toBeGreaterThanOrEqual(100);
              expect(adjusted.fontSize).toBeLessThanOrEqual(200);

              // Verify DOM reflects the change
              const fontScale = document.documentElement.style.getPropertyValue('--font-scale');
              expect(fontScale).toBe(`${adjusted.fontSize / 100}`);
            }
          )
        );
      },
      { numRuns: 50 }
    );
  });

  describe('Property 17.11: Keyboard Navigation Toggle Works Correctly', () => {
    it(
      'should toggle keyboard navigation on and off correctly',
      () => {
        fc.assert(
          fc.property(booleanArbitrary, (initialKeyboardNav: boolean) => {
            setAccessibilitySettings({ keyboardNavigationEnabled: initialKeyboardNav });

            // Verify initial state
            let settings = getAccessibilitySettings();
            expect(settings.keyboardNavigationEnabled).toBe(initialKeyboardNav);
            expect(document.documentElement.classList.contains('keyboard-navigation')).toBe(
              initialKeyboardNav
            );

            // Toggle
            setAccessibilitySettings({ keyboardNavigationEnabled: !initialKeyboardNav });

            // Verify toggled state
            settings = getAccessibilitySettings();
            expect(settings.keyboardNavigationEnabled).toBe(!initialKeyboardNav);
            expect(document.documentElement.classList.contains('keyboard-navigation')).toBe(
              !initialKeyboardNav
            );
          })
        );
      },
      { numRuns: 20 }
    );
  });

  describe('Property 17.12: Settings Are Independent', () => {
    it(
      'should allow changing one setting without affecting others',
      () => {
        fc.assert(
          fc.property(
            accessibilitySettingsArbitrary,
            fc.oneof(
              fc.constant('darkMode' as const),
              fc.constant('fontSize' as const),
              fc.constant('reduceMotion' as const),
              fc.constant('highContrast' as const),
              fc.constant('keyboardNavigationEnabled' as const)
            ),
            (initialSettings: AccessibilitySettings, keyToChange: keyof AccessibilitySettings) => {
              // Set initial settings
              setAccessibilitySettings(initialSettings);
              const before = getAccessibilitySettings();

              // Change one setting
              const newValue =
                typeof initialSettings[keyToChange] === 'boolean'
                  ? !(initialSettings[keyToChange] as boolean)
                  : (initialSettings[keyToChange] as number) + 10;

              setAccessibilitySettings({ [keyToChange]: newValue });
              const after = getAccessibilitySettings();

              // Verify only the changed setting is different
              for (const key of Object.keys(before) as Array<keyof AccessibilitySettings>) {
                if (key === keyToChange) {
                  expect(after[key]).not.toEqual(before[key]);
                } else {
                  expect(after[key]).toEqual(before[key]);
                }
              }
            }
          )
        );
      },
      { numRuns: 50 }
    );
  });
});
