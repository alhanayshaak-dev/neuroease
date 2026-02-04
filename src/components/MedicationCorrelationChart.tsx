'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CorrelationAnalysis } from '@/utils/medicationCorrelation';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MedicationCorrelationChartProps {
  analysis: CorrelationAnalysis | null;
  loading?: boolean;
}

export function MedicationCorrelationChart({
  analysis,
  loading = false,
}: MedicationCorrelationChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading correlation analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">No correlation data available</p>
        </div>
      </div>
    );
  }

  // Prepare data for medication comparison chart
  const medicationData = analysis.medications.map((med) => ({
    name: med.medication_name,
    adherence: med.adherence_rate,
    stressWhenTaken: med.average_stress_when_taken,
    stressWhenMissed: med.average_stress_when_missed,
  }));

  // Prepare data for stress comparison
  const stressComparisonData = [
    {
      name: 'With Adherence',
      stress: analysis.average_stress_with_adherence,
    },
    {
      name: 'Without Adherence',
      stress: analysis.average_stress_without_adherence,
    },
  ];

  const getImpactIcon = () => {
    if (analysis.stress_impact === 'positive') {
      return <TrendingDown className="text-green-500" size={24} />;
    } else if (analysis.stress_impact === 'negative') {
      return <TrendingUp className="text-red-500" size={24} />;
    } else {
      return <Minus className="text-yellow-500" size={24} />;
    }
  };

  const getImpactColor = () => {
    if (analysis.stress_impact === 'positive') {
      return 'bg-green-900 border-green-700';
    } else if (analysis.stress_impact === 'negative') {
      return 'bg-red-900 border-red-700';
    } else {
      return 'bg-yellow-900 border-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Impact Summary */}
      <div className={`rounded-lg p-6 border ${getImpactColor()}`}>
        <div className="flex items-center gap-4">
          {getImpactIcon()}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Medication Impact</h3>
            <p className="text-gray-300">
              {analysis.stress_impact === 'positive'
                ? `Taking medications on time reduces your stress by an average of ${analysis.stress_reduction_percentage.toFixed(1)}%. Keep up the good adherence!`
                : analysis.stress_impact === 'negative'
                  ? `Your stress levels are higher when taking medications. Consider discussing this with your healthcare provider.`
                  : `Your medication adherence shows a neutral correlation with stress levels. Continue monitoring your patterns.`}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Overall Adherence</p>
          <p className="text-2xl font-bold text-cyan-400">
            {analysis.overall_adherence_rate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">On-Time Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            {analysis.overall_on_time_rate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Stress with Adherence</p>
          <p className="text-2xl font-bold text-green-400">
            {analysis.average_stress_with_adherence.toFixed(1)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Stress without Adherence</p>
          <p className="text-2xl font-bold text-red-400">
            {analysis.average_stress_without_adherence.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Stress Comparison Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Stress Levels: Adherence vs Non-Adherence
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stressComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="stress" fill="#0ea5e9" name="Average Stress" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Medication Analysis */}
      {analysis.medications.length > 0 && (
        <>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Medication-Specific Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={medicationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="adherence" fill="#0ea5e9" name="Adherence Rate %" />
                <Bar dataKey="stressWhenTaken" fill="#10b981" name="Stress When Taken" />
                <Bar dataKey="stressWhenMissed" fill="#ef4444" name="Stress When Missed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Medication Details Table */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Medication Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4 text-gray-400">Medication</th>
                    <th className="text-left py-2 px-4 text-gray-400">Adherence</th>
                    <th className="text-left py-2 px-4 text-gray-400">On-Time</th>
                    <th className="text-left py-2 px-4 text-gray-400">Stress (Taken)</th>
                    <th className="text-left py-2 px-4 text-gray-400">Stress (Missed)</th>
                    <th className="text-left py-2 px-4 text-gray-400">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.medications.map((med) => (
                    <tr
                      key={med.medication_name}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-2 px-4 text-white">{med.medication_name}</td>
                      <td className="py-2 px-4 text-gray-300">{med.adherence_rate.toFixed(1)}%</td>
                      <td className="py-2 px-4 text-gray-300">{med.on_time_rate.toFixed(1)}%</td>
                      <td className="py-2 px-4 text-gray-300">
                        {med.average_stress_when_taken.toFixed(1)}
                      </td>
                      <td className="py-2 px-4 text-gray-300">
                        {med.average_stress_when_missed.toFixed(1)}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            med.stress_reduction > 0
                              ? 'bg-green-900 text-green-200'
                              : med.stress_reduction < 0
                                ? 'bg-red-900 text-red-200'
                                : 'bg-yellow-900 text-yellow-200'
                          }`}
                        >
                          {med.stress_reduction > 0 ? '+' : ''}
                          {med.stress_reduction.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Correlation Coefficient */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Statistical Correlation</h3>
        <p className="text-gray-300 mb-4">
          Pearson Correlation Coefficient:{' '}
          <span className="font-bold">{analysis.correlation_coefficient.toFixed(3)}</span>
        </p>
        <p className="text-gray-400 text-sm">
          {analysis.correlation_coefficient < -0.5
            ? 'Strong negative correlation: Higher medication adherence is associated with lower stress levels.'
            : analysis.correlation_coefficient < 0
              ? 'Weak negative correlation: Some relationship between adherence and lower stress.'
              : analysis.correlation_coefficient > 0.5
                ? 'Strong positive correlation: Higher medication adherence is associated with higher stress levels.'
                : analysis.correlation_coefficient > 0
                  ? 'Weak positive correlation: Some relationship between adherence and higher stress.'
                  : 'No significant correlation between medication adherence and stress levels.'}
        </p>
      </div>
    </div>
  );
}
