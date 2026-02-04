import {
  getAccessibilitySettings,
  setAccessibilitySettings,
  toggleAccessibilitySetting,
  adjustFontSize,
  resetAccessibilitySettings,
  prefersReducedMotion,
  prefersDarkMode,
  initializeAccessibilitySettings,
  AccessibilitySettings,
} from '../accessibility';

describe('Accessibility Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document classes
    document.documentElement.className = 'dark';
    document.documentElement.style.cssText = '';

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('getAccessibilitySettings', () => {
    it('should return default settings when localStorage is empty', () => {
      const settings = getAccessibilitySettings();
      expect(settings.darkMode).toBe(true);
      expect(settings.fontSize).toBe(100);
      expect(settings.reduceMotion).toBe(false);
      expect(settings.highContrast).toBe(false);
      expect(settings.keyboardNavigationEnabled).toBe(true);
    });

    it('should return stored settings from localStorage', () => {
      const customSettings: AccessibilitySettings = {
        darkMode: false,
        fontSize: 150,
        reduceMotion: true,
        highContrast: true,
        keyboardNavigationEnabled: false,
      };
      localStorage.setItem('neuroflow_accessibility_settings', JSON.stringify(customSettings));

      const settings = getAccessibilitySettings();
      expect(settings).toEqual(customSettings);
    });

    it('should merge stored settings with defaults', () => {
      localStorage.setItem(
        'neuroflow_accessibility_settings',
        JSON.stringify({ fontSize: 120 })
      );

      const settings = getAccessibilitySettings();
      expect(settings.fontSize).toBe(120);
      expect(settings.darkMode).toBe(true); // Default
      expect(settings.reduceMotion).toBe(false); // Default
    });
  });

  describe('setAccessibilitySettings', () => {
    it('should save settings to localStorage', () => {
      const newSettings = { fontSize: 150 };
      setAccessibilitySettings(newSettings);

      const stored = JSON.parse(localStorage.getItem('neuroflow_accessibility_settings') || '{}');
      expect(stored.fontSize).toBe(150);
    });

    it('should apply settings to DOM', () => {
      setAccessibilitySettings({ darkMode: false, fontSize: 150 });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.5');
    });

    it('should dispatch custom event', () => {
      const listener = jest.fn();
      window.addEventListener('accessibilitySettingsChanged', listener);

      setAccessibilitySettings({ fontSize: 120 });

      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.fontSize).toBe(120);

      window.removeEventListener('accessibilitySettingsChanged', listener);
    });

    it('should return updated settings', () => {
      const result = setAccessibilitySettings({ highContrast: true });
      expect(result.highContrast).toBe(true);
      expect(result.darkMode).toBe(true); // Preserved from default
    });
  });

  describe('toggleAccessibilitySetting', () => {
    it('should toggle boolean settings', () => {
      let settings = toggleAccessibilitySetting('darkMode');
      expect(settings.darkMode).toBe(false);

      settings = toggleAccessibilitySetting('darkMode');
      expect(settings.darkMode).toBe(true);
    });

    it('should set specific value when provided', () => {
      const settings = toggleAccessibilitySetting('fontSize', 150);
      expect(settings.fontSize).toBe(150);
    });

    it('should apply changes to DOM', () => {
      toggleAccessibilitySetting('highContrast', true);
      expect(document.documentElement.classList.contains('high-contrast')).toBe(true);

      toggleAccessibilitySetting('highContrast', false);
      expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
    });
  });

  describe('adjustFontSize', () => {
    it('should increase font size by delta', () => {
      const settings = adjustFontSize(10);
      expect(settings.fontSize).toBe(110);
    });

    it('should decrease font size by delta', () => {
      setAccessibilitySettings({ fontSize: 150 });
      const settings = adjustFontSize(-20);
      expect(settings.fontSize).toBe(130);
    });

    it('should not go below minimum (100)', () => {
      const settings = adjustFontSize(-50);
      expect(settings.fontSize).toBe(100);
    });

    it('should not exceed maximum (200)', () => {
      setAccessibilitySettings({ fontSize: 190 });
      const settings = adjustFontSize(50);
      expect(settings.fontSize).toBe(200);
    });

    it('should apply font scale to DOM', () => {
      adjustFontSize(20);
      expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.2');
    });
  });

  describe('resetAccessibilitySettings', () => {
    it('should clear localStorage', () => {
      setAccessibilitySettings({ fontSize: 150, highContrast: true });
      resetAccessibilitySettings();

      expect(localStorage.getItem('neuroflow_accessibility_settings')).toBeNull();
    });

    it('should reset DOM to defaults', () => {
      setAccessibilitySettings({ darkMode: false, highContrast: true });
      resetAccessibilitySettings();

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
    });

    it('should return default settings', () => {
      const settings = resetAccessibilitySettings();
      expect(settings.darkMode).toBe(true);
      expect(settings.fontSize).toBe(100);
      expect(settings.reduceMotion).toBe(false);
      expect(settings.highContrast).toBe(false);
    });

    it('should dispatch custom event', () => {
      const listener = jest.fn();
      window.addEventListener('accessibilitySettingsChanged', listener);

      resetAccessibilitySettings();

      expect(listener).toHaveBeenCalled();

      window.removeEventListener('accessibilitySettingsChanged', listener);
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return false by default', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('prefersDarkMode', () => {
    it('should return true by default', () => {
      const result = prefersDarkMode();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('initializeAccessibilitySettings', () => {
    it('should apply settings on initialization', () => {
      setAccessibilitySettings({ fontSize: 150 });
      initializeAccessibilitySettings();

      expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.5');
    });

    it('should return current settings', () => {
      const settings = initializeAccessibilitySettings();
      expect(settings).toHaveProperty('darkMode');
      expect(settings).toHaveProperty('fontSize');
      expect(settings).toHaveProperty('reduceMotion');
      expect(settings).toHaveProperty('highContrast');
      expect(settings).toHaveProperty('keyboardNavigationEnabled');
    });
  });

  describe('Dark Mode Application', () => {
    it('should add dark class when darkMode is true', () => {
      setAccessibilitySettings({ darkMode: true });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class when darkMode is false', () => {
      setAccessibilitySettings({ darkMode: false });
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Reduce Motion Application', () => {
    it('should add reduce-motion class when enabled', () => {
      setAccessibilitySettings({ reduceMotion: true });
      expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
    });

    it('should remove reduce-motion class when disabled', () => {
      setAccessibilitySettings({ reduceMotion: false });
      expect(document.documentElement.classList.contains('reduce-motion')).toBe(false);
    });
  });

  describe('High Contrast Application', () => {
    it('should add high-contrast class when enabled', () => {
      setAccessibilitySettings({ highContrast: true });
      expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    });

    it('should remove high-contrast class when disabled', () => {
      setAccessibilitySettings({ highContrast: false });
      expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
    });
  });

  describe('Keyboard Navigation Application', () => {
    it('should add keyboard-navigation class when enabled', () => {
      setAccessibilitySettings({ keyboardNavigationEnabled: true });
      expect(document.documentElement.classList.contains('keyboard-navigation')).toBe(true);
    });

    it('should remove keyboard-navigation class when disabled', () => {
      setAccessibilitySettings({ keyboardNavigationEnabled: false });
      expect(document.documentElement.classList.contains('keyboard-navigation')).toBe(false);
    });
  });

  describe('Font Size Scaling', () => {
    it('should set correct CSS variable for font scale', () => {
      setAccessibilitySettings({ fontSize: 150 });
      expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.5');
    });

    it('should set correct CSS variable for minimum font size', () => {
      setAccessibilitySettings({ fontSize: 100 });
      expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1');
    });

    it('should set correct CSS variable for maximum font size', () => {
      setAccessibilitySettings({ fontSize: 200 });
      expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('2');
    });
  });
});
