// Patient data generation utilities

export interface MedicationLog {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: string;
  taken: boolean;
}

export interface TriggerLog {
  id: string;
  trigger: string;
  location: string;
  timestamp: string;
  severity: number;
  stressLevel: number;
  context?: string;
}

export interface StrategyLog {
  id: string;
  strategy: string;
  timestamp: string;
  effectiveness: number;
  duration: number;
  notes?: string;
}

export interface StrategyRecommendation {
  strategy: string;
  reason: string;
  successRate: number;
  estimatedDuration: number;
}

export interface RefillReminder {
  medication: string;
  daysRemaining: number;
}

export interface AccessLog {
  id: string;
  guardian: string;
  timestamp: string;
  dataAccessed: string;
  duration: string;
}

export interface LearningResource {
  id: string;
  title: string;
  category: string;
  type: string;
  duration: string;
}

export function generateMedicationLogs(): MedicationLog[] {
  return [
    {
      id: 'med-1',
      name: 'Sertraline',
      dosage: '50mg',
      scheduledTime: 'Morning',
      taken: true,
    },
    {
      id: 'med-2',
      name: 'Melatonin',
      dosage: '5mg',
      scheduledTime: 'Evening',
      taken: false,
    },
  ];
}

export function generateTriggerLogs(): TriggerLog[] {
  return [
    {
      id: 'trigger-1',
      trigger: 'Loud noises',
      location: 'School',
      timestamp: 'Today, 2:30 PM',
      severity: 4,
      stressLevel: 78,
      context: 'Fire alarm during class',
    },
    {
      id: 'trigger-2',
      trigger: 'Crowded spaces',
      location: 'Mall',
      timestamp: 'Yesterday, 5:00 PM',
      severity: 3,
      stressLevel: 65,
      context: 'Weekend shopping',
    },
    {
      id: 'trigger-3',
      trigger: 'Unexpected changes',
      location: 'Home',
      timestamp: '2 days ago, 10:00 AM',
      severity: 2,
      stressLevel: 55,
      context: 'Schedule change',
    },
  ];
}

export function generateStrategyLogs(): StrategyLog[] {
  return [
    {
      id: 'strategy-1',
      strategy: 'Deep breathing',
      timestamp: 'Today, 2:45 PM',
      effectiveness: 4,
      duration: 5,
      notes: 'Helped calm down after fire alarm',
    },
    {
      id: 'strategy-2',
      strategy: 'Listening to music',
      timestamp: 'Yesterday, 5:30 PM',
      effectiveness: 5,
      duration: 15,
      notes: 'Very effective in mall',
    },
    {
      id: 'strategy-3',
      strategy: 'Quiet time alone',
      timestamp: '2 days ago, 10:30 AM',
      effectiveness: 3,
      duration: 20,
      notes: 'Partially helped',
    },
  ];
}

export function generateStrategyRecommendations(
  currentStress: number,
  triggers: string[]
): StrategyRecommendation[] {
  return [
    {
      strategy: 'Box Breathing (4-4-4-4)',
      reason: 'Highly effective for stress levels above 70%',
      successRate: 0.92,
      estimatedDuration: 5,
    },
    {
      strategy: 'Noise-Canceling Headphones',
      reason: 'Recommended for loud noise triggers',
      successRate: 0.88,
      estimatedDuration: 10,
    },
    {
      strategy: 'Weighted Blanket',
      reason: 'Deep pressure stimulation for anxiety',
      successRate: 0.85,
      estimatedDuration: 15,
    },
    {
      strategy: 'Guided Meditation',
      reason: 'Calming technique for overload prevention',
      successRate: 0.80,
      estimatedDuration: 10,
    },
  ];
}

export function generateRefillReminders(): RefillReminder[] {
  return [
    {
      medication: 'Sertraline 50mg',
      daysRemaining: 7,
    },
  ];
}

export function checkDrugInteractions(medications: string[]): string[] {
  const interactions: { [key: string]: string[] } = {
    'Sertraline': ['Tramadol', 'Linezolid', 'Ibuprofen'],
    'Ibuprofen': ['Aspirin', 'Warfarin', 'Sertraline'],
  };

  const warnings: string[] = [];
  medications.forEach((med) => {
    if (interactions[med]) {
      interactions[med].forEach((conflicting) => {
        if (medications.includes(conflicting)) {
          warnings.push(`${med} may interact with ${conflicting}`);
        }
      });
    }
  });

  return warnings;
}

export function generateLearningResources(): LearningResource[] {
  return [
    {
      id: 'res-1',
      title: 'Understanding Autism Spectrum Disorder',
      category: 'Education',
      type: 'Article',
      duration: '10 min read',
    },
    {
      id: 'res-2',
      title: 'Sensory Processing Guide',
      category: 'Sensory',
      type: 'Guide',
      duration: '15 min read',
    },
    {
      id: 'res-3',
      title: 'Coping Strategies for Anxiety',
      category: 'Mental Health',
      type: 'Video',
      duration: '8 min video',
    },
    {
      id: 'res-4',
      title: 'Therapist Resources',
      category: 'Professional',
      type: 'Resource',
      duration: 'Reference',
    },
    {
      id: 'res-5',
      title: 'Parent Support Guide',
      category: 'Family',
      type: 'Guide',
      duration: '20 min read',
    },
    {
      id: 'res-6',
      title: 'School Accommodations',
      category: 'Education',
      type: 'Guide',
      duration: '12 min read',
    },
  ];
}
