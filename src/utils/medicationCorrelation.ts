/**
 * Medication-stress correlation analysis utilities
 * Analyzes the relationship between medication adherence and stress levels
 */

import { Database } from '@/types/database';

export type SensorDataRow = Database['public']['Tables']['sensor_data']['Row'];

export interface MedicationLog {
  id: string;
  medication_id: string;
  medication_name: string;
  taken_at: string;
  scheduled_time: string;
  on_time: boolean;
  timestamp: number;
}

export interface MedicationAdherence {
  medication_name: string;
  total_doses: number;
  doses_taken: number;
  on_time_doses: number;
  adherence_rate: number;
  on_time_rate: number;
  average_stress_when_taken: number;
  average_stress_when_missed: number;
  stress_reduction: number;
}

export interface CorrelationAnalysis {
  overall_adherence_rate: number;
  overall_on_time_rate: number;
  average_stress_with_adherence: number;
  average_stress_without_adherence: number;
  correlation_coefficient: number;
  medications: MedicationAdherence[];
  stress_impact: 'positive' | 'neutral' | 'negative';
  stress_reduction_percentage: number;
}

/**
 * Calculate medication adherence rate
 */
export function calculateMedicationAdherence(
  medicationLogs: MedicationLog[],
  totalScheduledDoses: number
): number {
  if (totalScheduledDoses === 0) return 0;
  const dosesTaken = medicationLogs.filter((log) => log.on_time).length;
  return (dosesTaken / totalScheduledDoses) * 100;
}

/**
 * Calculate on-time medication rate
 */
export function calculateOnTimeRate(medicationLogs: MedicationLog[]): number {
  if (medicationLogs.length === 0) return 0;
  const onTimeDoses = medicationLogs.filter((log) => log.on_time).length;
  return (onTimeDoses / medicationLogs.length) * 100;
}

/**
 * Calculate average stress for a set of timestamps
 */
export function calculateAverageStressForTimestamps(
  sensorData: SensorDataRow[],
  timestamps: number[]
): number {
  if (timestamps.length === 0) return 0;

  const stressScores: number[] = [];

  for (const timestamp of timestamps) {
    // Find sensor data within 1 hour of the timestamp
    const relevantData = sensorData.filter((data) => {
      const dataTime = new Date(data.timestamp).getTime();
      const timeDiff = Math.abs(dataTime - timestamp);
      return timeDiff <= 60 * 60 * 1000; // 1 hour window
    });

    if (relevantData.length > 0) {
      const avgStress = relevantData.reduce((sum, d) => sum + d.stress_score, 0) / relevantData.length;
      stressScores.push(avgStress);
    }
  }

  if (stressScores.length === 0) return 0;
  return stressScores.reduce((sum, score) => sum + score, 0) / stressScores.length;
}

/**
 * Calculate Pearson correlation coefficient
 */
export function calculatePearsonCorrelation(
  adherenceRates: number[],
  stressScores: number[]
): number {
  if (adherenceRates.length !== stressScores.length || adherenceRates.length === 0) {
    return 0;
  }

  const n = adherenceRates.length;
  const meanAdherence = adherenceRates.reduce((a, b) => a + b, 0) / n;
  const meanStress = stressScores.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominatorA = 0;
  let denominatorB = 0;

  for (let i = 0; i < n; i++) {
    const diffAdherence = adherenceRates[i] - meanAdherence;
    const diffStress = stressScores[i] - meanStress;

    numerator += diffAdherence * diffStress;
    denominatorA += diffAdherence * diffAdherence;
    denominatorB += diffStress * diffStress;
  }

  const denominator = Math.sqrt(denominatorA * denominatorB);
  if (denominator === 0) return 0;

  return numerator / denominator;
}

/**
 * Analyze medication-stress correlation
 */
