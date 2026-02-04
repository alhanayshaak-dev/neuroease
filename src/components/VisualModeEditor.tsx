'use client';

import React, { useState } from 'react';
import {
  VisualModeConfig,
  VisualModeType,
  DEFAULT_VISUAL_MODES,
  getVisualModeLabel,
  getVisualModeDescription,
  validateVisualModeConfig,
} from '@/utils/visualModes';
import { Sliders, Eye, EyeOff } from 'lucide-react';

interface VisualModeEditorProps {
  mode: VisualModeType;
  onConfigChange: (config: Partial<VisualModeConfig>) => void;
  onCuesToggle: (enabled: boolean) => void;
  initialConfig?: Partial<VisualModeConfig>;
}

export function VisualModeEditor({
  mode,
  onConfigChange,
  onCuesToggle,
  initialConfig,
}: VisualModeEditorProps) {
  const defaultConfig = DEFAULT_VISUAL_MODES[mode];
  const [config, setConfig] = useState<Partial<VisualModeConfig>>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSliderChange = (key: keyof VisualModeConfig, value: number) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);

    const validation = validateVisualModeConfig(newConfig);
    setErrors(validation.errors);

    if (validation.valid) {
      onConfigChange(newConfig);
    }
  };

  const handleCuesToggle = () => {
    const newCuesState = !config.cuesEnabled;
    setConfig({ ...config, cuesEnabled: newCuesState });
    onCuesToggle(newCuesState);
  };

  const handleColorFilterChange = (filter: 'none' | 'warm' | 'cool' | 'sepia') => {
    const newConfig = { ...config, colorFilter: filter };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleHighContrastToggle = () => {
    const newConfig = { ...config, highContrast: !config.highContrast };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    onConfigChange(defaultConfig);
    setErrors([]);
  };

  return (
    <div className="space-y-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-teal-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">{getVisualModeLabel(mode)}</h3>
          <p className="text-sm text-gray-400">{getVisualModeDescription(mode)}</p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-900 border border-red-700 rounded text-red-300 text-sm">
          {errors.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      )}

      {/* Brightness Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Brightness: {config.brightness}%
        </label>
        <input
          type="range"
          min="0"
          max="150"
          value={config.brightness || 100}
          onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Contrast Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Contrast: {config.contrast}%
        </label>
        <input
          type="range"
          min="0"
          max="150"
          value={config.contrast || 100}
          onChange={(e) => handleSliderChange('contrast', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Blur Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Blur: {config.blur}px</label>
        <input
          type="range"
          min="0"
          max="100"
          value={config.blur || 0}
          onChange={(e) => handleSliderChange('blur', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Font Size Slider */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Font Size: {config.fontSize}%
        </label>
        <input
          type="range"
          min="50"
          max="150"
          value={config.fontSize || 100}
          onChange={(e) => handleSliderChange('fontSize', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Color Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Color Filter</label>
        <div className="grid grid-cols-4 gap-2">
          {(['none', 'warm', 'cool', 'sepia'] as const).map((filter) => (
            <button type="button"
              key={filter}
              onClick={() => handleColorFilterChange(filter)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                config.colorFilter === filter
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Cues Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
        <div className="flex items-center gap-2">
          {config.cuesEnabled ? (
            <Eye className="w-5 h-5 text-teal-400" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-500" />
          )}
          <span className="text-sm font-medium text-gray-300">Visual Cues</span>
        </div>
        <button type="button"
          onClick={handleCuesToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            config.cuesEnabled ? 'bg-teal-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.cuesEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* High Contrast Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
        <span className="text-sm font-medium text-gray-300">High Contrast Mode</span>
        <button type="button"
          onClick={handleHighContrastToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            config.highContrast ? 'bg-teal-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.highContrast ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Reset Button */}
      <button type="button"
        onClick={handleReset}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-medium transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
}

