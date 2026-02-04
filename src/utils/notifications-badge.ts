// Notification badge management
export interface NotificationBadge {
  careCircle: number;
  patient: number;
  devices: number;
  community: number;
  alerts: number;
}

export function getNotificationBadges(): NotificationBadge {
  return {
    careCircle: 3,
    patient: 2,
    devices: 1,
    community: 5,
    alerts: 2,
  };
}

export function getTotalNotifications(badges: NotificationBadge): number {
  return Object.values(badges).reduce((sum, count) => sum + count, 0);
}
