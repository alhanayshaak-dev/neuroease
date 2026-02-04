/**
 * Emergency feature utilities
 * Handles emergency mode activation, noise reduction, escape mode, alerts, and post-crisis reflection
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export type Mode = Database['public']['Tables']['modes']['Row'];
export type Guardian = Database['public']['Tables']['guardians']['Row'];

const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export interface EmergencyActivation {
  id: string;
  patient_id: string;
  activated_at: string;
  noise_reduction_level: 'max';
  escape_mode_enabled: boolean;
  alerts_sent: number;
  reflection_scheduled_at: string;
  reflection_completed: boolean;
  reflection_completed_at: string | null;
}

export interface EmergencyAlert {
  id: string;
  patient_id: string;
  guardian_id: string;
  message: string;
  alert_type: 'emergency';
  sent_at: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
}

export interface PostCrisisReflection {
  id: string;
  patient_id: string;
  emergency_activation_id: string;
  reflection_text: string;
  mood_before: number; // 1-10 scale
  mood_after: number; // 1-10 scale
  triggers_identified: string[];
  strategies_used: string[];
  created_at: string;
}

/**
 * Activate emergency mode
 * Immediately activates max noise reduction, escape mode, and sends alerts to guardians
 * @param patientId Patient ID
 * @returns Emergency activation record
 */
export async function activateEmergencyMode(patientId: string): Promise<EmergencyActivation> {
  const supabase = getSupabase();
  const now = new Date();
  const reflectionScheduledAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now

  // Create emergency activation record
  const { data: activation, error: activationError } = await supabase
    .from('emergency_activations')
    .insert({
      patient_id: patientId,
      activated_at: now.toISOString(),
      noise_reduction_level: 'max',
      escape_mode_enabled: true,
      alerts_sent: 0,
      reflection_scheduled_at: reflectionScheduledAt.toISOString(),
      reflection_completed: false,
      reflection_completed_at: null,
    })
    .select()
    .single();

  if (activationError) {
    throw new Error(`Failed to activate emergency mode: ${activationError.message}`);
  }

  // Send alerts to guardians with trigger_emergency permission
  const alertsSent = await sendEmergencyAlertsToGuardians(patientId, activation.id);

  // Update activation record with alerts sent count
  const { data: updatedActivation, error: updateError } = await supabase
    .from('emergency_activations')
    .update({ alerts_sent: alertsSent })
    .eq('id', activation.id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update emergency activation: ${updateError.message}`);
  }

  return updatedActivation;
}

/**
 * Send emergency alerts to all guardians with trigger_emergency permission
 * @param patientId Patient ID
 * @param activationId Emergency activation ID
 * @returns Number of alerts sent
 */
export async function sendEmergencyAlertsToGuardians(
  patientId: string,
  activationId: string
): Promise<number> {
  const supabase = getSupabase();

  // Get all guardians with trigger_emergency permission
  const { data: guardians, error: guardiansError } = await supabase
    .from('guardians')
    .select('*')
    .eq('patient_id', patientId);

  if (guardiansError) {
    throw new Error(`Failed to fetch guardians: ${guardiansError.message}`);
  }

  if (!guardians || guardians.length === 0) {
    return 0;
  }

  // Filter guardians with trigger_emergency permission
  const guardiansToAlert = guardians.filter(
    (g) => g.permissions && g.permissions.trigger_emergency === true
  );

  if (guardiansToAlert.length === 0) {
    return 0;
  }

  // Create alert records for each guardian
  const alerts = guardiansToAlert.map((guardian) => ({
    patient_id: patientId,
    guardian_id: guardian.id,
    message: 'Emergency mode activated. Patient needs immediate support.',
    alert_type: 'emergency' as const,
    sent_at: new Date().toISOString(),
    acknowledged: false,
    acknowledged_at: null,
  }));

  const { error: alertsError } = await supabase
    .from('emergency_alerts')
    .insert(alerts);

  if (alertsError) {
    throw new Error(`Failed to send emergency alerts: ${alertsError.message}`);
  }

  return guardiansToAlert.length;
}

/**
 * Apply max noise reduction to all devices
 * @param patientId Patient ID
 * @returns True if noise reduction was applied successfully
 */
export async function applyMaxNoiseReduction(patientId: string): Promise<boolean> {
  const supabase = getSupabase();

  // Get all devices for patient
  const { data: devices, error: devicesError } = await supabase
    .from('devices')
    .select('*')
    .eq('patient_id', patientId);

  if (devicesError) {
    throw new Error(`Failed to fetch devices: ${devicesError.message}`);
  }

  if (!devices || devices.length === 0) {
    return true; // No devices to update
  }

  // Filter for Neurobud devices (which have noise reduction)
  const neurobuds = devices.filter((d) => d.device_type === 'neurobud');

  if (neurobuds.length === 0) {
    return true; // No Neurobud devices
  }

  // In a real implementation, this would send commands to devices
  // For now, we'll just log the action
  console.log(`Applying max noise reduction to ${neurobuds.length} Neurobud devices`);

  return true;
}

/**
 * Enable escape mode navigation
 * Provides simplified navigation and quick exit options
 * @param patientId Patient ID
 * @returns True if escape mode was enabled
 */
export async function enableEscapeMode(patientId: string): Promise<boolean> {
  // Escape mode is a UI state that:
  // 1. Hides non-essential UI elements
  // 2. Shows large, easy-to-tap buttons for:
  //    - Call guardian
  //    - Go to safe space
  //    - Breathing exercise
  //    - Exit emergency mode
  // 3. Disables all gestures except emergency exit
  // 4. Maximizes screen real estate for calming content

  console.log(`Escape mode enabled for patient ${patientId}`);
  return true;
}

/**
 * Deactivate emergency mode
 * @param activationId Emergency activation ID
 * @returns Updated emergency activation record
 */
export async function deactivateEmergencyMode(activationId: string): Promise<EmergencyActivation> {
  const supabase = getSupabase();

  const { data: activation, error } = await supabase
    .from('emergency_activations')
    .update({
      reflection_completed: false,
      reflection_completed_at: null,
    })
    .eq('id', activationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to deactivate emergency mode: ${error.message}`);
  }

  return activation;
}

