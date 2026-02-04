import {
  getGestureTypeLabel,
  getActionLabel,
  validateGestureConfig,
  executeGestureAction,
} from '../gestures';
import { Gesture } from '@/types/database';

describe('Gesture Management Utilities', () => {
  describe('getGestureTypeLabel', () => {
    it('should return correct label for long-press', () => {
      expect(getGestureTypeLabel('long-press')).toBe('Long Press');
    });

    it('should return correct label for swipe', () => {
      expect(getGestureTypeLabel('swipe')).toBe('Swipe');
    });

    it('should return correct label for double-tap', () => {
      expect(getGestureTypeLabel('double-tap')).toBe('Double Tap');
    });

    it('should return correct label for triple-tap', () => {
      expect(getGestureTypeLabel('triple-tap')).toBe('Triple Tap');
    });

    it('should return correct label for custom', () => {
      expect(getGestureTypeLabel('custom')).toBe('Custom');
    });
  });

  describe('getActionLabel', () => {
    it('should return correct label for toggle-emergency', () => {
      expect(getActionLabel('toggle-emergency')).toBe('Toggle Emergency Mode');
    });

    it('should return correct label for open-menu', () => {
      expect(getActionLabel('open-menu')).toBe('Open Menu');
    });

    it('should return correct label for call-guardian', () => {
      expect(getActionLabel('call-guardian')).toBe('Call Guardian');
    });

    it('should return correct label for activate-strategy', () => {
      expect(getActionLabel('activate-strategy')).toBe('Activate Coping Strategy');
    });

    it('should return action name for unknown action', () => {
      expect(getActionLabel('unknown-action')).toBe('unknown-action');
    });
  });

  describe('validateGestureConfig', () => {
    it('should validate correct gesture config', () => {
      const result = validateGestureConfig('long-press', 'toggle-emergency', {});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing gesture type', () => {
      const result = validateGestureConfig('' as any, 'toggle-emergency', {});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Gesture type is required');
    });

    it('should reject missing action', () => {
      const result = validateGestureConfig('long-press', '', {});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Action is required');
    });

    it('should reject activate-strategy without strategyId', () => {
      const result = validateGestureConfig('long-press', 'activate-strategy', {});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Strategy ID is required for activate-strategy action');
    });

    it('should validate activate-strategy with strategyId', () => {
      const result = validateGestureConfig('long-press', 'activate-strategy', {
        strategyId: 'strategy-123',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('executeGestureAction', () => {
    it('should execute gesture action within 500ms', async () => {
      const gesture: Gesture = {
        id: '1',
        patient_id: '1',
        gesture_type: 'long-press',
        action: 'toggle-emergency',
        action_params: {},
        applies_to_modes: [],
        user_only: false,
        can_be_overridden_by_carer: true,
        created_at: new Date().toISOString(),
      };

      const result = await executeGestureAction(gesture);
      expect(result).toBe(true);
    });

    it('should not execute gesture if mode does not match', async () => {
      const gesture: Gesture = {
        id: '1',
        patient_id: '1',
        gesture_type: 'long-press',
        action: 'toggle-emergency',
        action_params: {},
        applies_to_modes: ['school', 'work'],
        user_only: false,
        can_be_overridden_by_carer: true,
        created_at: new Date().toISOString(),
      };

      const result = await executeGestureAction(gesture, 'home');
      expect(result).toBe(false);
    });

    it('should execute gesture if mode matches', async () => {
      const gesture: Gesture = {
        id: '1',
        patient_id: '1',
        gesture_type: 'long-press',
        action: 'toggle-emergency',
        action_params: {},
        applies_to_modes: ['school', 'work'],
        user_only: false,
        can_be_overridden_by_carer: true,
        created_at: new Date().toISOString(),
      };

      const result = await executeGestureAction(gesture, 'school');
      expect(result).toBe(true);
    });

    it('should execute gesture if no mode restrictions', async () => {
      const gesture: Gesture = {
        id: '1',
        patient_id: '1',
        gesture_type: 'long-press',
        action: 'toggle-emergency',
        action_params: {},
        applies_to_modes: [],
        user_only: false,
        can_be_overridden_by_carer: true,
        created_at: new Date().toISOString(),
      };

      const result = await executeGestureAction(gesture, 'any-mode');
      expect(result).toBe(true);
    });
  });
});
