'use client';

// Component for displaying aggregated patient insights
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingDown, TrendingUp, AlertCircle, Users } from 'lucide-react';
import type { AggregatedPatientInsights } from '@/utils/therapist';

interface AggregatedInsightsProps {
  insights: AggregatedPatientInsights;
}

export function AggregatedInsights({ insights }: AggregatedInsightsProps) {
  // Data for patient status distribution
  const statusData = [
    {
      name: 'Improving',
      value: insights.patients_improving,
      fill: '#10b981',
    },
    {
      name: 'Stable',
      value: insights.total_patients - insights.patients_improving - insights.patients_worsening,
      fill: '#6b7280',
    },
    {
      name: 'Worsening',
      value: insights.patients_worsening,
      fill: '#ef4444',
    },
  ];

  // Data for stress distribution
  const stressData = [
    {
      name: 'In Overload',
      value: insights.patients_in_overload,
      fill: '#dc2626',
    },
    {
      name: 'Normal',
      value: insights.total_patients - insights.patients_in_overload,
      fill: '#3b82f6',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Total Patients</p>
            <Users className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">{insights.total_patients}</p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Avg Stress</p>
            <AlertCircle className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">
            {Math.round(insights.average_stress_across_patients)}%
          </p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Improving</p>
            <TrendingDown className="w-4 h-4 text-calm" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">{insights.patients_improving}</p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Worsening</p>
            <TrendingUp className="w-4 h-4 text-rising" />
          </div>
          <p className="text-2xl font-bold text-neutral-100">{insights.patients_worsening}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Status Distribution */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">
            Patient Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stress Level Distribution */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Stress Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {stressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <p className="text-sm text-neutral-400 mb-2">Most Common Trigger</p>
          <p className="text-lg font-semibold text-neutral-100">
            {insights.most_common_trigger_across_patients}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <p className="text-sm text-neutral-400 mb-2">Most Effective Strategy</p>
          <p className="text-lg font-semibold text-neutral-100">
            {insights.most_effective_strategy_across_patients}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <p className="text-sm text-neutral-400 mb-2">Total Data Points</p>
          <p className="text-lg font-semibold text-neutral-100">{insights.total_data_points}</p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <p className="text-sm text-neutral-400 mb-2">In Overload</p>
          <p className="text-lg font-semibold text-neutral-100">
            {insights.patients_in_overload} / {insights.total_patients}
          </p>
        </div>
      </div>
    </div>
  );
}
