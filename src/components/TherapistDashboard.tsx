'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, TrendingDown, TrendingUp, Users, Activity, Target } from 'lucide-react';
import {
  calculatePatientInsights,
  calculateAggregatedInsights,
  getPatientsNeedingAttention,
  type PatientInsight,
  type AggregatedPatientInsights,
} from '@/utils/therapist';
import type { Database } from '@/types/database';

type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];
type CopingStrategyRow = Database['public']['Tables']['coping_strategies']['Row'];

interface TherapistDashboardProps {
  patientData: Array<{
    patient_id: string;
    patient_name: string;
    sensorData: SensorDataRow[];
    strategies: CopingStrategyRow[];
  }>;
  isLoading?: boolean;
}

export function TherapistDashboard({ patientData, isLoading = false }: TherapistDashboardProps) {
  const [patientInsights, setPatientInsights] = useState<PatientInsight[]>([]);
  const [aggregatedInsights, setAggregatedInsights] = useState<AggregatedPatientInsights | null>(
    null
  );
  const [patientsNeedingAttention, setPatientsNeedingAttention] = useState<PatientInsight[]>([]);

  useEffect(() => {
    // Calculate insights for each patient
    const insights = patientData.map((patient) =>
      calculatePatientInsights(
        patient.patient_id,
        patient.patient_name,
        patient.sensorData,
        patient.strategies
      )
    );

    setPatientInsights(insights);

    // Calculate aggregated insights
    const aggregated = calculateAggregatedInsights(insights);
    setAggregatedInsights(aggregated);

    // Get patients needing attention
    const needingAttention = getPatientsNeedingAttention(insights);
    setPatientsNeedingAttention(needingAttention);
  }, [patientData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-neutral-400">Loading therapist dashboard...</p>
      </div>
    );
  }

  if (!aggregatedInsights) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-neutral-400">No patient data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-100 mb-2">Therapist Dashboard</h1>
        <p className="text-neutral-400">
          Monitor your patients' progress and manage treatment goals
        </p>
      </div>

      {/* Aggregated Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Total Patients</p>
            <Users className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">{aggregatedInsights.total_patients}</p>
        </div>

        {/* Average Stress */}
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Avg Stress Level</p>
            <Activity className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {Math.round(aggregatedInsights.average_stress_across_patients)}%
          </p>
        </div>

        {/* Patients Improving */}
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Improving</p>
            <TrendingDown className="w-4 h-4 text-calm" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {aggregatedInsights.patients_improving}
          </p>
        </div>

        {/* Patients in Overload */}
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">In Overload</p>
            <AlertCircle className="w-4 h-4 text-overload" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {aggregatedInsights.patients_in_overload}
          </p>
        </div>
      </div>

      {/* Patients Needing Attention */}
      {patientsNeedingAttention.length > 0 && (
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-overload" />
            <h2 className="text-xl font-semibold text-neutral-100">
              Patients Needing Attention ({patientsNeedingAttention.length})
            </h2>
          </div>
          <div className="space-y-3">
            {patientsNeedingAttention.map((patient) => (
              <div
                key={patient.patient_id}
                className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-neutral-100">{patient.patient_name}</p>
                    <p className="text-sm text-neutral-400">
                      Current stress: {Math.round(patient.average_stress_score)}%
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {patient.trend_direction === 'improving' ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-calm" />
                      <span className="text-calm">
                        Improving ({patient.trend_percentage_change}%)
                      </span>
                    </>
                  ) : patient.trend_direction === 'worsening' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-rising" />
                      <span className="text-rising">
                        Worsening ({patient.trend_percentage_change}%)
                      </span>
                    </>
                  ) : (
                    <span className="text-neutral-400">Stable</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Insights */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">Patient Insights</h2>
        <div className="space-y-4">
          {patientInsights.map((patient) => (
            <div
              key={patient.patient_id}
              className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-neutral-100">{patient.patient_name}</p>
                  <p className="text-sm text-neutral-400">
                    {patient.data_points_this_week} data points this week
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
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
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Average Stress</p>
                  <p className="text-lg font-semibold text-neutral-100">
                    {Math.round(patient.average_stress_score)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Peak Stress</p>
                  <p className="text-lg font-semibold text-neutral-100">
                    {patient.peak_stress_score}%
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Most Common Trigger:</span>
                  <span className="text-neutral-100">{patient.most_common_trigger}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Most Effective Strategy:</span>
                  <span className="text-neutral-100">{patient.most_effective_strategy}</span>
                </div>
                {patient.last_overload_prediction && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Last Overload Prediction:</span>
                    <span className="text-neutral-100">
                      {new Date(patient.last_overload_prediction).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-400 mb-2">Most Common Trigger</p>
            <p className="text-lg font-semibold text-neutral-100">
              {aggregatedInsights.most_common_trigger_across_patients}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-400 mb-2">Most Effective Strategy</p>
            <p className="text-lg font-semibold text-neutral-100">
              {aggregatedInsights.most_effective_strategy_across_patients}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-400 mb-2">Patients Worsening</p>
            <p className="text-lg font-semibold text-neutral-100">
              {aggregatedInsights.patients_worsening}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-400 mb-2">Total Data Points</p>
            <p className="text-lg font-semibold text-neutral-100">
              {aggregatedInsights.total_data_points}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
