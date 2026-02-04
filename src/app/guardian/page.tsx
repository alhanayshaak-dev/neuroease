'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GuardianLayout } from '@/components/GuardianLayout';
import { VioletStatusCard } from '@/components/VioletStatusCard';
import { DeviceStatusCarousel } from '@/components/DeviceStatusCarousel';
import { AlertsPanel } from '@/components/AlertsPanel';
import { DashboardChatbot } from '@/components/DashboardChatbot';
import { useGuardianContext } from '@/context/GuardianContext';
import {
  TrendingDown,
  Bell,
  Settings,
  Zap,
} from 'lucide-react';

export default function GuardianDashboard() {
  const contextData = useGuardianContext();
  const session = contextData?.session || {
    guardianName: 'Avery Gray',
    patientName: 'Violet Azer',
    patientAge: 16,
  };
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showTriggerLog, setShowTriggerLog] = useState(false);
  const [showStrategyLog, setShowStrategyLog] = useState(false);
  const [showAlertThresholds, setShowAlertThresholds] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(70);
  const [showMedicationDetail, setShowMedicationDetail] = useState(false);
  const [showVioletStatus, setShowVioletStatus] = useState(false);
  const [showEmergencySetup, setShowEmergencySetup] = useState(false);
  const [calmingMethods, setCalmingMethods] = useState(['Deep breathing', 'Quiet time', 'Music']);
  const [newMethod, setNewMethod] = useState('');

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

  return (
    <GuardianLayout>
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 mt-6 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-white mb-1">Welcome back, {session.guardianName}</h1>
            <p className="text-xs font-medium text-cyan-400">Monitoring {session.patientName}</p>
          </div>
          <Link
            href="/guardian/settings"
            className="p-2 hover:bg-navy-900 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={24} className="text-teal-400" />
          </Link>
        </div>



        {/* Chatbot */}
        <div className="mb-6">
          <DashboardChatbot />
        </div>

        {/* Violet's Status & History Carousel */}
        <div className="mb-6">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4 min-w-min">
              {/* Violet's Current Status */}
              <div className="flex-shrink-0 w-[320px]">
                <VioletStatusCard 
                  status="rising" 
                  stressScore={62} 
                  heartRate={92} 
                  lastUpdate="Just now"
                  stressChange="rising"
                  heartRateChange="rising"
                  onActivateEmergency={() => {
                    setEmergencyMode(true);
                    setShowEmergencySetup(false);
                  }}
                />
              </div>

              {/* Weekly Status Overview */}
              <div className="flex-shrink-0 w-[320px] bg-black/20 border border-teal-600/30 rounded-lg p-3 hover:border-teal-400 transition-colors">
                <h3 className="text-white font-semibold mb-2 text-sm">Weekly Status</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-400 text-xs">Avg Cortisol</p>
                      <p className="text-teal-400 font-semibold text-xs">18.2 μg/dL</p>
                    </div>
                    <p className="text-gray-500 text-xs mb-1">Normal: 10-20 μg/dL</p>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: '52%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-400 text-xs">Stable Days</p>
                      <p className="text-green-400 font-semibold text-xs">5/7</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-green-500" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-400 text-xs">Critical Events</p>
                      <p className="text-red-400 font-semibold text-xs">4</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-red-500" style={{ width: '57%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Improvement Stats */}
              <div className="flex-shrink-0 w-[320px] bg-black/20 border border-teal-600/30 rounded-lg p-3 hover:border-teal-400 transition-colors">
                <h3 className="text-white font-semibold mb-2 text-sm">Monthly Progress</h3>
                <div className="space-y-2">
                  <div className="bg-green-900/20 border border-green-600/30 rounded p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-green-400 text-xs font-semibold">Stress Reduction</p>
                      <p className="text-green-400 font-bold text-xs">↓ 18%</p>
                    </div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-blue-400 text-xs font-semibold">Medication Adherence</p>
                      <p className="text-blue-400 font-bold text-xs">92%</p>
                    </div>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-600/30 rounded p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-purple-400 text-xs font-semibold">Coping Effectiveness</p>
                      <p className="text-purple-400 font-bold text-xs">↑ 25%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="flex-shrink-0 w-[320px] bg-black/20 border border-teal-600/30 rounded-lg p-3 hover:border-teal-400 transition-colors">
                <h3 className="text-white font-semibold mb-2 text-sm">Trend Analysis</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-1.5 bg-black/30 rounded text-xs">
                    <span className="text-gray-400">Peak Stress Time</span>
                    <span className="text-teal-400 font-semibold">2-4 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-black/30 rounded text-xs">
                    <span className="text-gray-400">Effective Strategy</span>
                    <span className="text-teal-400 font-semibold">Music</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-black/30 rounded text-xs">
                    <span className="text-gray-400">Primary Trigger</span>
                    <span className="text-teal-400 font-semibold">Loud Noise</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-black/30 rounded text-xs">
                    <span className="text-gray-400">Recovery Time</span>
                    <span className="text-teal-400 font-semibold">12 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Violet Status Detail Modal */}
        {showVioletStatus && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Violet's Status</h2>
                <button type="button" onClick={() => setShowVioletStatus(false)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>
              <div className="space-y-4 mb-4">
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">Stress Level</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white text-3xl font-bold">62</p>
                    <span className="text-orange-400 text-sm font-semibold">Rising</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-orange-500" style={{ width: '62%' }}></div>
                  </div>
                </div>
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">Heart Rate</p>
                  <p className="text-white text-2xl font-bold">92 bpm</p>
                </div>
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">Last Update</p>
                  <p className="text-white text-sm">Just now</p>
                </div>
                <div className="bg-red-900/30 border border-red-600/50 rounded p-3">
                  <p className="text-red-400 text-sm font-semibold">⚠ Alert</p>
                  <p className="text-gray-300 text-sm mt-1">Stress levels are rising. Consider checking in with Violet.</p>
                </div>
              </div>
              <button type="button" 
                onClick={() => setShowVioletStatus(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Analytics Mini Dashboard */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button type="button" 
            onClick={() => window.location.href = '/guardian/analytics'}
            className="bg-navy-900 border border-teal-600/30 rounded-lg p-4 hover:border-teal-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">Weekly Trend</h3>
              <TrendingDown size={18} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">↓ 25%</p>
            <p className="text-gray-400 text-xs">Stress decreased from last week</p>
          </button>
          <button type="button" 
            onClick={() => window.location.href = '/guardian/analytics'}
            className="bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">Stress Analysis</h3>
              <Zap size={18} className="text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">62</p>
            <p className="text-yellow-400 text-xs">Cortisol Level ↑</p>
          </button>
          <button type="button" 
            onClick={() => setShowMedicationDetail(true)}
            className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-600/30 rounded-lg p-4 hover:border-blue-400 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">Medication</h3>
            </div>
            <p className="text-2xl font-bold text-white mb-1">92%</p>
            <p className="text-blue-400 text-xs">Adherence Rate</p>
          </button>
        </div>

        {/* Connected Devices */}
        <DeviceStatusCarousel devices={mockDevices} />

        {/* Alerts & Notifications - MOVED UP FOR CRITICAL VISIBILITY */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-lg">Alerts & Notifications</h3>
          <AlertsPanel alerts={mockAlerts} />
        </div>

        {/* Notification Preferences */}
        <div className="bg-black/20 border border-teal-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Bell size={20} />
              Alert Thresholds
            </h3>
            <button type="button" 
              onClick={() => setShowAlertThresholds(true)}
              className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
            >
              Customize
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Sympathetic Nervous System (SNS) Activity Alert Threshold</span>
              <span className="text-teal-400 text-sm">{alertThreshold}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Do Not Disturb</span>
              <span className="text-teal-400 text-sm">9 PM - 8 AM</span>
            </div>
          </div>
        </div>

        {/* Alert Thresholds Customize Modal */}
        {showAlertThresholds && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-white text-xl font-bold mb-4">Customize Alert Thresholds</h2>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Stress Alert Threshold: {alertThreshold}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-gray-500 text-xs mt-2">Alert when stress exceeds {alertThreshold}%</p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Do Not Disturb Hours</label>
                  <div className="flex gap-2">
                    <input type="time" defaultValue="21:00" className="flex-1 bg-black/50 border border-teal-600/30 rounded px-2 py-1 text-white text-sm" />
                    <span className="text-gray-400 flex items-center">to</span>
                    <input type="time" defaultValue="08:00" className="flex-1 bg-black/50 border border-teal-600/30 rounded px-2 py-1 text-white text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" 
                  onClick={() => setShowAlertThresholds(false)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Save
                </button>
                <button type="button" 
                  onClick={() => setShowAlertThresholds(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Feature */}
        {emergencyMode && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="fixed top-[210px] left-[16px] w-[320px] bg-black border border-red-600 rounded-lg p-6 text-center relative pointer-events-auto max-h-[620px] overflow-y-auto">
              <button type="button"
                onClick={() => {
                  setEmergencyMode(false);
                  setShowBreathingExercise(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors"
                title="Close"
              >
                ✕
              </button>
              {!showEmergencySetup ? (
                <>
                  <h2 className="text-white text-2xl font-bold mb-4">Parasympathetic Intervention</h2>
                  
                  <div className="mb-6 space-y-2">
                    {calmingMethods.map((method, idx) => (
                      <div key={idx} className="bg-teal-600/20 border border-teal-600/50 rounded-lg p-3 text-teal-300 text-sm font-semibold animate-pulse">
                        ✓ {method}
                      </div>
                    ))}
                  </div>

                  {showBreathingExercise && (
                    <div className="mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-full border-4 border-teal-400 animate-pulse flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">Breathe</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">Box Breathing: 4-4-4-4</p>
                      <p className="text-gray-400 text-xs">Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button type="button"
                      onClick={() => setShowBreathingExercise(!showBreathingExercise)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      {showBreathingExercise ? 'Stop' : 'Start'} Box Breathing
                    </button>
                    <button type="button"
                      onClick={() => setShowEmergencySetup(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Customize Methods
                    </button>
                    <button type="button"
                      onClick={() => {
                        setEmergencyMode(false);
                        setShowBreathingExercise(false);
                      }}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Exit Emergency Mode
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-white text-2xl font-bold mb-4">Customize Calming Methods</h2>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {calmingMethods.map((method, idx) => (
                      <div key={idx} className="bg-black/50 rounded p-2 flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{method}</span>
                        <button type="button"
                          onClick={() => setCalmingMethods(calmingMethods.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Add new method..."
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value)}
                      className="flex-1 bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500 text-sm"
                    />
                    <button type="button"
                      onClick={() => {
                        if (newMethod.trim()) {
                          setCalmingMethods([...calmingMethods, newMethod]);
                          setNewMethod('');
                        }
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded font-semibold transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => setShowEmergencySetup(false)}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Done
                    </button>
                    <button type="button"
                      onClick={() => {
                        setEmergencyMode(false);
                        setShowEmergencySetup(false);
                      }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      Exit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Medication Detail Modal */}
        {showMedicationDetail && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="fixed top-[210px] left-[16px] w-[320px] bg-black border border-blue-600 rounded-lg p-6 text-center relative pointer-events-auto max-h-[620px] overflow-y-auto">
              <h2 className="text-white text-2xl font-bold mb-4">Medication Adherence</h2>
              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Doses Taken</span>
                  <span className="text-white font-bold">23 / 25</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="h-3 rounded-full bg-green-500" style={{ width: '92%' }}></div>
                </div>

                <div className="bg-black/70 rounded p-3 border border-blue-600/30">
                  <p className="text-white font-semibold text-sm mb-2">Current Medications</p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="text-blue-400 font-semibold">Sertraline 50mg</p>
                      <p className="text-gray-400">SSRI - Anxiety & Depression</p>
                      <p className="text-gray-500 text-xs">Taken: 24/25 doses (96%)</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-blue-400 font-semibold">Melatonin 5mg</p>
                      <p className="text-gray-400">Sleep Aid - Improves sleep quality</p>
                      <p className="text-gray-500 text-xs">Taken: 23/25 doses (92%)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/70 rounded p-3 border border-orange-600/30">
                  <p className="text-white font-semibold text-sm mb-2">Missed Doses</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-orange-400">Tuesday morning - Forgot (Sertraline)</p>
                    <p className="text-orange-400">Saturday evening - Away (Melatonin)</p>
                  </div>
                </div>

                <div className="bg-black/70 rounded p-3">
                  <p className="text-gray-300 text-sm">Next dose: Today at 6:00 PM</p>
                  <p className="text-gray-500 text-xs mt-1">Sertraline 50mg with food</p>
                </div>
              </div>
              <div className="space-y-2">
                <button type="button" 
                  onClick={() => setShowMedicationDetail(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trigger Log Modal */}
        {showTriggerLog && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-white text-xl font-bold mb-4">Log Trigger</h2>
              <div className="space-y-3 mb-4">
                <input type="text" placeholder="Trigger type" className="w-full bg-gray-800 border border-teal-600/50 rounded px-3 py-2 text-white placeholder-gray-400" />
                <input type="text" placeholder="Location" className="w-full bg-gray-800 border border-teal-600/50 rounded px-3 py-2 text-white placeholder-gray-400" />
                <textarea placeholder="Notes" className="w-full bg-gray-800 border border-teal-600/50 rounded px-3 py-2 text-white placeholder-gray-400 h-20"></textarea>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowTriggerLog(false)} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors">
                  Save
                </button>
                <button type="button" onClick={() => setShowTriggerLog(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Strategy Log Modal */}
        {showStrategyLog && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-white text-xl font-bold mb-4">Log Strategy</h2>
              <div className="space-y-3 mb-4">
                <select className="w-full bg-gray-800 border border-teal-600/50 rounded px-3 py-2 text-white">
                  <option>Select strategy...</option>
                  <option>Deep breathing</option>
                  <option>Quiet time</option>
                  <option>Music</option>
                  <option>Exercise</option>
                  <option>Social support</option>
                </select>
                <input type="number" placeholder="Effectiveness (1-10)" min="1" max="10" className="w-full bg-gray-800 border border-teal-600/50 rounded px-3 py-2 text-white placeholder-gray-400" />
                <textarea placeholder="Notes" className="w-full bg-gray-800 border border-teal-600/50 rounded px-3 py-2 text-white placeholder-gray-400 h-20"></textarea>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowStrategyLog(false)} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors">
                  Save
                </button>
                <button type="button" onClick={() => setShowStrategyLog(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-4 mb-20">
          <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" 
              onClick={() => setShowTriggerLog(true)}
              className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 px-3 py-2 rounded text-sm transition-colors"
            >
              Log Trigger
            </button>
            <button type="button" 
              onClick={() => setShowStrategyLog(true)}
              className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 px-3 py-2 rounded text-sm transition-colors"
            >
              Log Strategy
            </button>
            <button type="button" 
              onClick={() => window.location.href = '/guardian/patient?tab=analytics'}
              className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 px-3 py-2 rounded text-sm transition-colors"
            >
              View Analytics
            </button>
            <button type="button" 
              onClick={() => alert('Report exported as PDF')}
              className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 px-3 py-2 rounded text-sm transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </GuardianLayout>
  );
}

