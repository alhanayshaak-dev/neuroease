// Central export for all types

export type { Database } from './database';

// User types
export type UserRole = 'patient' | 'guardian' | 'therapist' | 'teacher';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar_url?: string;
  pronouns?: string;
  created_at: string;
  updated_at: string;
}

// Stress types
export type StressStatus = 'calm' | 'rising' | 'overload';

export interface StressLevel {
  score: number; // 0-100
  status: StressStatus;
  timestamp: string;
}

// Device types
export type DeviceType = 'neuroband' | 'neurobud' | 'neurolens';

export interface Device {
  id: string;
  patient_id: string;
  device_type: DeviceType;
  device_name: string;
  mac_address: string;
  battery_level: number;
  is_connected: boolean;
  firmware_version: string;
  last_sync: string;
  damage_state?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Sensor data types
export interface SensorReading {
  heart_rate: number;
  hrv: number;
  eda: number;
  accelerometer_x: number;
  accelerometer_y: number;
  accelerometer_z: number;
}

export interface SensorData extends SensorReading {
  id: string;
  patient_id: string;
  device_id: string;
  timestamp: string;
  location: string;
  activity: string;
  stress_score: number;
  overload_predicted: boolean;
  overload_predicted_in_minutes?: number;
  created_at: string;
}

// Coping strategy types
export type StrategyCategory = 'breathwork' | 'grounding' | 'body_awareness' | 'sensory' | 'other';

export interface CopingStrategy {
  id: string;
  patient_id: string;
  name: string;
  category: StrategyCategory;
  description: string;
  duration_minutes: number;
  success_rate: number;
  last_used?: string;
  times_used: number;
  created_by: 'user' | 'system' | 'therapist';
  created_at: string;
}

// Guardian types
export type GuardianRelationship = 'parent' | 'therapist' | 'teacher' | 'other';

export interface GuardianPermissions {
  see_status: boolean;
  see_alerts: boolean;
  see_trends: boolean;
  see_medical: boolean;
  trigger_emergency: boolean;
  suggest_strategies: boolean;
  access_mic: boolean;
  access_camera: boolean;
}

export interface Guardian {
  id: string;
  patient_id: string;
  guardian_user_id: string;
  relationship: GuardianRelationship;
  permissions: GuardianPermissions;
  created_at: string;
}

// Mode types
export type ModeVisualMode = 'reading' | 'outdoor' | 'crowd' | 'task' | 'meeting';
export type SensitivityLevel = 'low' | 'normal' | 'high';
export type NoiseReductionLevel = 'off' | 'low' | 'high';

export interface Mode {
  id: string;
  patient_id: string;
  mode_name: string;
  neuroband_sensitivity: SensitivityLevel;
  neuroband_haptics_intensity: number;
  neurobud_noise_reduction: NoiseReductionLevel;
  neurobud_social_cues: boolean;
  neurolens_vision_mode: ModeVisualMode;
  neurolens_cues: boolean;
  created_at: string;
}

// Gesture types
export interface Gesture {
  id: string;
  patient_id: string;
  gesture_type: string;
  action: string;
  action_params: Record<string, unknown>;
  applies_to_modes: string[];
  user_only: boolean;
  can_be_overridden_by_carer: boolean;
  created_at: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Community strategy types
export type AgeGroup = 'child' | 'teen' | 'adult' | 'all';

export interface CommunityStrategy {
  id: string;
  name: string;
  description: string;
  category: StrategyCategory;
  duration_minutes: number;
  age_group: AgeGroup;
  contributed_by: string;
  is_therapist_verified: boolean;
  therapist_id?: string;
  rating: number;
  rating_count: number;
  times_used: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityStrategyRating {
  id: string;
  strategy_id: string;
  patient_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}
