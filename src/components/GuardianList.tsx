'use client';

import { Database } from '@/types/database';
import { getEnabledPermissions } from '@/utils/permissions';

type Guardian = Database['public']['Tables']['guardians']['Row'] & {
  guardian_user?: Database['public']['Tables']['users']['Row'];
};

interface GuardianListProps {
  guardians: Guardian[];
  onEditPermissions?: (guardianId: string) => void;
  onRemove?: (guardianId: string) => Promise<void>;
  isLoading?: boolean;
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: 'Parent',
  therapist: 'Therapist',
  teacher: 'Teacher',
  other: 'Other',
};

export function GuardianList({
  guardians,
  onEditPermissions,
  onRemove,
  isLoading = false,
}: GuardianListProps) {
  if (guardians.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-400">No guardians added yet.</p>
        <p className="text-sm text-neutral-500 mt-2">Invite a guardian to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {guardians.map((guardian) => {
        const enabledPermissions = getEnabledPermissions(guardian.permissions);

        return (
          <div
            key={guardian.id}
            className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-100">
                    {guardian.guardian_user?.name || 'Unknown Guardian'}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-teal-500/20 text-teal-300 rounded">
                    {RELATIONSHIP_LABELS[guardian.relationship] || guardian.relationship}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mt-1">{guardian.guardian_user?.email}</p>

                <div className="mt-3">
                  <p className="text-xs text-neutral-500 mb-2">
                    {enabledPermissions.length} permission
                    {enabledPermissions.length !== 1 ? 's' : ''} enabled
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {enabledPermissions.slice(0, 3).map((perm) => (
                      <span
                        key={perm}
                        className="text-xs px-2 py-1 bg-neutral-800 text-neutral-300 rounded"
                      >
                        {perm.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {enabledPermissions.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded">
                        +{enabledPermissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {onEditPermissions && (
                  <button type="button"
                    onClick={() => onEditPermissions(guardian.id)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors disabled:opacity-50"
                  >
                    Edit
                  </button>
                )}
                {onRemove && (
                  <button type="button"
                    onClick={() => onRemove(guardian.id)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

