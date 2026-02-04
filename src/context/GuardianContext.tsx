'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface GuardianPermissions {
  see_status: boolean;
  see_alerts: boolean;
  see_trends: boolean;
  see_medical: boolean;
  trigger_emergency: boolean;
  suggest_strategies: boolean;
  access_mic: boolean;
  access_camera: boolean;
}

export interface GuardianSession {
  guardianId: string;
  guardianName: string;
  guardianEmail: string;
  relationship: 'parent' | 'therapist' | 'teacher';
  patientId: string;
  patientName: string;
  patientAge: number;
  permissions: GuardianPermissions;
  isAuthenticated: boolean;
}

interface GuardianContextType {
  session: GuardianSession | null;
  setSession: (session: GuardianSession | null) => void;
  hasPermission: (permission: keyof GuardianPermissions) => boolean;
  logout: () => void;
}

const GuardianContext = createContext<GuardianContextType | undefined>(undefined);

export function GuardianProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = React.useState<GuardianSession | null>(null);

  const hasPermission = (permission: keyof GuardianPermissions): boolean => {
    if (!session) return false;
    return session.permissions[permission] === true;
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <GuardianContext.Provider value={{ session, setSession, hasPermission, logout }}>
      {children}
    </GuardianContext.Provider>
  );
}

export function useGuardianContext() {
  const context = useContext(GuardianContext);
  if (context === undefined) {
    throw new Error('useGuardianContext must be used within GuardianProvider');
  }
  return context;
}
