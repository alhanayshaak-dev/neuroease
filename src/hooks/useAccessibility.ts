'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AccessibilitySettings,
  getAccessibilitySettings,
  setAccessibilitySettings,
  toggleAccessibilitySetting,
  adjustFontSize,
  resetAccessibilitySettings,
} from '@/utils/accessibility';

/**
 * Hook for managing accessibility settings
 * Provides current settings and functions to update them
 */
export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize settings on mount
  useEffect(() => {
    setSettings(getAccessibilitySettings());
    setIsLoading(false);

    // Listen for changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'neuroflow_accessibility_settings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch (error) {
          // Silently fail on parse
        }
      }
    };

    // Listen for custom accessibility settings change event
    const handleAccessibilityChange = (e: Event) => {
      const customEvent = e as CustomEvent<AccessibilitySettings>;
      setSettings(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('accessibilitySettingsChanged', handleAccessibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('accessibilitySettingsChanged', handleAccessibilityChange);
    };
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    const updated = setAccessibilitySettings(newSettings);
    setSettings(updated);
  }, []);

  const toggle = useCallback((key: keyof AccessibilitySettings, value?: boolean | number) => {
    const updated = toggleAccessibilitySetting(key, value);
    setSettings(updated);
  }, []);

  const adjustFont = useCallback((delta: number) => {
    const updated = adjustFontSize(delta);
    setSettings(updated);
  }, []);

  const reset = useCallback(() => {
    const updated = resetAccessibilitySettings();
    setSettings(updated);
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    toggle,
    adjustFont,
    reset,
  };
}
