// Therapist collaboration and data sharing
export interface TherapistNote {
  id: string;
  therapistName: string;
  date: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
}

export interface SharedData {
  id: string;
  dataType: 'metrics' | 'medications' | 'alerts' | 'notes';
  sharedWith: string;
  sharedDate: string;
  expiresDate?: string;
  accessLevel: 'view' | 'edit';
}

export function shareDataWithTherapist(
  therapistEmail: string,
  dataType: 'metrics' | 'medications' | 'alerts' | 'notes',
  expiresInDays?: number
): Promise<SharedData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        dataType,
        sharedWith: therapistEmail,
        sharedDate: new Date().toISOString(),
        expiresDate: expiresInDays
          ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        accessLevel: 'view',
      });
    }, 1000);
  });
}

export function getTherapistNotes(): TherapistNote[] {
  return [
    {
      id: '1',
      therapistName: 'Dr. Sarah Johnson',
      date: '2024-02-01',
      content: 'Violet showed good progress with breathing exercises. Continue daily practice.',
      tags: ['breathing', 'progress', 'exercises'],
      isPrivate: false,
    },
    {
      id: '2',
      therapistName: 'Dr. Sarah Johnson',
      date: '2024-01-25',
      content: 'Discussed new coping strategies. Violet is responsive to treatment.',
      tags: ['coping', 'treatment', 'progress'],
      isPrivate: false,
    },
  ];
}

export function addTherapistNote(content: string, tags: string[]): TherapistNote {
  return {
    id: Math.random().toString(36).substr(2, 9),
    therapistName: 'Dr. Sarah Johnson',
    date: new Date().toISOString().split('T')[0],
    content,
    tags,
    isPrivate: false,
  };
}

export function revokeTherapistAccess(therapistEmail: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Access revoked for ${therapistEmail}`);
      resolve(true);
    }, 500);
  });
}

export function getSharedDataHistory(): SharedData[] {
  return [
    {
      id: '1',
      dataType: 'metrics',
      sharedWith: 'dr.johnson@therapy.com',
      sharedDate: '2024-02-01',
      expiresDate: '2024-03-01',
      accessLevel: 'view',
    },
    {
      id: '2',
      dataType: 'medications',
      sharedWith: 'dr.johnson@therapy.com',
      sharedDate: '2024-01-25',
      accessLevel: 'view',
    },
  ];
}
