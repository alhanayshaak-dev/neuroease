/**
 * Trigger tracking and analysis utilities
 * Tracks stress triggers (auditory, visual, social, unknown) and analyzes patterns
 */

export type TriggerType = 'auditory' | 'visual' | 'social' | 'unknown';

export interface TriggerContext {
  location?: string;
  activity?: string;
  time?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export interface StressEvent {
  stress_score: number;
  timestamp: number;
  context: TriggerContext;
}

export interface TriggerRecord {
  id: string;
  trigger_type: TriggerType;
  stress_score: number;
  context: TriggerContext;
  timestamp: number;
  created_at: string;
}

export interface TriggerPattern {
  trigger_type: TriggerType;
  frequency: number;
  average_stress_score: number;
  locations: Record<string, number>;
  times_of_day: Record<string, number>;
  activities: Record<string, number>;
}

export interface TriggerAnalysis {
  total_triggers: number;
  trigger_patterns: Record<TriggerType, TriggerPattern>;
  most_common_trigger: TriggerType;
  highest_stress_trigger: TriggerType;
  average_stress_by_trigger: Record<TriggerType, number>;
  location_stress_map: Record<string, number>;
  time_stress_map: Record<string, number>;
}

/**
 * Detect trigger type from context
 * @param context Context information about the stress event
 * @returns Detected trigger type
 */
export function detectTriggerType(context: TriggerContext): TriggerType {
  // Check for auditory triggers
  if (context.activity) {
    const activity = String(context.activity).toLowerCase();
    if (
      activity.includes('loud') ||
      activity.includes('noise') ||
      activity.includes('sound') ||
      activity.includes('music') ||
      activity.includes('alarm') ||
      activity.includes('bell') ||
      activity.includes('crowd') ||
      activity.includes('busy')
    ) {
      return 'auditory';
    }
  }

  // Check for visual triggers
  if (context.activity) {
    const activity = String(context.activity).toLowerCase();
    if (
      activity.includes('bright') ||
      activity.includes('light') ||
      activity.includes('flash') ||
      activity.includes('screen') ||
      activity.includes('visual') ||
      activity.includes('busy') ||
      activity.includes('crowded')
    ) {
      return 'visual';
    }
  }

  // Check for social triggers
  if (context.activity) {
    const activity = String(context.activity).toLowerCase();
    if (
      activity.includes('social') ||
      activity.includes('meeting') ||
      activity.includes('presentation') ||
      activity.includes('conversation') ||
      activity.includes('group') ||
      activity.includes('class') ||
      activity.includes('interaction')
    ) {
      return 'social';
    }
  }

  // Check location for social triggers
  if (context.location) {
    const location = String(context.location).toLowerCase();
    if (
      location.includes('school') ||
      location.includes('office') ||
      location.includes('shop') ||
      location.includes('mall') ||
      location.includes('public') ||
      location.includes('cafe')
    ) {
      return 'social';
    }
  }

  return 'unknown';
}

/**
 * Record a stress event as a trigger
 * @param stressEvent The stress event to record
 * @param context Additional context about the event
 * @returns Recorded trigger
 */
export function recordTrigger(
  stressEvent: StressEvent,
  context?: TriggerContext
): TriggerRecord {
  const mergedContext = { ...stressEvent.context, ...context };
  const triggerType = detectTriggerType(mergedContext);

  const trigger: TriggerRecord = {
    id: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    trigger_type: triggerType,
    stress_score: stressEvent.stress_score,
    context: mergedContext,
    timestamp: stressEvent.timestamp,
    created_at: new Date().toISOString(),
  };

  return trigger;
}

/**
 * Analyze patterns in a collection of triggers
 * @param triggers Array of trigger records to analyze
 * @returns Analysis of trigger patterns
 */
export function analyzeTriggers(triggers: TriggerRecord[]): TriggerAnalysis {
  if (triggers.length === 0) {
    return {
      total_triggers: 0,
      trigger_patterns: {
        auditory: {
          trigger_type: 'auditory',
          frequency: 0,
          average_stress_score: 0,
          locations: {},
          times_of_day: {},
          activities: {},
        },
        visual: {
          trigger_type: 'visual',
          frequency: 0,
          average_stress_score: 0,
          locations: {},
          times_of_day: {},
          activities: {},
        },
        social: {
          trigger_type: 'social',
          frequency: 0,
          average_stress_score: 0,
          locations: {},
          times_of_day: {},
          activities: {},
        },
        unknown: {
          trigger_type: 'unknown',
          frequency: 0,
          average_stress_score: 0,
          locations: {},
          times_of_day: {},
          activities: {},
        },
      },
      most_common_trigger: 'unknown',
      highest_stress_trigger: 'unknown',
      average_stress_by_trigger: {
        auditory: 0,
        visual: 0,
        social: 0,
        unknown: 0,
      },
      location_stress_map: {},
      time_stress_map: {},
    };
  }

  // Initialize pattern tracking
  const patterns: Record<TriggerType, TriggerPattern> = {
    auditory: {
      trigger_type: 'auditory',
      frequency: 0,
      average_stress_score: 0,
      locations: {},
      times_of_day: {},
      activities: {},
    },
    visual: {
      trigger_type: 'visual',
      frequency: 0,
      average_stress_score: 0,
      locations: {},
      times_of_day: {},
      activities: {},
    },
    social: {
      trigger_type: 'social',
      frequency: 0,
      average_stress_score: 0,
      locations: {},
      times_of_day: {},
      activities: {},
    },
    unknown: {
      trigger_type: 'unknown',
      frequency: 0,
      average_stress_score: 0,
      locations: {},
      times_of_day: {},
      activities: {},
    },
  };

  const stressByTrigger: Record<TriggerType, number[]> = {
    auditory: [],
    visual: [],
    social: [],
    unknown: [],
  };

  const locationStressMap = new Map<string, number[]>();
  const timeStressMap = new Map<string, number[]>();

  // Process each trigger
  for (const trigger of triggers) {
    const type = trigger.trigger_type;
    patterns[type].frequency += 1;
    stressByTrigger[type].push(trigger.stress_score);

    // Track location
    if (trigger.context.location) {
      const location = String(trigger.context.location);
      patterns[type].locations[location] = (patterns[type].locations[location] || 0) + 1;

      if (!locationStressMap.has(location)) {
        locationStressMap.set(location, []);
      }
      const locationScores = locationStressMap.get(location);
      if (locationScores) {
        locationScores.push(trigger.stress_score);
      }
    }

    // Track time of day
    if (trigger.context.time) {
      const time = String(trigger.context.time);
      patterns[type].times_of_day[time] = (patterns[type].times_of_day[time] || 0) + 1;

      if (!timeStressMap.has(time)) {
        timeStressMap.set(time, []);
      }
      const timeScores = timeStressMap.get(time);
      if (timeScores) {
        timeScores.push(trigger.stress_score);
      }
    }

    // Track activity
    if (trigger.context.activity) {
      const activity = String(trigger.context.activity);
      patterns[type].activities[activity] = (patterns[type].activities[activity] || 0) + 1;
    }
  }

  // Calculate average stress scores
  const averageStressByTrigger: Record<TriggerType, number> = {
    auditory: 0,
    visual: 0,
    social: 0,
    unknown: 0,
  };

  for (const type of ['auditory', 'visual', 'social', 'unknown'] as TriggerType[]) {
    if (stressByTrigger[type].length > 0) {
      const sum = stressByTrigger[type].reduce((a, b) => a + b, 0);
      patterns[type].average_stress_score = sum / stressByTrigger[type].length;
      averageStressByTrigger[type] = patterns[type].average_stress_score;
    }
  }

  // Calculate location and time stress maps
  const locationStressAverage: Record<string, number> = {};
  for (const [location, scores] of locationStressMap.entries()) {
    locationStressAverage[location] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  const timeStressAverage: Record<string, number> = {};
  for (const [time, scores] of timeStressMap.entries()) {
    timeStressAverage[time] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // Find most common trigger
  let mostCommonTrigger: TriggerType = 'unknown';
  let maxFrequency = 0;
  for (const type of ['auditory', 'visual', 'social', 'unknown'] as TriggerType[]) {
    if (patterns[type].frequency > maxFrequency) {
      maxFrequency = patterns[type].frequency;
      mostCommonTrigger = type;
    }
  }

  // Find highest stress trigger
  let highestStressTrigger: TriggerType = 'unknown';
  let maxStress = 0;
  for (const type of ['auditory', 'visual', 'social', 'unknown'] as TriggerType[]) {
    if (averageStressByTrigger[type] > maxStress) {
      maxStress = averageStressByTrigger[type];
      highestStressTrigger = type;
    }
  }

  return {
    total_triggers: triggers.length,
    trigger_patterns: patterns,
    most_common_trigger: mostCommonTrigger,
    highest_stress_trigger: highestStressTrigger,
    average_stress_by_trigger: averageStressByTrigger,
    location_stress_map: locationStressAverage,
    time_stress_map: timeStressAverage,
  };
}
