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

/**
 * Get connection status for display
 */
export function getConnectionStatus(device: Device | boolean): string {
  if (typeof device === 'boolean') {
    return device ? 'Connected' : 'Disconnected';
  }
  
  if (!device.is_connected) {
    return 'disconnected';
  }
  
  if (device.battery_level < 20) {
    return 'low_battery';
  }
  
  return 'connected';
}
