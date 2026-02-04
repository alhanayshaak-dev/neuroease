import {
  validatePermissions,
  createDefaultPermissions,
  hasPermission,
  mergePermissions,
  getEnabledPermissions,
  getDisabledPermissions,
} from '../permissions';

describe('Permissions Utility', () => {
  describe('validatePermissions', () => {
    it('should validate correct permissions object', () => {
      const validPermissions = {
        see_status: true,
        see_alerts: true,
        see_trends: false,
        see_medical: false,
        trigger_emergency: false,
        suggest_strategies: false,
        access_mic: false,
        access_camera: false,
      };

      expect(validatePermissions(validPermissions)).toBe(true);
    });

    it('should reject permissions with missing fields', () => {
      const invalidPermissions = {
        see_status: true,
        see_alerts: true,
        // missing other fields
      };

      expect(validatePermissions(invalidPermissions)).toBe(false);
    });

    it('should reject permissions with non-boolean values', () => {
      const invalidPermissions = {
        see_status: 'true', // string instead of boolean
        see_alerts: true,
        see_trends: false,
        see_medical: false,
        trigger_emergency: false,
        suggest_strategies: false,
        access_mic: false,
        access_camera: false,
      };

      expect(validatePermissions(invalidPermissions)).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validatePermissions(null)).toBe(false);
      expect(validatePermissions(undefined)).toBe(false);
    });

    it('should reject non-object values', () => {
      expect(validatePermissions('not an object')).toBe(false);
      expect(validatePermissions(123)).toBe(false);
      expect(validatePermissions([])).toBe(false);
    });
  });

  describe('createDefaultPermissions', () => {
    it('should create default permissions with correct structure', () => {
      const defaults = createDefaultPermissions();

      expect(defaults.see_status).toBe(true);
      expect(defaults.see_alerts).toBe(true);
      expect(defaults.see_trends).toBe(false);
      expect(defaults.see_medical).toBe(false);
      expect(defaults.trigger_emergency).toBe(false);
      expect(defaults.suggest_strategies).toBe(false);
      expect(defaults.access_mic).toBe(false);
      expect(defaults.access_camera).toBe(false);
    });

    it('should create valid permissions', () => {
      const defaults = createDefaultPermissions();
      expect(validatePermissions(defaults)).toBe(true);
    });
  });

  describe('hasPermission', () => {
    it('should return true for enabled permissions', () => {
      const permissions = createDefaultPermissions();
      expect(hasPermission(permissions, 'see_status')).toBe(true);
      expect(hasPermission(permissions, 'see_alerts')).toBe(true);
    });

    it('should return false for disabled permissions', () => {
      const permissions = createDefaultPermissions();
      expect(hasPermission(permissions, 'see_trends')).toBe(false);
      expect(hasPermission(permissions, 'trigger_emergency')).toBe(false);
    });
  });

  describe('mergePermissions', () => {
    it('should merge partial permissions with existing', () => {
      const existing = createDefaultPermissions();
      const partial = {
        see_trends: true,
        trigger_emergency: true,
      };

      const merged = mergePermissions(existing, partial);

      expect(merged.see_trends).toBe(true);
      expect(merged.trigger_emergency).toBe(true);
      expect(merged.see_status).toBe(true); // unchanged
      expect(merged.see_alerts).toBe(true); // unchanged
    });

    it('should preserve all fields after merge', () => {
      const existing = createDefaultPermissions();
      const partial = { see_trends: true };

      const merged = mergePermissions(existing, partial);
      expect(validatePermissions(merged)).toBe(true);
    });
  });

  describe('getEnabledPermissions', () => {
    it('should return only enabled permissions', () => {
      const permissions = createDefaultPermissions();
      const enabled = getEnabledPermissions(permissions);

      expect(enabled).toContain('see_status');
      expect(enabled).toContain('see_alerts');
      expect(enabled).not.toContain('see_trends');
      expect(enabled).not.toContain('trigger_emergency');
    });

    it('should return empty array when all disabled', () => {
      const permissions = {
        see_status: false,
        see_alerts: false,
        see_trends: false,
        see_medical: false,
        trigger_emergency: false,
        suggest_strategies: false,
        access_mic: false,
        access_camera: false,
      };

      const enabled = getEnabledPermissions(permissions);
      expect(enabled).toHaveLength(0);
    });

    it('should return all keys when all enabled', () => {
      const permissions = {
        see_status: true,
        see_alerts: true,
        see_trends: true,
        see_medical: true,
        trigger_emergency: true,
        suggest_strategies: true,
        access_mic: true,
        access_camera: true,
      };

      const enabled = getEnabledPermissions(permissions);
      expect(enabled).toHaveLength(8);
    });
  });

  describe('getDisabledPermissions', () => {
    it('should return only disabled permissions', () => {
      const permissions = createDefaultPermissions();
      const disabled = getDisabledPermissions(permissions);

      expect(disabled).toContain('see_trends');
      expect(disabled).toContain('trigger_emergency');
      expect(disabled).not.toContain('see_status');
      expect(disabled).not.toContain('see_alerts');
    });

    it('should return all keys when all disabled', () => {
      const permissions = {
        see_status: false,
        see_alerts: false,
        see_trends: false,
        see_medical: false,
        trigger_emergency: false,
        suggest_strategies: false,
        access_mic: false,
        access_camera: false,
      };

      const disabled = getDisabledPermissions(permissions);
      expect(disabled).toHaveLength(8);
    });

    it('should return empty array when all enabled', () => {
      const permissions = {
        see_status: true,
        see_alerts: true,
        see_trends: true,
        see_medical: true,
        trigger_emergency: true,
        suggest_strategies: true,
        access_mic: true,
        access_camera: true,
      };

      const disabled = getDisabledPermissions(permissions);
      expect(disabled).toHaveLength(0);
    });
  });
});
