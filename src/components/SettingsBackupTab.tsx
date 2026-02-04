'use client';

import React, { useState } from 'react';
import { HardDrive, Calendar, AlertCircle } from 'lucide-react';

export function SettingsBackupTab() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [showBackupHistory, setShowBackupHistory] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [showDisasterRecovery, setShowDisasterRecovery] = useState(false);

  const backupHistory = [
    { date: 'Today 2:30 PM', size: '2.5 MB', status: 'Success' },
    { date: 'Yesterday 2:30 PM', size: '2.4 MB', status: 'Success' },
    { date: '2 days ago 2:30 PM', size: '2.3 MB', status: 'Success' },
    { date: '3 days ago 2:30 PM', size: '2.2 MB', status: 'Success' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Backup & Recovery</h2>

        <div className="space-y-6">
          {/* Automatic Backups */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <HardDrive size={18} /> Automatic Backups
                </label>
                <p className="text-gray-500 text-sm mt-1">Daily backups at 2:30 AM</p>
              </div>
              <button type="button"
                onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  autoBackupEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-black/50 border border-teal-600/30 text-gray-300'
                }`}
              >
                {autoBackupEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Backup History */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Calendar size={18} /> Backup History
              </label>
              <button type="button"
                onClick={() => setShowBackupHistory(!showBackupHistory)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showBackupHistory ? 'Hide' : 'View'}
              </button>
            </div>

            {showBackupHistory && (
              <div className="space-y-2">
                {backupHistory.map((backup, idx) => (
                  <div key={idx} className="bg-black rounded p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-300 font-semibold">{backup.date}</p>
                      <p className="text-gray-500">{backup.size}</p>
                    </div>
                    <span className="text-green-400 text-sm font-semibold">{backup.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Restore */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <HardDrive size={18} /> Restore from Backup
                </label>
                <p className="text-gray-500 text-sm mt-1">Restore your data from a previous backup</p>
              </div>
              <button type="button"
                onClick={() => setShowRestore(true)}
                className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-all"
              >
                Restore
              </button>
            </div>
          </div>

          {/* Disaster Recovery */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <AlertCircle size={18} /> Disaster Recovery
                </label>
                <p className="text-gray-500 text-sm mt-1">Emergency recovery codes for account access</p>
              </div>
              <button type="button"
                onClick={() => setShowDisasterRecovery(true)}
                className="px-4 py-2 bg-orange-600/20 border border-orange-600 text-orange-400 rounded font-semibold hover:bg-orange-600/30 transition-all"
              >
                View Codes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restore Modal */}
      {showRestore && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-white text-xl font-bold mb-4">Restore from Backup</h2>
            <p className="text-gray-300 mb-4">Select a backup to restore:</p>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {backupHistory.map((backup, idx) => (
                <button type="button"
                  key={idx}
                  className="w-full text-left bg-black hover:bg-gray-900 border border-teal-600/30 rounded p-3 transition-colors"
                >
                  <p className="text-gray-300 font-semibold text-sm">{backup.date}</p>
                  <p className="text-gray-500 text-xs">{backup.size}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => setShowRestore(false)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Restore
              </button>
              <button type="button"
                onClick={() => setShowRestore(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disaster Recovery Modal */}
      {showDisasterRecovery && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-orange-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-white text-xl font-bold mb-4">Recovery Codes</h2>
            <p className="text-gray-300 mb-4">Save these codes in a safe place. You can use them to recover your account.</p>
            <div className="bg-black border border-orange-600/30 rounded p-4 mb-4 space-y-2 font-mono text-sm">
              <p className="text-orange-400">ABCD-1234-EFGH-5678</p>
              <p className="text-orange-400">IJKL-9012-MNOP-3456</p>
              <p className="text-orange-400">QRST-7890-UVWX-1234</p>
              <p className="text-orange-400">YZAB-5678-CDEF-9012</p>
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => setShowDisasterRecovery(false)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Copy Codes
              </button>
              <button type="button"
                onClick={() => setShowDisasterRecovery(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
