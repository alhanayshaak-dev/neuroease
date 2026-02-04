import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export type Gesture = Database['public']['Tables']['gestures']['Row'];

const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export type GestureType = 'long-press' | 'swipe' | 'double-tap' | 'triple-tap' | 'custom';

/**
 * Get gesture type label for display
 */
export function getGestureTypeLabel(gestureType: GestureType): string {
  const labels: Record<GestureType, string> = {
    'long-press': 'Long Press',
    swipe: 'Swipe',
    'double-tap': 'Double Tap',
    'triple-tap': 'Triple Tap',
    custom: 'Custom',
  };
  return labels[gestureType] || gestureType;
}

/**
 * Get action label for display
 */
export function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    'toggle-emergency': 'Toggle Emergency Mode',
    'open-menu': 'Open Menu',
    'call-guardian': 'Call Guardian',
    'activate-strategy': 'Activate Coping Strategy',
  };
  return labels[action] || action;
}

/**
 * Validate gesture configuration
 */
export function validateGestureConfig(
  gestureType: GestureType,
  action: string,
  actionParams: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!gestureType) {
    errors.push('Gesture type is required');
  }

  if (!action) {
    errors.push('Action is required');
  }

  // Validate action params based on action type
  if (action === 'activate-strategy' && !actionParams.strategyId) {
    errors.push('Strategy ID is required for activate-strategy action');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
