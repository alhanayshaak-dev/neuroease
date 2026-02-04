'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Zap,
  BarChart3,
  Activity,
  Download,
  ArrowLeft,
  TrendingUp,
  X,
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  battery: number;
  damage?: string;
  lastSync: string;
  signalStrength?: number;
  sensorAccuracy?: number;
}

export default function DevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showGestureModal, setShowGestureModal] = useState(false);
  const [gestureConfig, setGestureConfig] = useState({
    neurolensActivate: '1 Tap',
    neurolensDeactivate: '3 Taps',
    neurobudPlayPause: '2 Taps',
    neurobudVolume: 'Long Press',
  });
  const [customGestures, setCustomGestures] = useState<Array<{gesture: string; command: string}>>([]);
  const [newGesture, setNewGesture] = useState('');
  const [newCommand, setNewCommand] = useState('');

  const devices: Device[] = [
    {
      id: '1',
      name: 'Neurobud',
      type: 'Wireless Earbuds',
      connected: true,
      battery: 85,
      lastSync: '2 min ago',
      signalStrength: 95,
      sensorAccuracy: 98,
    },
    {
      id: '2',
      name: 'NeuroLens',
      type: 'Smart Glasses',
      connected: true,
      battery: 72,
      lastSync: '5 min ago',
      signalStrength: 88,
      sensorAccuracy: 96,
    },
    {
      id: '3',
      name: 'Neuroband',
      type: 'Wrist Band',
      connected: true,
      battery: 91,
      lastSync: '1 min ago',
      signalStrength: 92,
      sensorAccuracy: 99,
    },
    {
      id: '4',
      name: 'NeuroLens (Backup)',
      type: 'Smart Glasses',
      connected: false,
      battery: 45,
      damage: 'Cracked lens',
      lastSync: '2 hours ago',
      signalStrength: 0,
      sensorAccuracy: 0,
    },
  ];

  if (selectedDevice) {
    return (
      <GuardianLayout>
        <div className="max-w-6xl mx-auto pb-20">
          {/* Header */}
          <button type="button"
            onClick={() => setSelectedDevice(null)}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Devices
          </button>

          <h1 className="text-lg font-bold text-white mb-1">{selectedDevice.name}</h1>
          <p className="text-xs text-gray-400 mb-8">{selectedDevice.type}</p>

          {/* Device Status */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Status</p>
              <div className="flex items-center gap-2">
                {selectedDevice.connected ? (
                  <>
                    <Wifi size={20} className="text-green-400" />
                    <p className="text-white font-semibold">Connected</p>
                  </>
                ) : (
                  <>
                    <WifiOff size={20} className="text-red-400" />
                    <p className="text-white font-semibold">Disconnected</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Battery</p>
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-yellow-400" />
                <p className="text-white font-semibold">{selectedDevice.battery}%</p>
              </div>
            </div>

            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Signal Strength</p>
              <p className="text-white font-semibold">{selectedDevice.signalStrength}%</p>
            </div>

            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Sensor Accuracy</p>
              <p className="text-white font-semibold">{selectedDevice.sensorAccuracy}%</p>
            </div>
          </div>

          {/* Device-Specific Sensor Data */}
          {selectedDevice.name === 'Neurobud' && (
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Privacy Status</h3>
              <div className="bg-red-900/20 border border-red-600/30 rounded p-4 mb-6">
                <p className="text-red-400 font-semibold text-sm mb-2">Microphone Disabled</p>
                <p className="text-gray-300 text-sm">Violet has disabled microphone access on this device for privacy protection.</p>
              </div>
              <h3 className="text-white font-semibold mb-4">Brainwave Data</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 text-sm mb-3">Alpha Waves (Relaxation)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[45, 52, 48, 55, 60, 58, 62, 65, 60, 55].map((val, i) => (
                      <div key={i} className="w-1.5 bg-blue-500 rounded" style={{height: `${val}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 58 μV | Avg: 55 μV</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-3">Beta Waves (Focus)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[35, 42, 38, 45, 50, 48, 52, 55, 50, 45].map((val, i) => (
                      <div key={i} className="w-1.5 bg-purple-500 rounded" style={{height: `${val}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 45 μV | Avg: 46 μV</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-3">Theta Waves (Drowsiness)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[20, 18, 22, 15, 12, 14, 10, 8, 12, 15].map((val, i) => (
                      <div key={i} className="w-1.5 bg-green-500 rounded" style={{height: `${val}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 15 μV | Avg: 15 μV</p>
                </div>
              </div>
            </div>
          )}

          {selectedDevice.name === 'NeuroLens' && (
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Privacy Status</h3>
              <div className="bg-red-900/20 border border-red-600/30 rounded p-4 mb-6">
                <p className="text-red-400 font-semibold text-sm mb-2">Camera Disabled</p>
                <p className="text-gray-300 text-sm">Violet has disabled camera access on this device for privacy protection.</p>
              </div>
              <h3 className="text-white font-semibold mb-4">Visual & Eye Tracking</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 text-sm mb-3">Gaze Fixation Duration (ms)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[250, 320, 280, 350, 400, 380, 420, 390, 350, 300].map((val, i) => (
                      <div key={i} className="w-1.5 bg-cyan-500 rounded" style={{height: `${(val / 450) * 100}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 300 ms | Avg: 347 ms</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-3">Blink Rate (blinks/min)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[18, 16, 20, 22, 24, 20, 18, 16, 14, 12].map((val, i) => (
                      <div key={i} className="w-1.5 bg-indigo-500 rounded" style={{height: `${(val / 30) * 100}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 12 blinks/min | Avg: 18 blinks/min</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-3">Light Exposure Level</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[40, 55, 65, 75, 85, 80, 70, 60, 50, 45].map((val, i) => (
                      <div key={i} className="w-1.5 bg-yellow-500 rounded" style={{height: `${val}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 45 lux | Avg: 63 lux</p>
                </div>
              </div>
            </div>
          )}

          {selectedDevice.name === 'Neuroband' && (
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Gesture Configuration</h3>
                <button type="button"
                  onClick={() => setShowGestureModal(true)}
                  className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-colors text-sm"
                >
                  Edit Gesture Configuration
                </button>
              </div>
              <div className="space-y-4 mb-6">
                <div className="bg-black/50 rounded p-4">
                  <p className="text-gray-300 text-sm mb-2">NeuroLens Control</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{gestureConfig.neurolensActivate} = Activate</span>
                      <span className="text-teal-400 text-xs font-semibold">Configured</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{gestureConfig.neurolensDeactivate} = Deactivate</span>
                      <span className="text-teal-400 text-xs font-semibold">Configured</span>
                    </div>
                  </div>
                </div>
                <div className="bg-black/50 rounded p-4">
                  <p className="text-gray-300 text-sm mb-2">Neurobud Control</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{gestureConfig.neurobudPlayPause} = Play/Pause</span>
                      <span className="text-teal-400 text-xs font-semibold">Configured</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{gestureConfig.neurobudVolume} = Volume</span>
                      <span className="text-teal-400 text-xs font-semibold">Configured</span>
                    </div>
                  </div>
                </div>
                {customGestures.length > 0 && (
                  <div className="bg-black/50 rounded p-4 border border-purple-600/30">
                    <p className="text-gray-300 text-sm mb-2">Custom Gestures ({customGestures.length})</p>
                    <div className="space-y-2">
                      {customGestures.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">{item.gesture} = {item.command}</span>
                          <span className="text-purple-400 text-xs font-semibold">Custom</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold mb-4">Heart Rate & Movement</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 text-sm mb-3">Heart Rate (bpm)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[72, 75, 78, 82, 85, 88, 85, 80, 78, 75].map((val, i) => (
                      <div key={i} className="w-1.5 bg-red-500 rounded" style={{height: `${(val / 100) * 100}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 75 bpm | Avg: 80 bpm</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-3">Movement Intensity (AU)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[30, 45, 60, 55, 70, 75, 65, 50, 40, 35].map((val, i) => (
                      <div key={i} className="w-1.5 bg-orange-500 rounded" style={{height: `${val}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Current: 35 AU | Avg: 53 AU</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-3">Steps (Last 6 hours)</p>
                  <div className="h-24 bg-black/50 rounded flex items-end justify-around p-3">
                    {[450, 520, 480, 650, 720, 680].map((val, i) => (
                      <div key={i} className="w-2 bg-green-500 rounded" style={{height: `${(val / 800) * 100}%`}}></div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Total Today: 4,200 steps</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Charts */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Data Collection
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Data Points</span>
                  <span className="text-teal-400 font-semibold">1.2M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Uptime</span>
                  <span className="text-teal-400 font-semibold">99.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Avg Latency</span>
                  <span className="text-teal-400 font-semibold">45ms</span>
                </div>
              </div>
            </div>

            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Performance
              </h3>
              <div className="h-32 bg-black/50 rounded flex items-end justify-around p-4">
                <div className="w-2 bg-teal-500" style={{height: '60%'}}></div>
                <div className="w-2 bg-teal-500" style={{height: '75%'}}></div>
                <div className="w-2 bg-teal-500" style={{height: '85%'}}></div>
                <div className="w-2 bg-teal-500" style={{height: '70%'}}></div>
                <div className="w-2 bg-teal-500" style={{height: '80%'}}></div>
              </div>
              <p className="text-gray-400 text-xs mt-2">Last 5 hours performance</p>
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Device Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                <span className="text-gray-300">Last Sync</span>
                <span className="text-white">{selectedDevice.lastSync}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                <span className="text-gray-300">Last Calibration</span>
                <span className="text-white">2024-01-28</span>
              </div>
              {selectedDevice.damage && (
                <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-600/30 rounded">
                  <span className="text-red-400 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Issue Detected
                  </span>
                  <span className="text-red-300">{selectedDevice.damage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button type="button" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2">
              <RefreshCw size={18} />
              Recalibrate
            </button>
            <button type="button" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2">
              <Download size={18} />
              Export Data
            </button>
          </div>
        </div>
      </GuardianLayout>
    );
  }

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-white mb-1">Devices</h1>
            <p className="text-xs text-gray-400">Manage Violet's connected devices and accessories</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Go back"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {devices.map((device) => (
            <button type="button"
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 hover:border-teal-400 transition-colors text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{device.name}</h3>
                  <p className="text-gray-400 text-sm">{device.type}</p>
                </div>
                {device.connected ? (
                  <Wifi size={24} className="text-green-400" />
                ) : (
                  <WifiOff size={24} className="text-red-400" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Battery</p>
                  <p className="text-white font-semibold">{device.battery}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Last Sync</p>
                  <p className="text-white font-semibold text-sm">{device.lastSync}</p>
                </div>
              </div>

              {device.damage && (
                <div className="bg-red-900/20 border border-red-600/30 rounded p-2 mb-3">
                  <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {device.damage}
                  </p>
                </div>
              )}

              <p className="text-teal-400 text-sm font-semibold">View Analytics →</p>
            </button>
          ))}
        </div>

        {/* Wearables Integration */}
        <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={24} />
            Wearable Integrations
          </h2>
          <div className="space-y-2">
            <button type="button"
              onClick={() => window.location.href = '/guardian/devices/wearable/apple-watch'}
              className="w-full flex items-center justify-between p-3 bg-black/50 rounded hover:bg-black/70 transition-colors"
            >
              <span className="text-white">Apple Watch</span>
              <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">Connected</span>
            </button>
            <button type="button"
              onClick={() => window.location.href = '/guardian/devices/wearable/fitbit'}
              className="w-full flex items-center justify-between p-3 bg-black/50 rounded hover:bg-black/70 transition-colors"
            >
              <span className="text-white">Fitbit</span>
              <span className="bg-gray-900/30 text-gray-400 text-xs px-2 py-1 rounded">Available</span>
            </button>
            <button type="button"
              onClick={() => window.location.href = '/guardian/devices/wearable/garmin'}
              className="w-full flex items-center justify-between p-3 bg-black/50 rounded hover:bg-black/70 transition-colors"
            >
              <span className="text-white">Garmin</span>
              <span className="bg-gray-900/30 text-gray-400 text-xs px-2 py-1 rounded">Available</span>
            </button>
          </div>
        </div>

        {/* NeuroEase Store */}
        <button type="button"
          onClick={() => window.location.href = '/guardian/store'}
          className="w-full bg-navy-900 border border-teal-600/30 rounded-lg p-6 hover:border-teal-400 transition-colors text-left"
        >
          <h3 className="text-white font-semibold text-lg mb-2">NeuroEase Store</h3>
          <p className="text-gray-400 text-sm mb-4">Browse devices, accessories, parts, and get AI-powered repair diagnostics</p>
          <div className="flex items-center justify-between">
            <p className="text-teal-400 text-sm font-semibold">Locate NeuroEase Store →</p>
          </div>
        </button>
      </div>

      {/* Gesture Configuration Modal */}
      {showGestureModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Edit Gesture Configuration</h2>
              <button type="button"
                onClick={() => setShowGestureModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Preset Gestures */}
            <div className="mb-6">
              <h3 className="text-teal-400 font-semibold mb-3">Preset Gestures</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">NeuroLens Activate</label>
                  <select
                    value={gestureConfig.neurolensActivate}
                    onChange={(e) => setGestureConfig({...gestureConfig, neurolensActivate: e.target.value})}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  >
                    <option>1 Tap</option>
                    <option>2 Taps</option>
                    <option>3 Taps</option>
                    <option>Long Press</option>
                    <option>Double Tap</option>
                    <option>Swipe Up</option>
                    <option>Swipe Down</option>
                    <option>Swipe Left</option>
                    <option>Swipe Right</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">NeuroLens Deactivate</label>
                  <select
                    value={gestureConfig.neurolensDeactivate}
                    onChange={(e) => setGestureConfig({...gestureConfig, neurolensDeactivate: e.target.value})}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  >
                    <option>1 Tap</option>
                    <option>2 Taps</option>
                    <option>3 Taps</option>
                    <option>Long Press</option>
                    <option>Double Tap</option>
                    <option>Swipe Up</option>
                    <option>Swipe Down</option>
                    <option>Swipe Left</option>
                    <option>Swipe Right</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Neurobud Play/Pause</label>
                  <select
                    value={gestureConfig.neurobudPlayPause}
                    onChange={(e) => setGestureConfig({...gestureConfig, neurobudPlayPause: e.target.value})}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  >
                    <option>1 Tap</option>
                    <option>2 Taps</option>
                    <option>3 Taps</option>
                    <option>Long Press</option>
                    <option>Double Tap</option>
                    <option>Swipe Up</option>
                    <option>Swipe Down</option>
                    <option>Swipe Left</option>
                    <option>Swipe Right</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Neurobud Volume Control</label>
                  <select
                    value={gestureConfig.neurobudVolume}
                    onChange={(e) => setGestureConfig({...gestureConfig, neurobudVolume: e.target.value})}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  >
                    <option>1 Tap</option>
                    <option>2 Taps</option>
                    <option>3 Taps</option>
                    <option>Long Press</option>
                    <option>Double Tap</option>
                    <option>Swipe Up</option>
                    <option>Swipe Down</option>
                    <option>Swipe Left</option>
                    <option>Swipe Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Custom Gestures */}
            <div className="mb-6 pb-6 border-t border-teal-600/30">
              <h3 className="text-teal-400 font-semibold mb-3 mt-6">Custom Gestures & Commands</h3>
              <p className="text-gray-400 text-xs mb-4">Create custom gesture-to-command mappings for advanced control</p>

              {/* Add Custom Gesture */}
              <div className="bg-black/50 rounded-lg p-4 mb-4 border border-teal-600/20">
                <p className="text-gray-300 text-sm font-semibold mb-3">Add New Gesture</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">Gesture Pattern</label>
                    <input
                      type="text"
                      placeholder="e.g., Triple Tap, Rotate Clockwise, Shake"
                      value={newGesture}
                      onChange={(e) => setNewGesture(e.target.value)}
                      className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white text-sm placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">Command/Action</label>
                    <input
                      type="text"
                      placeholder="e.g., Toggle Recording, Increase Volume, Open Menu"
                      value={newCommand}
                      onChange={(e) => setNewCommand(e.target.value)}
                      className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white text-sm placeholder-gray-500"
                    />
                  </div>
                  <button type="button"
                    onClick={() => {
                      if (newGesture.trim() && newCommand.trim()) {
                        setCustomGestures([...customGestures, {gesture: newGesture, command: newCommand}]);
                        setNewGesture('');
                        setNewCommand('');
                      }
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded font-semibold transition-colors text-sm"
                  >
                    Add Custom Gesture
                  </button>
                </div>
              </div>

              {/* List Custom Gestures */}
              {customGestures.length > 0 && (
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm font-semibold">Custom Mappings ({customGestures.length})</p>
                  {customGestures.map((item, idx) => (
                    <div key={idx} className="bg-black/50 rounded p-3 flex items-center justify-between border border-teal-600/20">
                      <div className="flex-1">
                        <p className="text-teal-400 text-sm font-semibold">{item.gesture}</p>
                        <p className="text-gray-400 text-xs">→ {item.command}</p>
                      </div>
                      <button type="button"
                        onClick={() => setCustomGestures(customGestures.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 font-semibold text-sm ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="button"
                onClick={() => {
                  setShowGestureModal(false);
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Save Configuration
              </button>
              <button type="button"
                onClick={() => {
                  setShowGestureModal(false);
                  setNewGesture('');
                  setNewCommand('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </GuardianLayout>
  );
}



