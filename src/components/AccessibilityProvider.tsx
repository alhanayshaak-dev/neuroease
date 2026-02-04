'use client';

import { useEffect } from 'react';
import { initializeAccessibilitySettings } from '@/utils/accessibility';

/**
 * Provider component that initializes accessibility settings on app load
 * Should be placed at the root of the app
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize accessibility settings on app load (non-blocking)
    const timer = setTimeout(() => {
      initializeAccessibilitySettings();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
