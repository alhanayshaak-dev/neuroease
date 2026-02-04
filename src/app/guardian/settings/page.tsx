'use client';

// Guardian settings page for managing user preferences and display options
import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Volume2,
  Smartphone,
  Moon,
  Globe,
  Database,
  Shield,
  AlertCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'display' | 'data'>('general');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    darkMode: true,
    soundEnabled: true,
    vibrationEnabled: true,
    autoSync: true,
    locationTracking: true,
    dataCollection: true,
    analyticsSharing: false,
  });

  const toggleSetting = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    });
  };

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
            <p className="text-xs text-gray-400">Customize your guardian experience</p>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy', icon: Lock },
            { id: 'display', label: 'Display', icon: Eye },
            { id: 'data', label: 'Data', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  isActive
                    ? `bg-teal-600/20 border border-teal-600 text-teal-400`
                    : 'bg-navy-900 border border-teal-600/30 text-gray-400 hover:text-teal-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-semibold text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">General Settings</h2>

              <div className="space-y-4">
                {/* Auto-Sync */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Auto-Sync Data</p>
                    <p className="text-gray-400 text-sm">Automatically sync data with Violet&apos;s devices</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('autoSync')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.autoSync
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.autoSync ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Language</p>
                    <p className="text-gray-400 text-sm">Choose your preferred language</p>
                  </div>
                  <select className="bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                {/* Time Zone */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Time Zone</p>
                    <p className="text-gray-400 text-sm">Set your local time zone</p>
                  </div>
                  <select className="bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Date Format</p>
                    <p className="text-gray-400 text-sm">Choose how dates are displayed</p>
                  </div>
                  <select className="bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Bell size={18} /> Email Notifications
                    </p>
                    <p className="text-gray-400 text-sm">Receive updates via email</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('emailNotifications')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.emailNotifications
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.emailNotifications ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Smartphone size={18} /> Push Notifications
                    </p>
                    <p className="text-gray-400 text-sm">Receive push notifications on your device</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('pushNotifications')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.pushNotifications
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.pushNotifications ? 'On' : 'Off'}
                  </button>
                </div>

                {/* SMS Alerts */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">SMS Alerts</p>
                    <p className="text-gray-400 text-sm">Receive critical alerts via SMS</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('smsAlerts')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.smsAlerts
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.smsAlerts ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Volume2 size={18} /> Sound
                    </p>
                    <p className="text-gray-400 text-sm">Play sound for notifications</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('soundEnabled')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.soundEnabled
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.soundEnabled ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Vibration */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Vibration</p>
                    <p className="text-gray-400 text-sm">Vibrate for notifications</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('vibrationEnabled')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.vibrationEnabled
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.vibrationEnabled ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Privacy & Security</h2>

              <div className="space-y-4">
                {/* Location Tracking */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Globe size={18} /> Location Tracking
                    </p>
                    <p className="text-gray-400 text-sm">Allow location tracking for Violet&apos;s safety</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('locationTracking')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.locationTracking
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.locationTracking ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Data Collection */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Database size={18} /> Data Collection
                    </p>
                    <p className="text-gray-400 text-sm">Allow collection of health and activity data</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('dataCollection')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.dataCollection
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.dataCollection ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Analytics Sharing */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Shield size={18} /> Analytics Sharing
                    </p>
                    <p className="text-gray-400 text-sm">Share anonymized data to improve the app</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('analyticsSharing')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.analyticsSharing
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.analyticsSharing ? 'On' : 'Off'}
                  </button>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="mt-6 p-4 bg-teal-900/20 border border-teal-600/30 rounded-lg">
                <p className="text-teal-400 text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle size={18} /> Privacy Notice
                </p>
                <p className="text-gray-300 text-sm">
                  Your privacy is important to us. All data is encrypted and stored securely. Violet maintains full control over what data is shared with you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Display Settings */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Display Preferences</h2>

              <div className="space-y-4">
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Moon size={18} /> Dark Mode
                    </p>
                    <p className="text-gray-400 text-sm">Use dark theme for the app</p>
                  </div>
                  <button type="button"
                    onClick={() => toggleSetting('darkMode')}
                    className={`px-4 py-2 rounded font-semibold transition-colors ${
                      settings.darkMode
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {settings.darkMode ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Text Size */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Text Size</p>
                    <p className="text-gray-400 text-sm">Adjust text size for readability</p>
                  </div>
                  <select className="bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white">
                    <option>Small</option>
                    <option>Normal</option>
                    <option>Large</option>
                    <option>Extra Large</option>
                  </select>
                </div>

                {/* Compact Mode */}
                <div className="flex items-center justify-between p-4 bg-black/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Compact Mode</p>
                    <p className="text-gray-400 text-sm">Show more information on screen</p>
                  </div>
                  <button type="button" className="px-4 py-2 bg-gray-700 text-gray-300 rounded font-semibold">
                    Off
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Settings */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Data Management</h2>

              <div className="space-y-4">
                {/* Storage Usage */}
                <div className="p-4 bg-black/50 rounded-lg">
                  <p className="text-white font-semibold mb-3">Storage Usage</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Used</span>
                      <span className="text-white">2.4 GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>2.4 GB / 4 GB</span>
                    </div>
                  </div>
                </div>

                {/* Clear Cache */}
                <button type="button" className="w-full p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors text-left">
                  <p className="text-white font-semibold">Clear Cache</p>
                  <p className="text-gray-400 text-sm">Free up space by clearing cached data</p>
                </button>

                {/* Export Data */}
                <button type="button" className="w-full p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors text-left">
                  <p className="text-white font-semibold">Export Data</p>
                  <p className="text-gray-400 text-sm">Download your data in a portable format</p>
                </button>

                {/* Delete Account */}
                <button type="button" className="w-full p-4 bg-red-900/20 border border-red-600/30 rounded-lg hover:bg-red-900/30 transition-colors text-left">
                  <p className="text-red-400 font-semibold">Delete Account</p>
                  <p className="text-red-300/70 text-sm">Permanently delete your account and all data</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GuardianLayout>
  );
}
