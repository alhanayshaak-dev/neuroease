import {
  validateEmergencyActivation,
  EmergencyActivation,
} from '../emergency';

/**
 * Unit Tests for Emergency Feature
 * Tests specific examples and edge cases for emergency mode activation
 */

describe('Emergency Feature - Unit Tests', () => {
  describe('validateEmergencyActivation', () => {
    it('should validate a properly formed emergency activation', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should reject activation with missing ID', () => {
      const activation: EmergencyActivation = {
        id: '',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Activation ID is required');
    });

    it('should reject activation with missing patient ID', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Patient ID is required');
    });

    it('should reject activation with noise reduction not set to max', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      // Manually set to invalid value for testing
      (activation as any).noise_reduction_level = 'low';

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Noise reduction must be set to max');
    });

    it('should reject activation with escape mode disabled', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: false,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Escape mode must be enabled');
    });

    it('should reject activation with negative alerts sent', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: -1,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Alerts sent count cannot be negative');
    });

    it('should reject activation with missing reflection scheduled time', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: '',
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Reflection must be scheduled');
    });

    it('should accept activation with zero alerts sent', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 0,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should accept activation with multiple alerts sent', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 10,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should accept activation with reflection completed', () => {
      const now = new Date();
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        reflection_completed: true,
        reflection_completed_at: now.toISOString(),
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should report multiple validation errors', () => {
      const activation: EmergencyActivation = {
        id: '',
        patient_id: '',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: false,
        alerts_sent: -5,
        reflection_scheduled_at: '',
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(1);
      expect(validation.errors).toContain('Activation ID is required');
      expect(validation.errors).toContain('Patient ID is required');
      expect(validation.errors).toContain('Escape mode must be enabled');
      expect(validation.errors).toContain('Alerts sent count cannot be negative');
      expect(validation.errors).toContain('Reflection must be scheduled');
    });
  });

  describe('Emergency Activation Properties', () => {
    it('should have all required properties for emergency activation', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      expect(activation).toHaveProperty('id');
      expect(activation).toHaveProperty('patient_id');
      expect(activation).toHaveProperty('activated_at');
      expect(activation).toHaveProperty('noise_reduction_level');
      expect(activation).toHaveProperty('escape_mode_enabled');
      expect(activation).toHaveProperty('alerts_sent');
      expect(activation).toHaveProperty('reflection_scheduled_at');
      expect(activation).toHaveProperty('reflection_completed');
      expect(activation).toHaveProperty('reflection_completed_at');
    });

    it('should have correct property types', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      expect(typeof activation.id).toBe('string');
      expect(typeof activation.patient_id).toBe('string');
      expect(typeof activation.activated_at).toBe('string');
      expect(typeof activation.noise_reduction_level).toBe('string');
      expect(typeof activation.escape_mode_enabled).toBe('boolean');
      expect(typeof activation.alerts_sent).toBe('number');
      expect(typeof activation.reflection_scheduled_at).toBe('string');
      expect(typeof activation.reflection_completed).toBe('boolean');
    });
  });

  describe('Emergency Activation Edge Cases', () => {
    it('should handle activation with very large alert count', () => {
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: new Date().toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 1000,
        reflection_scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(true);
    });

    it('should handle activation with reflection completed immediately', () => {
      const now = new Date();
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: now.toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
        reflection_completed: true,
        reflection_completed_at: now.toISOString(),
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(true);
    });

    it('should handle activation with very old timestamp', () => {
      const oldDate = new Date('2020-01-01');
      const activation: EmergencyActivation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        patient_id: '223e4567-e89b-12d3-a456-426614174000',
        activated_at: oldDate.toISOString(),
        noise_reduction_level: 'max',
        escape_mode_enabled: true,
        alerts_sent: 3,
        reflection_scheduled_at: new Date(oldDate.getTime() + 30 * 60 * 1000).toISOString(),
        reflection_completed: false,
        reflection_completed_at: null,
      };

      const validation = validateEmergencyActivation(activation);
      expect(validation.valid).toBe(true);
    });
  });
});
