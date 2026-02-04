'use client';

import React, { useState } from 'react';
import { Zap, Code, Store, CheckCircle2 } from 'lucide-react';

export function SettingsIntegrationsTab() {
  const [showConnectedApps, setShowConnectedApps] = useState(false);
  const [showAPIKeys, setShowAPIKeys] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);

  const connectedApps = [
    { name: 'Google Calendar', status: 'Connected', lastSync: '5 minutes ago' },
    { name: 'Apple Health', status: 'Connected', lastSync: '2 hours ago' },
    { name: 'Fitbit', status: 'Connected', lastSync: '1 day ago' },
  ];

  const apiKeys = [
    { name: 'Production API Key', created: 'Jan 15, 2024', lastUsed: 'Today' },
    { name: 'Development API Key', created: 'Jan 10, 2024', lastUsed: '3 days ago' },
  ];

  const marketplaceApps = [
    { name: 'Meditation Guide', category: 'Wellness', rating: 4.8 },
    { name: 'Sleep Tracker', category: 'Health', rating: 4.6 },
    { name: 'Mood Journal', category: 'Mental Health', rating: 4.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Integrations</h2>

        <div className="space-y-6">
          {/* Connected Apps */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Zap size={18} /> Connected Apps
              </label>
              <button type="button"
                onClick={() => setShowConnectedApps(!showConnectedApps)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showConnectedApps ? 'Hide' : 'View'}
              </button>
            </div>

            {showConnectedApps && (
              <div className="space-y-2">
                {connectedApps.map((app, idx) => (
                  <div key={idx} className="bg-black rounded p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-300 font-semibold">{app.name}</p>
                      <p className="text-gray-500">Last sync: {app.lastSync}</p>
                    </div>
                    <button type="button" className="text-red-400 hover:text-red-300 text-sm font-semibold">
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* API Keys */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Code size={18} /> API Keys
              </label>
              <button type="button"
                onClick={() => setShowAPIKeys(!showAPIKeys)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showAPIKeys ? 'Hide' : 'View'}
              </button>
            </div>

            {showAPIKeys && (
              <div className="space-y-2">
                {apiKeys.map((key, idx) => (
                  <div key={idx} className="bg-black rounded p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-300 font-semibold">{key.name}</p>
                      <p className="text-gray-500">Created: {key.created} • Last used: {key.lastUsed}</p>
                    </div>
                    <button type="button" className="text-red-400 hover:text-red-300 text-sm font-semibold">
                      Revoke
                    </button>
                  </div>
                ))}
                <button type="button" className="w-full mt-3 px-4 py-2 bg-black border border-teal-600 text-teal-400 rounded font-semibold hover:bg-gray-900 transition-all">
                  Generate New Key
                </button>
              </div>
            )}
          </div>

          {/* App Marketplace */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Store size={18} /> App Marketplace
              </label>
              <button type="button"
                onClick={() => setShowMarketplace(!showMarketplace)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showMarketplace ? 'Hide' : 'Browse'}
              </button>
            </div>

            {showMarketplace && (
              <div className="space-y-2">
                {marketplaceApps.map((app, idx) => (
                  <div key={idx} className="bg-black rounded p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-300 font-semibold">{app.name}</p>
                      <p className="text-gray-500">{app.category} • Rating: {app.rating}</p>
                    </div>
                    <button type="button" className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-semibold transition-colors">
                      Install
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
