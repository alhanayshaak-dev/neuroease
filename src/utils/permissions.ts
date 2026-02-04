import { Database } from '@/types/database';

export type GuardianPermissions = Database['public']['Tables']['guardians']['Row']['permissions'];

/**
 * Validates that a permissions object has all required fields
 */
export function validatePermissions(permissions: any): permissions is GuardianPermissions {
  if (!permissions || typeof permissions !== 'object') {
    return false;
  }

  const requiredKeys: (keyof GuardianPermissions)[] = [
    'see_status',
    'see_alerts',
    'see_trends',
    'see_medical',
    'trigger_emergency',
    'suggest_strategies',
    'access_mic',
    'access_camera',
  ];

  return requiredKeys.every(
    (key) => key in permissions && typeof permissions[key] === 'boolean'
  );
}

/**
 * Creates default permissions for a new guardian
 */
export function createDefaultPermissions(): GuardianPermissions {
  return {
    see_status: true,
    see_alerts: true,
    see_trends: false,
    see_medical: false,
    trigger_emergency: false,
    suggest_strategies: false,
    access_mic: false,
    access_camera: false,
  };
}

/**
 * Checks if a guardian has a specific permission
 */
export function hasPermission(
  permissions: GuardianPermissions,
  permission: keyof GuardianPermissions
): boolean {
  return permissions[permission] === true;
}

/**
 * Merges partial permissions with existing permissions
 */
export function mergePermissions(
  existing: GuardianPermissions,
  partial: Partial<GuardianPermissions>
): GuardianPermissions {
  return {
    ...existing,
    ...partial,
  };
}

/**
 * Gets all permissions that are currently enabled
 */
export function getEnabledPermissions(
  permissions: GuardianPermissions
): (keyof GuardianPermissions)[] {
  return (Object.keys(permissions) as (keyof GuardianPermissions)[]).filter(
    (key) => permissions[key] === true
  );
}

/**
 * Gets all permissions that are currently disabled
 */
export function getDisabledPermissions(
  permissions: GuardianPermissions
): (keyof GuardianPermissions)[] {
  return (Object.keys(permissions) as (keyof GuardianPermissions)[]).filter(
    (key) => permissions[key] === false
  );
}
