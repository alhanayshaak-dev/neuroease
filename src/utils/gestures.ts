import { Database } from '@/types/database';

export type Gesture = Database['public']['Tables']['gestures']['Row'];

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

/**
 * Execute a gesture action
 */
export function executeGestureAction(
  action: string,
  _actionParams: Record<string, unknown>
): void {
  switch (action) {
    case 'toggle-emergency':
      // Toggle emergency mode
      break;
    case 'open-menu':
      // Open menu
      break;
    case 'call-guardian':
      // Call guardian
      break;
    case 'activate-strategy':
      // Activate coping strategy
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
}
