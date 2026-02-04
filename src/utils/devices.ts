import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export type Device = Database['public']['Tables']['devices']['Row'];

const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

/**
 * Register a new device for a patient
 */
export async function registerDevice(
  patientId: string,
  deviceType: 'neuroband' | 'neurobud' | 'neurolens',
  deviceName: string,
  macAddress: string,
  firmwareVersion: string
): Promise<Device> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('devices')
    .insert({
      patient_id: patientId,
      device_type: deviceType,
      device_name: deviceName,
      mac_address: macAddress,
      firmware_version: firmwareVersion,
      battery_level: 100,
      is_connected: false,
      last_sync: new Date().toISOString(),
      damage_state: {},
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to register device: ${error.message}`);
  }

  return data;
}

/**
 * Get all devices for a patient
 */
export async function getPatientDevices(patientId: string): Promise<Device[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch devices: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single device by ID
 */
export async function getDevice(deviceId: string): Promise<Device> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', deviceId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch device: ${error.message}`);
  }

  return data;
}

/**
 * Update device status (battery, connection, last sync)
 */
export async function updateDeviceStatus(
  deviceId: string,
  updates: {
    battery_level?: number;
    is_connected?: boolean;
    last_sync?: string;
  }
): Promise<Device> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('devices')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deviceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update device: ${error.message}`);
  }

  return data;
}

/**
 * Update device damage state
 */
export async function updateDeviceDamageState(
  deviceId: string,
  damageState: Record<string, unknown>
): Promise<Device> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('devices')
    .update({
      damage_state: damageState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deviceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update device damage state: ${error.message}`);
  }

  return data;
}

/**
 * Delete a device
 */
export async function deleteDevice(deviceId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', deviceId);

  if (error) {
    throw new Error(`Failed to delete device: ${error.message}`);
  }
}

/**
 * Pair a device (simulate pairing logic)
 * In a real implementation, this would handle Bluetooth pairing
 */
export async function pairDevice(
  deviceId: string,
  pairingCode: string
): Promise<Device> {
  // Validate pairing code format (simple validation)
  if (!pairingCode || pairingCode.length < 4) {
    throw new Error('Invalid pairing code');
  }

  // Update device as connected
  return updateDeviceStatus(deviceId, {
    is_connected: true,
    last_sync: new Date().toISOString(),
  });
}

/**
 * Unpair a device
 */
export async function unpairDevice(deviceId: string): Promise<Device> {
  return updateDeviceStatus(deviceId, {
    is_connected: false,
  });
}

/**
 * Get device connection status
 */
export function getConnectionStatus(device: Device): 'connected' | 'disconnected' | 'low_battery' {
  if (!device.is_connected) {
    return 'disconnected';
  }
  if (device.battery_level < 20) {
    return 'low_battery';
  }
  return 'connected';
}

/**
 * Format battery level for display
 */
export function formatBatteryLevel(batteryLevel: number): string {
  return `${Math.round(batteryLevel)}%`;
}

/**
 * Format last sync time for display
 */
export function formatLastSync(lastSync: string): string {
  const date = new Date(lastSync);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${diffDays}d ago`;
}
