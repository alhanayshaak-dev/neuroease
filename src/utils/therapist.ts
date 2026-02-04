/**
 * Therapist collaboration and patient management utilities
 * Provides functions for therapist dashboard, patient insights, and goal management
 */

import { Database } from '@/types/database';

export type PatientRow = Database['public']['Tables']['patients']['Row'];
export type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];
export type CopingStrategyRow = Database['public']['Tables']['coping_strategies']['Row'];
export type GuardianRow = Database['public']['Tables']['guardians']['Row'];

export interface PatientInsight {
  patient_id: string;
  patient_name: string;
  current_stress_level: 'calm' | 'rising' | 'overload';
  average_stress_score: number;
  peak_stress_score: number;
  trend_direction: 'improving' | 'stable' | 'worsening';
  trend_percentage_change: number;
  most_common_trigger: string;
  most_effective_strategy: string;
  last_overload_prediction: string | null;
  data_points_this_week: number;
}

export interface TherapistGoal {
  id: string;
  patient_id: string;
  goal_name: string;
  description: string;
  target_metric: string;
  target_value: number;
  current_value: number;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  target_date: string;
}

export interface StrategySuggestion {
  strategy_id: string;
  strategy_name: string;
  category: string;
  reason: string;
  effectiveness_score: number;
  recommended_for_patient: string;
}

export interface AggregatedPatientInsights {
  total_patients: number;
  average_stress_across_patients: number;
  patients_in_overload: number;
  patients_improving: number;
  patients_worsening: number;
  most_common_trigger_across_patients: string;
  most_effective_strategy_across_patients: string;
  total_data_points: number;
}

/**
 * Calculate patient insights from sensor data
 */