/**
 * Schedule post-crisis reflection
 * Displays reflection prompts 30 minutes after emergency activation
 * @param activationId Emergency activation ID
 * @returns True if reflection was scheduled
 */
export async function schedulePostCrisisReflection(activationId: string): Promise<boolean> {
  const supabase = getSupabase();

  // Get the activation record
  const { data: activation, error: fetchError } = await supabase
    .from('emergency_activations')
    .select('*')
    .eq('id', activationId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch emergency activation: ${fetchError.message}`);
  }

  if (!activation) {
    throw new Error('Emergency activation not found');
  }

  // Check if 30 minutes have passed
  const activatedAt = new Date(activation.activated_at);
  const now = new Date();
  const minutesElapsed = (now.getTime() - activatedAt.getTime()) / (1000 * 60);

  if (minutesElapsed < 30) {
    return false; // Not yet time for reflection
  }

  // Mark reflection as ready
  const { error: updateError } = await supabase
    .from('emergency_activations')
    .update({
      reflection_completed: false, // Ready for reflection
    })
    .eq('id', activationId);

  if (updateError) {
    throw new Error(`Failed to schedule reflection: ${updateError.message}`);
  }

  return true;
}

/**
 * Record post-crisis reflection
 * @param patientId Patient ID
 * @param activationId Emergency activation ID
 * @param reflection Reflection data
 * @returns Created reflection record
 */
export async function recordPostCrisisReflection(
  patientId: string,
  activationId: string,
  reflection: {
    reflection_text: string;
    mood_before: number;
    mood_after: number;
    triggers_identified: string[];
    strategies_used: string[];
  }
): Promise<PostCrisisReflection> {
  const supabase = getSupabase();

  // Validate mood scores
  if (reflection.mood_before < 1 || reflection.mood_before > 10) {
    throw new Error('Mood before must be between 1 and 10');
  }
  if (reflection.mood_after < 1 || reflection.mood_after > 10) {
    throw new Error('Mood after must be between 1 and 10');
  }

  // Create reflection record
  const { data: reflectionRecord, error } = await supabase
    .from('post_crisis_reflections')
    .insert({
      patient_id: patientId,
      emergency_activation_id: activationId,
      reflection_text: reflection.reflection_text,
      mood_before: reflection.mood_before,
      mood_after: reflection.mood_after,
      triggers_identified: reflection.triggers_identified,
      strategies_used: reflection.strategies_used,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to record reflection: ${error.message}`);
  }

  // Mark activation as reflection completed
  await supabase
    .from('emergency_activations')
    .update({
      reflection_completed: true,
      reflection_completed_at: new Date().toISOString(),
    })
    .eq('id', activationId);

  return reflectionRecord;
}

/**
 * Get emergency activation history for a patient
 * @param patientId Patient ID
 * @param limit Number of records to return
 * @returns Array of emergency activation records
 */
export async function getEmergencyActivationHistory(
  patientId: string,
  limit: number = 10
): Promise<EmergencyActivation[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('emergency_activations')
    .select('*')
    .eq('patient_id', patientId)
    .order('activated_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch emergency history: ${error.message}`);
  }

  return data || [];
}

/**
 * Check if emergency mode is currently active for a patient
 * @param patientId Patient ID
 * @returns True if emergency mode is active
 */
export async function isEmergencyModeActive(patientId: string): Promise<boolean> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('emergency_activations')
    .select('*')
    .eq('patient_id', patientId)
    .eq('reflection_completed', false)
    .order('activated_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Failed to check emergency mode status: ${error.message}`);
  }

  return data && data.length > 0;
}

/**
 * Acknowledge emergency alert
 * @param alertId Alert ID
 * @returns Updated alert record
 */
export async function acknowledgeEmergencyAlert(alertId: string): Promise<EmergencyAlert> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('emergency_alerts')
    .update({
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
    })
    .eq('id', alertId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to acknowledge alert: ${error.message}`);
  }

  return data;
}

/**
 * Get unacknowledged emergency alerts for a guardian
 * @param guardianId Guardian ID
 * @returns Array of unacknowledged alerts
 */
export async function getUnacknowledgedAlerts(guardianId: string): Promise<EmergencyAlert[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('emergency_alerts')
    .select('*')
    .eq('guardian_id', guardianId)
    .eq('acknowledged', false)
    .order('sent_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch unacknowledged alerts: ${error.message}`);
  }

  return data || [];
}

/**
 * Validate emergency activation
 * Ensures all required systems are activated
 * @param activation Emergency activation record
 * @returns Validation result
 */
export function validateEmergencyActivation(activation: EmergencyActivation): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!activation.id) {
    errors.push('Activation ID is required');
  }

  if (!activation.patient_id) {
    errors.push('Patient ID is required');
  }

  if (activation.noise_reduction_level !== 'max') {
    errors.push('Noise reduction must be set to max');
  }

  if (!activation.escape_mode_enabled) {
    errors.push('Escape mode must be enabled');
  }

  if (activation.alerts_sent < 0) {
    errors.push('Alerts sent count cannot be negative');
  }

  if (!activation.reflection_scheduled_at) {
    errors.push('Reflection must be scheduled');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
