'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AnalyticsTrends } from '@/utils/analytics';
import { Calendar } from 'lucide-react';

type TimePeriod = 'day' | 'week' | 'month';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useCustomRange, setUseCustomRange] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTrends = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('timePeriod', timePeriod);

        if (useCustomRange && startDate && endDate) {
          params.append('startDate', startDate);
          params.append('endDate', endDate);
        }

        const response = await fetch(`/api/analytics/trends?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${user.id}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setTrends(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [user, timePeriod, useCustomRange, startDate, endDate]);

  const handleExportPDF = () => {
    if (!trends) return;

    // Create a simple PDF export
    const content = generatePDFContent(trends);
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `analytics-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportCSV = () => {
    if (!trends) return;

    const csv = generateCSVContent(trends);
    const element = document.createElement('a');
    const file = new Blob([csv], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics & Trends</h1>
          <p className="text-gray-400">View your stress patterns, triggers, and trends over time</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Time Period Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
              <div className="flex gap-2">
                {(['day', 'week', 'month'] as TimePeriod[]).map((period) => (
                  <button type="button"
                    key={period}
                    onClick={() => {
                      setTimePeriod(period);
                      setUseCustomRange(false);
                    }}
                    className={`px-4 py-2 rounded-lg transition ${
                      !useCustomRange && timePeriod === period
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range Toggle */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomRange}
                  onChange={(e) => setUseCustomRange(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-300">Custom Date Range</span>
              </label>
            </div>
          </div>

          {/* Custom Date Range Inputs */}
          {useCustomRange && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard
          trends={trends}
          loading={loading}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
        />
      </div>
    </div>
  );
}

function generatePDFContent(trends: AnalyticsTrends): string {
  let content = 'NEUROFLOW ANALYTICS REPORT\n';
  content += '='.repeat(50) + '\n\n';

  content += `Report Period: ${trends.start_date} to ${trends.end_date}\n`;
  content += `Time Period: ${trends.time_period}\n`;
  content += `Total Data Points: ${trends.total_data_points}\n\n`;

  content += 'SUMMARY STATISTICS\n';
  content += '-'.repeat(50) + '\n';
  content += `Average Stress: ${trends.average_stress.toFixed(2)}\n`;
  content += `Peak Stress: ${trends.peak_stress}\n`;
  content += `Minimum Stress: ${trends.min_stress}\n`;
  content += `Trend Direction: ${trends.trend_direction}\n`;
  content += `Trend Change: ${trends.trend_percentage_change.toFixed(2)}%\n\n`;

  if (trends.stress_by_location.length > 0) {
    content += 'STRESS BY LOCATION\n';
    content += '-'.repeat(50) + '\n';
    trends.stress_by_location.forEach((location) => {
      content += `${location.location}: ${location.average_stress.toFixed(2)} (${location.percentage.toFixed(2)}%)\n`;
    });
    content += '\n';
  }

  if (trends.hardest_times.length > 0) {
    content += 'HARDEST TIMES\n';
    content += '-'.repeat(50) + '\n';
    trends.hardest_times.forEach((time) => {
      content += `${time.time_period}: ${time.average_stress.toFixed(2)} (${time.percentage.toFixed(2)}%)\n`;
    });
    content += '\n';
  }

  if (trends.trigger_frequencies.length > 0) {
    content += 'STRESS TRIGGERS\n';
    content += '-'.repeat(50) + '\n';
    trends.trigger_frequencies.forEach((trigger) => {
      content += `${trigger.trigger_type}: ${trigger.frequency} occurrences (${trigger.percentage.toFixed(2)}%) - Avg Stress: ${trigger.average_stress.toFixed(2)}\n`;
    });
  }

  return content;
}

function generateCSVContent(trends: AnalyticsTrends): string {
  let csv = 'Analytics Report\n';
  csv += `Report Period,${trends.start_date},${trends.end_date}\n`;
  csv += `Time Period,${trends.time_period}\n`;
  csv += `Total Data Points,${trends.total_data_points}\n\n`;

  csv += 'Summary Statistics\n';
  csv += 'Metric,Value\n';
  csv += `Average Stress,${trends.average_stress.toFixed(2)}\n`;
  csv += `Peak Stress,${trends.peak_stress}\n`;
  csv += `Minimum Stress,${trends.min_stress}\n`;
  csv += `Trend Direction,${trends.trend_direction}\n`;
  csv += `Trend Change,${trends.trend_percentage_change.toFixed(2)}%\n\n`;

  if (trends.stress_by_location.length > 0) {
    csv += 'Stress by Location\n';
    csv += 'Location,Average Stress,Peak Stress,Frequency,Percentage\n';
    trends.stress_by_location.forEach((location) => {
      csv += `${location.location},${location.average_stress.toFixed(2)},${location.peak_stress},${location.frequency},${location.percentage.toFixed(2)}%\n`;
    });
    csv += '\n';
  }

  if (trends.hardest_times.length > 0) {
    csv += 'Hardest Times\n';
    csv += 'Time Period,Average Stress,Peak Stress,Frequency,Percentage\n';
    trends.hardest_times.forEach((time) => {
      csv += `${time.time_period},${time.average_stress.toFixed(2)},${time.peak_stress},${time.frequency},${time.percentage.toFixed(2)}%\n`;
    });
    csv += '\n';
  }

  if (trends.trigger_frequencies.length > 0) {
    csv += 'Stress Triggers\n';
    csv += 'Trigger,Frequency,Average Stress,Percentage\n';
    trends.trigger_frequencies.forEach((trigger) => {
      csv += `${trigger.trigger_type},${trigger.frequency},${trigger.average_stress.toFixed(2)},${trigger.percentage.toFixed(2)}%\n`;
    });
  }

  return csv;
}

