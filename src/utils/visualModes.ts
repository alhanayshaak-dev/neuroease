import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export type Mode = Database['public']['Tables']['modes']['Row'];

export type VisualModeType = 'reading' | 'outdoor' | 'crowd' | 'task' | 'meeting';

/**
 * Visual mode configuration for NeuroLens
 */
export interface VisualModeConfig {
  mode: VisualModeType;
  brightness: number; // 0-100
  contrast: number; // 0-100
  blur: number; // 0-100
  colorFilter: 'none' | 'warm' | 'cool' | 'sepia'; // Color temperature adjustments
  cuesEnabled: boolean; // Show visual cues
  fontSize: number; // 0-100 (relative scaling)
  highContrast: boolean; // High contrast mode
}

/**
 * Default visual mode configurations
 */
export const DEFAULT_VISUAL_MODES: Record<VisualModeType, VisualModeConfig> = {
  reading: {
    mode: 'reading',
    brightness: 80,
    contrast: 100,
    blur: 0,
    colorFilter: 'warm',
    cuesEnabled: true,
    fontSize: 100,
    highContrast: false,
  },
  outdoor: {
    mode: 'outdoor',
    brightness: 120,
    contrast: 110,
    blur: 0,
    colorFilter: 'cool',
    cuesEnabled: true,
    fontSize: 100,
    highContrast: false,
  },
  crowd: {
    mode: 'crowd',
    brightness: 90,
    contrast: 120,
    blur: 20,
    colorFilter: 'none',
    cuesEnabled: false,
    fontSize: 110,
    highContrast: true,
  },
  task: {
    mode: 'task',
    brightness: 100,
    contrast: 100,
    blur: 0,
    colorFilter: 'none',
    cuesEnabled: false,
    fontSize: 100,
    highContrast: false,
  },
  meeting: {
    mode: 'meeting',
    brightness: 95,
    contrast: 105,
    blur: 10,
    colorFilter: 'warm',
    cuesEnabled: true,
    fontSize: 105,
    highContrast: false,
  },
};

const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

/**
 * Get visual mode configuration
 */
export function getVisualModeConfig(mode: VisualModeType): VisualModeConfig {
  return DEFAULT_VISUAL_MODES[mode];
}

/**
 * Create custom visual mode
 */
export async function createCustomVisualMode(
  patientId: string,
  modeName: string,
  visionMode: VisualModeType,
  config: Partial<VisualModeConfig>
): Promise<Mode> {
  const supabase = getSupabase();
  const defaultConfig = DEFAULT_VISUAL_MODES[visionMode];
  const mergedConfig = { ...defaultConfig, ...config };

  const { data, error } = await supabase
    .from('modes')
    .insert({
      patient_id: patientId,
      mode_name: modeName,
      neurolens_vision_mode: visionMode,
      neurolens_cues: mergedConfig.cuesEnabled,
      neuroband_sensitivity: 'normal',
      neuroband_haptics_intensity: 50,
      neurobud_noise_reduction: 'low',
      neurobud_social_cues: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create custom visual mode: ${error.message}`);
  }

  return data;
}

/**
 * Update visual mode configuration
 */
export async function updateVisualModeConfig(
  modeId: string,
  config: Partial<VisualModeConfig>
): Promise<Mode> {
  const supabase = getSupabase();

  const updates: any = {};
  if (config.cuesEnabled !== undefined) {
    updates.neurolens_cues = config.cuesEnabled;
  }

  const { data, error } = await supabase
    .from('modes')
    .update(updates)
    .eq('id', modeId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update visual mode: ${error.message}`);
  }

  return data;
}

/**
 * Apply visual mode to UI
 * Returns CSS variables for styling
 */
export function applyVisualMode(config: VisualModeConfig): Record<string, string> {
  const brightness = config.brightness / 100;
  const contrast = config.contrast / 100;
  const blur = config.blur;
  const fontSize = config.fontSize / 100;

  let filter = `brightness(${brightness}) contrast(${contrast})`;
  if (blur > 0) {
    filter += ` blur(${blur}px)`;
  }

  let colorFilter = '';
  switch (config.colorFilter) {
    case 'warm':
      colorFilter = 'sepia(0.2)';
      break;
    case 'cool':
      colorFilter = 'hue-rotate(180deg) saturate(1.2)';
      break;
    case 'sepia':
      colorFilter = 'sepia(0.5)';
      break;
    default:
      colorFilter = '';
  }

  return {
    '--visual-filter': filter,
    '--color-filter': colorFilter,
    '--font-scale': `${fontSize}`,
    '--high-contrast': config.highContrast ? '1' : '0',
  };
}

/**
 * Get visual mode label
 */
export function getVisualModeLabel(mode: VisualModeType): string {
  const labels: Record<VisualModeType, string> = {
    reading: 'Reading',
    outdoor: 'Outdoor',
    crowd: 'Crowd',
    task: 'Task',
    meeting: 'Meeting',
  };
  return labels[mode];
}

/**
 * Get visual mode description
 */
export function getVisualModeDescription(mode: VisualModeType): string {
  const descriptions: Record<VisualModeType, string> = {
    reading: 'Optimized for reading with warm colors and reduced brightness',
    outdoor: 'Bright and high contrast for outdoor visibility',
    crowd: 'Reduced visual noise with blur and high contrast',
    task: 'Neutral settings for focused task work',
    meeting: 'Balanced settings for social interactions',
  };
  return descriptions[mode];
}

/**
 * Validate visual mode configuration
 */
export function validateVisualModeConfig(config: Partial<VisualModeConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.brightness !== undefined && (config.brightness < 0 || config.brightness > 150)) {
    errors.push('Brightness must be between 0 and 150');
  }

  if (config.contrast !== undefined && (config.contrast < 0 || config.contrast > 150)) {
    errors.push('Contrast must be between 0 and 150');
  }

  if (config.blur !== undefined && (config.blur < 0 || config.blur > 100)) {
    errors.push('Blur must be between 0 and 100');
  }

  if (config.fontSize !== undefined && (config.fontSize < 50 || config.fontSize > 150)) {
    errors.push('Font size must be between 50 and 150');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get all visual modes for a patient
 */
export async function getPatientVisualModes(patientId: string): Promise<Mode[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('modes')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch visual modes: ${error.message}`);
  }

  return data || [];
}

/**
 * Toggle visual cues for a mode
 */
export async function toggleVisualCues(modeId: string, enabled: boolean): Promise<Mode> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('modes')
    .update({ neurolens_cues: enabled })
    .eq('id', modeId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to toggle visual cues: ${error.message}`);
  }

  return data;
}