export function analyzeMedicationStressCorrelation(
  medicationLogs: MedicationLog[],
  sensorData: SensorDataRow[],
  totalScheduledDoses: number
): CorrelationAnalysis {
  if (medicationLogs.length === 0 || sensorData.length === 0) {
    return {
      overall_adherence_rate: 0,
      overall_on_time_rate: 0,
      average_stress_with_adherence: 0,
      average_stress_without_adherence: 0,
      correlation_coefficient: 0,
      medications: [],
      stress_impact: 'neutral',
      stress_reduction_percentage: 0,
    };
  }

  // Calculate overall adherence
  const overallAdherence = calculateMedicationAdherence(medicationLogs, totalScheduledDoses);
  const overallOnTimeRate = calculateOnTimeRate(medicationLogs);

  // Separate logs into taken and missed
  const takenLogs = medicationLogs.filter((log) => log.on_time);
  const missedLogs = medicationLogs.filter((log) => !log.on_time);

  // Calculate average stress when medication was taken vs missed
  const stressWhenTaken = calculateAverageStressForTimestamps(
    sensorData,
    takenLogs.map((log) => log.timestamp)
  );
  const stressWhenMissed = calculateAverageStressForTimestamps(
    sensorData,
    missedLogs.map((log) => log.timestamp)
  );

  // Calculate stress reduction
  const stressReduction = stressWhenMissed - stressWhenTaken;
  const stressReductionPercentage =
    stressWhenMissed > 0 ? (stressReduction / stressWhenMissed) * 100 : 0;

  // Determine stress impact
  let stressImpact: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (stressReductionPercentage > 10) {
    stressImpact = 'positive';
  } else if (stressReductionPercentage < -10) {
    stressImpact = 'negative';
  }

  // Group logs by medication
  const medicationMap = new Map<string, MedicationLog[]>();
  for (const log of medicationLogs) {
    if (!medicationMap.has(log.medication_name)) {
      medicationMap.set(log.medication_name, []);
    }
    medicationMap.get(log.medication_name)!.push(log);
  }

  // Calculate per-medication statistics
  const medications: MedicationAdherence[] = [];
  for (const [medName, logs] of medicationMap.entries()) {
    const takenCount = logs.filter((log) => log.on_time).length;
    const onTimeCount = logs.filter((log) => log.on_time).length;

    const medStressWhenTaken = calculateAverageStressForTimestamps(
      sensorData,
      logs.filter((log) => log.on_time).map((log) => log.timestamp)
    );
    const medStressWhenMissed = calculateAverageStressForTimestamps(
      sensorData,
      logs.filter((log) => !log.on_time).map((log) => log.timestamp)
    );

    medications.push({
      medication_name: medName,
      total_doses: logs.length,
      doses_taken: takenCount,
      on_time_doses: onTimeCount,
      adherence_rate: (takenCount / logs.length) * 100,
      on_time_rate: (onTimeCount / logs.length) * 100,
      average_stress_when_taken: medStressWhenTaken,
      average_stress_when_missed: medStressWhenMissed,
      stress_reduction: medStressWhenMissed - medStressWhenTaken,
    });
  }

  // Calculate correlation coefficient
  const adherenceRates = medicationLogs.map((log) => (log.on_time ? 100 : 0));
  const stressScores = medicationLogs.map((log) => {
    const relevantData = sensorData.filter((data) => {
      const dataTime = new Date(data.timestamp).getTime();
      const timeDiff = Math.abs(dataTime - log.timestamp);
      return timeDiff <= 60 * 60 * 1000;
    });
    return relevantData.length > 0
      ? relevantData.reduce((sum, d) => sum + d.stress_score, 0) / relevantData.length
      : 50;
  });

  const correlationCoefficient = calculatePearsonCorrelation(adherenceRates, stressScores);

  return {
    overall_adherence_rate: Math.round(overallAdherence * 100) / 100,
    overall_on_time_rate: Math.round(overallOnTimeRate * 100) / 100,
    average_stress_with_adherence: Math.round(stressWhenTaken * 100) / 100,
    average_stress_without_adherence: Math.round(stressWhenMissed * 100) / 100,
    correlation_coefficient: Math.round(correlationCoefficient * 100) / 100,
    medications,
    stress_impact: stressImpact,
    stress_reduction_percentage: Math.round(stressReductionPercentage * 100) / 100,
  };
}

/**
 * Get medication impact summary
 */
export function getMedicationImpactSummary(analysis: CorrelationAnalysis): string {
  if (analysis.stress_impact === 'positive') {
    return `Taking medications on time reduces your stress by an average of ${analysis.stress_reduction_percentage.toFixed(1)}%. Keep up the good adherence!`;
  } else if (analysis.stress_impact === 'negative') {
    return `Your stress levels are higher when taking medications. Consider discussing this with your healthcare provider.`;
  } else {
    return `Your medication adherence shows a neutral correlation with stress levels. Continue monitoring your patterns.`;
  }
}
