'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SensorData } from '@/types';

interface StressChartProps {
  data: SensorData[];
  height?: number;
  showLegend?: boolean;
}

/**
 * Real-time stress chart component displaying HR, HRV, and EDA trends
 * Uses Recharts for visualization with dark mode styling
 */
export function StressChart({ data, height = 300, showLegend = true }: StressChartProps) {
  // Transform sensor data for chart display
  const chartData = useMemo(() => {
    return data.map((reading) => ({
      timestamp: new Date(reading.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      heartRate: reading.heart_rate,
      hrv: reading.hrv,
      eda: Math.round(reading.eda * 100) / 100, // Round to 2 decimals
      stressScore: Math.round(reading.stress_score),
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div
        className="w-full bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-neutral-400">No data available yet</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-900 rounded-lg border border-neutral-800 p-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis dataKey="timestamp" stroke="#737373" style={{ fontSize: '12px' }} />
          <YAxis stroke="#737373" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #404040',
              borderRadius: '8px',
              color: '#f5f5f5',
            }}
            labelStyle={{ color: '#f5f5f5' }}
            formatter={(value: number) => {
              if (typeof value === 'number') {
                return value.toFixed(2);
              }
              return value;
            }}
          />
          {showLegend && <Legend wrapperStyle={{ color: '#a3a3a3' }} iconType="line" />}
          <Line
            type="monotone"
            dataKey="heartRate"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
            name="Heart Rate (bpm)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="hrv"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name="HRV (ms)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="eda"
            stroke="#8b5cf6"
            dot={false}
            strokeWidth={2}
            name="EDA (µS)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="stressScore"
            stroke="#10b981"
            dot={false}
            strokeWidth={2}
            name="Stress Score"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
