'use client';

import React, { useState } from 'react';
import { Volume2, Clock } from 'lucide-react';

export function SettingsNotificationsTab() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(true);
  const [dndStart, setDndStart] = useState('21:00');
  const [dndEnd, setDndEnd] = useState('08:00');

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Notification Settings</h2>

        <div className="space-y-6">
          {/* Sound */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Volume2 size={18} /> Notification Sounds
              </label>
              <button type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  soundEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {soundEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">Play sound for incoming notifications</p>
          </div>

          {/* Vibration */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Volume2 size={18} /> Vibration
              </label>
              <button type="button"
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  vibrationEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {vibrationEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">Vibrate on incoming notifications</p>
          </div>

          {/* Do Not Disturb */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Clock size={18} /> Do Not Disturb (Quiet Hours)
              </label>
              <button type="button"
                onClick={() => setDndEnabled(!dndEnabled)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  dndEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {dndEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {dndEnabled && (
              <div className="bg-black/50 border border-teal-600/30 rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Start Time</label>
                  <input
                    type="time"
                    value={dndStart}
                    onChange={(e) => setDndStart(e.target.value)}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">End Time</label>
                  <input
                    type="time"
                    value={dndEnd}
                    onChange={(e) => setDndEnd(e.target.value)}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  />
                </div>
                <p className="text-gray-500 text-sm">Quiet hours: {dndStart} to {dndEnd}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
