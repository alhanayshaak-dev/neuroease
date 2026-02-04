'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import {
  calculateAdherenceRate,
  getAdherenceStatus,
  getDosesTodayCount,
  getExpectedDosesToday,
  isMedicationActive,
  type Medication,
} from '@/utils/medications';

interface MedicationTrackerProps {
  patientId: string;
  medications?: Medication[];
  onAddMedication?: () => void;
  onLogDose?: (medicationId: string) => Promise<void>;
  isReadOnly?: boolean;
}

export function MedicationTracker({
  patientId,
  medications = [],
  onAddMedication,
  onLogDose,
  isReadOnly = false,
}: MedicationTrackerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [localMedications, setLocalMedications] = useState<Medication[]>(medications);

  useEffect(() => {
    setLocalMedications(medications);
  }, [medications]);

  const handleLogDose = async (medicationId: string) => {
    if (!onLogDose) return;

    try {
      setIsLoading(true);
      setError('');
      await onLogDose(medicationId);

      // Update local state
      setLocalMedications((prev) =>
        prev.map((med) =>
          med.id === medicationId
            ? {
                ...med,
                taken_today: true,
                taken_times: [...(med.taken_times || []), new Date().toTimeString().split(' ')[0]],
              }
            : med
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log dose');
    } finally {
      setIsLoading(false);
    }
  };

  const getAdherenceColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-teal-400';
      case 'fair':
        return 'text-yellow-400';
      case 'poor':
        return 'text-red-400';
      default:
        return 'text-neutral-400';
    }
  };

  const activeMedications = localMedications.filter(isMedicationActive);
  const inactiveMedications = localMedications.filter((med) => !isMedicationActive(med));

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</div>}

      {/* Active Medications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-100">Active Medications</h3>
          {!isReadOnly && onAddMedication && (
            <button type="button"
              onClick={onAddMedication}
              className="flex items-center gap-2 px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded transition-colors text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          )}
        </div>

        {activeMedications.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            <p>No active medications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMedications.map((medication) => {
              const adherenceRate = calculateAdherenceRate(medication);
              const adherenceStatus = getAdherenceStatus(adherenceRate);
              const dosesToday = getDosesTodayCount(medication);
              const expectedDoses = getExpectedDosesToday(medication);

              return (
                <div
                  key={medication.id}
                  className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-100">
                        {medication.medication_name}&apos;s
                      </h4>
                      <p className="text-sm text-neutral-400">
                        {medication.dosage} • {medication.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${getAdherenceColor(adherenceStatus)}`}>
                        {adherenceRate}%
                      </p>
                      <p className="text-xs text-neutral-500">{adherenceStatus}</p>
                    </div>
                  </div>

                  {/* Today's Progress */}
                  <div className="mb-3 p-2 bg-neutral-700/50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-neutral-400">Today&apos;s doses</p>
                      <p className="text-xs font-semibold text-neutral-300">
                        {dosesToday} / {expectedDoses}
                      </p>
                    </div>
                    <div className="w-full bg-neutral-600 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((dosesToday / expectedDoses) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Log Dose Button */}
                  {!isReadOnly && onLogDose && (
                    <button type="button"
                      onClick={() => handleLogDose(medication.id)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 bg-teal-500/20 hover:bg-teal-500/30 disabled:opacity-50 text-teal-300 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      {isLoading ? 'Logging...' : 'Log Dose'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inactive Medications */}
      {inactiveMedications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Inactive Medications</h3>
          <div className="space-y-3">
            {inactiveMedications.map((medication) => {
              const adherenceRate = calculateAdherenceRate(medication);
              const adherenceStatus = getAdherenceStatus(adherenceRate);

              return (
                <div
                  key={medication.id}
                  className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700 opacity-60"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-300">
                        {medication.medication_name}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {medication.dosage} • {medication.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${getAdherenceColor(adherenceStatus)}`}>
                        {adherenceRate}%
                      </p>
                      <p className="text-xs text-neutral-500">Completed</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

