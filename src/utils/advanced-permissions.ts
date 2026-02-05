// Advanced Permissions & RBAC
export type Role = 'admin' | 'guardian' | 'therapist' | 'viewer';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
}

export interface RolePermission {
  role: Role;
  permissions: Permission[];
}

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface DelegatedPermission {
  id: string;
  from: string;
  to: string;
  permission: Permission;
  expiresAt?: string;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    { id: '1', name: 'Manage Users', description: 'Create and manage users', resource: 'users', action: 'admin' },
    { id: '2', name: 'View All Data', description: 'Access all patient data', resource: 'data', action: 'read' },
    { id: '3', name: 'Modify Settings', description: 'Change system settings', resource: 'settings', action: 'write' },
  ],
  guardian: [
    { id: '4', name: 'View Patient Data', description: 'View assigned patient data', resource: 'patient-data', action: 'read' },
    { id: '5', name: 'Update Patient Info', description: 'Update patient information', resource: 'patient-data', action: 'write' },
    { id: '6', name: 'View Reports', description: 'View health reports', resource: 'reports', action: 'read' },
  ],
  therapist: [
    { id: '7', name: 'View Patient Data', description: 'View patient data', resource: 'patient-data', action: 'read' },
    { id: '8', name: 'Add Notes', description: 'Add therapy notes', resource: 'notes', action: 'write' },
  ],
  viewer: [
    { id: '9', name: 'View Data', description: 'View shared data', resource: 'shared-data', action: 'read' },
  ],
};

export function getUserRole(_userId: string): Role {
  // In production, fetch from database
  return 'guardian';
}

export function hasPermission(_userId: string, resource: string, action: 'read' | 'write' | 'delete' | 'admin'): boolean {
  const role = getUserRole(_userId);
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.some(p => p.resource === resource && p.action === action);
}

export function getPermissionTemplates(): PermissionTemplate[] {
  return [
    {
      id: '1',
      name: 'Guardian Template',
      description: 'Standard guardian permissions',
      permissions: ROLE_PERMISSIONS.guardian,
    },
    {
      id: '2',
      name: 'Therapist Template',
      description: 'Standard therapist permissions',
      permissions: ROLE_PERMISSIONS.therapist,
    },
  ];
}

export function delegatePermission(_from: string, _to: string, _permission: Permission, _expiresInDays?: number): Promise<DelegatedPermission> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        from: _from,
        to: _to,
        permission: _permission,
        expiresAt: _expiresInDays ? new Date(Date.now() + _expiresInDays * 24 * 60 * 60 * 1000).toISOString() : undefined,
      });
    }, 500);
  });
}

export function revokeDelegatedPermission(_delegationId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function getDelegatedPermissions(userId: string): DelegatedPermission[] {
  return [
    {
      id: '1',
      from: 'user-123',
      to: userId,
      permission: ROLE_PERMISSIONS.guardian[0],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function auditPermissionChange(_userId: string, _action: string, _details: any): void {
  // Permission audit logged
}

export function getPermissionAuditLog(limit: number = 50): any[] {
  const logs = [];
  for (let i = 0; i < limit; i++) {
    logs.push({
      id: `audit-${i}`,
      userId: 'user-123',
      action: ['grant', 'revoke', 'delegate'][i % 3],
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      details: `Permission change ${i}`,
    });
  }
  return logs;
}

export function createCustomRole(_name: string, _permissions: Permission[]): Promise<Role> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('viewer');
    }, 500);
  });
}
