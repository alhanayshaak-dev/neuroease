import { Database } from '@/types/database';

export type Mode = Database['public']['Tables']['modes']['Row'];

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
