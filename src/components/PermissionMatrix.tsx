'use client';

import { Database } from '@/types/database';
import { useState } from 'react';

type GuardianPermissions = Database['public']['Tables']['guardians']['Row']['permissions'];

interface PermissionMatrixProps {
  permissions: GuardianPermissions;
  onPermissionChange: (permissions: GuardianPermissions) => void;
  isEditable?: boolean;
}

const PERMISSION_LABELS: Record<keyof GuardianPermissions, string> = {
  see_status: 'View Status',
  see_alerts: 'View Alerts',
  see_trends: 'View Trends',
  see_medical: 'View Medical Info',
  trigger_emergency: 'Trigger Emergency',
  suggest_strategies: 'Suggest Strategies',
  access_mic: 'Access Microphone',
  access_camera: 'Access Camera',
};

const PERMISSION_DESCRIPTIONS: Record<keyof GuardianPermissions, string> = {
  see_status: 'Can see current stress status (Calm/Rising/Overload)',
  see_alerts: 'Can receive alerts when stress levels rise',
  see_trends: 'Can view stress trends and analytics',
  see_medical: 'Can view medical information and files',
  trigger_emergency: 'Can trigger emergency mode',
  suggest_strategies: 'Can suggest coping strategies',
  access_mic: 'Can access microphone for conversation simplification',
  access_camera: 'Can access camera for visual mode adjustments',
};

export function PermissionMatrix({
  permissions,
  onPermissionChange,
  isEditable = false,
}: PermissionMatrixProps) {
  const [hoveredPermission, setHoveredPermission] = useState<keyof GuardianPermissions | null>(
    null
  );

  const handleToggle = (permission: keyof GuardianPermissions) => {
    if (!isEditable) return;

    onPermissionChange({
      ...permissions,
      [permission]: !permissions[permission],
    });
  };

  const permissionKeys = Object.keys(permissions) as (keyof GuardianPermissions)[];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permissionKeys.map((permission) => (
          <div
            key={permission}
            className={`p-4 rounded-lg border transition-all ${
              permissions[permission]
                ? 'border-teal-500 bg-teal-500/10'
                : 'border-neutral-700 bg-neutral-900'
            } ${isEditable ? 'cursor-pointer hover:border-teal-400' : ''}`}
            onClick={() => handleToggle(permission)}
            onMouseEnter={() => setHoveredPermission(permission)}
            onMouseLeave={() => setHoveredPermission(null)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-100">
                  {PERMISSION_LABELS[permission]}
                </h3>
                {hoveredPermission === permission && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {PERMISSION_DESCRIPTIONS[permission]}
                  </p>
                )}
              </div>
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  permissions[permission]
                    ? 'bg-teal-500 border-teal-500'
                    : 'border-neutral-600 bg-transparent'
                }`}
              >
                {permissions[permission] && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditable && (
        <div className="text-xs text-neutral-400 mt-4">
          Click on any permission to toggle it on or off.
        </div>
      )}
    </div>
  );
}
