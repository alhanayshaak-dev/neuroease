'use client';

// Analytics dashboard component for displaying metrics
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, FileText, Sheet } from 'lucide-react';
import { AnalyticsTrends } from '@/utils/analytics';

interface AnalyticsDashboardProps {
  trends: AnalyticsTrends | null;
  loading?: boolean;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
}

const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsDashboard({
  trends,
  loading = false,
  onExportPDF,
  onExportCSV,
}: AnalyticsDashboardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!trends || trends.total_data_points === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">No data available for the selected period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with export buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Trends</h2>
          <p className="text-gray-400 text-sm">
            {trends.start_date} to {trends.end_date}
          </p>
        </div>
        <div className="flex gap-2">
          {onExportPDF && (
            <button type="button"
              onClick={onExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <FileText size={18} />
              PDF
            </button>
          )}
          {onExportCSV && (
            <button type="button"
              onClick={onExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Sheet size={18} />
              CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Average Stress</p>
          <p className="text-2xl font-bold text-cyan-400">{trends.average_stress.toFixed(1)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Peak Stress</p>
          <p className="text-2xl font-bold text-orange-400">{trends.peak_stress}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Min Stress</p>
          <p className="text-2xl font-bold text-green-400">{trends.min_stress}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Data Points</p>
          <p className="text-2xl font-bold text-blue-400">{trends.total_data_points}</p>
        </div>
      </div>

      {/* Trend Direction */}
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-sm mb-2">Trend Direction</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  trends.trend_direction === 'improving'
                    ? 'bg-green-500'
                    : trends.trend_direction === 'worsening'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                }`}
              ></div>
              <span className="text-white font-semibold capitalize">{trends.trend_direction}</span>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-lg font-bold ${
                trends.trend_percentage_change < 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trends.trend_percentage_change > 0 ? '+' : ''}
              {trends.trend_percentage_change.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Stress Trend Chart */}
      {trends.stress_trend.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Stress Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends.stress_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="average_stress"
                stroke="#0ea5e9"
                name="Average Stress"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="peak_stress"
                stroke="#ef4444"
                name="Peak Stress"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="min_stress"
                stroke="#10b981"
                name="Min Stress"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stress by Location Chart */}
      {trends.stress_by_location.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Stress by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends.stress_by_location}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="location" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="average_stress" fill="#0ea5e9" name="Average Stress" />
              <Bar dataKey="peak_stress" fill="#ef4444" name="Peak Stress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hardest Times Chart */}
      {trends.hardest_times.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Stress by Time of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends.hardest_times}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time_period"
                stroke="#9ca3af"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="average_stress" fill="#0ea5e9" name="Average Stress" />
              <Bar dataKey="peak_stress" fill="#ef4444" name="Peak Stress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trigger Frequencies Pie Chart */}
      {trends.trigger_frequencies.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Stress Triggers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trends.trigger_frequencies}
                  dataKey="frequency"
                  nameKey="trigger_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {trends.trigger_frequencies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-2">
              {trends.trigger_frequencies.map((trigger, index) => (
                <div key={trigger.trigger_type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-300 text-sm">{trigger.trigger_type}</span>
                  <span className="text-gray-400 text-sm ml-auto">
                    {trigger.frequency} ({trigger.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trigger Details Table */}
      {trends.trigger_frequencies.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Trigger Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-4 text-gray-400">Trigger</th>
                  <th className="text-left py-2 px-4 text-gray-400">Frequency</th>
                  <th className="text-left py-2 px-4 text-gray-400">Avg Stress</th>
                  <th className="text-left py-2 px-4 text-gray-400">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {trends.trigger_frequencies.map((trigger) => (
                  <tr
                    key={trigger.trigger_type}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="py-2 px-4 text-white">{trigger.trigger_type}</td>
                    <td className="py-2 px-4 text-gray-300">{trigger.frequency}</td>
                    <td className="py-2 px-4 text-gray-300">{trigger.average_stress.toFixed(1)}</td>
                    <td className="py-2 px-4 text-gray-300">{trigger.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

