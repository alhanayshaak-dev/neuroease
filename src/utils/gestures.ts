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
 * Create a new gesture mapping
 */
export async function createGesture(
  patientId: string,
  gestureType: GestureType,
  action: string,
  actionParams: Record<string, unknown> = {},
  appliesToModes: string[] = [],
  userOnly: boolean = false,
  canBeOverriddenByCareer: boolean = true
): Promise<Gesture> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gestures')
    .insert({
      patient_id: patientId,
      gesture_type: gestureType,
      action,
      action_params: actionParams,
      applies_to_modes: appliesToModes,
      user_only: userOnly,
      can_be_overridden_by_carer: canBeOverriddenByCareer,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create gesture: ${error.message}`);
  }

  return data;
}

/**
 * Get all gestures for a patient
 */
export async function getPatientGestures(patientId: string): Promise<Gesture[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gestures')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch gestures: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single gesture by ID
 */
export async function getGesture(gestureId: string): Promise<Gesture> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gestures')
    .select('*')
    .eq('id', gestureId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch gesture: ${error.message}`);
  }

  return data;
}

/**
 * Update a gesture
 */
export async function updateGesture(
  gestureId: string,
  updates: Partial<Omit<Gesture, 'id' | 'patient_id' | 'created_at'>>
): Promise<Gesture> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gestures')
    .update(updates)
    .eq('id', gestureId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update gesture: ${error.message}`);
  }

  return data;
}

/**
 * Delete a gesture
 */
export async function deleteGesture(gestureId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('gestures')
    .delete()
    .eq('id', gestureId);

  if (error) {
    throw new Error(`Failed to delete gesture: ${error.message}`);
  }
}

/**
 * Execute a gesture action
 * Returns true if action was executed within 500ms
 */
export async function executeGestureAction(
  gesture: Gesture,
  currentMode?: string
): Promise<boolean> {
  const startTime = performance.now();

  // Check if gesture applies to current mode
  if (
    currentMode &&
    gesture.applies_to_modes.length > 0 &&
    !gesture.applies_to_modes.includes(currentMode)
  ) {
    return false;
  }

  try {
    // Simulate action execution
    // In a real implementation, this would trigger the actual action
    switch (gesture.action) {
      case 'toggle-emergency':
        // Trigger emergency mode
        console.log('Emergency mode triggered');
        break;
      case 'open-menu':
        // Open menu
        console.log('Menu opened');
        break;
      case 'call-guardian':
        // Call guardian
        console.log('Calling guardian');
        break;
      case 'activate-strategy':
        // Activate coping strategy
        console.log('Strategy activated:', gesture.action_params);
        break;
      default:
        console.log('Unknown action:', gesture.action);
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Verify execution completed within 500ms
    return executionTime < 500;
  } catch (error) {
    console.error('Failed to execute gesture:', error);
    return false;
  }
}

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
