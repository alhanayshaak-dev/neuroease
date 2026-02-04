'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import type { SensorDataRow } from '@/types/database';
import {
  calculateStressByLocation,
  calculateHardestTimes,
  calculateTriggerFrequencies,
} from '@/utils/analytics';

interface PatientHealthOverviewProps {
  sensorData: SensorDataRow[];
  timeRange?: 'week' | 'month';
}

export function PatientHealthOverview({
  sensorData,
  timeRange = 'week',
}: PatientHealthOverviewProps) {
  // Calculate analytics
  const stressByLocation = calculateStressByLocation(sensorData);
  const hardestTimes = calculateHardestTimes(sensorData);
  const triggerFrequencies = calculateTriggerFrequencies(sensorData);

  // Get this week's triggers
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekData = sensorData.filter((d) => new Date(d.timestamp) >= oneWeekAgo);

  const triggerCounts = new Map<string, number>();
  for (const data of thisWeekData) {
    const trigger = data.activity || 'Unknown';
    triggerCounts.set(trigger, (triggerCounts.get(trigger) || 0) + 1);
  }

  const topTriggers = Array.from(triggerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([trigger, count]) => ({
      trigger,
      count,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-100 mb-2">Health Overview</h2>
        <p className="text-neutral-400">Last {timeRange === 'week' ? '7 days' : '30 days'}</p>
      </div>

      {/* Triggers This Week */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-neutral-100">Triggers This Week</h3>
        </div>

        {topTriggers.length === 0 ? (
          <p className="text-neutral-400">No trigger data available</p>
        ) : (
          <div className="space-y-3">
            {topTriggers.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-neutral-300">{item.trigger}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-400 rounded-full"
                      style={{
                        width: `${(item.count / Math.max(...topTriggers.map((t) => t.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-neutral-500 w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stress by Location */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-neutral-100">Stress by Location</h3>
        </div>

        {stressByLocation.length === 0 ? (
          <p className="text-neutral-400">No location data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stressByLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="location" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="average_stress" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Location Details */}
        <div className="mt-4 space-y-2">
          {stressByLocation.map((location, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">{location.location}</span>
              <div className="flex items-center gap-3">
                <span className="text-neutral-300">
                  Avg: {Math.round(location.average_stress)}%
                </span>
                <span className="text-neutral-500">({location.frequency} times)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardest Times */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-neutral-100">Hardest Times</h3>
        </div>

        {hardestTimes.length === 0 ? (
          <p className="text-neutral-400">No time-based data available</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hardestTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time_period" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average_stress"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Time Period Details */}
            <div className="mt-4 space-y-2">
              {hardestTimes.map((time, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">{time.time_period}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-300">
                      Avg: {Math.round(time.average_stress)}%
                    </span>
                    <span className="text-neutral-500">Peak: {time.peak_stress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <p className="text-sm text-neutral-400 mb-2">Total Data Points</p>
          <p className="text-2xl font-bold text-neutral-100">{sensorData.length}</p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <p className="text-sm text-neutral-400 mb-2">Unique Locations</p>
          <p className="text-2xl font-bold text-neutral-100">{stressByLocation.length}</p>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <p className="text-sm text-neutral-400 mb-2">Unique Triggers</p>
          <p className="text-2xl font-bold text-neutral-100">{triggerFrequencies.length}</p>
        </div>
      </div>
    </div>
  );
}
