/**
 * Medication tracking utilities
 * Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

export interface Medication {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  taken_today: boolean;
  taken_times: string[];
  created_at: string;
}

/**
 * Parse frequency string to get expected doses per day
 * Examples: "once daily", "twice daily", "three times daily", "every 8 hours"
 */
export function parseFrequency(frequency: string): number {
  const lowerFreq = frequency.toLowerCase();

  if (lowerFreq.includes('once')) return 1;
  if (lowerFreq.includes('twice')) return 2;
  if (lowerFreq.includes('three times')) return 3;
  if (lowerFreq.includes('four times')) return 4;

  // Parse "every X hours" format
  const hourMatch = lowerFreq.match(/every\s+(\d+)\s+hours?/i);
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    return Math.round(24 / hours);
  }

  // Default to once daily if unable to parse
  return 1;
}

/**
 * Calculate adherence rate for a medication
 * Returns percentage of doses taken on time (0-100)
 */
export function calculateAdherenceRate(
  medication: Medication,
  daysToCheck: number = 30
): number {
  if (!medication.start_date) {
    return 0;
  }

  const startDate = new Date(medication.start_date);
  const today = new Date();
  const endDate = medication.end_date ? new Date(medication.end_date) : today;

  // Calculate days elapsed
  const daysElapsed = Math.min(
    Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    daysToCheck
  );

  if (daysElapsed <= 0) {
    return 0;
  }

  // Calculate expected doses
  const expectedDosesPerDay = parseFrequency(medication.frequency);
  const totalExpectedDoses = expectedDosesPerDay * daysElapsed;

  // Count actual doses taken
  const actualDosesTaken = medication.taken_times?.length || 0;

  // Calculate adherence percentage
  const adherenceRate = Math.min(
    Math.round((actualDosesTaken / totalExpectedDoses) * 100),
    100
  );

  return adherenceRate;
}

/**
 * Get adherence status based on rate
 */
export function getAdherenceStatus(
  adherenceRate: number
): 'excellent' | 'good' | 'fair' | 'poor' {
  if (adherenceRate >= 90) return 'excellent';
  if (adherenceRate >= 75) return 'good';
  if (adherenceRate >= 50) return 'fair';
  return 'poor';
}

/**
 * Calculate doses taken today
 */
export function getDosesTodayCount(medication: Medication): number {
  if (!medication.taken_times) {
    return 0;
  }

  // Count doses logged today
  return medication.taken_times.length;
}

/**
 * Get expected doses for today based on frequency
 */
export function getExpectedDosesToday(medication: Medication): number {
  return parseFrequency(medication.frequency);
}

/**
 * Check if medication is currently active
 */
export function isMedicationActive(medication: Medication): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(medication.start_date);
  startDate.setHours(0, 0, 0, 0);

  if (today < startDate) {
    return false;
  }

  if (medication.end_date) {
    const endDate = new Date(medication.end_date);
    endDate.setHours(23, 59, 59, 999);

    if (today > endDate) {
      return false;
    }
  }

  return true;
}

/**
 * Validate medication data
 */
export function validateMedication(medication: Partial<Medication>): boolean {
  if (!medication.medication_name || typeof medication.medication_name !== 'string') {
    return false;
  }

  if (!medication.dosage || typeof medication.dosage !== 'string') {
    return false;
  }

  if (!medication.frequency || typeof medication.frequency !== 'string') {
    return false;
  }

  if (!medication.start_date || typeof medication.start_date !== 'string') {
    return false;
  }

  return true;
}
