/**
 * Appointment scheduling utilities
 * Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */

export interface SensoryPrepItem {
  id: string;
  title: string;
  description: string;
  category: 'environment' | 'sensory' | 'social' | 'transition' | 'other';
  completed: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  appointment_type?: string;
  title: string;
  scheduled_time: string;
  duration_minutes?: number;
  location?: string;
  sensory_prep: Record<string, any>;
  notes?: string;
  created_at: string;
}

/**
 * Generate default sensory prep checklist for an appointment
 */
export function generateDefaultSensoryPrep(): SensoryPrepItem[] {
  return [
    {
      id: 'prep-1',
      title: 'Review location',
      description: 'Familiarize yourself with the appointment location',
      category: 'environment',
      completed: false,
    },
    {
      id: 'prep-2',
      title: 'Plan arrival time',
      description: 'Plan to arrive 10-15 minutes early',
      category: 'transition',
      completed: false,
    },
    {
      id: 'prep-3',
      title: 'Identify quiet space',
      description: 'Locate a quiet space if you need a break',
      category: 'sensory',
      completed: false,
    },
    {
      id: 'prep-4',
      title: 'Prepare comfort items',
      description: 'Bring headphones, fidget tools, or other comfort items',
      category: 'sensory',
      completed: false,
    },
    {
      id: 'prep-5',
      title: 'Plan communication',
      description: 'Decide how you will communicate your needs',
      category: 'social',
      completed: false,
    },
    {
      id: 'prep-6',
      title: 'Set expectations',
      description: 'Review what to expect during the appointment',
      category: 'environment',
      completed: false,
    },
  ];
}

/**
 * Calculate time until appointment
 */
export function getTimeUntilAppointment(appointmentTime: string): {
  days: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
  isPast: boolean;
} {
  const now = new Date();
  const appointmentDate = new Date(appointmentTime);
  const diff = appointmentDate.getTime() - now.getTime();

  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  const totalMinutes = Math.floor(absDiff / (1000 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, totalMinutes, isPast };
}

/**
 * Check if appointment is today
 */
export function isAppointmentToday(appointmentTime: string): boolean {
  const now = new Date();
  const appointmentDate = new Date(appointmentTime);

  return (
    now.getFullYear() === appointmentDate.getFullYear() &&
    now.getMonth() === appointmentDate.getMonth() &&
    now.getDate() === appointmentDate.getDate()
  );
}

/**
 * Check if appointment is upcoming (within 7 days)
 */
export function isAppointmentUpcoming(appointmentTime: string): boolean {
  const { days, isPast } = getTimeUntilAppointment(appointmentTime);
  return !isPast && days <= 7;
}

/**
 * Check if appointment is in the past
 */
export function isAppointmentPast(appointmentTime: string): boolean {
  const { isPast } = getTimeUntilAppointment(appointmentTime);
  return isPast;
}

/**
 * Format appointment time for display
 */
export function formatAppointmentTime(appointmentTime: string): string {
  const date = new Date(appointmentTime);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get appointment status
 */
export function getAppointmentStatus(
  appointmentTime: string
): 'upcoming' | 'today' | 'past' {
  if (isAppointmentToday(appointmentTime)) {
    return 'today';
  }
  if (isAppointmentPast(appointmentTime)) {
    return 'past';
  }
  return 'upcoming';
}

/**
 * Calculate prep completion percentage
 */
export function calculatePrepCompletion(prepItems: SensoryPrepItem[]): number {
  if (prepItems.length === 0) {
    return 0;
  }

  const completed = prepItems.filter((item) => item.completed).length;
  return Math.round((completed / prepItems.length) * 100);
}

/**
 * Validate appointment data
 */
export function validateAppointment(appointment: Partial<Appointment>): boolean {
  if (!appointment.title || typeof appointment.title !== 'string') {
    return false;
  }

  if (!appointment.scheduled_time || typeof appointment.scheduled_time !== 'string') {
    return false;
  }

  // Validate that scheduled_time is a valid date
  try {
    const date = new Date(appointment.scheduled_time);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * Get sensory prep items by category
 */
export function getPrepItemsByCategory(
  prepItems: SensoryPrepItem[],
  category: SensoryPrepItem['category']
): SensoryPrepItem[] {
  return prepItems.filter((item) => item.category === category);
}

/**
 * Update prep item completion status
 */
export function updatePrepItemCompletion(
  prepItems: SensoryPrepItem[],
  itemId: string,
  completed: boolean
): SensoryPrepItem[] {
  return prepItems.map((item) =>
    item.id === itemId ? { ...item, completed } : item
  );
}
