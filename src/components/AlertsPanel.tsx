'use client';

import React, { useState } from 'react';
import { AlertCircle, Info, CheckCircle, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const getAlertConfig = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-900/60',
          border: 'border-red-600/30',
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-400',
          bg: 'bg-blue-900/60',
          border: 'border-blue-600/30',
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-900/60',
          border: 'border-green-600/30',
        };
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-transparent/50 border border-teal-600/30 rounded-lg p-6 text-center">
        <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
        <p className="text-white font-semibold">All Clear</p>
        <p className="text-gray-400 text-sm">No alerts at this time</p>
      </div>
    );
  }

  return (
    <>
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-teal-600 rounded-lg p-8 max-w-sm w-full mx-4">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-white text-xl font-bold">{selectedAlert.title}</h2>
              <button type="button" onClick={() => setSelectedAlert(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-300 mb-6">{selectedAlert.message}</p>
            <p className="text-gray-500 text-sm mb-8">Received: {selectedAlert.timestamp}</p>
            <div className="flex gap-3">
              <button type="button" 
                onClick={() => setSelectedAlert(null)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded font-semibold transition-colors"
              >
                Acknowledge
              </button>
              <button type="button" 
                onClick={() => setSelectedAlert(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;

          return (
            <button type="button"
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`w-full ${config.bg} border ${config.border} rounded-lg p-4 flex gap-3 hover:border-teal-400 transition-all cursor-pointer text-left`}
            >
              <Icon size={20} className={config.color} />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{alert.title}</p>
                <p className="text-gray-400 text-sm">{alert.message}</p>
                <p className="text-gray-500 text-xs mt-1">{alert.timestamp}</p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
