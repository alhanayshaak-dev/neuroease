/**
 * Feature opt-in system utilities
 * Manages feature toggles, explanations, and data collection settings
 */

export type FeatureId =
  | 'ai_predictions'
  | 'stress_analytics'
  | 'medication_tracking'
  | 'appointment_prep'
  | 'emergency_mode'
  | 'social_cues'
  | 'visual_modes'
  | 'community_strategies'
  | 'therapist_collaboration'
  | 'research_participation';

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  explanation: string;
  enabled: boolean;
  data_collection: string[];
  category: 'health' | 'social' | 'accessibility' | 'collaboration' | 'research';
  requires_features: FeatureId[];
  created_at: string;
  updated_at: string;
}

export interface FeatureSettings {
  features: Record<FeatureId, Feature>;
  last_updated: string;
}

export interface FeatureDataCollection {
  feature_id: FeatureId;
  data_types: string[];
  collection_enabled: boolean;
  retention_days: number;
}

/**
 * Default features - all disabled by default
 */
export const DEFAULT_FEATURES: Record<FeatureId, Feature> = {
  ai_predictions: {
    id: 'ai_predictions',
    name: 'AI Predictions',
    description: 'Get AI-powered predictions of stress overload before it happens',
    explanation:
      'This feature uses machine learning to analyze your stress patterns and predict when you might experience overload. It helps you prepare and take preventive action. Your sensor data is analyzed to identify patterns.',
    enabled: false,
    data_collection: ['sensor_data', 'stress_scores', 'triggers'],
    category: 'health',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  stress_analytics: {
    id: 'stress_analytics',
    name: 'Stress Analytics',
    description: 'View detailed analytics and trends of your stress patterns',
    explanation:
      'This feature provides charts and insights about your stress levels over time, including trends, patterns by location and time of day, and trigger analysis. This helps you understand what affects your stress.',
    enabled: false,
    data_collection: ['sensor_data', 'stress_scores', 'location', 'activity'],
    category: 'health',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  medication_tracking: {
    id: 'medication_tracking',
    name: 'Medication Tracking',
    description: 'Track your medication adherence and see its impact on stress',
    explanation:
      'This feature lets you log your medications and see how adherence correlates with your stress levels. It helps you understand the effectiveness of your treatment plan.',
    enabled: false,
    data_collection: ['medication_logs', 'adherence_data', 'stress_scores'],
    category: 'health',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  appointment_prep: {
    id: 'appointment_prep',
    name: 'Appointment Prep',
    description: 'Get sensory preparation checklists for upcoming appointments',
    explanation:
      'This feature provides customized sensory preparation checklists before appointments to help you feel more prepared and reduce anxiety. It includes transition support and post-appointment reflection.',
    enabled: false,
    data_collection: ['appointments', 'sensory_preferences', 'preparation_history'],
    category: 'health',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  emergency_mode: {
    id: 'emergency_mode',
    name: 'Emergency Mode',
    description: 'Quick access to emergency support when experiencing overload',
    explanation:
      'This feature provides a quick-access button to activate emergency mode, which maximizes noise reduction, enables escape mode, and alerts your guardians. Use this when you need immediate support.',
    enabled: false,
    data_collection: ['emergency_activations', 'location', 'timestamp'],
    category: 'health',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  social_cues: {
    id: 'social_cues',
    name: 'Social Cues',
    description: 'Get help understanding social cues and simplifying conversations',
    explanation:
      'This feature analyzes conversations to detect tone, simplify speech, and suggest appropriate responses. It helps you navigate social interactions more comfortably.',
    enabled: false,
    data_collection: ['conversation_data', 'tone_analysis', 'response_suggestions'],
    category: 'social',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  visual_modes: {
    id: 'visual_modes',
    name: 'Visual Modes',
    description: 'Customize visual settings for different environments',
    explanation:
      'This feature lets you create custom visual modes (Reading, Outdoor, Crowd, Task, Meeting) that adjust brightness, contrast, blur, and visual cues based on your environment.',
    enabled: false,
    data_collection: ['visual_preferences', 'mode_usage'],
    category: 'accessibility',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  community_strategies: {
    id: 'community_strategies',
    name: 'Community Strategies',
    description: 'Access coping strategies shared by the community',
    explanation:
      'This feature lets you browse and rate coping strategies shared by other users and verified by therapists. You can contribute your own strategies to help others.',
    enabled: false,
    data_collection: ['strategy_ratings', 'strategy_usage', 'contributions'],
    category: 'collaboration',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  therapist_collaboration: {
    id: 'therapist_collaboration',
    name: 'Therapist Collaboration',
    description: 'Share data with your therapist for better support',
    explanation:
      'This feature lets you share your stress data, trends, and insights with your therapist. They can provide personalized recommendations and track your progress over time.',
    enabled: false,
    data_collection: ['all_data'],
    category: 'collaboration',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  research_participation: {
    id: 'research_participation',
    name: 'Research Participation',
    description: 'Contribute anonymized data to autism research',
    explanation:
      'This feature lets you opt-in to contribute anonymized data to research studies that help advance autism understanding and support. Your privacy is protected through anonymization.',
    enabled: false,
    data_collection: ['anonymized_data'],
    category: 'research',
    requires_features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

/**
 * Get all features
 */
export function getAllFeatures(): Feature[] {
  return Object.values(DEFAULT_FEATURES);
}

/**
 * Get feature by ID
 */
export function getFeature(id: FeatureId): Feature | null {
  return DEFAULT_FEATURES[id] || null;
}

/**
 * Toggle feature on/off
 */
export function toggleFeature(feature: Feature, enabled: boolean): Feature {
  return {
    ...feature,
    enabled,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: Feature): boolean {
  return feature.enabled;
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(
  category: 'health' | 'social' | 'accessibility' | 'collaboration' | 'research'
): Feature[] {
  return Object.values(DEFAULT_FEATURES).filter((f) => f.category === category);
}

/**
 * Get enabled features
 */
export function getEnabledFeatures(): Feature[] {
  return Object.values(DEFAULT_FEATURES).filter((f) => f.enabled);
}

/**
 * Get disabled features
 */
export function getDisabledFeatures(): Feature[] {
  return Object.values(DEFAULT_FEATURES).filter((f) => !f.enabled);
}

/**
 * Check if feature can be enabled (all dependencies met)
 */
export function canEnableFeature(
  feature: Feature,
  enabledFeatures: Feature[]
): { can_enable: boolean; missing_features: FeatureId[] } {
  const enabledIds = new Set(enabledFeatures.map((f) => f.id));
  const missingFeatures = feature.requires_features.filter((id) => !enabledIds.has(id));

  return {
    can_enable: missingFeatures.length === 0,
    missing_features: missingFeatures,
  };
}

/**
 * Get data collection for feature
 */
export function getFeatureDataCollection(feature: Feature): FeatureDataCollection {
  return {
    feature_id: feature.id,
    data_types: feature.data_collection,
    collection_enabled: feature.enabled,
    retention_days: 365, // Default 1 year retention
  };
}

/**
 * Get all data types collected by enabled features
 */
export function getCollectedDataTypes(enabledFeatures: Feature[]): string[] {
  const dataTypes = new Set<string>();

  for (const feature of enabledFeatures) {
    for (const dataType of feature.data_collection) {
      dataTypes.add(dataType);
    }
  }

  return Array.from(dataTypes);
}

/**
 * Get feature status summary
 */
export function getFeatureStatusSummary(features: Feature[]): {
  total: number;
  enabled: number;
  disabled: number;
  by_category: Record<string, { total: number; enabled: number }>;
} {
  const enabledCount = features.filter((f) => f.enabled).length;
  const disabledCount = features.filter((f) => !f.enabled).length;

  const byCategory: Record<string, { total: number; enabled: number }> = {};

  for (const feature of features) {
    if (!byCategory[feature.category]) {
      byCategory[feature.category] = { total: 0, enabled: 0 };
    }
    byCategory[feature.category].total += 1;
    if (feature.enabled) {
      byCategory[feature.category].enabled += 1;
    }
  }

  return {
    total: features.length,
    enabled: enabledCount,
    disabled: disabledCount,
    by_category: byCategory,
  };
}

/**
 * Validate feature settings
 */
export function validateFeatureSettings(features: Feature[]): string[] {
  const errors: string[] = [];
  const enabledIds = new Set(features.filter((f) => f.enabled).map((f) => f.id));

  for (const feature of features) {
    if (feature.enabled) {
      // Check if all required features are enabled
      for (const requiredId of feature.requires_features) {
        if (!enabledIds.has(requiredId)) {
          errors.push(
            `Feature "${feature.name}" requires "${getFeature(requiredId)?.name}" to be enabled`
          );
        }
      }
    }
  }

  return errors;
}
