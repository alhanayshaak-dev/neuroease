// Predictive stress alerts and interventions
export interface PredictiveAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  suggestedIntervention: string;
  confidence: number;
  timestamp: string;
}

export function generatePredictiveAlerts(currentStress: number, trend: 'rising' | 'stable' | 'falling'): PredictiveAlert[] {
  const alerts: PredictiveAlert[] = [];

  if (trend === 'rising' && currentStress > 50) {
    alerts.push({
      id: '1',
      type: 'warning',
      title: 'Stress Rising',
      message: 'Violet\'s stress levels are trending upward. Consider intervention soon.',
      suggestedIntervention: 'Suggest a calming activity or check-in call',
      confidence: 0.85,
      timestamp: new Date().toISOString(),
    });
  }

  if (currentStress > 75) {
    alerts.push({
      id: '2',
      type: 'warning',
      title: 'High Stress Detected',
      message: 'Stress levels are critically high. Immediate intervention recommended.',
      suggestedIntervention: 'Activate emergency mode or contact Violet',
      confidence: 0.95,
      timestamp: new Date().toISOString(),
    });
  }

  if (trend === 'falling' && currentStress < 40) {
    alerts.push({
      id: '3',
      type: 'success',
      title: 'Stress Improving',
      message: 'Great news! Violet\'s stress levels are improving.',
      suggestedIntervention: 'Reinforce current coping strategies',
      confidence: 0.9,
      timestamp: new Date().toISOString(),
    });
  }

  return alerts;
}

export function getInterventionSuggestions(stressLevel: number): string[] {
  if (stressLevel > 75) {
    return [
      'Emergency breathing exercise',
      'Contact emergency contact',
      'Activate calming music',
      'Guided meditation',
    ];
  }
  if (stressLevel > 50) {
    return [
      'Take a 5-minute break',
      'Practice deep breathing',
      'Go for a short walk',
      'Listen to calming music',
      'Talk to a friend',
    ];
  }
  return [
    'Continue current activity',
    'Practice mindfulness',
    'Stay hydrated',
    'Take regular breaks',
  ];
}