export function calculatePatientInsights(
  patientId: string,
  patientName: string,
  sensorData: SensorDataRow[],
  strategies: CopingStrategyRow[]
): PatientInsight {
  if (sensorData.length === 0) {
    return {
      patient_id: patientId,
      patient_name: patientName,
      current_stress_level: 'calm',
      average_stress_score: 0,
      peak_stress_score: 0,
      trend_direction: 'stable',
      trend_percentage_change: 0,
      most_common_trigger: 'Unknown',
      most_effective_strategy: 'None',
      last_overload_prediction: null,
      data_points_this_week: 0,
    };
  }

  // Calculate stress statistics
  const stressScores = sensorData.map((d) => d.stress_score);
  const averageStress = stressScores.reduce((a, b) => a + b, 0) / stressScores.length;
  const peakStress = Math.max(...stressScores);
  const currentStress = stressScores[stressScores.length - 1];

  // Determine current stress level
  const currentStressLevel: 'calm' | 'rising' | 'overload' =
    currentStress < 40 ? 'calm' : currentStress < 70 ? 'rising' : 'overload';

  // Calculate trend
  const firstHalf = sensorData.slice(0, Math.floor(sensorData.length / 2));
  const secondHalf = sensorData.slice(Math.floor(sensorData.length / 2));

  const firstHalfAverage =
    firstHalf.reduce((sum, d) => sum + d.stress_score, 0) / firstHalf.length;
  const secondHalfAverage =
    secondHalf.reduce((sum, d) => sum + d.stress_score, 0) / secondHalf.length;

  const percentageChange = ((secondHalfAverage - firstHalfAverage) / firstHalfAverage) * 100;
  let trendDirection: 'improving' | 'stable' | 'worsening' = 'stable';
  if (percentageChange < -5) {
    trendDirection = 'improving';
  } else if (percentageChange > 5) {
    trendDirection = 'worsening';
  }

  // Find most common trigger
  const triggerMap = new Map<string, number>();
  for (const data of sensorData) {
    const activity = data.activity || 'Unknown';
    triggerMap.set(activity, (triggerMap.get(activity) || 0) + 1);
  }
  const mostCommonTrigger = Array.from(triggerMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  // Find most effective strategy
  const mostEffectiveStrategy = strategies.length > 0
    ? strategies.reduce((best, current) =>
        current.success_rate > best.success_rate ? current : best
      ).name
    : 'None';

  // Find last overload prediction
  const lastOverloadPrediction = sensorData
    .filter((d) => d.overload_predicted)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    ?.timestamp || null;

  return {
    patient_id: patientId,
    patient_name: patientName,
    current_stress_level: currentStressLevel,
    average_stress_score: Math.round(averageStress * 100) / 100,
    peak_stress_score: peakStress,
    trend_direction: trendDirection,
    trend_percentage_change: Math.round(percentageChange * 100) / 100,
    most_common_trigger: mostCommonTrigger,
    most_effective_strategy: mostEffectiveStrategy,
    last_overload_prediction: lastOverloadPrediction,
    data_points_this_week: sensorData.length,
  };
}

/**
 * Calculate aggregated insights across multiple patients
 */
export function calculateAggregatedInsights(
  patientInsights: PatientInsight[]
): AggregatedPatientInsights {
  if (patientInsights.length === 0) {
    return {
      total_patients: 0,
      average_stress_across_patients: 0,
      patients_in_overload: 0,
      patients_improving: 0,
      patients_worsening: 0,
      most_common_trigger_across_patients: 'Unknown',
      most_effective_strategy_across_patients: 'None',
      total_data_points: 0,
    };
  }

  const averageStress =
    patientInsights.reduce((sum, p) => sum + p.average_stress_score, 0) /
    patientInsights.length;

  const patientsInOverload = patientInsights.filter(
    (p) => p.current_stress_level === 'overload'
  ).length;

  const patientsImproving = patientInsights.filter(
    (p) => p.trend_direction === 'improving'
  ).length;

  const patientsWorsening = patientInsights.filter(
    (p) => p.trend_direction === 'worsening'
  ).length;

  // Find most common trigger across all patients
  const triggerMap = new Map<string, number>();
  for (const insight of patientInsights) {
    triggerMap.set(
      insight.most_common_trigger,
      (triggerMap.get(insight.most_common_trigger) || 0) + 1
    );
  }
  const mostCommonTrigger = Array.from(triggerMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

  // Find most effective strategy across all patients
  const strategyMap = new Map<string, number>();
  for (const insight of patientInsights) {
    strategyMap.set(
      insight.most_effective_strategy,
      (strategyMap.get(insight.most_effective_strategy) || 0) + 1
    );
  }
  const mostEffectiveStrategy = Array.from(strategyMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  const totalDataPoints = patientInsights.reduce((sum, p) => sum + p.data_points_this_week, 0);

  return {
    total_patients: patientInsights.length,
    average_stress_across_patients: Math.round(averageStress * 100) / 100,
    patients_in_overload: patientsInOverload,
    patients_improving: patientsImproving,
    patients_worsening: patientsWorsening,
    most_common_trigger_across_patients: mostCommonTrigger,
    most_effective_strategy_across_patients: mostEffectiveStrategy,
    total_data_points: totalDataPoints,
  };
}

/**
 * Suggest strategies for a patient based on their stress patterns
 */
export function suggestStrategiesForPatient(
  patientInsight: PatientInsight,
  availableStrategies: CopingStrategyRow[]
): StrategySuggestion[] {
  const suggestions: StrategySuggestion[] = [];

  // Sort strategies by success rate
  const sortedStrategies = [...availableStrategies].sort(
    (a, b) => b.success_rate - a.success_rate
  );

  // Suggest top 3 strategies
  for (let i = 0; i < Math.min(3, sortedStrategies.length); i++) {
    const strategy = sortedStrategies[i];
    let reason = '';

    if (i === 0) {
      reason = 'Most effective strategy based on your history';
    } else if (i === 1) {
      reason = 'Second most effective strategy';
    } else {
      reason = 'Recommended strategy';
    }

    suggestions.push({
      strategy_id: strategy.id,
      strategy_name: strategy.name,
      category: strategy.category,
      reason,
      effectiveness_score: strategy.success_rate,
      recommended_for_patient: patientInsight.patient_id,
    });
  }

  return suggestions;
}

/**
 * Create a goal for a patient
 */
export function createGoal(
  patientId: string,
  goalName: string,
  description: string,
  targetMetric: string,
  targetValue: number,
  targetDate: string
): TherapistGoal {
  return {
    id: `goal-${Date.now()}`,
    patient_id: patientId,
    goal_name: goalName,
    description,
    target_metric: targetMetric,
    target_value: targetValue,
    current_value: 0,
    progress_percentage: 0,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    target_date: targetDate,
  };
}

/**
 * Update goal progress
 */
export function updateGoalProgress(
  goal: TherapistGoal,
  currentValue: number
): TherapistGoal {
  const progressPercentage = Math.min(100, (currentValue / goal.target_value) * 100);
  const status = progressPercentage >= 100 ? 'completed' : goal.status;

  return {
    ...goal,
    current_value: currentValue,
    progress_percentage: Math.round(progressPercentage * 100) / 100,
    status,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Get patients needing attention (high stress or worsening trends)
 */
export function getPatientsNeedingAttention(
  patientInsights: PatientInsight[]
): PatientInsight[] {
  return patientInsights.filter(
    (p) =>
      p.current_stress_level === 'overload' ||
      p.trend_direction === 'worsening' ||
      p.average_stress_score > 70
  );
}
