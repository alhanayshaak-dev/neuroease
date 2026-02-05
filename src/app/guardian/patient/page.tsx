'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import { useGuardianContext } from '@/context/GuardianContext';
import {
  FileText,
  Pill,
  Calendar,
  Lock,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle,
  Video,
  Download,
  Eye,
  EyeOff,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  LineChart,
  Activity,
  Heart,
  Brain,
  Zap as ZapIcon,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  generateMedicationLogs,
  generateTriggerLogs,
  generateStrategyLogs,
  generateStrategyRecommendations,
  generateRefillReminders,
  checkDrugInteractions,
  TriggerLog,
  StrategyLog,
} from '@/utils/patient-data';

export default function PatientPage() {
  const contextData = useGuardianContext();
  const session = contextData?.session || {
    patientName: 'Violet Azer',
    patientAge: 16,
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'tracking' | 'analytics' | 'health' | 'insights'>('overview');
  const [showDrugInteractionsDisclaimer, setShowDrugInteractionsDisclaimer] = useState(false);
  const [showTriggerDetail, setShowTriggerDetail] = useState<TriggerLog | null>(null);
  const [showStrategyDetail, setShowStrategyDetail] = useState<StrategyLog | null>(null);

  const medicationLogs = generateMedicationLogs();
  const triggerLogs = generateTriggerLogs();
  const strategyLogs = generateStrategyLogs();
  const strategyRecommendations = generateStrategyRecommendations(62, ['Loud noises']);
  const refillReminders = generateRefillReminders();
  const drugInteractions = checkDrugInteractions(['Sertraline', 'Ibuprofen']);

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white mb-1 truncate">{session?.patientName}&apos;s Profile</h1>
            <p className="text-xs text-gray-400">
              Age {session?.patientAge} • Diagnosed with Autism Spectrum Disorder
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            type="button"
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Go back"
            aria-label="Go back"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-teal-600/30 overflow-x-auto">
          {['overview', 'tracking', 'analytics', 'health', 'insights'].map((tab) => (
            <button type="button"
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-gray-400 hover:text-teal-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Disclaimer */}
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
              <p className="text-red-400 text-sm font-semibold mb-1">Privacy Notice</p>
              <p className="text-gray-300 text-sm">Microphone and camera access have been disabled by Violet for privacy protection.</p>
            </div>

            {/* Hardware Detected Graphs & Charts */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Real-Time Sensor Data</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-2">Heart Rate</p>
                  <p className="text-white text-3xl font-bold">92 bpm</p>
                  <div className="mt-3 h-16 bg-black/30 rounded flex items-end justify-around p-2">
                    <div className="w-1 bg-teal-500" style={{height: '40%'}}></div>
                    <div className="w-1 bg-teal-500" style={{height: '50%'}}></div>
                    <div className="w-1 bg-teal-500" style={{height: '60%'}}></div>
                    <div className="w-1 bg-teal-500" style={{height: '55%'}}></div>
                    <div className="w-1 bg-teal-500" style={{height: '65%'}}></div>
                  </div>
                </div>

                <div className="bg-black/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-2">Stress Level</p>
                  <p className="text-white text-3xl font-bold">62%</p>
                  <div className="mt-3 h-16 bg-black/30 rounded flex items-end justify-around p-2">
                    <div className="w-1 bg-orange-500" style={{height: '45%'}}></div>
                    <div className="w-1 bg-orange-500" style={{height: '55%'}}></div>
                    <div className="w-1 bg-orange-500" style={{height: '62%'}}></div>
                    <div className="w-1 bg-orange-500" style={{height: '58%'}}></div>
                    <div className="w-1 bg-orange-500" style={{height: '62%'}}></div>
                  </div>
                </div>

                <div className="bg-black/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-2">Sleep Quality</p>
                  <p className="text-white text-3xl font-bold">78%</p>
                  <div className="mt-3 h-16 bg-black/30 rounded flex items-end justify-around p-2">
                    <div className="w-1 bg-blue-500" style={{height: '70%'}}></div>
                    <div className="w-1 bg-blue-500" style={{height: '75%'}}></div>
                    <div className="w-1 bg-blue-500" style={{height: '78%'}}></div>
                    <div className="w-1 bg-blue-500" style={{height: '80%'}}></div>
                    <div className="w-1 bg-blue-500" style={{height: '78%'}}></div>
                  </div>
                </div>

                <div className="bg-black/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-2">Activity Level</p>
                  <p className="text-white text-3xl font-bold">4.2k steps</p>
                  <div className="mt-3 h-16 bg-black/30 rounded flex items-end justify-around p-2">
                    <div className="w-1 bg-green-500" style={{height: '50%'}}></div>
                    <div className="w-1 bg-green-500" style={{height: '65%'}}></div>
                    <div className="w-1 bg-green-500" style={{height: '75%'}}></div>
                    <div className="w-1 bg-green-500" style={{height: '70%'}}></div>
                    <div className="w-1 bg-green-500" style={{height: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Triggers & Calming Methods */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Known Triggers
                </h3>
                <ul className="space-y-2 mb-4">
                  <li className="text-gray-300 text-sm">• Loud noises</li>
                  <li className="text-gray-300 text-sm">• Crowded spaces</li>
                  <li className="text-gray-300 text-sm">• Unexpected changes</li>
                  <li className="text-gray-300 text-sm">• Bright lights</li>
                </ul>
                <div className="flex gap-2">
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-sm font-semibold flex items-center gap-1">
                    <Plus size={16} />
                    Add
                  </button>
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-sm font-semibold flex items-center gap-1">
                    <Edit size={16} />
                    Edit
                  </button>
                </div>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap size={20} />
                  Calming Methods
                </h3>
                <ul className="space-y-2 mb-4">
                  <li className="text-gray-300 text-sm">• Listening to music</li>
                  <li className="text-gray-300 text-sm">• Deep breathing</li>
                  <li className="text-gray-300 text-sm">• Quiet time alone</li>
                  <li className="text-gray-300 text-sm">• Fidget tools</li>
                </ul>
                <div className="flex gap-2">
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-sm font-semibold flex items-center gap-1">
                    <Plus size={16} />
                    Add
                  </button>
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-sm font-semibold flex items-center gap-1">
                    <Edit size={16} />
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* AI Strategy Recommendations */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target size={20} />
                Recommended Strategies
              </h3>
              <div className="space-y-3">
                {strategyRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-black/30 rounded p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white font-semibold">{rec.strategy}</p>
                      <span className="text-teal-400 text-sm">
                        {Math.round(rec.successRate * 100)}% success
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{rec.reason}</p>
                    <p className="text-gray-500 text-xs mt-1">Est. duration: {rec.estimatedDuration} min</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Files */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText size={24} />
                Medical Files
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                  <div>
                    <p className="text-white font-semibold text-sm">Diagnosis Report 2024</p>
                    <p className="text-gray-500 text-xs">PDF • 2.4 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="text-teal-400 hover:text-teal-300">
                      <Eye size={18} />
                    </button>
                    <button type="button" className="text-teal-400 hover:text-teal-300">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                  <div>
                    <p className="text-white font-semibold text-sm">Therapy Notes - Jan 2024</p>
                    <p className="text-gray-500 text-xs">PDF • 1.2 MB</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="text-teal-400 hover:text-teal-300">
                      <Eye size={18} />
                    </button>
                    <button type="button" className="text-teal-400 hover:text-teal-300">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" className="text-teal-400 hover:text-teal-300 text-sm font-semibold flex items-center gap-1">
                <Plus size={16} />
                Upload New File
              </button>
            </div>

            {/* Medications */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Pill size={24} />
                Medications
              </h2>
              <div className="space-y-3 mb-4">
                {medicationLogs.map((med) => (
                  <div key={med.id} className="p-3 bg-black/50 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{med.name} {med.dosage}</p>
                        <p className="text-gray-400 text-xs">{med.scheduledTime}</p>
                      </div>
                      {med.taken ? (
                        <CheckCircle size={18} className="text-green-400" />
                      ) : (
                        <AlertTriangle size={18} className="text-yellow-400" />
                      )}
                    </div>
                    <p className="text-teal-400 text-xs">Adherence: 95%</p>
                  </div>
                ))}
              </div>

              {refillReminders.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-3 mb-4">
                  <p className="text-yellow-400 text-sm font-semibold mb-2">Refill Reminder</p>
                  {refillReminders.map((reminder, idx) => (
                    <p key={idx} className="text-gray-300 text-xs">
                      {reminder.medication} - {reminder.daysRemaining} days remaining
                    </p>
                  ))}
                </div>
              )}

              {drugInteractions.length > 0 && (
                <div className="bg-red-900/20 border border-red-600/30 rounded p-3">
                  <p className="text-red-400 text-sm font-semibold mb-2">Drug Interactions</p>
                  {drugInteractions.map((interaction, idx) => (
                    <button type="button"
                      key={idx}
                      onClick={() => setShowDrugInteractionsDisclaimer(true)}
                      className="text-gray-300 text-xs hover:text-red-300 transition-colors block w-full text-left"
                    >
                      ⚠️ {interaction}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Appointments */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar size={24} />
                Upcoming Appointments
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-black/50 rounded">
                  <p className="text-white font-semibold text-sm">Therapy with Sophie Falcone</p>
                  <p className="text-gray-400 text-xs">Thursday, Feb 6 • 3:00 PM</p>
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-xs font-semibold mt-2 flex items-center gap-1">
                    <Video size={14} />
                    Join Video Call
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lock size={24} />
                Privacy Settings
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                  <div>
                    <p className="text-white font-semibold text-sm">Camera Access</p>
                    <p className="text-gray-400 text-xs">Disabled by Violet</p>
                  </div>
                  <EyeOff size={18} className="text-red-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                  <div>
                    <p className="text-white font-semibold text-sm">Microphone Access</p>
                    <p className="text-gray-400 text-xs">Disabled by Violet</p>
                  </div>
                  <EyeOff size={18} className="text-red-400" />
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-4">
                Violet controls access to camera and microphone. These cannot be overridden.
              </p>
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            {/* Combined Triggers & Strategies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trigger History */}
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Trigger History</h3>
                <div className="space-y-3">
                  {triggerLogs.map((log) => (
                    <button type="button"
                      key={log.id}
                      onClick={() => setShowTriggerDetail(log)}
                      className="p-3 bg-black/50 rounded hover:border-teal-400 border border-transparent transition-colors w-full text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-semibold text-sm">{log.trigger}</p>
                          <p className="text-gray-400 text-xs">
                            {log.location} • {log.timestamp}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-teal-400 font-semibold">Severity: {log.severity}/5</p>
                          <p className="text-gray-400 text-xs">Stress: {log.stressLevel}%</p>
                        </div>
                      </div>
                      {log.context && <p className="text-gray-500 text-xs">Context: {log.context}</p>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strategy Effectiveness */}
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Strategy Effectiveness</h3>
                <div className="space-y-3">
                  {strategyLogs.map((log) => (
                    <button type="button"
                      key={log.id}
                      onClick={() => setShowStrategyDetail(log)}
                      className="p-3 bg-black/50 rounded hover:border-teal-400 border border-transparent transition-colors w-full text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-semibold text-sm">{log.strategy}</p>
                          <p className="text-gray-400 text-xs">{log.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-teal-400 font-semibold">Effectiveness: {log.effectiveness}/5</p>
                          <p className="text-gray-400 text-xs">Duration: {log.duration} min</p>
                        </div>
                      </div>
                      {log.notes && <p className="text-gray-500 text-xs">Notes: {log.notes}</p>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Avg Daily Stress</p>
                    <p className="text-white text-3xl font-bold">62%</p>
                  </div>
                  <Brain size={24} className="text-purple-400" />
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown size={16} className="text-green-400" />
                  <span className="text-green-400 text-sm">8% decrease</span>
                </div>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Heart Rate Avg</p>
                    <p className="text-white text-3xl font-bold">78 bpm</p>
                  </div>
                  <Heart size={24} className="text-red-400" />
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-orange-400" />
                  <span className="text-orange-400 text-sm">2% increase</span>
                </div>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Sleep Quality</p>
                    <p className="text-white text-3xl font-bold">7.2 hrs</p>
                  </div>
                  <Clock size={24} className="text-blue-400" />
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-green-400 text-sm">12% better</span>
                </div>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Activity Level</p>
                    <p className="text-white text-3xl font-bold">6.8k steps</p>
                  </div>
                  <Activity size={24} className="text-green-400" />
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-green-400 text-sm">15% more active</span>
                </div>
              </div>
            </div>

            {/* Weekly Trends */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LineChart size={20} />
                Weekly Trends
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-300 text-sm mb-3">Stress Levels</p>
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs w-8">{day}</span>
                        <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${50 + Math.random() * 40}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-3">Sleep Quality</p>
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs w-8">{day}</span>
                        <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${60 + Math.random() * 30}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart size={20} />
                  Cardiovascular Health
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                    <span className="text-gray-300">Resting Heart Rate</span>
                    <span className="text-teal-400 font-bold">62 bpm</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                    <span className="text-gray-300">Blood Pressure</span>
                    <span className="text-teal-400 font-bold">120/80</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                    <span className="text-gray-300">Heart Rate Variability</span>
                    <span className="text-teal-400 font-bold">45 ms</span>
                  </div>
                </div>
              </div>

              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain size={20} />
                  Neurological Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                    <span className="text-gray-300">Cognitive Load</span>
                    <span className="text-teal-400 font-bold">45%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                    <span className="text-gray-300">Focus Level</span>
                    <span className="text-teal-400 font-bold">78%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/50 rounded">
                    <span className="text-gray-300">Alertness</span>
                    <span className="text-teal-400 font-bold">High</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Health Recommendations</h3>
              <div className="space-y-3">
                <div className="bg-green-900/20 border border-green-600/30 rounded p-4">
                  <p className="text-green-400 font-semibold text-sm mb-1">✓ Excellent Sleep</p>
                  <p className="text-gray-300 text-sm">Violet is getting 7+ hours of quality sleep. Keep this up!</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-600/30 rounded p-4">
                  <p className="text-blue-400 font-semibold text-sm mb-1">→ Increase Activity</p>
                  <p className="text-gray-300 text-sm">Consider adding 2000 more steps daily for better cardiovascular health.</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-4">
                  <p className="text-yellow-400 font-semibold text-sm mb-1">⚠ Monitor Stress</p>
                  <p className="text-gray-300 text-sm">Stress levels are elevated on Tuesdays and Thursdays. Plan calming activities.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ZapIcon size={20} />
                AI-Generated Insights
              </h3>
              <div className="space-y-4">
                <div className="bg-teal-900/20 border border-teal-600/30 rounded p-4">
                  <p className="text-teal-400 font-semibold text-sm mb-2">Pattern Detected: Weekly Stress Cycle</p>
                  <p className="text-gray-300 text-sm">Violet experiences higher stress on Tuesdays and Thursdays. This correlates with school schedule. Consider preventive strategies on these days.</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-600/30 rounded p-4">
                  <p className="text-blue-400 font-semibold text-sm mb-2">Correlation Found: Exercise & Sleep</p>
                  <p className="text-gray-300 text-sm">Days with 8000+ steps show 15% better sleep quality. Encourage daily activity for improved sleep.</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-600/30 rounded p-4">
                  <p className="text-purple-400 font-semibold text-sm mb-2">Strategy Effectiveness: Deep Breathing</p>
                  <p className="text-gray-300 text-sm">Deep breathing is 92% effective at reducing stress. It&apos;s the most reliable strategy. Use it proactively.</p>
                </div>
                <div className="bg-green-900/20 border border-green-600/30 rounded p-4">
                  <p className="text-green-400 font-semibold text-sm mb-2">Medication Impact: Positive</p>
                  <p className="text-gray-300 text-sm">Current medication regimen shows positive impact on mood stability. Adherence is excellent at 94%.</p>
                </div>
              </div>
            </div>

            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Predictive Alerts</h3>
              <div className="space-y-3">
                <div className="bg-orange-900/20 border border-orange-600/30 rounded p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-orange-400 font-semibold text-sm">Upcoming High-Stress Period</p>
                    <p className="text-gray-300 text-sm">Based on patterns, Tuesday next week may be high-stress. Plan extra support.</p>
                  </div>
                </div>
                <div className="bg-green-900/20 border border-green-600/30 rounded p-4 flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-green-400 font-semibold text-sm">Medication Refill Due</p>
                    <p className="text-gray-300 text-sm">Sertraline refill needed in 5 days. Schedule appointment with doctor.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Drug Interactions Disclaimer Modal */}
      {showDrugInteractionsDisclaimer && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-red-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-white text-xl font-bold mb-4">Drug Interactions Warning</h2>
            <div className="space-y-4 mb-6">
              <div className="bg-red-900/30 border border-red-600/50 rounded p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">Important Disclaimer</p>
                <p className="text-gray-300 text-sm">
                  Please consult with your doctor or pharmacist before consuming both medications together. Drug interactions can be serious and require professional medical guidance.
                </p>
              </div>
              <div className="bg-black/70 rounded p-4">
                <p className="text-gray-300 text-sm mb-2">
                  <span className="text-teal-400 font-semibold">Sertraline</span> and <span className="text-teal-400 font-semibold">Ibuprofen</span> may interact. Ibuprofen can increase the risk of bleeding when combined with SSRIs like Sertraline.
                </p>
              </div>
              <div className="bg-black/70 rounded p-4">
                <p className="text-gray-400 text-xs">
                  If you experience unusual bleeding, bruising, or other concerning symptoms, seek medical attention immediately.
                </p>
              </div>
            </div>
            <button type="button"
              onClick={() => setShowDrugInteractionsDisclaimer(false)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Trigger Detail Modal */}
      {showTriggerDetail && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Trigger Details</h2>
              <button type="button"
                onClick={() => setShowTriggerDetail(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-black/70 rounded p-4">
                <p className="text-gray-400 text-sm mb-1">Trigger</p>
                <p className="text-white font-semibold text-lg">{showTriggerDetail.trigger}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-xs mb-1">Severity</p>
                  <p className="text-white font-bold text-2xl">{showTriggerDetail.severity}/5</p>
                </div>
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-xs mb-1">Stress Level</p>
                  <p className="text-white font-bold text-2xl">{showTriggerDetail.stressLevel}%</p>
                </div>
              </div>
              <div className="bg-black/70 rounded p-4">
                <p className="text-gray-400 text-sm mb-1">Location</p>
                <p className="text-white">{showTriggerDetail.location}</p>
              </div>
              <div className="bg-black/70 rounded p-4">
                <p className="text-gray-400 text-sm mb-1">Time</p>
                <p className="text-white">{showTriggerDetail.timestamp}</p>
              </div>
              {showTriggerDetail.context && (
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">Context</p>
                  <p className="text-white">{showTriggerDetail.context}</p>
                </div>
              )}
            </div>
            <button type="button"
              onClick={() => setShowTriggerDetail(null)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Strategy Detail Modal */}
      {showStrategyDetail && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Strategy Effectiveness</h2>
              <button type="button"
                onClick={() => setShowStrategyDetail(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-black/70 rounded p-4">
                <p className="text-gray-400 text-sm mb-1">Strategy</p>
                <p className="text-white font-semibold text-lg">{showStrategyDetail.strategy}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-xs mb-1">Effectiveness</p>
                  <p className="text-white font-bold text-2xl">{showStrategyDetail.effectiveness}/5</p>
                </div>
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-xs mb-1">Duration</p>
                  <p className="text-white font-bold text-lg">{showStrategyDetail.duration} min</p>
                </div>
              </div>
              <div className="bg-black/70 rounded p-4">
                <p className="text-gray-400 text-sm mb-1">Time Used</p>
                <p className="text-white">{showStrategyDetail.timestamp}</p>
              </div>
              {showStrategyDetail.notes && (
                <div className="bg-black/70 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">Notes</p>
                  <p className="text-white">{showStrategyDetail.notes}</p>
                </div>
              )}
              <div className="bg-teal-900/30 border border-teal-600/50 rounded p-4">
                <p className="text-teal-400 text-sm font-semibold">Recommendation</p>
                <p className="text-gray-300 text-xs mt-2">
                  This strategy was {showStrategyDetail.effectiveness >= 4 ? 'highly effective' : showStrategyDetail.effectiveness >= 3 ? 'moderately effective' : 'less effective'} for managing stress. Consider using it again in similar situations.
                </p>
              </div>
            </div>
            <button type="button"
              onClick={() => setShowStrategyDetail(null)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GuardianLayout>
  );
}

