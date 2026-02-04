// External service integrations
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'appointment' | 'medication' | 'reminder';
}

export interface HealthAppData {
  source: 'apple-health' | 'google-fit' | 'fitbit';
  steps: number;
  heartRate: number;
  calories: number;
  distance: number;
  lastSync: string;
}

export function connectToCalendar(provider: 'google' | 'outlook' | 'apple'): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Connected to ${provider} calendar`);
      resolve(true);
    }, 1000);
  });
}

export function syncCalendarEvents(): Promise<CalendarEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Therapy Session',
          date: '2024-02-05',
          time: '14:00',
          type: 'appointment',
        },
        {
          id: '2',
          title: 'Medication Reminder',
          date: '2024-02-05',
          time: '09:00',
          type: 'medication',
        },
      ]);
    }, 1000);
  });
}

export function connectToHealthApp(provider: 'apple-health' | 'google-fit' | 'fitbit'): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Connected to ${provider}`);
      resolve(true);
    }, 1000);
  });
}

export function syncHealthData(provider: 'apple-health' | 'google-fit' | 'fitbit'): Promise<HealthAppData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        source: provider,
        steps: 8234,
        heartRate: 72,
        calories: 2100,
        distance: 6.5,
        lastSync: new Date().toISOString(),
      });
    }, 1000);
  });
}

export function isHealthAppConnected(provider: string): boolean {
  const connected = localStorage.getItem(`health-app-${provider}`);
  return connected === 'true';
}

export function saveHealthAppConnection(provider: string, connected: boolean): void {
  localStorage.setItem(`health-app-${provider}`, connected ? 'true' : 'false');
}
