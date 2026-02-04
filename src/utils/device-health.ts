// Device health monitoring
export interface DeviceHealth {
  id: string;
  name: string;
  health: 'excellent' | 'good' | 'warning' | 'critical';
  battery: number;
  connectivity: 'strong' | 'weak' | 'offline';
  lastSync: string;
  issues: string[];
  maintenanceNeeded: boolean;
  nextMaintenanceDate?: string;
}

export function getDeviceHealth(deviceId: string, battery: number, connected: boolean): DeviceHealth {
  const issues: string[] = [];
  let health: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';

  if (battery < 20) {
    issues.push('Low battery');
    health = 'warning';
  }
  if (battery < 10) {
    issues.push('Critical battery');
    health = 'critical';
  }
  if (!connected) {
    issues.push('Not connected');
    health = 'critical';
  }

  const deviceNames: Record<string, string> = {
    '1': 'Neurobud',
    '2': 'NeuroLens',
    '3': 'Neuroband',
  };

  return {
    id: deviceId,
    name: deviceNames[deviceId] || 'Unknown Device',
    health,
    battery,
    connectivity: connected ? (battery > 50 ? 'strong' : 'weak') : 'offline',
    lastSync: 'Just now',
    issues,
    maintenanceNeeded: battery < 30 || !connected,
    nextMaintenanceDate: battery < 30 ? 'Today' : undefined,
  };
}

export function getHealthColor(health: string): string {
  switch (health) {
    case 'excellent': return 'text-green-400';
    case 'good': return 'text-blue-400';
    case 'warning': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    default: return 'text-gray-400';
  }
}
