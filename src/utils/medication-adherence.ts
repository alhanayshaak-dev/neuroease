// Medication adherence tracking
export interface MedicationDay {
  date: string;
  taken: boolean;
  time?: string;
  notes?: string;
}

export interface MedicationAdherence {
  medicationName: string;
  adherenceRate: number;
  currentStreak: number;
  longestStreak: number;
  missedDoses: number;
  totalDoses: number;
  history: MedicationDay[];
}

export function calculateAdherence(history: MedicationDay[]): MedicationAdherence {
  const taken = history.filter(d => d.taken).length;
  const total = history.length;
  
  let currentStreak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].taken) {
      currentStreak++;
    } else {
      break;
    }
  }

  let longestStreak = 0;
  let tempStreak = 0;
  for (const day of history) {
    if (day.taken) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return {
    medicationName: 'Current Medication',
    adherenceRate: total > 0 ? (taken / total) * 100 : 0,
    currentStreak,
    longestStreak,
    missedDoses: total - taken,
    totalDoses: total,
    history,
  };
}

export function getMedicationCalendar(days: number = 30): MedicationDay[] {
  const calendar: MedicationDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    calendar.push({
      date: date.toISOString().split('T')[0],
      taken: Math.random() > 0.15, // 85% adherence
      time: Math.random() > 0.15 ? '09:00 AM' : undefined,
    });
  }
  return calendar;
}
