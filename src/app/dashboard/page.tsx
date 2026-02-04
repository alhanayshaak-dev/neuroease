'use client';

import React from 'react';
import { useGuardianContext } from '@/context/GuardianContext';
import { VioletStatusCard } from '@/components/VioletStatusCard';
import { DeviceStatusCarousel } from '@/components/DeviceStatusCarousel';
import { AlertsPanel } from '@/components/AlertsPanel';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { session, setSession } = useGuardianContext();

  // Initialize with mock session if not authenticated
  React.useEffect(() => {
    if (!session) {
      setSession({
        guardianId: 'guardian-1',
        guardianName: 'Avery',
        guardianEmail: 'avery@example.com',
        relationship: 'parent',
        patientId: 'patient-1',
        patientName: 'Violet',
        patientAge: 8,
        permissions: {
          see_status: true,
          see_alerts: true,
          see_trends: true,
          see_medical: true,
          trigger_emergency: true,
          suggest_strategies: true,
          access_mic: true,
          access_camera: true,
        },
        isAuthenticated: true,
      });
    }
  }, [session, setSession]);

  const mockDevices = [
    {
      id: '1',
      name: 'Neurobud',
      type: 'neurobud' as const,
      connected: true,
      battery: 85,
      lastSync: '2 min ago',
    },
    {
      id: '2',
      name: 'NeuroLens',
      type: 'neurolens' as const,
      connected: true,
      battery: 72,
      lastSync: '5 min ago',
    },
    {
      id: '3',
      name: 'Neuroband',
      type: 'neuroband' as const,
      connected: true,
      battery: 91,
      lastSync: '1 min ago',
    },
    {
      id: '4',
      name: 'NeuroLens (Backup)',
      type: 'neurolens' as const,
      connected: false,
      battery: 45,
      lastSync: '2 hours ago',
    },
  ];

  const mockAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Stress Rising',
      message: "Violet's stress level is rising. Consider checking in.",
      timestamp: '5 minutes ago',
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'Medication Due',
      message: "Violet's afternoon medication is due in 30 minutes.",
      timestamp: '10 minutes ago',
    },
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Not authenticated</p>
          <p className="text-gray-400">Please log in to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 w-full bg-blue-900 py-6 px-6 border-b-2 border-cyan-400">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
          {/* Brain Logo SVG */}
          <div className="flex-shrink-0">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="2" />
              <circle cx="30" cy="30" r="3" fill="#06b6d4" />
              <circle cx="70" cy="30" r="3" fill="#06b6d4" />
              <circle cx="50" cy="50" r="3" fill="#06b6d4" />
              <circle cx="30" cy="70" r="3" fill="#06b6d4" />
              <circle cx="70" cy="70" r="3" fill="#06b6d4" />
            </svg>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h1 className="text-3xl font-black text-cyan-400 tracking-wider mb-1">
              NEUROEASE
            </h1>
            <p className="text-sm text-cyan-300 font-bold tracking-widest">
              EASE. ELEVATE. EMPOWER
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 mt-6">
            <h1 className="text-lg font-bold text-white mb-1">
              Welcome back, {session.guardianName}
            </h1>
            <p className="text-xs text-cyan-400">
              Monitoring {session.patientName}
            </p>
          </div>

          {/* Violet's Status */}
          <div className="mb-6">
            <VioletStatusCard 
              status="rising" 
              stressScore={62} 
              heartRate={92} 
              lastUpdate="Just now"
              stressChange="rising"
              heartRateChange="rising"
            />
          </div>

          {/* Connected Devices */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">Connected Devices</h3>
            <DeviceStatusCarousel devices={mockDevices} />
          </div>

          {/* Alerts & Notifications */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">Alerts & Notifications</h3>
            <AlertsPanel alerts={mockAlerts} />
          </div>

          {/* Emergency Feature */}
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Emergency Mode</h3>
                <p className="text-gray-400 text-xs">
                  Activate noise reduction & escape navigation
                </p>
              </div>
              <button type="button" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded text-sm transition-colors">
                Activate
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
