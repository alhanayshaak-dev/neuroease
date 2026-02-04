// Security logging utilities

export interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'success' | 'failed';
}

export interface AccessLog {
  id: string;
  guardian: string;
  timestamp: string;
  dataAccessed: string;
  duration: string;
}

export function generateSecurityLogs(): SecurityLog[] {
  return [
    {
      id: 'sec-1',
      action: 'Login successful',
      timestamp: 'Today, 9:00 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success',
    },
    {
      id: 'sec-2',
      action: 'Permission changed',
      timestamp: 'Today, 8:30 AM',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'success',
    },
    {
      id: 'sec-3',
      action: 'Data exported',
      timestamp: 'Yesterday, 3:00 PM',
      ipAddress: '192.168.1.101',
      device: 'Safari on iPhone',
      status: 'success',
    },
    {
      id: 'sec-4',
      action: 'Failed login attempt',
      timestamp: 'Yesterday, 2:00 PM',
      ipAddress: '203.0.113.45',
      device: 'Unknown',
      status: 'failed',
    },
  ];
}

export function generateAccessLogs(): AccessLog[] {
  return [
    {
      id: 'access-1',
      guardian: 'Avery Gray',
      timestamp: 'Today, 3:00 PM',
      dataAccessed: 'Medical files, Medications',
      duration: '5 minutes',
    },
    {
      id: 'access-2',
      guardian: 'Sophie Falcone',
      timestamp: 'Today, 1:30 PM',
      dataAccessed: 'Trigger patterns, Strategy effectiveness',
      duration: '10 minutes',
    },
    {
      id: 'access-3',
      guardian: 'Kai Azer',
      timestamp: 'Yesterday, 6:00 PM',
      dataAccessed: 'Status, Alerts',
      duration: '3 minutes',
    },
    {
      id: 'access-4',
      guardian: 'Scarlet White',
      timestamp: '2 days ago, 10:00 AM',
      dataAccessed: 'Status only',
      duration: '2 minutes',
    },
  ];
}
