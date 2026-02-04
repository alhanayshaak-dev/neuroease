// Advanced Analytics with Forecasting and Comparisons
export interface AnalyticsData {
  date: string;
  value: number;
  metric: string;
}

export interface Forecast {
  date: string;
  predicted: number;
  confidence: number;
  range: { min: number; max: number };
}

export interface Comparison {
  period1: string;
  period2: string;
  change: number;
  percentChange: number;
  trend: 'up' | 'down' | 'stable';
}

export function predictTrend(data: AnalyticsData[], daysAhead: number = 7): Forecast[] {
  const forecasts: Forecast[] = [];
  const values = data.map(d => d.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const trend = (values[values.length - 1] - values[0]) / values.length;

  for (let i = 1; i <= daysAhead; i++) {
    const predicted = avg + trend * i;
    const variance = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length);

    forecasts.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted: Math.round(predicted),
      confidence: 0.85 - i * 0.05,
      range: {
        min: Math.round(predicted - variance),
        max: Math.round(predicted + variance),
      },
    });
  }

  return forecasts;
}

export function compareWeekOverWeek(currentWeek: AnalyticsData[], previousWeek: AnalyticsData[]): Comparison {
  const currentAvg = currentWeek.reduce((sum, d) => sum + d.value, 0) / currentWeek.length;
  const previousAvg = previousWeek.reduce((sum, d) => sum + d.value, 0) / previousWeek.length;
  const change = currentAvg - previousAvg;
  const percentChange = (change / previousAvg) * 100;

  return {
    period1: 'Current Week',
    period2: 'Previous Week',
    change: Math.round(change),
    percentChange: Math.round(percentChange * 10) / 10,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
  };
}

export function compareMonthOverMonth(currentMonth: AnalyticsData[], previousMonth: AnalyticsData[]): Comparison {
  const currentAvg = currentMonth.reduce((sum, d) => sum + d.value, 0) / currentMonth.length;
  const previousAvg = previousMonth.reduce((sum, d) => sum + d.value, 0) / previousMonth.length;
  const change = currentAvg - previousAvg;
  const percentChange = (change / previousAvg) * 100;

  return {
    period1: 'Current Month',
    period2: 'Previous Month',
    change: Math.round(change),
    percentChange: Math.round(percentChange * 10) / 10,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
  };
}

export function getCustomDateRangeData(
  allData: AnalyticsData[],
  startDate: string,
  endDate: string
): AnalyticsData[] {
  return allData.filter(d => d.date >= startDate && d.date <= endDate);
}

export function calculateMovingAverage(data: AnalyticsData[], windowSize: number = 7): AnalyticsData[] {
  const result: AnalyticsData[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    const avg = window.reduce((sum, d) => sum + d.value, 0) / window.length;

    result.push({
      date: data[i].date,
      value: Math.round(avg),
      metric: data[i].metric,
    });
  }

  return result;
}

export function identifyAnomalies(data: AnalyticsData[], threshold: number = 2): AnalyticsData[] {
  const values = data.map(d => d.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length);

  return data.filter(d => Math.abs(d.value - avg) > threshold * stdDev);
}

export function generateAnalyticsReport(data: AnalyticsData[]): string {
  const values = data.map(d => d.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const trend = values[values.length - 1] > avg ? 'increasing' : 'decreasing';

  return `
Analytics Report
================
Average: ${Math.round(avg)}
Minimum: ${min}
Maximum: ${max}
Trend: ${trend}
Data Points: ${data.length}
  `.trim();
}
