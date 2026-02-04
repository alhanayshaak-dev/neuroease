'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SensorDataPoint {
  timestamp: string;
  heart_rate: number;
  hrv: number;
  eda: number;
}

interface SensorDataChartsProps {
  data: SensorDataPoint[];
  loading?: boolean;
}

export function SensorDataCharts({ data, loading }: SensorDataChartsProps) {
  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <p className="text-neutral-400">Loading sensor data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <p className="text-neutral-400">No sensor data available</p>
      </div>
    );
  }

  // Format data for charts
  const chartData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  return (
    <div className="space-y-6">
      {/* Heart Rate Chart */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-100 mb-4">Heart Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="time" stroke="#737373" style={{ fontSize: '12px' }} />
            <YAxis stroke="#737373" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Line
              type="monotone"
              dataKey="heart_rate"
              stroke="#ef4444"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* HRV Chart */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-100 mb-4">
          Heart Rate Variability (HRV)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="time" stroke="#737373" style={{ fontSize: '12px' }} />
            <YAxis stroke="#737373" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Line
              type="monotone"
              dataKey="hrv"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* EDA Chart */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-100 mb-4">
          Electrodermal Activity (EDA)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="time" stroke="#737373" style={{ fontSize: '12px' }} />
            <YAxis stroke="#737373" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Line
              type="monotone"
              dataKey="eda"
              stroke="#10b981"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Combined Chart */}
      <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-100 mb-4">All Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="time" stroke="#737373" style={{ fontSize: '12px' }} />
            <YAxis stroke="#737373" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="heart_rate"
              stroke="#ef4444"
              dot={false}
              isAnimationActive={false}
              name="Heart Rate"
            />
            <Line
              type="monotone"
              dataKey="hrv"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
              name="HRV"
            />
            <Line
              type="monotone"
              dataKey="eda"
              stroke="#10b981"
              dot={false}
              isAnimationActive={false}
              name="EDA"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
