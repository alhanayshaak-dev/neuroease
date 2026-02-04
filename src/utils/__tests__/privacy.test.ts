import {
  getDefaultAIAccessSettings,
  getDefaultDataRetentionPolicy,
  validateAIAccessSettings,
  isAIFeatureEnabled,
  getEnabledAIFeatures,
  calculateDataExpirationDate,
  shouldDeleteData,
  getDataRetentionStatus,
  formatDataRetentionDays,
  mergeAIAccessSettings,
  type AIAccessSettings,
} from '../privacy';

describe('Privacy Utility', () => {
  describe('getDefaultAIAccessSettings', () => {
    it('should return default settings with all features disabled', () => {
      const settings = getDefaultAIAccessSettings();

      expect(settings.ai_predictions_enabled).toBe(false);
      expect(settings.ai_strategy_suggestions_enabled).toBe(false);
      expect(settings.ai_conversation_simplification_enabled).toBe(false);
      expect(settings.ai_therapist_insights_enabled).toBe(false);
    });

    it('should have data export and deletion enabled by default', () => {
      const settings = getDefaultAIAccessSettings();

      expect(settings.allow_data_export).toBe(true);
      expect(settings.allow_data_deletion).toBe(true);
    });

    it('should have 90 day retention by default', () => {
      const settings = getDefaultAIAccessSettings();
      expect(settings.data_retention_days).toBe(90);
    });
  });

  describe('getDefaultDataRetentionPolicy', () => {
    it('should return default retention policy', () => {
      const policy = getDefaultDataRetentionPolicy();

      expect(policy.sensor_data_days).toBe(90);
      expect(policy.medical_files_days).toBe(365);
      expect(policy.messages_days).toBe(180);
      expect(policy.analytics_days).toBe(365);
    });
  });

  describe('validateAIAccessSettings', () => {
    it('should validate correct settings', () => {
      const settings = getDefaultAIAccessSettings();
      expect(validateAIAccessSettings(settings)).toBe(true);
    });

    it('should reject invalid data_retention_days', () => {
      expect(validateAIAccessSettings({ data_retention_days: -1 })).toBe(false);
      expect(validateAIAccessSettings({ data_retention_days: 366 })).toBe(false);
      expect(validateAIAccessSettings({ data_retention_days: 'invalid' as any })).toBe(false);
    });

    it('should reject non-boolean AI feature values', () => {
      expect(validateAIAccessSettings({ ai_predictions_enabled: 'true' as any })).toBe(false);
      expect(validateAIAccessSettings({ ai_strategy_suggestions_enabled: 1 as any })).toBe(false);
    });

    it('should accept valid data_retention_days', () => {
      expect(validateAIAccessSettings({ data_retention_days: 0 })).toBe(true);
      expect(validateAIAccessSettings({ data_retention_days: 90 })).toBe(true);
      expect(validateAIAccessSettings({ data_retention_days: 365 })).toBe(true);
    });
  });

  describe('isAIFeatureEnabled', () => {
    it('should return true for enabled features', () => {
      const settings: AIAccessSettings = {
        ...getDefaultAIAccessSettings(),
        ai_predictions_enabled: true,
      };

      expect(isAIFeatureEnabled(settings, 'ai_predictions_enabled')).toBe(true);
    });

    it('should return false for disabled features', () => {
      const settings = getDefaultAIAccessSettings();
      expect(isAIFeatureEnabled(settings, 'ai_predictions_enabled')).toBe(false);
    });
  });

  describe('getEnabledAIFeatures', () => {
    it('should return empty array when all disabled', () => {
      const settings = getDefaultAIAccessSettings();
      expect(getEnabledAIFeatures(settings)).toEqual([]);
    });

    it('should return enabled features', () => {
      const settings: AIAccessSettings = {
        ...getDefaultAIAccessSettings(),
        ai_predictions_enabled: true,
        ai_strategy_suggestions_enabled: true,
      };

      const enabled = getEnabledAIFeatures(settings);
      expect(enabled).toContain('predictions');
      expect(enabled).toContain('strategy_suggestions');
      expect(enabled).not.toContain('conversation_simplification');
    });

    it('should return all features when all enabled', () => {
      const settings: AIAccessSettings = {
        ...getDefaultAIAccessSettings(),
        ai_predictions_enabled: true,
        ai_strategy_suggestions_enabled: true,
        ai_conversation_simplification_enabled: true,
        ai_therapist_insights_enabled: true,
      };

      const enabled = getEnabledAIFeatures(settings);
      expect(enabled.length).toBe(4);
    });
  });

  describe('calculateDataExpirationDate', () => {
    it('should calculate expiration date correctly', () => {
      const createdAt = new Date(2024, 0, 1).toISOString();
      const expirationDate = calculateDataExpirationDate(createdAt, 30);

      expect(expirationDate.getDate()).toBe(31);
      expect(expirationDate.getMonth()).toBe(0);
    });

    it('should handle month boundaries', () => {
      const createdAt = new Date(2024, 0, 15).toISOString();
      const expirationDate = calculateDataExpirationDate(createdAt, 30);

      expect(expirationDate.getDate()).toBe(14);
      expect(expirationDate.getMonth()).toBe(1);
    });
  });

  describe('shouldDeleteData', () => {
    it('should return false for recent data', () => {
      const createdAt = new Date().toISOString();
      expect(shouldDeleteData(createdAt, 90)).toBe(false);
    });

    it('should return true for expired data', () => {
      const createdAt = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
      expect(shouldDeleteData(createdAt, 90)).toBe(true);
    });
  });

  describe('getDataRetentionStatus', () => {
    it('should return active for recent data', () => {
      const createdAt = new Date().toISOString();
      expect(getDataRetentionStatus(createdAt, 90)).toBe('active');
    });

    it('should return expiring_soon for data expiring within 7 days', () => {
      const createdAt = new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString();
      expect(getDataRetentionStatus(createdAt, 90)).toBe('expiring_soon');
    });

    it('should return expired for old data', () => {
      const createdAt = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
      expect(getDataRetentionStatus(createdAt, 90)).toBe('expired');
    });
  });

  describe('formatDataRetentionDays', () => {
    it('should format 0 days', () => {
      expect(formatDataRetentionDays(0)).toBe('No retention (deleted immediately)');
    });

    it('should format days', () => {
      expect(formatDataRetentionDays(1)).toContain('1 day');
      expect(formatDataRetentionDays(7)).toContain('7 day');
    });

    it('should format months', () => {
      expect(formatDataRetentionDays(30)).toContain('month');
      expect(formatDataRetentionDays(60)).toContain('month');
      expect(formatDataRetentionDays(90)).toContain('3 month');
    });

    it('should format 365 days as 1 year', () => {
      expect(formatDataRetentionDays(365)).toBe('1 year');
    });
  });

  describe('mergeAIAccessSettings', () => {
    it('should merge custom settings with defaults', () => {
      const custom = { ai_predictions_enabled: true };
      const merged = mergeAIAccessSettings(custom);

      expect(merged.ai_predictions_enabled).toBe(true);
      expect(merged.ai_strategy_suggestions_enabled).toBe(false);
      expect(merged.data_retention_days).toBe(90);
    });

    it('should use provided defaults', () => {
      const custom = { ai_predictions_enabled: true };
      const defaults: AIAccessSettings = {
        ...getDefaultAIAccessSettings(),
        data_retention_days: 180,
      };

      const merged = mergeAIAccessSettings(custom, defaults);
      expect(merged.data_retention_days).toBe(180);
    });

    it('should preserve all fields', () => {
      const custom = { ai_predictions_enabled: true };
      const merged = mergeAIAccessSettings(custom);

      expect(merged.ai_predictions_enabled).toBeDefined();
      expect(merged.ai_strategy_suggestions_enabled).toBeDefined();
      expect(merged.ai_conversation_simplification_enabled).toBeDefined();
      expect(merged.ai_therapist_insights_enabled).toBeDefined();
      expect(merged.data_retention_days).toBeDefined();
      expect(merged.allow_data_export).toBeDefined();
      expect(merged.allow_data_deletion).toBeDefined();
    });
  });
});
