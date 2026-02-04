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
