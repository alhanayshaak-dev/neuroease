'use client';

import React from 'react';
import { useGuardianContext } from '@/context/GuardianContext';
import { VioletStatusCard } from '@/components/VioletStatusCard';
import { DeviceStatusCarousel } from '@/components/DeviceStatusCarousel';
import { AlertsPanel } from '@/components/AlertsPanel';
import { AlertCircle, Home, Heart, Smartphone, Users, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { session, setSession } = useGuardianContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('home');

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

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-lg">Not authenticated</p>
          <p className="text-gray-400">Please log in to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* Mobile Phone Frame */}
      <div className="relative w-full max-w-sm bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50" />

        {/* Phone Content */}
        <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-gradient-to-b from-blue-900 to-blue-800 px-4 pt-8 pb-4 border-b border-cyan-400/30">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="2" />
                <circle cx="30" cy="30" r="3" fill="#06b6d4" />
                <circle cx="70" cy="30" r="3" fill="#06b6d4" />
                <circle cx="50" cy="50" r="3" fill="#06b6d4" />
                <circle cx="30" cy="70" r="3" fill="#06b6d4" />
                <circle cx="70" cy="70" r="3" fill="#06b6d4" />
              </svg>
              <h1 className="text-xl font-black text-cyan-400">NEUROEASE</h1>
            </div>
            <p className="text-xs text-cyan-300 font-bold text-center">EASE. ELEVATE. EMPOWER</p>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white mb-1">Welcome back, {session.guardianName}</h2>
              <p className="text-xs text-cyan-400">Monitoring {session.patientName}</p>
            </div>

            <div className="mb-4">
              <VioletStatusCard 
                status="rising" 
                stressScore={62} 
                heartRate={92} 
                lastUpdate="Just now"
                stressChange="rising"
                heartRateChange="rising"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-white mb-2">Connected Devices</h3>
              <DeviceStatusCarousel devices={mockDevices} />
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-white mb-2">Alerts</h3>
              <AlertsPanel alerts={mockAlerts} />
            </div>

            <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3">
              <h3 className="text-white font-semibold text-xs mb-1">Emergency Mode</h3>
              <p className="text-gray-400 text-xs mb-2">Activate noise reduction & escape navigation</p>
              <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-2 rounded text-xs transition-colors">
                Activate
              </button>
            </div>
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-cyan-400/30 flex justify-around items-center h-20 max-w-sm mx-auto">
            <button
              onClick={() => handleNavigation('home', '/dashboard')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                activeTab === 'home' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Home size={20} />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => handleNavigation('health', '/patient')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                activeTab === 'health' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Heart size={20} />
              <span className="text-xs">Health</span>
            </button>
            <button
              onClick={() => handleNavigation('devices', '/devices')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                activeTab === 'devices' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Smartphone size={20} />
              <span className="text-xs">Devices</span>
            </button>
            <button
              onClick={() => handleNavigation('care', '/care-circle')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                activeTab === 'care' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Users size={20} />
              <span className="text-xs">Care</span>
            </button>
            <button
              onClick={() => handleNavigation('settings', '/community')}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                activeTab === 'settings' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Settings size={20} />
              <span className="text-xs">More</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
