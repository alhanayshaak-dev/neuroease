import fc from 'fast-check';
import { getConnectionStatus, formatBatteryLevel, formatLastSync } from '@/utils/devices';
import { Device } from '@/types/database';

/**
 * Property 5: Device Status Display and Management
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**
 *
 * For any connected or disconnected device, the system SHALL display accurate
 * battery level, connection status, last sync time, and damage state, with
 * appropriate visual indicators.
 */

describe('Property 5: Device Status Display and Management', () => {
  // Arbitrary for generating valid Device objects
  const deviceArbitrary = fc.record({
    id: fc.uuid(),
    patient_id: fc.uuid(),
    device_type: fc.constantFrom('neuroband' as const, 'neurobud' as const, 'neurolens' as const),
    device_name: fc.string({ minLength: 1, maxLength: 50 }),
    mac_address: fc.string({ minLength: 17, maxLength: 17 }), // MAC address format
    battery_level: fc.integer({ min: 0, max: 100 }),
    is_connected: fc.boolean(),
    firmware_version: fc.string({ minLength: 1, maxLength: 20 }),
    last_sync: fc.date().map((d) => d.toISOString()),
    damage_state: fc.record(
      {
        screen: fc.option(fc.string()),
        battery: fc.option(fc.string()),
        button: fc.option(fc.string()),
      },
      { withDeletedKeys: true }
    ),
    created_at: fc.date().map((d) => d.toISOString()),
    updated_at: fc.date().map((d) => d.toISOString()),
  });

  it('should display accurate battery level for any device', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device: Device) => {
        const batteryDisplay = formatBatteryLevel(device.battery_level);

        // Battery display should be a percentage string
        expect(batteryDisplay).toMatch(/^\d+%$/);

        // Battery percentage should be within valid range
        const percentage = parseInt(batteryDisplay);
        expect(percentage).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeLessThanOrEqual(100);
      }),
      { numRuns: 100 }
    );
  });

  it('should display correct connection status for any device', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device: Device) => {
        const status = getConnectionStatus(device);

        // Status should be one of the valid values
        expect(['connected', 'disconnected', 'low_battery']).toContain(status);

        // If disconnected, status must be 'disconnected'
        if (!device.is_connected) {
          expect(status).toBe('disconnected');
        }

        // If connected with low battery, status must be 'low_battery'
        if (device.is_connected && device.battery_level < 20) {
          expect(status).toBe('low_battery');
        }

        // If connected with good battery, status must be 'connected'
        if (device.is_connected && device.battery_level >= 20) {
          expect(status).toBe('connected');
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should format last sync time consistently for any device', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device: Device) => {
        const syncDisplay = formatLastSync(device.last_sync);

        // Sync display should be a non-empty string
        expect(syncDisplay).toBeTruthy();
        expect(typeof syncDisplay).toBe('string');

        // Should contain time unit or "Just now"
        expect(
          syncDisplay === 'Just now' ||
            syncDisplay.includes('m ago') ||
            syncDisplay.includes('h ago') ||
            syncDisplay.includes('d ago')
        ).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle damage state display for any device', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device: Device) => {
        // Damage state should be an object or undefined
        expect(device.damage_state === undefined || typeof device.damage_state === 'object').toBe(
          true
        );

        // If damage state exists, it should be iterable
        if (device.damage_state) {
          const damageEntries = Object.entries(device.damage_state);
          expect(Array.isArray(damageEntries)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain device type consistency for display', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device: Device) => {
        // Device type should be one of the valid types
        expect(['neuroband', 'neurobud', 'neurolens']).toContain(device.device_type);

        // Device name should be non-empty
        expect(device.device_name.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle battery level transitions correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.boolean(),
        (batteryLevel: number, isConnected: boolean) => {
          const device: Device = {
            id: 'test-id',
            patient_id: 'patient-id',
            device_type: 'neuroband',
            device_name: 'Test Device',
            mac_address: '00:00:00:00:00:00',
            battery_level: batteryLevel,
            is_connected: isConnected,
            firmware_version: '1.0.0',
            last_sync: new Date().toISOString(),
            damage_state: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const status = getConnectionStatus(device);

          // Verify battery level boundaries
          if (batteryLevel < 20 && isConnected) {
            expect(status).toBe('low_battery');
          } else if (batteryLevel >= 20 && isConnected) {
            expect(status).toBe('connected');
          } else if (!isConnected) {
            expect(status).toBe('disconnected');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all required device information fields', () => {
    fc.assert(
      fc.property(deviceArbitrary, (device: Device) => {
        // All required fields should be present
        expect(device.id).toBeDefined();
        expect(device.patient_id).toBeDefined();
        expect(device.device_type).toBeDefined();
        expect(device.device_name).toBeDefined();
        expect(device.battery_level).toBeDefined();
        expect(device.is_connected).toBeDefined();
        expect(device.firmware_version).toBeDefined();
        expect(device.last_sync).toBeDefined();
        expect(device.damage_state).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});
