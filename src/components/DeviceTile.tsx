'use client';

import React from 'react';
import {
  Battery,
  BatteryLow,
  BatteryFull,
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react';
import { Device } from '@/types/database';
import { getConnectionStatus, formatBatteryLevel, formatLastSync } from '@/utils/devices';

interface DeviceTileProps {
  device: Device;
  onSettings?: () => void;
  onRemove?: () => void;
}

export function DeviceTile({ device, onSettings, onRemove }: DeviceTileProps) {
  const connectionStatus = getConnectionStatus(device);
  const batteryPercentage = device.battery_level;
  const isConnected = device.is_connected;
  const hasDamage = Object.keys(device.damage_state || {}).length > 0;

  // Determine battery icon based on level
  const getBatteryIcon = () => {
    if (batteryPercentage >= 80) {
      return <BatteryFull className="w-5 h-5 text-green-500" />;
    }
    if (batteryPercentage >= 20) {
      return <Battery className="w-5 h-5 text-yellow-500" />;
    }
    return <BatteryLow className="w-5 h-5 text-red-500" />;
  };

  // Determine connection icon
  const getConnectionIcon = () => {
    if (isConnected) {
      return <Wifi className="w-5 h-5 text-green-500" />;
    }
    return <WifiOff className="w-5 h-5 text-neutral-500" />;
  };

  // Get device type icon
  const getDeviceIcon = () => {
    switch (device.device_type) {
      case 'neuroband':
        return '⌚';
      case 'neurobud':
        return '🎧';
      case 'neurolens':
        return '👓';
      default:
        return '📱';
    }
  };

  // Get device type label
  const getDeviceTypeLabel = () => {
    switch (device.device_type) {
      case 'neuroband':
        return 'Neuroband';
      case 'neurobud':
        return 'Neurobud';
      case 'neurolens':
        return 'NeuroLens';
      default:
        return 'Device';
    }
  };

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 hover:border-neutral-700 transition-colors">
      {/* Header with device name and type */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getDeviceIcon()}</div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-100">{device.device_name}</h3>
            <p className="text-sm text-neutral-400">{getDeviceTypeLabel()}</p>
          </div>
        </div>
        {hasDamage && <AlertCircle className="w-5 h-5 text-red-500" title="Device has damage" />}
      </div>

      {/* Status indicators */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Battery status */}
        <div className="flex items-center gap-2">
          {getBatteryIcon()}
          <div>
            <p className="text-xs text-neutral-500">Battery</p>
            <p className="text-sm font-medium text-neutral-100">
              {formatBatteryLevel(batteryPercentage)}
            </p>
          </div>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <div>
            <p className="text-xs text-neutral-500">Connection</p>
            <p className="text-sm font-medium text-neutral-100">
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
      </div>

      {/* Last sync time */}
      <div className="mb-4 pb-4 border-b border-neutral-800">
        <p className="text-xs text-neutral-500">Last Sync</p>
        <p className="text-sm text-neutral-300">{formatLastSync(device.last_sync)}</p>
      </div>

      {/* Damage state if applicable */}
      {hasDamage && (
        <div className="mb-4 pb-4 border-b border-neutral-800">
          <p className="text-xs text-neutral-500 mb-2">Damage Report</p>
          <div className="space-y-1">
            {Object.entries(device.damage_state || {}).map(([key, value]) => (
              <p key={key} className="text-sm text-red-400">
                {key}: {String(value)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Firmware version */}
      <div className="mb-4">
        <p className="text-xs text-neutral-500">Firmware</p>
        <p className="text-sm text-neutral-300">{device.firmware_version}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onSettings && (
          <button type="button"
            onClick={onSettings}
            className="flex-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded text-sm font-medium transition-colors"
          >
            Settings
          </button>
        )}
        {onRemove && (
          <button type="button"
            onClick={onRemove}
            className="flex-1 px-3 py-2 bg-red-900 hover:bg-red-800 text-red-100 rounded text-sm font-medium transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

