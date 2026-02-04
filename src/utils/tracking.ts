// Tracking utilities for triggers, medications, and strategies

export interface TriggerLog {
  id: string;
  trigger: string;
  timestamp: Date;
  stressLevel: number;
  location?: string;
  context?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface MedicationLog {
  id: string;
  medicationName: string;
  dosage: string;
  timestamp: Date;
  taken: boolean;
  sideEffects?: string[];
  effectiveness: number; // 0-100
}

export interface StrategyLog {
  id: string;
  strategyName: string;
  timestamp: Date;
  duration: number; // minutes
  effectiveness: number; // 0-100
  notes?: string;
}

export interface TriggerPattern {
  trigger: string;
  frequency: number;
  averageStress: number;
  commonLocations: string[];
  commonTimes: string[];
  severity: 'low' | 'medium' | 'high';
}

export function logTrigger(
  trigger: string,
  stressLevel: number,
  location?: string,
  context?: string
): TriggerLog {
  const severity = stressLevel > 75 ? 'high' : stressLevel > 50 ? 'medium' : 'low';

  return {
    id: `trigger-${Date.now()}`,
    trigger,
    timestamp: new Date(),
    stressLevel,
    location,
    context,
    severity,
  };
}

export function logMedication(
  medicationName: string,
  dosage: string,
  taken: boolean,
  effectiveness?: number,
  sideEffects?: string[]
): MedicationLog {
  return {
    id: `med-${Date.now()}`,
    medicationName,
    dosage,
    timestamp: new Date(),
    taken,
    effectiveness: effectiveness || 0,
    sideEffects,
  };
}

export function logStrategy(
  strategyName: string,
  duration: number,
  effectiveness: number,
  notes?: string
): StrategyLog {
  return {
    id: `strategy-${Date.now()}`,
    strategyName,
    timestamp: new Date(),
    duration,
    effectiveness,
    notes,
  };
}

export function analyzeTriggerPatterns(logs: TriggerLog[]): TriggerPattern[] {
  const patterns: { [key: string]: TriggerPattern } = {};

  logs.forEach((log) => {
    if (!patterns[log.trigger]) {
      patterns[log.trigger] = {
        trigger: log.trigger,
        frequency: 0,
        averageStress: 0,
        commonLocations: [],
        commonTimes: [],
        severity: log.severity,
      };
    }

    const pattern = patterns[log.trigger];
    pattern.frequency++;
    pattern.averageStress = (pattern.averageStress + log.stressLevel) / 2;

    if (log.location && !pattern.commonLocations.includes(log.location)) {
      pattern.commonLocations.push(log.location);
    }

    const hour = log.timestamp.getHours();
    const timeSlot = `${hour}:00`;
    if (!pattern.commonTimes.includes(timeSlot)) {
      pattern.commonTimes.push(timeSlot);
    }
  });

  return Object.values(patterns).sort((a, b) => b.frequency - a.frequency);
}

export function getMedicationAdherence(logs: MedicationLog[]): number {
  if (logs.length === 0) return 0;
  const taken = logs.filter((l) => l.taken).length;
  return Math.round((taken / logs.length) * 100);
}

export function getStrategyEffectiveness(logs: StrategyLog[]): number {
  if (logs.length === 0) return 0;
  const total = logs.reduce((sum, log) => sum + log.effectiveness, 0);
  return Math.round(total / logs.length);
}

export function getTopStrategies(logs: StrategyLog[], limit: number = 5): StrategyLog[] {
  return logs.sort((a, b) => b.effectiveness - a.effectiveness).slice(0, limit);
}

export function getMedicationEffectiveness(logs: MedicationLog[]): number {
  const takenLogs = logs.filter((l) => l.taken);
  if (takenLogs.length === 0) return 0;
  const total = takenLogs.reduce((sum, log) => sum + log.effectiveness, 0);
  return Math.round(total / takenLogs.length);
}

export function checkDrugInteraction(medications: string[]): string[] {
  // Mock drug interaction checker
  const interactions: { [key: string]: string[] } = {
    'Sertraline': ['Tramadol', 'Linezolid'],
    'Ibuprofen': ['Aspirin', 'Warfarin'],
  };

  const warnings: string[] = [];
  medications.forEach((med) => {
    if (interactions[med]) {
      interactions[med].forEach((conflicting) => {
        if (medications.includes(conflicting)) {
          warnings.push(`⚠️ ${med} may interact with ${conflicting}`);
        }
      });
    }
  });

  return warnings;
}
