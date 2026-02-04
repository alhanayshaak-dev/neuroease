import {
  getConnectionStatus,
  formatBatteryLevel,
  formatLastSync,
} from '../devices';
import { Device } from '@/types/database';

describe('Device Management Utilities', () => {
  describe('getConnectionStatus', () => {
    it('should return "disconnected" when device is not connected', () => {
      const device: Device = {
        id: '1',
        patient_id: '1',
        device_type: 'neuroband',
        device_name: 'My Neuroband',
        mac_address: '00:11:22:33:44:55',
        battery_level: 80,
        is_connected: false,
        firmware_version: '1.0.0',
        last_sync: new Date().toISOString(),
        damage_state: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(getConnectionStatus(device)).toBe('disconnected');
    });

    it('should return "low_battery" when battery is below 20%', () => {
      const device: Device = {
        id: '1',
        patient_id: '1',
        device_type: 'neuroband',
        device_name: 'My Neuroband',
        mac_address: '00:11:22:33:44:55',
        battery_level: 15,
        is_connected: true,
        firmware_version: '1.0.0',
        last_sync: new Date().toISOString(),
        damage_state: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(getConnectionStatus(device)).toBe('low_battery');
    });

    it('should return "connected" when device is connected with good battery', () => {
      const device: Device = {
        id: '1',
        patient_id: '1',
        device_type: 'neuroband',
        device_name: 'My Neuroband',
        mac_address: '00:11:22:33:44:55',
        battery_level: 80,
        is_connected: true,
        firmware_version: '1.0.0',
        last_sync: new Date().toISOString(),
        damage_state: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(getConnectionStatus(device)).toBe('connected');
    });

    it('should return "connected" when battery is exactly 20%', () => {
      const device: Device = {
        id: '1',
        patient_id: '1',
        device_type: 'neuroband',
        device_name: 'My Neuroband',
        mac_address: '00:11:22:33:44:55',
        battery_level: 20,
        is_connected: true,
        firmware_version: '1.0.0',
        last_sync: new Date().toISOString(),
        damage_state: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(getConnectionStatus(device)).toBe('connected');
    });
  });

  describe('formatBatteryLevel', () => {
    it('should format battery level as percentage', () => {
      expect(formatBatteryLevel(80)).toBe('80%');
      expect(formatBatteryLevel(100)).toBe('100%');
      expect(formatBatteryLevel(0)).toBe('0%');
    });

    it('should round battery level to nearest integer', () => {
      expect(formatBatteryLevel(80.4)).toBe('80%');
      expect(formatBatteryLevel(80.5)).toBe('81%');
      expect(formatBatteryLevel(80.9)).toBe('81%');
    });
  });

  describe('formatLastSync', () => {
    it('should return "Just now" for times less than 1 minute ago', () => {
      const now = new Date();
      const lastSync = new Date(now.getTime() - 30000).toISOString(); // 30 seconds ago
      expect(formatLastSync(lastSync)).toBe('Just now');
    });

    it('should return minutes ago for times less than 1 hour ago', () => {
      const now = new Date();
      const lastSync = new Date(now.getTime() - 5 * 60000).toISOString(); // 5 minutes ago
      expect(formatLastSync(lastSync)).toBe('5m ago');
    });

    it('should return hours ago for times less than 1 day ago', () => {
      const now = new Date();
      const lastSync = new Date(now.getTime() - 3 * 3600000).toISOString(); // 3 hours ago
      expect(formatLastSync(lastSync)).toBe('3h ago');
    });

    it('should return days ago for times more than 1 day ago', () => {
      const now = new Date();
      const lastSync = new Date(now.getTime() - 2 * 86400000).toISOString(); // 2 days ago
      expect(formatLastSync(lastSync)).toBe('2d ago');
    });
  });
});
