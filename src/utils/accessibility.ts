/**
 * Accessibility utilities for managing user preferences
 * Handles dark mode, font size, reduce motion, high contrast, and keyboard navigation
 */

export interface AccessibilitySettings {
  darkMode: boolean; // Default: true
  fontSize: number; // 100-200 (percentage), default: 100
  reduceMotion: boolean; // Default: false (respects system preference)
  highContrast: boolean; // Default: false
  keyboardNavigationEnabled: boolean; // Default: true
}

const STORAGE_KEY = 'neuroflow_accessibility_settings';

// Default settings - all features start disabled except dark mode (which is ON by default)
const DEFAULT_SETTINGS: AccessibilitySettings = {
  darkMode: true,
  fontSize: 100,
  reduceMotion: false,
  highContrast: false,
  keyboardNavigationEnabled: true,
};

/**
 * Get current accessibility settings from localStorage
 * Falls back to defaults if not found
 */
export function getAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    }
  } catch (error) {
    // Silently fail on parse
  }

  return DEFAULT_SETTINGS;
}

/**
 * Save accessibility settings to localStorage
 * Applies changes immediately to the DOM
 */
export function setAccessibilitySettings(
  settings: Partial<AccessibilitySettings>
): AccessibilitySettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  const current = getAccessibilitySettings();
  const updated = { ...current, ...settings };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    // Silently fail on save
  }

  // Apply settings to DOM immediately
  applyAccessibilitySettings(updated);

  // Dispatch custom event for components to listen to
  window.dispatchEvent(
    new CustomEvent('accessibilitySettingsChanged', { detail: updated })
  );

  return updated;
}

/**
 * Apply accessibility settings to the DOM
 */
export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  // Apply dark mode
  if (settings.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Apply font size scaling
  root.style.setProperty('--font-scale', `${settings.fontSize / 100}`);

  // Apply reduce motion
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }

  // Apply high contrast
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Apply keyboard navigation
  if (settings.keyboardNavigationEnabled) {
    root.classList.add('keyboard-navigation');
  } else {
    root.classList.remove('keyboard-navigation');
  }
}

/**
 * Toggle a specific accessibility setting
 */
export function toggleAccessibilitySetting(
  key: keyof AccessibilitySettings,
  value?: boolean | number
): AccessibilitySettings {
  const current = getAccessibilitySettings();

  if (value !== undefined) {
    return setAccessibilitySettings({ [key]: value });
  }

  // For boolean settings, toggle
  if (typeof current[key] === 'boolean') {
    return setAccessibilitySettings({ [key]: !current[key] });
  }

  return current;
}

/**
 * Adjust font size by a delta (e.g., +10 or -10)
 */
export function adjustFontSize(delta: number): AccessibilitySettings {
  const current = getAccessibilitySettings();
  const newSize = Math.max(100, Math.min(200, current.fontSize + delta));
  return setAccessibilitySettings({ fontSize: newSize });
}

/**
 * Reset all accessibility settings to defaults
 */
export function resetAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Silently fail on reset
  }

  applyAccessibilitySettings(DEFAULT_SETTINGS);

  window.dispatchEvent(
    new CustomEvent('accessibilitySettingsChanged', { detail: DEFAULT_SETTINGS })
  );

  return DEFAULT_SETTINGS;
}

/**
 * Check if system prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if system prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Initialize accessibility settings on app load
 * Respects system preferences for reduce motion
 */
export function initializeAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  const stored = getAccessibilitySettings();

  // If reduce motion is not explicitly set, use system preference
  if (!localStorage.getItem(STORAGE_KEY)) {
    const systemReduceMotion = prefersReducedMotion();
    if (systemReduceMotion) {
      stored.reduceMotion = true;
    }
  }

  applyAccessibilitySettings(stored);
  return stored;
}
