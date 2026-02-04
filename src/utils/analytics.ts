// Analytics utilities for stress trends, correlations, and predictions

export interface StressTrend {
  date: string;
  stress: number;
  heartRate: number;
  hrv: number;
}

export interface AnalyticsTrends {
  time_period: string;
  start_date: string;
  end_date: string;
  total_data_points: number;
  average_stress: number;
  peak_stress: number;
  min_stress: number;
  stress_trend: any[];
  stress_by_location: any[];
  hardest_times: any[];
  trigger_frequencies: any[];
  coping_effectiveness: any[];
  trend_direction: 'improving' | 'stable' | 'worsening';
  trend_percentage_change: number;
}

export interface CorrelationData {
  medication: number;
  weather: number;
  sleep: number;
  socialInteraction: number;
  screenTime: number;
}

export interface PredictiveMetrics {
  overloadRiskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  predictedPeakTime: string;
  recommendedActions: string[];
}

export interface ComparativeInsights {
  weekOverWeek: number;
  monthOverMonth: number;
  trend: 'improving' | 'stable' | 'worsening';
  streakDays: number;
}

export interface AnalyticsTrends {
  time_period: string;
  start_date: string;
  end_date: string;
  total_data_points: number;
  average_stress: number;
  peak_stress: number;
  min_stress: number;
  stress_trend: any[];
  stress_by_location: any[];
  hardest_times: any[];
  trigger_frequencies: any[];
  coping_effectiveness: any[];
  trend_direction: 'improving' | 'stable' | 'worsening';
  trend_percentage_change: number;
}

// Generate mock stress trends
export function generateStressTrends(days: number = 7): StressTrend[] {
  const trends: StressTrend[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    trends.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      stress: Math.floor(Math.random() * 40 + 30),
      heartRate: Math.floor(Math.random() * 30 + 65),
      hrv: Math.floor(Math.random() * 20 + 40),
    });
  }

  return trends;
}

// Calculate correlation scores
export function calculateCorrelations(): CorrelationData {
  return {
    medication: 0.78,
    weather: 0.45,
    sleep: 0.82,
    socialInteraction: 0.61,
    screenTime: 0.53,
  };
}

// Generate predictive metrics
export function generatePredictiveMetrics(): PredictiveMetrics {
  const riskScore = Math.floor(Math.random() * 100);
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  if (riskScore > 70) riskLevel = 'high';
  else if (riskScore > 40) riskLevel = 'medium';

  return {
    overloadRiskScore: riskScore,
    riskLevel,
    predictedPeakTime: '2:00 PM - 3:00 PM',
    recommendedActions: [
      'Schedule quiet time before peak hours',
      'Ensure medication taken on time',
      'Prepare calming strategies',
      'Notify guardians of elevated risk',
    ],
  };
}

// Generate comparative insights
export function generateComparativeInsights(): ComparativeInsights {
  return {
    weekOverWeek: -15,
    monthOverMonth: -22,
    trend: 'improving',
    streakDays: 12,
  };
}

// Export report data
export function generateReportData() {
  return {
    period: 'Last 30 Days',
    averageStress: 52,
    peakStress: 89,
    minStress: 18,
    medicationAdherence: 92,
    overloadEvents: 4,
    topTriggers: ['Loud noises', 'Crowded spaces', 'Unexpected changes'],
    effectiveStrategies: ['Deep breathing', 'Quiet time', 'Music'],
    generatedAt: new Date().toLocaleString(),
  };
}


