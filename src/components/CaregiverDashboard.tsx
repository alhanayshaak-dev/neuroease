'use client';

import { useEffect, useState } from 'react';
import { Database } from '@/types/database';
import { useSensorDataSubscription } from '@/hooks/useSensorDataSubscription';

type SensorData = Database['public']['Tables']['sensor_data']['Row'];
type Patient = Database['public']['Tables']['patients']['Row'];

interface CaregiverDashboardProps {
  patientId: string;
}

interface PatientWithStatus extends Patient {
  currentStatus?: 'calm' | 'rising' | 'overload';
  currentStressScore?: number;
  lastUpdate?: string;
}

export function CaregiverDashboard({ patientId }: CaregiverDashboardProps) {
  const [patient, setPatient] = useState<PatientWithStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<SensorData[]>([]);

  // Subscribe to sensor data for this patient
  const sensorData = useSensorDataSubscription(patientId);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  useEffect(() => {
    if (sensorData) {
      // Update patient status based on latest sensor data
      setPatient((prev) => {
        if (!prev) return prev;

        const stressScore = sensorData.stress_score;
        let status: 'calm' | 'rising' | 'overload' = 'calm';

        if (stressScore >= 75) {
          status = 'overload';
        } else if (stressScore >= 50) {
          status = 'rising';
        }

        return {
          ...prev,
          currentStatus: status,
          currentStressScore: stressScore,
          lastUpdate: new Date().toISOString(),
        };
      });

      // Add to events timeline
      setEvents((prev) => [sensorData, ...prev].slice(0, 20));
    }
  }, [sensorData]);

  const loadPatientData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setPatient({
          ...data,
          currentStatus: 'calm',
          currentStressScore: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'calm':
        return 'text-green-400';
      case 'rising':
        return 'text-yellow-400';
      case 'overload':
        return 'text-red-400';
      default:
        return 'text-neutral-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return <div className="text-neutral-400">Loading patient data...</div>;
  }

  if (!patient) {
    return <div className="text-neutral-400">Patient not found.</div>;
  }

  // Calculate weekly summary
  const weeklyEvents = events.filter((e) => {
    const eventDate = new Date(e.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return eventDate > weekAgo;
  });

  const weeklyOverloadCount = weeklyEvents.filter((e) => e.stress_score >= 75).length;
  const weeklyRisingCount = weeklyEvents.filter(
    (e) => e.stress_score >= 50 && e.stress_score < 75
  ).length;
  const weeklyAverageStress =
    weeklyEvents.length > 0
      ? Math.round(weeklyEvents.reduce((sum, e) => sum + e.stress_score, 0) / weeklyEvents.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">Current Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Status</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  patient.currentStatus === 'calm'
                    ? 'bg-green-500'
                    : patient.currentStatus === 'rising'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
              />
              <span
                className={`text-lg font-semibold capitalize ${getStatusColor(patient.currentStatus)}`}
              >
                {patient.currentStatus || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Stress Score</p>
            <p className="text-3xl font-bold text-neutral-100">
              {patient.currentStressScore || 0}%
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Last Update</p>
            <p className="text-sm text-neutral-300">
              {patient.lastUpdate ? formatTime(patient.lastUpdate) : 'No data'}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">Weekly Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Events This Week</p>
            <p className="text-2xl font-bold text-neutral-100">{weeklyEvents.length}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Overload Events</p>
            <p className="text-2xl font-bold text-red-400">{weeklyOverloadCount}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Rising Events</p>
            <p className="text-2xl font-bold text-yellow-400">{weeklyRisingCount}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Average Stress</p>
            <p className="text-2xl font-bold text-neutral-100">{weeklyAverageStress}%</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">Recent Events</h2>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-neutral-400">No events recorded yet.</p>
          ) : (
            events.slice(0, 10).map((event) => {
              const status =
                event.stress_score >= 75
                  ? 'overload'
                  : event.stress_score >= 50
                    ? 'rising'
                    : 'calm';

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        status === 'calm'
                          ? 'bg-green-500'
                          : status === 'rising'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-100 capitalize">{status}</p>
                      <p className="text-xs text-neutral-400">
                        {event.location && `Location: ${event.location}`}
                        {event.activity && ` • Activity: ${event.activity}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-100">{event.stress_score}%</p>
                    <p className="text-xs text-neutral-400">{formatTime(event.created_at)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
