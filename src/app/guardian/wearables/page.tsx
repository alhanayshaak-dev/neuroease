'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  Watch,
  Activity,
  Heart,
  Settings,
  Battery,
  TrendingUp,
  Clock,
  Gauge,
} from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness-band' | 'ring' | 'patch';
  brand: string;
  model: string;
  status: 'connected' | 'disconnected' | 'low-battery';
  battery: number;
  lastSync: string;
  metrics: {
    heartRate: number;
    steps: number;
    calories: number;
    sleep: number;
    stress: number;
    temperature: number;
  };
}

export default function WearablesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'metrics' | 'settings'>('overview');

  const mockDevices: WearableDevice[] = [
    {
      id: '1',
      name: 'Apple Watch Series 8',
      type: 'smartwatch',
      brand: 'Apple',
      model: 'Series 8',
      status: 'connected',
      battery: 85,
      lastSync: '2 minutes ago',
      metrics: {
        heartRate: 72,
        steps: 8432,
        calories: 520,
        sleep: 7.5,
        stress: 35,
        temperature: 98.6,
      },
    },
    {
      id: '2',
      name: 'Fitbit Charge 6',
      type: 'fitness-band',
      brand: 'Fitbit',
      model: 'Charge 6',
      status: 'connected',
      battery: 60,
      lastSync: '5 minutes ago',
      metrics: {
        heartRate: 68,
        steps: 12543,
        calories: 680,
        sleep: 8.2,
        stress: 28,
        temperature: 98.5,
      },
    },
    {
      id: '3',
      name: 'Oura Ring Gen 3',
      type: 'ring',
      brand: 'Oura',
      model: 'Gen 3',
      status: 'connected',
      battery: 45,
      lastSync: '1 hour ago',
      metrics: {
        heartRate: 65,
        steps: 5234,
        calories: 380,
        sleep: 7.8,
        stress: 22,
        temperature: 98.4,
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'disconnected':
        return 'text-red-400';
      case 'low-battery':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-900/20';
      case 'disconnected':
        return 'bg-red-900/20';
      case 'low-battery':
        return 'bg-yellow-900/20';
      default:
        return 'bg-gray-900/20';
    }
  };

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Wearable Devices</h1>
            <p className="text-xs text-gray-400">Monitor Violet's health with connected wearables</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Go back"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'devices', label: 'Devices', icon: Watch },
            { id: 'metrics', label: 'Metrics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'bg-navy-900 border border-teal-600/30 text-gray-400 hover:text-teal-400'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Heart Rate</p>
                  <Heart size={18} className="text-red-400" />
                </div>
                <p className="text-white text-2xl font-bold">72 bpm</p>
                <p className="text-gray-500 text-xs mt-1">Normal range</p>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Steps Today</p>
                  <Activity size={18} className="text-teal-400" />
                </div>
                <p className="text-white text-2xl font-bold">8,432</p>
                <p className="text-gray-500 text-xs mt-1">Goal: 10,000</p>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Sleep</p>
                  <Clock size={18} className="text-blue-400" />
                </div>
                <p className="text-white text-2xl font-bold">7.5 hrs</p>
                <p className="text-gray-500 text-xs mt-1">Last night</p>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Stress Level</p>
                  <Gauge size={18} className="text-orange-400" />
                </div>
                <p className="text-white text-2xl font-bold">35%</p>
                <p className="text-gray-500 text-xs mt-1">Moderate</p>
              </div>
            </div>

            {/* Connected Devices */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-4">Connected Devices</h2>
              <div className="space-y-3">
                {mockDevices.map((device) => (
                  <div
                    key={device.id}
                    className={`p-4 rounded-lg border ${getStatusBg(device.status)} border-teal-600/30 flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <Watch size={24} className="text-teal-400" />
                      <div>
                        <p className="text-white font-semibold">{device.name}</p>
                        <p className="text-gray-400 text-sm">{device.brand} {device.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${getStatusColor(device.status)}`}>
                          {device.status === 'connected' ? 'Connected' : device.status === 'low-battery' ? 'Low Battery' : 'Disconnected'}
                        </p>
                        <p className="text-gray-500 text-xs">Synced {device.lastSync}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery size={18} className="text-teal-400" />
                        <span className="text-white font-semibold">{device.battery}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            {mockDevices.map((device) => (
              <div
                key={device.id}
                className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 cursor-pointer hover:border-teal-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Watch size={32} className="text-teal-400 mt-1" />
                    <div>
                      <h3 className="text-white text-xl font-bold">{device.name}</h3>
                      <p className="text-gray-400">{device.brand} {device.model}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${device.status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={`text-sm ${getStatusColor(device.status)}`}>
                          {device.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery size={18} className="text-teal-400" />
                      <span className="text-white font-semibold">{device.battery}%</span>
                    </div>
                    <p className="text-gray-500 text-sm">Last sync: {device.lastSync}</p>
                  </div>
                </div>

                {/* Device Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-black/50 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Heart Rate</p>
                    <p className="text-white font-bold">{device.metrics.heartRate} bpm</p>
                  </div>
                  <div className="bg-black/50 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Steps</p>
                    <p className="text-white font-bold">{device.metrics.steps.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/50 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Calories</p>
                    <p className="text-white font-bold">{device.metrics.calories} kcal</p>
                  </div>
                  <div className="bg-black/50 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Sleep</p>
                    <p className="text-white font-bold">{device.metrics.sleep} hrs</p>
                  </div>
                  <div className="bg-black/50 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Stress</p>
                    <p className="text-white font-bold">{device.metrics.stress}%</p>
                  </div>
                  <div className="bg-black/50 rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Temperature</p>
                    <p className="text-white font-bold">{device.metrics.temperature}°F</p>
                  </div>
                </div>

                {/* Device Actions */}
                <div className="flex gap-2 mt-4">
                  <button type="button" className="flex-1 px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-colors">
                    View Details
                  </button>
                  <button type="button" className="flex-1 px-4 py-2 bg-blue-600/20 border border-blue-600 text-blue-400 rounded font-semibold hover:bg-blue-600/30 transition-colors">
                    Sync Now
                  </button>
                  <button type="button" className="flex-1 px-4 py-2 bg-gray-700/20 border border-gray-600 text-gray-400 rounded font-semibold hover:bg-gray-700/30 transition-colors">
                    Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heart Rate Trends */}
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Heart Rate Trends</h3>
                  <Heart size={20} className="text-red-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Today: 72 bpm</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-red-500 h-2 rounded" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Average: 68 bpm</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-red-500 h-2 rounded" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Resting: 62 bpm</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-red-500 h-2 rounded" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sleep Analysis */}
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Sleep Analysis</h3>
                  <Clock size={20} className="text-blue-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Night: 7.5 hrs</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Weekly Avg: 7.8 hrs</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Goal: 8 hrs</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Levels */}
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Activity Levels</h3>
                  <Activity size={20} className="text-teal-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Steps: 8,432 / 10,000</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-teal-500 h-2 rounded" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Calories: 520 / 600</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-teal-500 h-2 rounded" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Active Minutes: 45 / 60</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-teal-500 h-2 rounded" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stress & Wellness */}
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Stress & Wellness</h3>
                  <Gauge size={20} className="text-orange-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Stress Level: 35%</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-orange-500 h-2 rounded" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Recovery: 78%</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-green-500 h-2 rounded" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Readiness: 82%</p>
                    <div className="w-full bg-black/50 rounded h-2">
                      <div className="bg-green-500 h-2 rounded" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Wearable Settings</h2>

              <div className="space-y-6">
                {/* Sync Settings */}
                <div className="pb-6 border-b border-teal-600/20">
                  <h3 className="text-teal-400 font-semibold mb-4">Sync Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Auto-sync enabled</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Sync frequency</span>
                      <select className="bg-black/50 border border-teal-600/30 rounded px-3 py-1 text-white text-sm">
                        <option>Every 5 minutes</option>
                        <option>Every 15 minutes</option>
                        <option>Every 30 minutes</option>
                        <option>Hourly</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Collection */}
                <div className="pb-6 border-b border-teal-600/20">
                  <h3 className="text-teal-400 font-semibold mb-4">Data Collection</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Heart rate tracking</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Sleep tracking</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Activity tracking</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Stress monitoring</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alerts & Notifications */}
                <div className="pb-6 border-b border-teal-600/20">
                  <h3 className="text-teal-400 font-semibold mb-4">Alerts & Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">High heart rate alert</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Low battery alert</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                      <span className="text-gray-300">Sync failed alert</span>
                      <button type="button" className="px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold">
                        On
                      </button>
                    </div>
                  </div>
                </div>

                {/* Device Management */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-4">Device Management</h3>
                  <div className="space-y-2">
                    <button type="button" className="w-full px-4 py-3 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-colors">
                      Add New Device
                    </button>
                    <button type="button" className="w-full px-4 py-3 bg-blue-600/20 border border-blue-600 text-blue-400 rounded font-semibold hover:bg-blue-600/30 transition-colors">
                      Pair Device
                    </button>
                    <button type="button" className="w-full px-4 py-3 bg-red-600/20 border border-red-600 text-red-400 rounded font-semibold hover:bg-red-600/30 transition-colors">
                      Unpair Device
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GuardianLayout>
  );
}
