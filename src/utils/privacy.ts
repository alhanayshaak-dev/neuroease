/**
 * Privacy and data control utilities
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6
 */

export interface AIAccessSettings {
  ai_predictions_enabled: boolean;
  ai_strategy_suggestions_enabled: boolean;
  ai_conversation_simplification_enabled: boolean;
  ai_therapist_insights_enabled: boolean;
  data_retention_days: number;
  allow_data_export: boolean;
  allow_data_deletion: boolean;
}

export interface DataRetentionPolicy {
  sensor_data_days: number;
  medical_files_days: number;
  messages_days: number;
  analytics_days: number;
}

/**
 * Get default AI access settings (all disabled by default)
 */
export function getDefaultAIAccessSettings(): AIAccessSettings {
  return {
    ai_predictions_enabled: false,
    ai_strategy_suggestions_enabled: false,
    ai_conversation_simplification_enabled: false,
    ai_therapist_insights_enabled: false,
    data_retention_days: 90,
    allow_data_export: true,
    allow_data_deletion: true,
  };
}

/**
 * Get default data retention policy
 */
export function getDefaultDataRetentionPolicy(): DataRetentionPolicy {
  return {
    sensor_data_days: 90,
    medical_files_days: 365,
    messages_days: 180,
    analytics_days: 365,
  };
}

/**
 * Validate AI access settings
 */
export function validateAIAccessSettings(settings: Partial<AIAccessSettings>): boolean {
  if (settings.data_retention_days !== undefined) {
    if (typeof settings.data_retention_days !== 'number') {
      return false;
    }
    if (settings.data_retention_days < 0 || settings.data_retention_days > 365) {
      return false;
    }
  }

  if (settings.ai_predictions_enabled !== undefined && typeof settings.ai_predictions_enabled !== 'boolean') {
    return false;
  }

  if (settings.ai_strategy_suggestions_enabled !== undefined && typeof settings.ai_strategy_suggestions_enabled !== 'boolean') {
    return false;
  }

  if (settings.ai_conversation_simplification_enabled !== undefined && typeof settings.ai_conversation_simplification_enabled !== 'boolean') {
    return false;
  }

  if (settings.ai_therapist_insights_enabled !== undefined && typeof settings.ai_therapist_insights_enabled !== 'boolean') {
    return false;
  }

  if (settings.allow_data_export !== undefined && typeof settings.allow_data_export !== 'boolean') {
    return false;
  }

  if (settings.allow_data_deletion !== undefined && typeof settings.allow_data_deletion !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Check if AI feature is enabled
 */
export function isAIFeatureEnabled(
  settings: AIAccessSettings,
  feature: keyof Omit<AIAccessSettings, 'data_retention_days' | 'allow_data_export' | 'allow_data_deletion'>
): boolean {
  return settings[feature] === true;
}

/**
 * Get enabled AI features
 */
export function getEnabledAIFeatures(settings: AIAccessSettings): string[] {
  const features: string[] = [];

  if (settings.ai_predictions_enabled) features.push('predictions');
  if (settings.ai_strategy_suggestions_enabled) features.push('strategy_suggestions');
  if (settings.ai_conversation_simplification_enabled) features.push('conversation_simplification');
  if (settings.ai_therapist_insights_enabled) features.push('therapist_insights');

  return features;
}

/**
 * Calculate data expiration date
 */
export function calculateDataExpirationDate(createdAt: string, retentionDays: number): Date {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + retentionDays);
  return date;
}

/**
 * Check if data should be deleted based on retention policy
 */
export function shouldDeleteData(createdAt: string, retentionDays: number): boolean {
  const expirationDate = calculateDataExpirationDate(createdAt, retentionDays);
  return new Date() > expirationDate;
}

/**
 * Get data retention status
 */
export function getDataRetentionStatus(
  createdAt: string,
  retentionDays: number
): 'active' | 'expiring_soon' | 'expired' {
  const expirationDate = calculateDataExpirationDate(createdAt, retentionDays);
  const now = new Date();
  const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration < 0) {
    return 'expired';
  }

  if (daysUntilExpiration <= 7) {
    return 'expiring_soon';
  }

  return 'active';
}

/**
 * Format data retention days for display
 */
export function formatDataRetentionDays(days: number): string {
  if (days === 0) {
    return 'No retention (deleted immediately)';
  }

  if (days === 365) {
    return '1 year';
  }

  if (days >= 30) {
    const months = Math.round(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }

  return `${days} day${days > 1 ? 's' : ''}`;
}

/**
 * Merge AI access settings with defaults
 */
export function mergeAIAccessSettings(
  custom: Partial<AIAccessSettings>,
  defaults: AIAccessSettings = getDefaultAIAccessSettings()
): AIAccessSettings {
  return {
    ai_predictions_enabled: custom.ai_predictions_enabled ?? defaults.ai_predictions_enabled,
    ai_strategy_suggestions_enabled: custom.ai_strategy_suggestions_enabled ?? defaults.ai_strategy_suggestions_enabled,
    ai_conversation_simplification_enabled: custom.ai_conversation_simplification_enabled ?? defaults.ai_conversation_simplification_enabled,
    ai_therapist_insights_enabled: custom.ai_therapist_insights_enabled ?? defaults.ai_therapist_insights_enabled,
    data_retention_days: custom.data_retention_days ?? defaults.data_retention_days,
    allow_data_export: custom.allow_data_export ?? defaults.allow_data_export,
    allow_data_deletion: custom.allow_data_deletion ?? defaults.allow_data_deletion,
  };
}
