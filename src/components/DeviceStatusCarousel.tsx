'use client';

// Force rebuild v3
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'neurobud' | 'neurolens' | 'neuroband';
  connected: boolean;
  battery: number;
  lastSync: string;
}

interface DeviceStatusCarouselProps {
  devices: Device[];
}

export function DeviceStatusCarousel({ devices }: DeviceStatusCarouselProps) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Scroll position tracking for future use
    const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
  };

  const handleDeviceClick = (deviceId: string) => {
    window.location.href = `/guardian/devices?device=${deviceId}`;
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-semibold mb-3">Connected Devices</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide" onScroll={handleScroll}>
        {devices.map((device) => (
          <button type="button"
            key={device.id}
            onClick={() => handleDeviceClick(device.id)}
            className="flex-shrink-0 w-48 bg-black/20 border border-teal-600 rounded-lg p-4 hover:border-teal-400 transition-all cursor-pointer hover:shadow-lg hover:shadow-teal-600/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-semibold text-sm">{device.name}</p>
                <p className="text-gray-400 text-xs capitalize">{device.type}</p>
              </div>
              {device.connected ? (
                <Wifi size={16} className="text-green-400" />
              ) : (
                <WifiOff size={16} className="text-gray-500" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Battery</span>
                <span className="text-white text-sm font-semibold">{device.battery}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    device.battery > 50
                      ? 'bg-green-500'
                      : device.battery > 20
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${device.battery}%` }}
                ></div>
              </div>
            </div>

            <p className="text-gray-500 text-xs mt-3">Last sync: {device.lastSync}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

