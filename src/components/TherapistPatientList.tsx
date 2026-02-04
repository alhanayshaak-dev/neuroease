'use client';

import { useState } from 'react';
import { MessageSquare, TrendingDown, TrendingUp, AlertCircle, Users } from 'lucide-react';
import type { PatientInsight } from '@/utils/therapist';

interface TherapistPatientListProps {
  patients: PatientInsight[];
  onSelectPatient?: (patientId: string) => void;
  onSendMessage?: (patientId: string) => void;
}

export function TherapistPatientList({
  patients,
  onSelectPatient,
  onSendMessage,
}: TherapistPatientListProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'stress' | 'trend'>('name');

  const sortedPatients = [...patients].sort((a, b) => {
    switch (sortBy) {
      case 'stress':
        return b.average_stress_score - a.average_stress_score;
      case 'trend':
        const trendOrder = { worsening: 0, stable: 1, improving: 2 };
        return trendOrder[a.trend_direction] - trendOrder[b.trend_direction];
      case 'name':
      default:
        return a.patient_name.localeCompare(b.patient_name);
    }
  });

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    onSelectPatient?.(patientId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-neutral-100">Patients ({patients.length})</h2>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <button type="button"
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === 'name'
                ? 'bg-primary-400/20 text-primary-400'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Name
          </button>
          <button type="button"
            onClick={() => setSortBy('stress')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === 'stress'
                ? 'bg-primary-400/20 text-primary-400'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Stress
          </button>
          <button type="button"
            onClick={() => setSortBy('trend')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === 'trend'
                ? 'bg-primary-400/20 text-primary-400'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Trend
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-2">
        {sortedPatients.length === 0 ? (
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 text-center">
            <p className="text-neutral-400">No patients assigned yet</p>
          </div>
        ) : (
          sortedPatients.map((patient) => (
            <div
              key={patient.patient_id}
              onClick={() => handleSelectPatient(patient.patient_id)}
              className={`bg-neutral-900 rounded-lg p-4 border cursor-pointer transition-all ${
                selectedPatientId === patient.patient_id
                  ? 'border-primary-400 bg-neutral-800'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-neutral-100">{patient.patient_name}</p>
                  <p className="text-xs text-neutral-500">{patient.patient_id}</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      patient.current_stress_level === 'overload'
                        ? 'bg-overload/20 text-overload'
                        : patient.current_stress_level === 'rising'
                          ? 'bg-rising/20 text-rising'
                          : 'bg-calm/20 text-calm'
                    }`}
                  >
                    {patient.current_stress_level.charAt(0).toUpperCase() +
                      patient.current_stress_level.slice(1)}
                  </span>

                  {patient.current_stress_level === 'overload' && (
                    <AlertCircle className="w-4 h-4 text-overload" />
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Avg Stress</p>
                  <p className="text-sm font-semibold text-neutral-100">
                    {Math.round(patient.average_stress_score)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Peak Stress</p>
                  <p className="text-sm font-semibold text-neutral-100">
                    {patient.peak_stress_score}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Data Points</p>
                  <p className="text-sm font-semibold text-neutral-100">
                    {patient.data_points_this_week}
                  </p>
                </div>
              </div>

              {/* Trend and Trigger Info */}
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-2">
                  {patient.trend_direction === 'improving' ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-calm" />
                      <span className="text-calm">Improving</span>
                    </>
                  ) : patient.trend_direction === 'worsening' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-rising" />
                      <span className="text-rising">Worsening</span>
                    </>
                  ) : (
                    <span className="text-neutral-400">Stable</span>
                  )}
                </div>
                <span className="text-neutral-400">Trigger: {patient.most_common_trigger}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendMessage?.(patient.patient_id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-400/10 text-primary-400 rounded text-sm font-medium hover:bg-primary-400/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

