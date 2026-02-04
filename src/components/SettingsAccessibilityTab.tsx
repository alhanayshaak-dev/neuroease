'use client';

import React, { useState } from 'react';
import { Type, Eye, Contrast, Globe } from 'lucide-react';

export function SettingsAccessibilityTab() {
  const [textSize, setTextSize] = useState('medium');
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('en');

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Accessibility Settings</h2>

        <div className="space-y-6">
          {/* Text Size */}
          <div className="pb-6 border-b border-teal-600/20">
            <label className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
              <Type size={18} /> Text Size
            </label>
            <div className="flex gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <button type="button"
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`px-4 py-2 rounded font-semibold transition-all ${
                    textSize === size
                      ? 'bg-teal-600 text-white'
                      : 'bg-black/50 border border-teal-600/30 text-gray-300 hover:text-teal-400'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-2">Current: {textSize}</p>
          </div>

          {/* Dyslexic Font */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Eye size={18} /> Dyslexic-Friendly Font
              </label>
              <button type="button"
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  dyslexicFont
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {dyslexicFont ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">Uses OpenDyslexic font for easier reading</p>
          </div>

          {/* High Contrast */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Contrast size={18} /> High Contrast Mode
              </label>
              <button type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  highContrast
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {highContrast ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">Increases contrast for better visibility</p>
          </div>

          {/* Language */}
          <div>
            <label className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
              <Globe size={18} /> Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
            <p className="text-gray-500 text-sm mt-2">Select your preferred language</p>
          </div>
        </div>
      </div>
    </div>
  );
}
