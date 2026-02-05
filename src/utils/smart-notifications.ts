// Smart Notifications System
export interface NotificationPreference {
  type: string;
  enabled: boolean;
  quietHours: { start: string; end: string };
  batchSimilar: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: { label: string; url: string };
}

export interface NotificationBatch {
  id: string;
  type: string;
  count: number;
  notifications: Notification[];
  createdAt: string;
}

export interface DoNotDisturbSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
  allowEmergency: boolean;
  allowContacts: string[];
}

export function getNotificationPreferences(): Record<string, NotificationPreference> {
  return {
    alerts: {
      type: 'alerts',
      enabled: true,
      quietHours: { start: '22:00', end: '08:00' },
      batchSimilar: true,
      priority: 'high',
    },
    medications: {
      type: 'medications',
      enabled: true,
      quietHours: { start: '22:00', end: '08:00' },
      batchSimilar: false,
      priority: 'high',
    },
    messages: {
      type: 'messages',
      enabled: true,
      quietHours: { start: '22:00', end: '08:00' },
      batchSimilar: true,
      priority: 'medium',
    },
    updates: {
      type: 'updates',
      enabled: true,
      quietHours: { start: '22:00', end: '08:00' },
      batchSimilar: true,
      priority: 'low',
    },
  };
}

export function isInQuietHours(preference: NotificationPreference): boolean {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const { start, end } = preference.quietHours;

  if (start < end) {
    return currentTime >= start && currentTime < end;
  } else {
    return currentTime >= start || currentTime < end;
  }
}

export function shouldNotify(notification: Notification, preference: NotificationPreference, dnd: DoNotDisturbSettings): boolean {
  if (!preference.enabled) return false;
  if (dnd.enabled && !isEmergency(notification, dnd)) return false;
  if (isInQuietHours(preference) && preference.priority !== 'high') return false;
  return true;
}

export function isEmergency(notification: Notification, dnd: DoNotDisturbSettings): boolean {
  return dnd.allowEmergency && notification.priority === 'high';
}

export function batchNotifications(notifications: Notification[]): NotificationBatch[] {
  const batches: Record<string, Notification[]> = {};

  notifications.forEach(notif => {
    if (!batches[notif.type]) {
      batches[notif.type] = [];
    }
    batches[notif.type].push(notif);
  });

  return Object.entries(batches).map(([type, notifs]) => ({
    id: Math.random().toString(36).substr(2, 9),
    type,
    count: notifs.length,
    notifications: notifs,
    createdAt: new Date().toISOString(),
  }));
}

export function getNotificationHistory(limit: number = 50): Notification[] {
  const notifications: Notification[] = [];
  for (let i = 0; i < limit; i++) {
    notifications.push({
      id: `notif-${i}`,
      title: `Notification ${i + 1}`,
      message: `This is notification ${i + 1}`,
      type: ['alerts', 'medications', 'messages', 'updates'][i % 4],
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      read: i > 5,
      priority: ['low', 'medium', 'high'][i % 3] as any,
    });
  }
  return notifications;
}

export function setNotificationPreference(type: string, preference: Partial<NotificationPreference>): void {
  const prefs = getNotificationPreferences();
  if (prefs[type]) {
    Object.assign(prefs[type], preference);
    localStorage.setItem(`notification-pref-${type}`, JSON.stringify(prefs[type]));
  }
}

export function setDoNotDisturb(settings: DoNotDisturbSettings): void {
  localStorage.setItem('dnd-settings', JSON.stringify(settings));
}

export function getDoNotDisturb(): DoNotDisturbSettings {
  const saved = localStorage.getItem('dnd-settings');
  return saved ? JSON.parse(saved) : {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    allowEmergency: true,
    allowContacts: [],
  };
}

export function markNotificationAsRead(_notificationId: string): void {
  // Mark notification as read
}

export function archiveNotification(_notificationId: string): void {
  // Archive notification
}
