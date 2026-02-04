'use client';

import { useAccessibility } from '@/hooks/useAccessibility';
import { Moon, Sun, Type, Zap, Eye, Keyboard, RotateCcw } from 'lucide-react';

export interface AccessibilitySettingsProps {
  onClose?: () => void;
}

export function AccessibilitySettings({ onClose }: AccessibilitySettingsProps) {
  const { settings, isLoading, toggle, adjustFont, reset } = useAccessibility();

  if (isLoading || !settings) {
    return (
      <div className="p-6 text-center text-neutral-400">Loading accessibility settings...</div>
    );
  }

  return (
    <div className="w-full max-w-md bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">Accessibility</h2>
        {onClose && (
          <button type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
            aria-label="Close accessibility settings"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <Moon className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium text-neutral-200">Dark Mode</span>
          </label>
          <button type="button"
            onClick={() => toggle('darkMode')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.darkMode ? 'bg-primary-500' : 'bg-neutral-700'
            }`}
            role="switch"
            aria-checked={settings.darkMode}
            aria-label="Toggle dark mode"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-neutral-500">Reduces visual overwhelm (default ON)</p>
      </div>

      {/* Font Size Adjustment */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3">
            <Type className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium text-neutral-200">Font Size</span>
          </label>
          <span className="text-sm font-semibold text-primary-400">{settings.fontSize}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button"
            onClick={() => adjustFont(-10)}
            disabled={settings.fontSize <= 100}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-medium transition-colors"
            aria-label="Decrease font size"
          >
            −
          </button>
          <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{ width: `${((settings.fontSize - 100) / 100) * 100}%` }}
            />
          </div>
          <button type="button"
            onClick={() => adjustFont(10)}
            disabled={settings.fontSize >= 200}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-medium transition-colors"
            aria-label="Increase font size"
          >
            +
          </button>
        </div>
        <p className="text-xs text-neutral-500">Adjust text size for readability (100-200%)</p>
      </div>

      {/* Reduce Motion Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <Zap className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium text-neutral-200">Reduce Motion</span>
          </label>
          <button type="button"
            onClick={() => toggle('reduceMotion')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.reduceMotion ? 'bg-primary-500' : 'bg-neutral-700'
            }`}
            role="switch"
            aria-checked={settings.reduceMotion}
            aria-label="Toggle reduce motion"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-neutral-500">Minimize animations and transitions</p>
      </div>

      {/* High Contrast Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <Eye className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium text-neutral-200">High Contrast</span>
          </label>
          <button type="button"
            onClick={() => toggle('highContrast')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.highContrast ? 'bg-primary-500' : 'bg-neutral-700'
            }`}
            role="switch"
            aria-checked={settings.highContrast}
            aria-label="Toggle high contrast mode"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.highContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-neutral-500">Increase color contrast for better visibility</p>
      </div>

      {/* Keyboard Navigation Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <Keyboard className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-medium text-neutral-200">Keyboard Navigation</span>
          </label>
          <button type="button"
            onClick={() => toggle('keyboardNavigationEnabled')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.keyboardNavigationEnabled ? 'bg-primary-500' : 'bg-neutral-700'
            }`}
            role="switch"
            aria-checked={settings.keyboardNavigationEnabled}
            aria-label="Toggle keyboard navigation"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.keyboardNavigationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-neutral-500">Enable full keyboard navigation support</p>
      </div>

      {/* Reset Button */}
      <button type="button"
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium text-neutral-200 transition-colors"
        aria-label="Reset accessibility settings to defaults"
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Defaults
      </button>
    </div>
  );
}

