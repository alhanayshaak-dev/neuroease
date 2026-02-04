'use client';

import React from 'react';
import { AlertCircle, Pill, Bell, Heart, Settings } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

interface QuickActionShortcutsProps {
  onEmergency?: () => void;
  onMedication?: () => void;
  onAlerts?: () => void;
  onHealth?: () => void;
  onSettings?: () => void;
}

export function QuickActionShortcuts({
  onEmergency,
  onMedication,
  onAlerts,
  onHealth,
  onSettings,
}: QuickActionShortcutsProps) {
  const actions: QuickAction[] = [
    {
      id: 'emergency',
      label: 'Emergency Mode',
      icon: <AlertCircle size={20} />,
      color: 'bg-red-600 hover:bg-red-700',
      action: onEmergency || (() => {}),
    },
    {
      id: 'medication',
      label: 'Check Medication',
      icon: <Pill size={20} />,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: onMedication || (() => {}),
    },
    {
      id: 'alerts',
      label: 'View Alerts',
      icon: <Bell size={20} />,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      action: onAlerts || (() => {}),
    },
    {
      id: 'health',
      label: 'Health Status',
      icon: <Heart size={20} />,
      color: 'bg-green-600 hover:bg-green-700',
      action: onHealth || (() => {}),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: onSettings || (() => {}),
    },
  ];

  return (
    <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4 mb-6">
      <h3 className="text-white font-semibold mb-4 text-sm">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.action}
            className={`${action.color} text-white p-3 rounded-lg transition-colors flex flex-col items-center justify-center gap-2`}
          >
            {action.icon}
            <span className="text-xs font-semibold text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
