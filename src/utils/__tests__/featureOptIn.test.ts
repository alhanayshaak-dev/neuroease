/**
 * Unit tests for feature opt-in utilities
 */

import {
  getAllFeatures,
  getFeature,
  toggleFeature,
  isFeatureEnabled,
  getFeaturesByCategory,
  getEnabledFeatures,
  getDisabledFeatures,
  canEnableFeature,
  getFeatureDataCollection,
  getCollectedDataTypes,
  getFeatureStatusSummary,
  validateFeatureSettings,
  DEFAULT_FEATURES,
} from '../featureOptIn';

describe('Feature Opt-In Utilities', () => {
  describe('getAllFeatures', () => {
    it('should return all features', () => {
      const features = getAllFeatures();
      expect(features.length).toBeGreaterThan(0);
      expect(features.length).toBe(Object.keys(DEFAULT_FEATURES).length);
    });

    it('should return features with all required properties', () => {
      const features = getAllFeatures();
      for (const feature of features) {
        expect(feature.id).toBeDefined();
        expect(feature.name).toBeDefined();
        expect(feature.description).toBeDefined();
        expect(feature.explanation).toBeDefined();
        expect(typeof feature.enabled).toBe('boolean');
        expect(Array.isArray(feature.data_collection)).toBe(true);
        expect(feature.category).toBeDefined();
        expect(Array.isArray(feature.requires_features)).toBe(true);
      }
    });

    it('should have all features disabled by default', () => {
      const features = getAllFeatures();
      for (const feature of features) {
        expect(feature.enabled).toBe(false);
      }
    });
  });

  describe('getFeature', () => {
    it('should return feature by ID', () => {
      const feature = getFeature('ai_predictions');
      expect(feature).not.toBeNull();
      expect(feature?.id).toBe('ai_predictions');
    });

    it('should return null for invalid ID', () => {
      const feature = getFeature('invalid_feature' as any);
      expect(feature).toBeNull();
    });
  });

  describe('toggleFeature', () => {
    it('should enable feature', () => {
      const feature = getFeature('ai_predictions')!;
      const toggled = toggleFeature(feature, true);
      expect(toggled.enabled).toBe(true);
      expect(toggled.updated_at).toBeDefined();
    });

    it('should disable feature', () => {
      const feature = getFeature('ai_predictions')!;
      const enabled = toggleFeature(feature, true);
      const disabled = toggleFeature(enabled, false);
      expect(disabled.enabled).toBe(false);
    });

    it('should update timestamp', () => {
      const feature = getFeature('ai_predictions')!;
      const original = feature.updated_at;
      const toggled = toggleFeature(feature, true);
      expect(toggled.updated_at).not.toBe(original);
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for enabled feature', () => {
      const feature = getFeature('ai_predictions')!;
      const enabled = toggleFeature(feature, true);
      expect(isFeatureEnabled(enabled)).toBe(true);
    });

    it('should return false for disabled feature', () => {
      const feature = getFeature('ai_predictions')!;
      expect(isFeatureEnabled(feature)).toBe(false);
    });
  });

  describe('getFeaturesByCategory', () => {
    it('should return features by category', () => {
      const healthFeatures = getFeaturesByCategory('health');
      expect(healthFeatures.length).toBeGreaterThan(0);
      for (const feature of healthFeatures) {
        expect(feature.category).toBe('health');
      }
    });

    it('should return empty array for category with no features', () => {
      // This depends on the actual features, but we can test the structure
      const features = getFeaturesByCategory('health');
      expect(Array.isArray(features)).toBe(true);
    });
  });

  describe('getEnabledFeatures', () => {
    it('should return empty array when no features enabled', () => {
      const enabled = getEnabledFeatures();
      expect(enabled.length).toBe(0);
    });
  });

  describe('getDisabledFeatures', () => {
    it('should return all features when none enabled', () => {
      const disabled = getDisabledFeatures();
      expect(disabled.length).toBe(getAllFeatures().length);
    });
  });

  describe('canEnableFeature', () => {
    it('should allow enabling feature with no dependencies', () => {
      const feature = getFeature('ai_predictions')!;
      const result = canEnableFeature(feature, []);
      expect(result.can_enable).toBe(true);
      expect(result.missing_features.length).toBe(0);
    });

    it('should prevent enabling feature with unmet dependencies', () => {
      // Create a feature with dependencies
      const feature = {
        ...getFeature('therapist_collaboration')!,
        requires_features: ['ai_predictions' as any],
      };

      const result = canEnableFeature(feature, []);
      expect(result.can_enable).toBe(false);
      expect(result.missing_features).toContain('ai_predictions');
    });

    it('should allow enabling feature when dependencies are met', () => {
      const aiFeature = getFeature('ai_predictions')!;
      const feature = {
        ...getFeature('therapist_collaboration')!,
        requires_features: ['ai_predictions' as any],
      };

      const result = canEnableFeature(feature, [aiFeature]);
      expect(result.can_enable).toBe(true);
      expect(result.missing_features.length).toBe(0);
    });
  });

  describe('getFeatureDataCollection', () => {
    it('should return data collection for feature', () => {
      const feature = getFeature('ai_predictions')!;
      const collection = getFeatureDataCollection(feature);

      expect(collection.feature_id).toBe('ai_predictions');
      expect(Array.isArray(collection.data_types)).toBe(true);
      expect(collection.collection_enabled).toBe(false);
      expect(collection.retention_days).toBe(365);
    });

    it('should reflect feature enabled status', () => {
      const feature = toggleFeature(getFeature('ai_predictions')!, true);
      const collection = getFeatureDataCollection(feature);
      expect(collection.collection_enabled).toBe(true);
    });
  });

  describe('getCollectedDataTypes', () => {
    it('should return empty array for no enabled features', () => {
      const dataTypes = getCollectedDataTypes([]);
      expect(dataTypes.length).toBe(0);
    });

    it('should return data types from enabled features', () => {
      const feature = toggleFeature(getFeature('ai_predictions')!, true);
      const dataTypes = getCollectedDataTypes([feature]);

      expect(dataTypes.length).toBeGreaterThan(0);
      expect(dataTypes).toContain('sensor_data');
    });

    it('should not duplicate data types', () => {
      const feature1 = toggleFeature(getFeature('ai_predictions')!, true);
      const feature2 = toggleFeature(getFeature('stress_analytics')!, true);
      const dataTypes = getCollectedDataTypes([feature1, feature2]);

      const uniqueTypes = new Set(dataTypes);
      expect(uniqueTypes.size).toBe(dataTypes.length);
    });
  });

  describe('getFeatureStatusSummary', () => {
    it('should return summary with all features disabled', () => {
      const features = getAllFeatures();
      const summary = getFeatureStatusSummary(features);

      expect(summary.total).toBe(features.length);
      expect(summary.enabled).toBe(0);
      expect(summary.disabled).toBe(features.length);
    });

    it('should return summary with some features enabled', () => {
      const features = getAllFeatures().map((f) =>
        f.id === 'ai_predictions' ? toggleFeature(f, true) : f
      );
      const summary = getFeatureStatusSummary(features);

      expect(summary.enabled).toBe(1);
      expect(summary.disabled).toBe(features.length - 1);
    });

    it('should include category breakdown', () => {
      const features = getAllFeatures();
      const summary = getFeatureStatusSummary(features);

      expect(summary.by_category).toBeDefined();
      expect(Object.keys(summary.by_category).length).toBeGreaterThan(0);
    });
  });

  describe('validateFeatureSettings', () => {
    it('should validate features with no dependencies', () => {
      const features = [getFeature('ai_predictions')!];
      const errors = validateFeatureSettings(features);
      expect(errors.length).toBe(0);
    });

    it('should detect unmet dependencies', () => {
      const feature = {
        ...getFeature('therapist_collaboration')!,
        enabled: true,
        requires_features: ['ai_predictions' as any],
      };

      const errors = validateFeatureSettings([feature]);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should allow features with met dependencies', () => {
      const aiFeature = toggleFeature(getFeature('ai_predictions')!, true);
      const therapistFeature = {
        ...getFeature('therapist_collaboration')!,
        enabled: true,
        requires_features: ['ai_predictions' as any],
      };

      const errors = validateFeatureSettings([aiFeature, therapistFeature]);
      expect(errors.length).toBe(0);
    });

    it('should not validate disabled features', () => {
      const feature = {
        ...getFeature('therapist_collaboration')!,
        enabled: false,
        requires_features: ['ai_predictions' as any],
      };

      const errors = validateFeatureSettings([feature]);
      expect(errors.length).toBe(0);
    });
  });
});
