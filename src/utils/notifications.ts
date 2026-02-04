// Notification management utilities

export interface NotificationPreference {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
  alertThreshold: number; // 0-100
}

export interface ScheduledNotification {
  id: string;
  type: 'stress_spike' | 'medication_due' | 'appointment' | 'check_in';
  title: string;
  message: string;
  scheduledTime: Date;
  sent: boolean;
}

export const defaultNotificationPreferences: NotificationPreference = {
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  alertThreshold: 70,
};

export function isInDoNotDisturb(prefs: NotificationPreference): boolean {
  if (!prefs.doNotDisturbStart || !prefs.doNotDisturbEnd) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMin] = prefs.doNotDisturbStart.split(':').map(Number);
  const [endHour, endMin] = prefs.doNotDisturbEnd.split(':').map(Number);

  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  if (startTime <= endTime) {
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    return currentTime >= startTime || currentTime <= endTime;
  }
}

export function shouldSendNotification(
  stressLevel: number,
  threshold: number,
  prefs: NotificationPreference
): boolean {
  if (isInDoNotDisturb(prefs)) return false;
  return stressLevel >= threshold;
}

export function scheduleNotification(
  type: ScheduledNotification['type'],
  title: string,
  message: string,
  scheduledTime: Date
): ScheduledNotification {
  return {
    id: `notif-${Date.now()}`,
    type,
    title,
    message,
    scheduledTime,
    sent: false,
  };
}

export function getUpcomingNotifications(
  notifications: ScheduledNotification[],
  hoursAhead: number = 24
): ScheduledNotification[] {
  const now = new Date();
  const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  return notifications.filter(
    (n) => !n.sent && n.scheduledTime >= now && n.scheduledTime <= futureTime
  );
}

export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
  return `${Math.floor(diffMins / 1440)}d`;
}
