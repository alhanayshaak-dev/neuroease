'use client';

import React, { useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';

export function SettingsDisplayTab() {
  const [colorScheme, setColorScheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('teal');

  const accentColors = [
    { name: 'teal', hex: '#14b8a6', label: 'Teal' },
    { name: 'blue', hex: '#3b82f6', label: 'Blue' },
    { name: 'purple', hex: '#a855f7', label: 'Purple' },
    { name: 'green', hex: '#22c55e', label: 'Green' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Display Settings</h2>

        <div className="space-y-6">
          {/* Color Scheme */}
          <div className="pb-6 border-b border-teal-600/20">
            <label className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
              <Moon size={18} /> Color Scheme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'auto', label: 'Auto', icon: Palette },
              ].map((scheme) => {
                const Icon = scheme.icon;
                return (
                  <button type="button"
                    key={scheme.id}
                    onClick={() => setColorScheme(scheme.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                      colorScheme === scheme.id
                        ? 'bg-teal-600/20 border border-teal-600 text-teal-400'
                        : 'bg-black/50 border border-teal-600/30 text-gray-400 hover:text-teal-400'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-sm font-semibold">{scheme.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-gray-500 text-sm mt-3">Current: {colorScheme}</p>
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
              <Sun size={18} /> Accent Color
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {accentColors.map((color) => (
                <button type="button"
                  key={color.name}
                  onClick={() => setAccentColor(color.name)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    accentColor === color.name
                      ? 'bg-teal-600/20 border border-teal-600'
                      : 'bg-black/50 border border-teal-600/30 hover:border-teal-600'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className="text-gray-300 text-sm font-semibold">{color.label}</span>
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-3">Current: {accentColor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
