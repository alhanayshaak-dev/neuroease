'use client';

import React, { useState } from 'react';
import { Download, Trash2, AlertCircle } from 'lucide-react';

export function SettingsPrivacyTab() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [showDataLogs, setShowDataLogs] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [showDeleteData, setShowDeleteData] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-black border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Privacy Settings</h2>

        <div className="space-y-6">
          {/* Analytics */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Download size={18} /> Analytics & Usage Data
                </label>
                <p className="text-gray-500 text-sm mt-1">Help us improve by sharing usage data</p>
              </div>
              <button type="button"
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  analyticsEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {analyticsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Data Access Logs */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold">Data Access Logs</label>
                <p className="text-gray-500 text-sm mt-1">View who accessed your data and when</p>
              </div>
              <button type="button"
                onClick={() => setShowDataLogs(!showDataLogs)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showDataLogs ? 'Hide' : 'View'}
              </button>
            </div>

            {showDataLogs && (
              <div className="mt-4 space-y-2">
                <div className="bg-black/20 rounded p-3 text-sm">
                  <p className="text-gray-300 font-semibold">Violet Azer</p>
                  <p className="text-gray-500">Viewed health data - Today 2:30 PM</p>
                </div>
                <div className="bg-black/20 rounded p-3 text-sm">
                  <p className="text-gray-300 font-semibold">Dr. Sarah Johnson</p>
                  <p className="text-gray-500">Viewed medical records - Yesterday 10:15 AM</p>
                </div>
                <div className="bg-black/20 rounded p-3 text-sm">
                  <p className="text-gray-300 font-semibold">System</p>
                  <p className="text-gray-500">Backup created - 3 days ago</p>
                </div>
              </div>
            )}
          </div>

          {/* Export Data */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Download size={18} /> Export Your Data
                </label>
                <p className="text-gray-500 text-sm mt-1">Download all your data in JSON format</p>
              </div>
              <button type="button"
                onClick={() => setShowExportData(true)}
                className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-all"
              >
                Export
              </button>
            </div>
          </div>

          {/* Delete Data */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Trash2 size={18} /> Delete Account & Data
                </label>
                <p className="text-gray-500 text-sm mt-1">Permanently delete your account and all data</p>
              </div>
              <button type="button"
                onClick={() => setShowDeleteData(true)}
                className="px-4 py-2 bg-red-600/20 border border-red-600 text-red-400 rounded font-semibold hover:bg-red-600/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Data Modal */}
      {showExportData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-white text-xl font-bold mb-4">Export Your Data</h2>
            <p className="text-gray-300 mb-4">Your data will be exported as a JSON file containing all your account information, settings, and history.</p>
            <div className="bg-black/20 border border-teal-600/30 rounded p-3 mb-4">
              <p className="text-gray-400 text-sm">File size: ~2.5 MB</p>
              <p className="text-gray-400 text-sm">Format: JSON</p>
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => setShowExportData(false)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Download
              </button>
              <button type="button"
                onClick={() => setShowExportData(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Data Modal */}
      {showDeleteData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-red-600 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-400" />
              <h2 className="text-white text-xl font-bold">Delete Account</h2>
            </div>
            <p className="text-gray-300 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="bg-black/20 border border-teal-600/30 rounded p-3 mb-4">
              <p className="text-red-400 text-sm font-semibold">Warning: This is permanent</p>
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => setShowDeleteData(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Delete Everything
              </button>
              <button type="button"
                onClick={() => setShowDeleteData(false)}
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
