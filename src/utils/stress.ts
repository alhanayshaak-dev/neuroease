/**
 * Stress calculation utilities
 * Converts sensor data (HR, HRV, EDA) into a stress score (0-100)
 */

export interface SensorMetrics {
  heart_rate: number;
  hrv: number;
  eda: number;
}

export interface BaselineMetrics {
  baseline_hr: number;
  baseline_hrv: number;
  baseline_eda: number;
}

/**
 * Calculate stress score from sensor metrics
 * @param metrics Current sensor readings
 * @param baseline Patient's baseline metrics
 * @returns Stress score 0-100
 */
export function calculateStressScore(
  metrics: SensorMetrics,
  baseline: BaselineMetrics
): number {
  // Normalize each metric relative to baseline
  const hrDeviation = Math.abs(metrics.heart_rate - baseline.baseline_hr) / baseline.baseline_hr;
  const hrvDeviation = Math.abs(metrics.hrv - baseline.baseline_hrv) / baseline.baseline_hrv;
  const edaDeviation = Math.abs(metrics.eda - baseline.baseline_eda) / baseline.baseline_eda;

  // Weight the deviations (HRV is most important for stress detection)
  const weightedScore =
    hrDeviation * 0.3 + hrvDeviation * 0.5 + edaDeviation * 0.2;

  // Convert to 0-100 scale with sigmoid function for smooth curve
  const stressScore = (Math.tanh(weightedScore * 2) + 1) * 50;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, stressScore));
}

/**
 * Determine stress status based on score and baseline
 * @param stressScore Current stress score (0-100)
 * @param baseline Patient's baseline metrics
 * @returns Status: 'calm', 'rising', or 'overload'
 */
export function getStressStatus(
  stressScore: number,
  baselineScore: number
): 'calm' | 'rising' | 'overload' {
  const percentageIncrease = ((stressScore - baselineScore) / baselineScore) * 100;

  if (percentageIncrease >= 60) {
    return 'overload';
  } else if (percentageIncrease >= 30) {
    return 'rising';
  } else {
    return 'calm';
  }
}

/**
 * Get color for stress status
 * @param status Stress status
 * @returns Tailwind color class
 */
export function getStressStatusColor(status: 'calm' | 'rising' | 'overload'): string {
  switch (status) {
    case 'calm':
      return 'text-calm bg-calm/10';
    case 'rising':
      return 'text-rising bg-rising/10';
    case 'overload':
      return 'text-overload bg-overload/10';
  }
}

/**
 * Get label for stress status
 * @param status Stress status
 * @returns Human-readable label
 */
export function getStressStatusLabel(status: 'calm' | 'rising' | 'overload'): string {
  switch (status) {
    case 'calm':
      return 'Calm';
    case 'rising':
      return 'Rising';
    case 'overload':
      return 'Overload Predicted';
  }
}
