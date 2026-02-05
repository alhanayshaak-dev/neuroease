// Mobile App Features
export interface PushNotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  badge: boolean;
}

export interface HomeScreenWidget {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large';
  data: any;
  refreshInterval: number;
}

export function registerPushNotifications(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('push-token-xyz123');
    }, 1000);
  });
}

export function sendPushNotification(title: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function getPushNotificationSettings(): PushNotificationSettings {
  return {
    enabled: true,
    sound: true,
    vibration: true,
    badge: true,
  };
}

export function setPushNotificationSettings(settings: Partial<PushNotificationSettings>): void {
  localStorage.setItem('push-settings', JSON.stringify(settings));
}

export function getHomeScreenWidgets(): HomeScreenWidget[] {
  return [
    {
      id: '1',
      name: 'Stress Level',
      size: 'medium',
      data: { current: 62, trend: 'rising' },
      refreshInterval: 300,
    },
    {
      id: '2',
      name: 'Medication Reminder',
      size: 'small',
      data: { nextDue: '09:00 AM' },
      refreshInterval: 600,
    },
  ];
}

export function addHomeScreenWidget(widget: HomeScreenWidget): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function enableOfflineMode(): void {
  localStorage.setItem('offline-mode', 'true');
}

export function isOfflineMode(): boolean {
  return localStorage.getItem('offline-mode') === 'true';
}

export function enableBiometricAuth(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export function authenticateWithBiometric(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
}

export function shareToNativeApp(data: any, appName: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}
