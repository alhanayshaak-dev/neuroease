'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Heart,
  Brain,
  Download,
  Share2,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [showMedicationOverlay, setShowMedicationOverlay] = useState(false);

  const stressData = [
    { day: 'Mon', value: 65, target: 50 },
    { day: 'Tue', value: 72, target: 50 },
    { day: 'Wed', value: 58, target: 50 },
    { day: 'Thu', value: 68, target: 50 },
    { day: 'Fri', value: 55, target: 50 },
    { day: 'Sat', value: 48, target: 50 },
    { day: 'Sun', value: 52, target: 50 },
  ];

  const triggerData = [
    { trigger: 'Loud Noises', count: 12, percentage: 35 },
    { trigger: 'Crowded Spaces', count: 8, percentage: 24 },
    { trigger: 'Schedule Changes', count: 7, percentage: 21 },
    { trigger: 'Bright Lights', count: 6, percentage: 18 },
  ];

  const strategyEffectiveness = [
    { strategy: 'Deep Breathing', effectiveness: 92, used: 24 },
    { strategy: 'Quiet Time', effectiveness: 88, used: 18 },
    { strategy: 'Music', effectiveness: 85, used: 15 },
    { strategy: 'Exercise', effectiveness: 78, used: 12 },
    { strategy: 'Social Support', effectiveness: 72, used: 8 },
  ];

  const medicationAdherence = [
    { medication: 'Sertraline 50mg', adherence: 96, doses: 24, missed: 1 },
    { medication: 'Melatonin 5mg', adherence: 92, doses: 23, missed: 2 },
  ];

  const weeklyStats = [
    { label: 'Overload Events', value: 4, change: -25, icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Strategies Used', value: 18, change: 12, icon: Zap, color: 'text-yellow-400' },
    { label: 'Avg Stress Level', value: 60, change: -8, icon: Brain, color: 'text-purple-400' },
    { label: 'Medication Adherence', value: '94%', change: 2, icon: CheckCircle, color: 'text-green-400' },
  ];

  return (
    <GuardianLayout>
      <div className="max-w-7xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white mb-1">Analytics Dashboard</h1>
            <p className="text-xs text-gray-400">Comprehensive insights into Violet's health and wellbeing</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Go back"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button type="button"
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                timeRange === range
                  ? 'bg-teal-600 text-white'
                  : 'bg-black/20 border border-teal-600/30 text-gray-400 hover:text-teal-300'
              }`}
            >
              {range}
            </button>
          ))}
          <button type="button" className="ml-auto px-4 py-2 bg-black/20 border border-teal-600/30 text-teal-400 rounded-lg hover:border-teal-600 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
          <button type="button" className="px-4 py-2 bg-black/20 border border-teal-600/30 text-teal-400 rounded-lg hover:border-teal-600 transition-colors flex items-center gap-2">
            <Share2 size={18} />
            Share
          </button>
        </div>

        {/* Weekly Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {weeklyStats.map((stat, idx) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            return (
              <div key={idx} className="bg-black/20 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-white text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon size={24} className={stat.color} />
                </div>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp size={16} className="text-green-400" />
                  ) : (
                    <TrendingDown size={16} className="text-red-400" />
                  )}
                  <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                    {Math.abs(stat.change)}% {isPositive ? 'increase' : 'decrease'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stress Trend Chart */}
          <div className="lg:col-span-2 bg-black/20 border border-teal-600/30 rounded-lg p-6">
            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <LineChart size={24} className="text-teal-400" />
              Stress Level Trend
            </h2>
            <div className="space-y-4">
              {stressData.map((data, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{data.day}</span>
                    <span className="text-white font-semibold">{data.value}%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        data.value > 70
                          ? 'bg-red-500'
                          : data.value > 50
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${data.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-teal-600/20">
              <p className="text-gray-300 text-sm">
                <span className="text-teal-400 font-semibold">Trend:</span> Stress levels decreased by 8% this week. Best day was Saturday with 48% stress level.
              </p>
            </div>
          </div>

          {/* Trigger Distribution */}
          <div className="bg-black/20 border border-teal-600/30 rounded-lg p-6">
            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart size={24} className="text-teal-400" />
              Top Triggers
            </h2>
            <div className="space-y-4">
              {triggerData.map((trigger, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">{trigger.trigger}</span>
                    <span className="text-teal-400 font-semibold">{trigger.percentage}%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${trigger.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{trigger.count} occurrences</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy Effectiveness */}
        <div className="bg-black/20 border border-teal-600/30 rounded-lg p-6 mb-8">
          <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={24} className="text-teal-400" />
            Strategy Effectiveness
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {strategyEffectiveness.map((strategy, idx) => (
              <div key={idx} className="bg-black/50 rounded-lg p-4 border border-teal-600/20">
                <p className="text-white font-semibold text-sm mb-3">{strategy.strategy}</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">Effectiveness</span>
                    <span className="text-teal-400 font-bold">{strategy.effectiveness}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${strategy.effectiveness}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-500 text-xs">Used {strategy.used} times</p>
              </div>
            ))}
          </div>
        </div>

        {/* Medication Adherence */}
        <button
          type="button"
          onClick={() => setShowMedicationOverlay(true)}
          className="w-full bg-black/20 border border-teal-600/30 rounded-lg p-6 mb-8 hover:border-teal-400 transition-colors text-left"
        >
          <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <Heart size={24} className="text-teal-400" />
            Medication Adherence
          </h2>
          <div className="space-y-6">
            {medicationAdherence.map((med, idx) => (
              <div key={idx} className="border-b border-teal-600/20 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold">{med.medication}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {med.doses} doses taken, {med.missed} missed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-teal-400">{med.adherence}%</p>
                    <p className="text-gray-400 text-xs mt-1">Adherence Rate</p>
                  </div>
                </div>
                <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${med.adherence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </button>

        {/* Medication Adherence Overlay */}
        {showMedicationOverlay && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="fixed top-[210px] left-[16px] w-[320px] bg-black/20 border border-green-600 rounded-lg p-6 text-center relative pointer-events-auto max-h-[620px] overflow-y-auto">
              <h2 className="text-white text-2xl font-bold mb-6">Medication Adherence</h2>
              
              <div className="mb-6 space-y-3">
                {medicationAdherence.map((med, idx) => (
                  <div key={idx} className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
                    <p className="text-green-300 text-sm font-semibold mb-2">{med.medication}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-xs">{med.doses} doses taken</span>
                      <span className="text-green-400 font-bold text-lg">{med.adherence}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${med.adherence}%` }}
                      ></div>
                    </div>
                    {med.missed > 0 && (
                      <p className="text-red-400 text-xs mt-2">{med.missed} dose(s) missed</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  View Details
                </button>
                <button type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Set Reminders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Key Insights */}
          <div className="bg-black/20 border border-teal-600/30 rounded-lg p-6">
            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <Brain size={24} className="text-teal-400" />
              Key Insights
            </h2>
            <div className="space-y-4">
              <div className="bg-teal-900/20 border border-teal-600/30 rounded-lg p-4">
                <p className="text-teal-400 font-semibold text-sm mb-1">Positive Trend</p>
                <p className="text-gray-300 text-sm">Stress levels have decreased 8% this week. Keep up the good work!</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold text-sm mb-1">Most Effective Strategy</p>
                <p className="text-gray-300 text-sm">Deep breathing has been 92% effective. Consider using it more often.</p>
              </div>
              <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold text-sm mb-1">Primary Trigger</p>
                <p className="text-gray-300 text-sm">Loud noises account for 35% of overload events. Plan quiet time accordingly.</p>
              </div>
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold text-sm mb-1">Medication Compliance</p>
                <p className="text-gray-300 text-sm">94% average adherence rate. Excellent consistency with medication schedule.</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-black/20 border border-teal-600/30 rounded-lg p-6">
            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <Zap size={24} className="text-teal-400" />
              Recommendations
            </h2>
            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4 border-l-4 border-teal-600">
                <p className="text-white font-semibold text-sm mb-1">1. Increase Quiet Time</p>
                <p className="text-gray-400 text-sm">Schedule more quiet breaks, especially on high-stress days (Tue, Thu).</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4 border-l-4 border-teal-600">
                <p className="text-white font-semibold text-sm mb-1">2. Noise Management</p>
                <p className="text-gray-400 text-sm">Use noise-canceling headphones in crowded environments to reduce triggers.</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4 border-l-4 border-teal-600">
                <p className="text-white font-semibold text-sm mb-1">3. Leverage Deep Breathing</p>
                <p className="text-gray-400 text-sm">Deep breathing is highly effective. Teach Violet to use it proactively.</p>
              </div>
              <div className="bg-black/50 rounded-lg p-4 border-l-4 border-teal-600">
                <p className="text-white font-semibold text-sm mb-1">4. Maintain Medication Schedule</p>
                <p className="text-gray-400 text-sm">Current adherence is excellent. Continue with current reminders and routine.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-black/20 border border-teal-600/30 rounded-lg p-6">
          <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <Activity size={24} className="text-teal-400" />
            Detailed Metrics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-600/30">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Metric</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">This Week</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Last Week</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Change</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-teal-600/20 hover:bg-black/30 transition-colors">
                  <td className="py-3 px-4 text-white">Average Stress Level</td>
                  <td className="py-3 px-4 text-white font-semibold">60%</td>
                  <td className="py-3 px-4 text-gray-400">65%</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">-5%</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">Improving</span>
                  </td>
                </tr>
                <tr className="border-b border-teal-600/20 hover:bg-black/30 transition-colors">
                  <td className="py-3 px-4 text-white">Overload Events</td>
                  <td className="py-3 px-4 text-white font-semibold">4</td>
                  <td className="py-3 px-4 text-gray-400">5</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">-1</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">Good</span>
                  </td>
                </tr>
                <tr className="border-b border-teal-600/20 hover:bg-black/30 transition-colors">
                  <td className="py-3 px-4 text-white">Strategies Used</td>
                  <td className="py-3 px-4 text-white font-semibold">18</td>
                  <td className="py-3 px-4 text-gray-400">16</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">+2</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">Excellent</span>
                  </td>
                </tr>
                <tr className="border-b border-teal-600/20 hover:bg-black/30 transition-colors">
                  <td className="py-3 px-4 text-white">Medication Adherence</td>
                  <td className="py-3 px-4 text-white font-semibold">94%</td>
                  <td className="py-3 px-4 text-gray-400">92%</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">+2%</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">Excellent</span>
                  </td>
                </tr>
                <tr className="hover:bg-black/30 transition-colors">
                  <td className="py-3 px-4 text-white">Sleep Quality</td>
                  <td className="py-3 px-4 text-white font-semibold">78%</td>
                  <td className="py-3 px-4 text-gray-400">75%</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">+3%</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">Good</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GuardianLayout>
  );
}