// Calculate stress trends from sensor data
export function calculateStressTrends(sensorData: any[]): any[] {
  if (sensorData.length === 0) return [];

  const grouped: { [key: string]: any[] } = {};

  sensorData.forEach((data) => {
    const date = new Date(data.timestamp).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(data);
  });

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      average_stress: parseFloat((data.reduce((sum: number, d: any) => sum + d.stress_score, 0) / data.length).toFixed(2)),
      peak_stress: Math.max(...data.map((d: any) => d.stress_score)),
      min_stress: Math.min(...data.map((d: any) => d.stress_score)),
      data_points: data.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Calculate stress by location
export function calculateStressByLocation(sensorData: any[]): any[] {
  if (sensorData.length === 0) return [];

  const grouped: { [key: string]: any[] } = {};

  sensorData.forEach((data) => {
    const location = data.location || 'Unknown';
    if (!grouped[location]) grouped[location] = [];
    grouped[location].push(data);
  });

  return Object.entries(grouped)
    .map(([location, data]) => ({
      location,
      frequency: data.length,
      average_stress: parseFloat((data.reduce((sum: number, d: any) => sum + d.stress_score, 0) / data.length).toFixed(2)),
      peak_stress: Math.max(...data.map((d: any) => d.stress_score)),
      percentage: parseFloat(((data.length / sensorData.length) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.average_stress - a.average_stress);
}

// Calculate stress by time of day
export function calculateStressByTimeOfDay(sensorData: any[]): any[] {
  if (sensorData.length === 0) return [];

  const timeSlots: { [key: string]: any[] } = {
    'Morning (6-12)': [],
    'Afternoon (12-18)': [],
    'Evening (18-24)': [],
    'Night (0-6)': [],
  };

  sensorData.forEach((data) => {
    const hour = new Date(data.timestamp).getHours();
    if (hour >= 6 && hour < 12) timeSlots['Morning (6-12)'].push(data);
    else if (hour >= 12 && hour < 18) timeSlots['Afternoon (12-18)'].push(data);
    else if (hour >= 18 && hour < 24) timeSlots['Evening (18-24)'].push(data);
    else timeSlots['Night (0-6)'].push(data);
  });

  return Object.entries(timeSlots)
    .filter(([_, data]) => data.length > 0)
    .map(([timeSlot, data]) => ({
      time_period: timeSlot,
      average_stress: data.reduce((sum: number, d: any) => sum + d.stress_score, 0) / data.length,
      peak_stress: Math.max(...data.map((d: any) => d.stress_score)),
      frequency: data.length,
    }));
}

// Calculate trigger frequencies
export function calculateTriggerFrequencies(sensorData: any[]): any[] {
  if (sensorData.length === 0) return [];

  const grouped: { [key: string]: any[] } = {};

  sensorData.forEach((data) => {
    const trigger = data.activity || 'Unknown';
    if (!grouped[trigger]) grouped[trigger] = [];
    grouped[trigger].push(data);
  });

  return Object.entries(grouped)
    .map(([trigger, data]) => ({
      trigger_type: trigger,
      frequency: data.length,
      average_stress: data.reduce((sum: number, d: any) => sum + (d.stress_score || 0), 0) / data.length,
      percentage: parseFloat(((data.length / sensorData.length) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

// Calculate hardest times (time periods with highest stress)
export function calculateHardestTimes(sensorData: any[]): any[] {
  if (sensorData.length === 0) return [];

  const timeSlots: { [key: string]: any[] } = {
    'Morning (6-12)': [],
    'Afternoon (12-18)': [],
    'Evening (18-24)': [],
    'Night (0-6)': [],
  };

  sensorData.forEach((data) => {
    const hour = new Date(data.timestamp).getHours();
    if (hour >= 6 && hour < 12) timeSlots['Morning (6-12)'].push(data);
    else if (hour >= 12 && hour < 18) timeSlots['Afternoon (12-18)'].push(data);
    else if (hour >= 18 && hour < 24) timeSlots['Evening (18-24)'].push(data);
    else timeSlots['Night (0-6)'].push(data);
  });

  return Object.entries(timeSlots)
    .filter(([_, data]) => data.length > 0)
    .map(([timeSlot, data]) => ({
      time_period: timeSlot,
      average_stress: data.reduce((sum: number, d: any) => sum + d.stress_score, 0) / data.length,
      peak_stress: Math.max(...data.map((d: any) => d.stress_score)),
      frequency: data.length,
      percentage: parseFloat(((data.length / sensorData.length) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.average_stress - a.average_stress);
}

// Calculate trend direction
export function calculateTrendDirection(trends: any[]): any {
  if (trends.length <= 1) {
    return {
      direction: 'stable',
      percentage_change: 0,
    };
  }

  const firstHalf = trends.slice(0, Math.floor(trends.length / 2));
  const secondHalf = trends.slice(Math.floor(trends.length / 2));

  const firstAvg = firstHalf.reduce((sum, t) => sum + t.average_stress, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, t) => sum + t.average_stress, 0) / secondHalf.length;

  const percentageChange = ((secondAvg - firstAvg) / firstAvg) * 100;
  const roundedChange = parseFloat(percentageChange.toFixed(2));

  let direction: 'improving' | 'stable' | 'worsening' = 'stable';
  if (roundedChange < -5) direction = 'improving';
  else if (roundedChange > 5) direction = 'worsening';

  return {
    direction,
    percentage_change: roundedChange,
  };
}

// Calculate comprehensive analytics trends
export function calculateAnalyticsTrends(sensorData: any[], timePeriod: string = 'week'): any {
  if (sensorData.length === 0) {
    return {
      time_period: timePeriod,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      total_data_points: 0,
      average_stress: 0,
      peak_stress: 0,
      min_stress: 0,
      stress_trend: [],
      stress_by_location: [],
      hardest_times: [],
      trigger_frequencies: [],
      coping_effectiveness: [],
      trend_direction: 'stable',
      trend_percentage_change: 0,
    };
  }

  const stressTrend = calculateStressTrends(sensorData);
  const stressByLocation = calculateStressByLocation(sensorData);
  const hardestTimes = calculateHardestTimes(sensorData);
  const triggerFrequencies = calculateTriggerFrequencies(sensorData);
  const trendDirection = calculateTrendDirection(stressTrend);

  const stressScores = sensorData.map((d) => d.stress_score);
  const averageStress = stressScores.reduce((a, b) => a + b, 0) / stressScores.length;
  const peakStress = Math.max(...stressScores);
  const minStress = Math.min(...stressScores);

  const dates = sensorData.map((d) => new Date(d.timestamp));
  const startDate = new Date(Math.min(...dates.map((d) => d.getTime()))).toISOString().split('T')[0];
  const endDate = new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString().split('T')[0];

  return {
    time_period: timePeriod,
    start_date: startDate,
    end_date: endDate,
    total_data_points: sensorData.length,
    average_stress: parseFloat(averageStress.toFixed(2)),
    peak_stress: peakStress,
    min_stress: minStress,
    stress_trend: stressTrend,
    stress_by_location: stressByLocation,
    hardest_times: hardestTimes,
    trigger_frequencies: triggerFrequencies,
    coping_effectiveness: [],
    trend_direction: trendDirection.direction,
    trend_percentage_change: trendDirection.percentage_change,
  };
}

// Filter sensor data by date range
export function filterSensorDataByDateRange(sensorData: any[], startDate: string, endDate: string): any[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime() + 24 * 60 * 60 * 1000; // Include entire end date

  return sensorData.filter((data) => {
    const dataTime = new Date(data.timestamp).getTime();
    return dataTime >= start && dataTime <= end;
  });
}

// Get sensor data for last N days
export function getSensorDataForLastDays(sensorData: any[], days: number): any[] {
  const now = new Date().getTime();
  const cutoffTime = now - days * 24 * 60 * 60 * 1000;

  return sensorData.filter((data) => {
    const dataTime = new Date(data.timestamp).getTime();
    return dataTime >= cutoffTime;
  });
}
