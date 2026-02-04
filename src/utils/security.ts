// Security and compliance utilities

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  sessionTimeout: number; // minutes
  ipWhitelist: string[];
  encryptionEnabled: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed';
}

export interface DataAccessLog {
  id: string;
  guardianId: string;
  guardianName: string;
  dataType: string;
  timestamp: Date;
  action: 'view' | 'download' | 'export';
}

export interface ComplianceStatus {
  gdprCompliant: boolean;
  hipaaCompliant: boolean;
  ccpaCompliant: boolean;
  dataRetentionDays: number;
  lastAudit: Date;
}

export const defaultSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  biometricEnabled: false,
  sessionTimeout: 30,
  ipWhitelist: [],
  encryptionEnabled: true,
};

export const defaultComplianceStatus: ComplianceStatus = {
  gdprCompliant: true,
  hipaaCompliant: true,
  ccpaCompliant: true,
  dataRetentionDays: 2555, // 7 years
  lastAudit: new Date(),
};

export function logActivity(
  action: string,
  userId: string,
  status: 'success' | 'failed',
  ipAddress?: string
): ActivityLog {
  return {
    id: `activity-${Date.now()}`,
    action,
    timestamp: new Date(),
    userId,
    ipAddress,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    status,
  };
}

export function logDataAccess(
  guardianId: string,
  guardianName: string,
  dataType: string,
  action: 'view' | 'download' | 'export'
): DataAccessLog {
  return {
    id: `access-${Date.now()}`,
    guardianId,
    guardianName,
    dataType,
    timestamp: new Date(),
    action,
  };
}

export function isSessionExpired(lastActivity: Date, timeoutMinutes: number): boolean {
  const now = new Date();
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins > timeoutMinutes;
}

export function validateIPAddress(ip: string, whitelist: string[]): boolean {
  if (whitelist.length === 0) return true;
  return whitelist.includes(ip);
}

export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function verifyTwoFactorCode(code: string, expectedCode: string): boolean {
  return code === expectedCode;
}

export function encryptData(data: string, key: string): string {
  // Mock encryption - in production use proper encryption library
  return Buffer.from(data).toString('base64');
}

export function decryptData(encrypted: string, key: string): string {
  // Mock decryption - in production use proper encryption library
  return Buffer.from(encrypted, 'base64').toString('utf-8');
}

export function generateDataDeletionReport(
  guardianId: string,
  dataTypes: string[]
): {
  requestId: string;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed';
  dataTypes: string[];
} {
  return {
    requestId: `delete-${Date.now()}`,
    timestamp: new Date(),
    status: 'pending',
    dataTypes,
  };
}

export function getComplianceReport(status: ComplianceStatus): string {
  const report = `
COMPLIANCE REPORT
================
GDPR Compliant: ${status.gdprCompliant ? '✓' : '✗'}
HIPAA Compliant: ${status.hipaaCompliant ? '✓' : '✗'}
CCPA Compliant: ${status.ccpaCompliant ? '✓' : '✗'}
Data Retention: ${status.dataRetentionDays} days
Last Audit: ${status.lastAudit.toLocaleDateString()}
  `;
  return report;
}

export function getActivitySummary(logs: ActivityLog[]): {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  successRate: number;
} {
  const successful = logs.filter((l) => l.status === 'success').length;
  const failed = logs.filter((l) => l.status === 'failed').length;
  const total = logs.length;

  return {
    totalActions: total,
    successfulActions: successful,
    failedActions: failed,
    successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
  };
}
