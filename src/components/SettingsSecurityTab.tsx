'use client';

import React, { useState } from 'react';
import { Lock, Fingerprint, Key } from 'lucide-react';

export function SettingsSecurityTab() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLoginActivity, setShowLoginActivity] = useState(false);

  const loginActivityData = [
    { device: 'iPhone 14 Pro', location: 'Home', time: 'Today 2:30 PM', ip: '192.168.1.100' },
    { device: 'MacBook Pro', location: 'Home', time: 'Today 9:15 AM', ip: '192.168.1.101' },
    { device: 'iPad Air', location: 'Work', time: 'Yesterday 3:45 PM', ip: '203.0.113.42' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Security Settings</h2>

        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Lock size={18} /> Two-Factor Authentication
                </label>
                <p className="text-gray-500 text-sm mt-1">Add an extra layer of security</p>
              </div>
              <button type="button"
                onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  twoFAEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {twoFAEnabled ? 'Enabled' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Biometric Login */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Fingerprint size={18} /> Biometric Login
                </label>
                <p className="text-gray-500 text-sm mt-1">Use Face ID or fingerprint to login</p>
              </div>
              <button type="button"
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  biometricEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {biometricEnabled ? 'Enabled' : 'Setup'}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Key size={18} /> Password
                </label>
                <p className="text-gray-500 text-sm mt-1">Last changed 3 months ago</p>
              </div>
              <button type="button"
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-all"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Login Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Lock size={18} /> Login Activity
              </label>
              <button type="button"
                onClick={() => setShowLoginActivity(!showLoginActivity)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showLoginActivity ? 'Hide' : 'View'}
              </button>
            </div>

            {showLoginActivity && (
              <div className="space-y-2">
                {loginActivityData.map((activity, idx) => (
                  <div key={idx} className="bg-black rounded p-3 text-sm">
                    <p className="text-gray-300 font-semibold">{activity.device}</p>
                    <p className="text-gray-500">{activity.location} • {activity.time}</p>
                    <p className="text-gray-600 text-xs mt-1">IP: {activity.ip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-white text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-gray-300 text-sm block mb-2">Current Password</label>
                <input type="password" className="w-full bg-black/20 border border-teal-600/30 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">New Password</label>
                <input type="password" className="w-full bg-black/20 border border-teal-600/30 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-2">Confirm Password</label>
                <input type="password" className="w-full bg-black/20 border border-teal-600/30 rounded px-3 py-2 text-white" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Update
              </button>
              <button type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
