import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export type Mode = Database['public']['Tables']['modes']['Row'];

const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export type PresetModeName = 'School' | 'Work' | 'Home' | 'Transit';

/**
 * Get default preset modes
 */
export function getDefaultPresetModes(): Omit<Mode, 'id' | 'patient_id' | 'created_at'>[] {
  return [
    {
      mode_name: 'School',
      neuroband_sensitivity: 'high',
      neuroband_haptics_intensity: 50,
      neurobud_noise_reduction: 'high',
      neurobud_social_cues: true,
      neurolens_vision_mode: 'reading',
      neurolens_cues: true,
    },
    {
      mode_name: 'Work',
      neuroband_sensitivity: 'normal',
      neuroband_haptics_intensity: 60,
      neurobud_noise_reduction: 'low',
      neurobud_social_cues: true,
      neurolens_vision_mode: 'task',
      neurolens_cues: false,
    },
    {
      mode_name: 'Home',
      neuroband_sensitivity: 'low',
      neuroband_haptics_intensity: 30,
      neurobud_noise_reduction: 'off',
      neurobud_social_cues: false,
      neurolens_vision_mode: 'reading',
      neurolens_cues: false,
    },
    {
      mode_name: 'Transit',
      neuroband_sensitivity: 'high',
      neuroband_haptics_intensity: 70,
      neurobud_noise_reduction: 'high',
      neurobud_social_cues: false,
      neurolens_vision_mode: 'crowd',
      neurolens_cues: true,
    },
  ];
}

/**
 * Create a new mode
 */
export async function createMode(
  patientId: string,
  modeName: string,
  settings: Omit<Mode, 'id' | 'patient_id' | 'created_at' | 'mode_name'>
): Promise<Mode> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('modes')
    .insert({
      patient_id: patientId,
      mode_name: modeName,
      ...settings,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create mode: ${error.message}`);
  }

  return data;
}

/**
 * Get all modes for a patient
 */
export async function getPatientModes(patientId: string): Promise<Mode[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('modes')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch modes: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single mode by ID
 */
export async function getMode(modeId: string): Promise<Mode> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('modes')
    .select('*')
    .eq('id', modeId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch mode: ${error.message}`);
  }

  return data;
}

/**
 * Update a mode
 */
export async function updateMode(
  modeId: string,
  updates: Partial<Omit<Mode, 'id' | 'patient_id' | 'created_at'>>
): Promise<Mode> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('modes')
    .update(updates)
    .eq('id', modeId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update mode: ${error.message}`);
  }

  return data;
}

/**
 * Delete a mode
 */
export async function deleteMode(modeId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('modes')
    .delete()
    .eq('id', modeId);

  if (error) {
    throw new Error(`Failed to delete mode: ${error.message}`);
  }
}

/**
 * Switch to a mode (apply settings to all devices)
 * Returns true if mode was switched within 1 second
 */
export async function switchMode(modeId: string): Promise<boolean> {
  const startTime = performance.now();

  try {
    // In a real implementation, this would:
    // 1. Get the mode settings
    // 2. Apply settings to all connected devices
    // 3. Update device configurations
    // 4. Broadcast mode change via Realtime

    // Simulate mode switching
    const mode = await getMode(modeId);
    console.log('Switching to mode:', mode.mode_name);

    // Simulate device configuration updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    const endTime = performance.now();
    const switchTime = endTime - startTime;

    // Verify mode switch completed within 1 second
    return switchTime < 1000;
  } catch (error) {
    console.error('Failed to switch mode:', error);
    return false;
  }
}

/**
 * Initialize default preset modes for a patient
 */
export async function initializePresetModes(patientId: string): Promise<Mode[]> {
  const supabase = getSupabase();
  const presets = getDefaultPresetModes();

  const modes: Mode[] = [];

  for (const preset of presets) {
    const { data, error } = await supabase
      .from('modes')
      .insert({
        patient_id: patientId,
        ...preset,
      })
      .select()
      .single();

    if (error) {
      console.error(`Failed to create preset mode ${preset.mode_name}:`, error);
      continue;
    }

    modes.push(data);
  }

  return modes;
}

/**
 * Get mode label for display
 */
export function getModeLabel(modeName: string): string {
  return modeName;
}

/**
 * Get sensitivity label for display
 */
export function getSensitivityLabel(sensitivity: 'low' | 'normal' | 'high'): string {
  const labels: Record<string, string> = {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
  };
  return labels[sensitivity] || sensitivity;
}

/**
 * Get noise reduction label for display
 */
export function getNoiseReductionLabel(noiseReduction: 'off' | 'low' | 'high'): string {
  const labels: Record<string, string> = {
    off: 'Off',
    low: 'Low',
    high: 'High',
  };
  return labels[noiseReduction] || noiseReduction;
}

/**
 * Get vision mode label for display
 */
export function getVisionModeLabel(visionMode: 'reading' | 'outdoor' | 'crowd' | 'task' | 'meeting'): string {
  const labels: Record<string, string> = {
    reading: 'Reading',
    outdoor: 'Outdoor',
    crowd: 'Crowd',
    task: 'Task',
    meeting: 'Meeting',
  };
  return labels[visionMode] || visionMode;
}

/**
 * Validate mode configuration
 */
export function validateModeConfig(
  modeName: string,
  settings: Omit<Mode, 'id' | 'patient_id' | 'created_at' | 'mode_name'>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!modeName || modeName.trim().length === 0) {
    errors.push('Mode name is required');
  }

  if (!settings.neuroband_sensitivity) {
    errors.push('Neuroband sensitivity is required');
  }

  if (settings.neuroband_haptics_intensity < 0 || settings.neuroband_haptics_intensity > 100) {
    errors.push('Neuroband haptics intensity must be between 0 and 100');
  }

  if (!settings.neurobud_noise_reduction) {
    errors.push('Neurobud noise reduction is required');
  }

  if (!settings.neurolens_vision_mode) {
    errors.push('NeuroLens vision mode is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
