// Emergency contact management
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  protocols: string[];
}

export interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  steps: string[];
  contacts: string[];
  isActive: boolean;
}

export function getEmergencyContacts(): EmergencyContact[] {
  return [
    {
      id: '1',
      name: 'Avery Gray',
      phone: '+1 (555) 123-4567',
      relationship: 'Mother',
      isPrimary: true,
      protocols: ['immediate-call', 'send-location'],
    },
    {
      id: '2',
      name: 'Kai Azer',
      phone: '+1 (555) 234-5678',
      relationship: 'Father',
      isPrimary: false,
      protocols: ['immediate-call'],
    },
    {
      id: '3',
      name: 'Emergency Services',
      phone: '911',
      relationship: 'Emergency',
      isPrimary: false,
      protocols: ['emergency-call'],
    },
  ];
}

export function getEmergencyProtocols(): EmergencyProtocol[] {
  return [
    {
      id: '1',
      name: 'Immediate Alert',
      description: 'Contact primary guardian immediately',
      steps: [
        'Call primary guardian',
        'Send location',
        'Activate emergency mode',
        'Send alert to secondary contacts',
      ],
      contacts: ['Avery Gray'],
      isActive: true,
    },
    {
      id: '2',
      name: 'Crisis Protocol',
      description: 'Full emergency response',
      steps: [
        'Call emergency services',
        'Contact all guardians',
        'Send location to all contacts',
        'Activate emergency mode',
        'Log incident',
      ],
      contacts: ['Emergency Services', 'Avery Gray', 'Kai Azer'],
      isActive: true,
    },
  ];
}

export function callEmergencyContact(contactId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function sendEmergencyAlert(message: string, contactIds: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export function activateEmergencyProtocol(protocolId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): EmergencyContact {
  return {
    ...contact,
    id: Math.random().toString(36).substr(2, 9),
  };
}

export function updateEmergencyContact(id: string, updates: Partial<EmergencyContact>): EmergencyContact {
  return {
    id,
    name: updates.name || 'Contact',
    phone: updates.phone || '',
    relationship: updates.relationship || '',
    isPrimary: updates.isPrimary || false,
    protocols: updates.protocols || [],
  };
}
