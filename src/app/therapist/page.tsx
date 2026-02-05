'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { TherapistDashboard } from '@/components/TherapistDashboard';
import { TherapistPatientList } from '@/components/TherapistPatientList';
import { TherapistMessaging } from '@/components/TherapistMessaging';
import { AggregatedInsights } from '@/components/AggregatedInsights';
import {
  calculatePatientInsights,
  calculateAggregatedInsights,
  type PatientInsight,
} from '@/utils/therapist';
import type { Database } from '@/types/database';

type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];
type CopingStrategyRow = Database['public']['Tables']['coping_strategies']['Row'];

// Mock therapist data - in production this would come from auth context and API
const MOCK_THERAPIST_PATIENTS = [
  {
    patient_id: 'patient-1',
    patient_name: 'Violet',
    sensorData: Array.from({ length: 50 }, (_, i) => ({
      id: `sensor-${i}`,
      patient_id: 'patient-1',
      device_id: 'device-1',
      timestamp: new Date(Date.now() - (50 - i) * 5000).toISOString(),
      heart_rate: 70 + Math.random() * 20,
      hrv: 50 + Math.random() * 20,
      eda: 2.0 + Math.random() * 1.0,
      accelerometer_x: 0,
      accelerometer_y: 0,
      accelerometer_z: 0,
      location: 'school',
      activity: 'class',
      stress_score: 35 + Math.random() * 30,
      overload_predicted: Math.random() > 0.8,
      overload_predicted_in_minutes: Math.random() > 0.8 ? 7 : null,
      created_at: new Date(Date.now() - (50 - i) * 5000).toISOString(),
    })) as SensorDataRow[],
    strategies: [
      {
        id: 'strategy-1',
        patient_id: 'patient-1',
        name: 'Deep Breathing',
        category: 'breathwork',
        description: 'Slow, deep breathing exercise',
        duration_minutes: 5,
        success_rate: 0.85,
        last_used: new Date().toISOString(),
        times_used: 15,
        created_by: 'user',
        created_at: new Date().toISOString(),
      },
      {
        id: 'strategy-2',
        patient_id: 'patient-1',
        name: 'Grounding Technique',
        category: 'grounding',
        description: '5-4-3-2-1 sensory grounding',
        duration_minutes: 3,
        success_rate: 0.75,
        last_used: new Date().toISOString(),
        times_used: 10,
        created_by: 'therapist',
        created_at: new Date().toISOString(),
      },
    ] as CopingStrategyRow[],
  },
  {
    patient_id: 'patient-2',
    patient_name: 'Alex',
    sensorData: Array.from({ length: 50 }, (_, i) => ({
      id: `sensor-${i}`,
      patient_id: 'patient-2',
      device_id: 'device-2',
      timestamp: new Date(Date.now() - (50 - i) * 5000).toISOString(),
      heart_rate: 75 + Math.random() * 25,
      hrv: 45 + Math.random() * 15,
      eda: 2.5 + Math.random() * 1.5,
      accelerometer_x: 0,
      accelerometer_y: 0,
      accelerometer_z: 0,
      location: 'work',
      activity: 'meeting',
      stress_score: 50 + Math.random() * 35,
      overload_predicted: Math.random() > 0.7,
      overload_predicted_in_minutes: Math.random() > 0.7 ? 8 : null,
      created_at: new Date(Date.now() - (50 - i) * 5000).toISOString(),
    })) as SensorDataRow[],
    strategies: [
      {
        id: 'strategy-3',
        patient_id: 'patient-2',
        name: 'Progressive Muscle Relaxation',
        category: 'body_awareness',
        description: 'Systematic muscle relaxation',
        duration_minutes: 10,
        success_rate: 0.8,
        last_used: new Date().toISOString(),
        times_used: 12,
        created_by: 'therapist',
        created_at: new Date().toISOString(),
      },
    ] as CopingStrategyRow[],
  },
  {
    patient_id: 'patient-3',
    patient_name: 'Jordan',
    sensorData: Array.from({ length: 50 }, (_, i) => ({
      id: `sensor-${i}`,
      patient_id: 'patient-3',
      device_id: 'device-3',
      timestamp: new Date(Date.now() - (50 - i) * 5000).toISOString(),
      heart_rate: 65 + Math.random() * 15,
      hrv: 55 + Math.random() * 25,
      eda: 1.8 + Math.random() * 0.8,
      accelerometer_x: 0,
      accelerometer_y: 0,
      accelerometer_z: 0,
      location: 'home',
      activity: 'relaxing',
      stress_score: 25 + Math.random() * 20,
      overload_predicted: Math.random() > 0.95,
      overload_predicted_in_minutes: null,
      created_at: new Date(Date.now() - (50 - i) * 5000).toISOString(),
    })) as SensorDataRow[],
    strategies: [
      {
        id: 'strategy-4',
        patient_id: 'patient-3',
        name: 'Meditation',
        category: 'breathwork',
        description: 'Guided meditation',
        duration_minutes: 15,
        success_rate: 0.9,
        last_used: new Date().toISOString(),
        times_used: 20,
        created_by: 'user',
        created_at: new Date().toISOString(),
      },
    ] as CopingStrategyRow[],
  },
];

export default function TherapistPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [patientInsights, setPatientInsights] = useState<PatientInsight[]>([]);
  const [aggregatedInsights, setAggregatedInsights] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'insights'>('overview');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Calculate insights for each patient
      const insights = MOCK_THERAPIST_PATIENTS.map((patient) =>
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

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const selectedPatient = MOCK_THERAPIST_PATIENTS.find((p) => p.patient_id === selectedPatientId);

  return (
    <AppLayout
      headerProps={{
        userName: 'Dr. Smith',
        supportLevel: 3,
        notificationCount: 2,
        devicesConnected: 0,
        devicesTotal: 0,
      }}
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-neutral-800">
          <button type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Overview
          </button>
          <button type="button"
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'patients'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Patients
          </button>
          <button type="button"
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'insights'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Insights
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <TherapistDashboard patientData={MOCK_THERAPIST_PATIENTS} isLoading={isLoading} />
        )}

        {activeTab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TherapistPatientList
                patients={patientInsights}
                onSelectPatient={(patientId) => {
                  setSelectedPatientId(patientId);
                  setShowMessaging(true);
                }}
                onSendMessage={(patientId) => {
                  setSelectedPatientId(patientId);
                  setShowMessaging(true);
                }}
              />
            </div>

            {/* Messaging Panel */}
            {showMessaging && selectedPatient && (
              <div className="lg:col-span-1">
                <TherapistMessaging
                  patientId={selectedPatient.patient_id}
                  patientName={selectedPatient.patient_name}
                  therapistName="Dr. Smith"
                  messages={[
                    {
                      id: '1',
                      sender_id: 'patient',
                      sender_name: selectedPatient.patient_name,
                      message: 'I had a difficult day at school today.',
                      message_type: 'update',
                      created_at: new Date(Date.now() - 3600000).toISOString(),
                    },
                    {
                      id: '2',
                      sender_id: 'therapist',
                      sender_name: 'Dr. Smith',
                      message:
                        'I see your stress levels were elevated. Would you like to discuss what happened?',
                      message_type: 'suggestion',
                      created_at: new Date(Date.now() - 1800000).toISOString(),
                    },
                  ]}
                  onSendMessage={(_message: string, _type: string) => {
                    // Handle message sending
                  }}
                  onClose={() => setShowMessaging(false)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && aggregatedInsights && (
          <AggregatedInsights insights={aggregatedInsights} />
        )}
      </div>
    </AppLayout>
  );
}

