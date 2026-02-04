'use client';

import { useState } from 'react';
import { Toggle, Download, Trash2, Info } from 'lucide-react';
import {
  getDefaultAIAccessSettings,
  formatDataRetentionDays,
  type AIAccessSettings,
} from '@/utils/privacy';

interface PrivacyDashboardProps {
  settings?: AIAccessSettings;
  onSettingsChange?: (settings: AIAccessSettings) => Promise<void>;
  onExportData?: () => Promise<void>;
  onDeleteData?: () => Promise<void>;
  isReadOnly?: boolean;
}

export function PrivacyDashboard({
  settings = getDefaultAIAccessSettings(),
  onSettingsChange,
  onExportData,
  onDeleteData,
  isReadOnly = false,
}: PrivacyDashboardProps) {
  const [localSettings, setLocalSettings] = useState<AIAccessSettings>(settings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggleSetting = async (key: keyof AIAccessSettings) => {
    if (isReadOnly || typeof localSettings[key] !== 'boolean') return;

    const newSettings = {
      ...localSettings,
      [key]: !localSettings[key],
    };

    setLocalSettings(newSettings);

    if (onSettingsChange) {
      try {
        setIsLoading(true);
        setError('');
        await onSettingsChange(newSettings);
        setSuccessMessage('Settings updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update settings');
        // Revert on error
        setLocalSettings(settings);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDataRetentionChange = async (days: number) => {
    const newSettings = {
      ...localSettings,
      data_retention_days: days,
    };

    setLocalSettings(newSettings);

    if (onSettingsChange) {
      try {
        setIsLoading(true);
        setError('');
        await onSettingsChange(newSettings);
        setSuccessMessage('Data retention updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update retention');
        // Revert on error
        setLocalSettings(settings);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = async () => {
    if (!onExportData) return;

    try {
      setIsLoading(true);
      setError('');
      await onExportData();
      setSuccessMessage('Data exported successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteData = async () => {
    if (!onDeleteData) return;

    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await onDeleteData();
      setSuccessMessage('Data deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</div>}

      {successMessage && (
        <div className="text-sm text-green-400 bg-green-500/10 p-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* AI Access Controls */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">AI Features</h3>
          <p className="text-sm text-neutral-400 mb-4">
            All AI features are disabled by default. Enable only the features you want to use.
          </p>
        </div>

        <div className="space-y-3">
          {/* Predictions */}
          <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-100">Overload Predictions</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  AI analyzes sensor data to predict sensory overload 5-10 minutes in advance
                </p>
              </div>
              {!isReadOnly && (
                <button type="button"
                  onClick={() => handleToggleSetting('ai_predictions_enabled')}
                  disabled={isLoading}
                  className={`ml-4 px-3 py-2 rounded transition-colors ${
                    localSettings.ai_predictions_enabled
                      ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                      : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                  } disabled:opacity-50`}
                >
                  {localSettings.ai_predictions_enabled ? 'Enabled' : 'Disabled'}
                </button>
              )}
            </div>
          </div>

          {/* Strategy Suggestions */}
          <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-100">Strategy Suggestions</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  AI suggests coping strategies based on your stress level and history
                </p>
              </div>
              {!isReadOnly && (
                <button type="button"
                  onClick={() => handleToggleSetting('ai_strategy_suggestions_enabled')}
                  disabled={isLoading}
                  className={`ml-4 px-3 py-2 rounded transition-colors ${
                    localSettings.ai_strategy_suggestions_enabled
                      ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                      : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                  } disabled:opacity-50`}
                >
                  {localSettings.ai_strategy_suggestions_enabled ? 'Enabled' : 'Disabled'}
                </button>
              )}
            </div>
          </div>

          {/* Conversation Simplification */}
          <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-100">Conversation Simplification</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  AI simplifies complex conversations and detects social cues
                </p>
              </div>
              {!isReadOnly && (
                <button type="button"
                  onClick={() => handleToggleSetting('ai_conversation_simplification_enabled')}
                  disabled={isLoading}
                  className={`ml-4 px-3 py-2 rounded transition-colors ${
                    localSettings.ai_conversation_simplification_enabled
                      ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                      : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                  } disabled:opacity-50`}
                >
                  {localSettings.ai_conversation_simplification_enabled ? 'Enabled' : 'Disabled'}
                </button>
              )}
            </div>
          </div>

          {/* Therapist Insights */}
          <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-100">Therapist Insights</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  AI provides insights to your therapist to help with treatment planning
                </p>
              </div>
              {!isReadOnly && (
                <button type="button"
                  onClick={() => handleToggleSetting('ai_therapist_insights_enabled')}
                  disabled={isLoading}
                  className={`ml-4 px-3 py-2 rounded transition-colors ${
                    localSettings.ai_therapist_insights_enabled
                      ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                      : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                  } disabled:opacity-50`}
                >
                  {localSettings.ai_therapist_insights_enabled ? 'Enabled' : 'Disabled'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Data Retention</h3>
          <p className="text-sm text-neutral-400 mb-4">
            Choose how long your data is kept before automatic deletion
          </p>
        </div>

        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-neutral-100">Retention Period</h4>
              <p className="text-sm text-neutral-400 mt-1">
                {formatDataRetentionDays(localSettings.data_retention_days)}
              </p>
            </div>
          </div>

          {!isReadOnly && (
            <div className="space-y-2">
              <div className="flex gap-2">
                {[30, 60, 90, 180, 365].map((days) => (
                  <button type="button"
                    key={days}
                    onClick={() => handleDataRetentionChange(days)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      localSettings.data_retention_days === days
                        ? 'bg-teal-500 text-neutral-900 font-semibold'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    } disabled:opacity-50`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Data Management</h3>
        </div>

        <div className="space-y-3">
          {/* Export Data */}
          {localSettings.allow_data_export && (
            <button type="button"
              onClick={handleExportData}
              disabled={isLoading || !onExportData}
              className="w-full p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-teal-500/50 hover:bg-neutral-700/50 transition-colors disabled:opacity-50 flex items-center gap-3"
            >
              <Download size={20} className="text-teal-400" />
              <div className="text-left">
                <p className="font-semibold text-neutral-100">Export Your Data</p>
                <p className="text-sm text-neutral-400">
                  Download all your data in JSON or CSV format
                </p>
              </div>
            </button>
          )}

          {/* Delete Data */}
          {localSettings.allow_data_deletion && (
            <button type="button"
              onClick={handleDeleteData}
              disabled={isLoading || !onDeleteData}
              className="w-full p-4 bg-red-500/10 rounded-lg border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-3"
            >
              <Trash2 size={20} className="text-red-400" />
              <div className="text-left">
                <p className="font-semibold text-red-300">Delete All Data</p>
                <p className="text-sm text-red-400/70">
                  Permanently delete all your data (cannot be undone)
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 flex gap-3">
        <Info size={20} className="text-neutral-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-neutral-400">
          <p className="font-semibold text-neutral-300 mb-1">Privacy Notice</p>
          <p>
            Your data is encrypted and stored securely. You have full control over what data is
            collected and how it's used. All AI features are disabled by default and require your
            explicit consent.
          </p>
        </div>
      </div>
    </div>
  );
}

