'use client';

import { AppLayout } from '@/components/AppLayout';
import { GuardianList } from '@/components/GuardianList';
import { InviteGuardianForm } from '@/components/InviteGuardianForm';
import { PermissionMatrix } from '@/components/PermissionMatrix';
import { useEffect, useState } from 'react';
import { Database } from '@/types/database';

type Guardian = Database['public']['Tables']['guardians']['Row'] & {
  guardian_user?: Database['public']['Tables']['users']['Row'];
};

export default function CareCirclePage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    loadGuardians();
  }, []);

  const loadGuardians = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/care-circle/guardians');
      if (response.ok) {
        const data = await response.json();
        setGuardians(data);
      }
    } catch (error) {
      console.error('Failed to load guardians:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteGuardian = async (data: {
    guardianEmail: string;
    relationship: 'parent' | 'therapist' | 'teacher' | 'other';
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/care-circle/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to invite guardian');
      }

      await loadGuardians();
      setShowInviteForm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePermissions = async (permissions: any) => {
    if (!selectedGuardian) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/care-circle/guardians/${selectedGuardian.id}/permissions`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissions }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update permissions');
      }

      await loadGuardians();
      setSelectedGuardian(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGuardian = async (guardianId: string) => {
    if (!confirm('Are you sure you want to remove this guardian?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/care-circle/guardians/${guardianId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove guardian');
      }

      await loadGuardians();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout headerProps={{ userName: 'Violet', supportLevel: 1 }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Care Circle</h1>
          <p className="text-neutral-400">Manage your guardians and permissions.</p>
        </div>

        {selectedGuardian ? (
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-100">
                Edit Permissions: {selectedGuardian.guardian_user?.name}
              </h2>
              <button type="button"
                onClick={() => setSelectedGuardian(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <PermissionMatrix
              permissions={selectedGuardian.permissions}
              onPermissionChange={handleUpdatePermissions}
              isEditable={true}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                <h2 className="text-xl font-semibold text-neutral-100 mb-4">Guardians</h2>
                <GuardianList
                  guardians={guardians}
                  onEditPermissions={(id) => {
                    const guardian = guardians.find((g) => g.id === id);
                    if (guardian) setSelectedGuardian(guardian);
                  }}
                  onRemove={handleRemoveGuardian}
                  isLoading={isLoading}
                />
              </div>

              <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                <h2 className="text-xl font-semibold text-neutral-100 mb-4">
                  {showInviteForm ? 'Invite Guardian' : 'Add Guardian'}
                </h2>

                {showInviteForm ? (
                  <div className="space-y-4">
                    <InviteGuardianForm onSubmit={handleInviteGuardian} isLoading={isLoading} />
                    <button type="button"
                      onClick={() => setShowInviteForm(false)}
                      className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button"
                    onClick={() => setShowInviteForm(true)}
                    className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Invite Guardian
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

