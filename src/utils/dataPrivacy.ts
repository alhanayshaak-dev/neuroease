/**
 * Data privacy and access control utilities
 * Manages data retention, export, deletion, and access control
 */

export type DataRetentionPeriod = '30days' | '90days' | '1year' | 'indefinite';

export interface DataRetentionSettings {
  retention_period: DataRetentionPeriod;
  auto_delete_enabled: boolean;
  last_updated: string;
}

export interface AccessLog {
  id: string;
  accessor_id: string;
  accessor_name: string;
  accessor_role: 'guardian' | 'therapist' | 'teacher' | 'system';
  access_type: 'view' | 'export' | 'delete' | 'modify';
  data_type: string;
  timestamp: string;
  ip_address?: string;
}

export interface DataExportRequest {
  id: string;
  requested_at: string;
  export_format: 'json' | 'csv' | 'pdf';
  data_types: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  expires_at?: string;
}

export interface DataDeletionRequest {
  id: string;
  requested_at: string;
  data_types: string[];
  reason?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completed_at?: string;
}

export interface PrivacySettings {
  data_retention: DataRetentionSettings;
  ai_access_enabled: boolean;
  guardian_access_enabled: boolean;
  therapist_access_enabled: boolean;
  analytics_enabled: boolean;
  marketing_emails_enabled: boolean;
  research_participation_enabled: boolean;
}

export interface PrivacyDashboard {
  privacy_settings: PrivacySettings;
  access_logs: AccessLog[];
  data_export_requests: DataExportRequest[];
  data_deletion_requests: DataDeletionRequest[];
  total_data_size_mb: number;
  last_access: string;
  last_export: string;
  last_deletion: string;
}

/**
 * Get retention period in days
 */
export function getRetentionPeriodDays(period: DataRetentionPeriod): number {
  switch (period) {
    case '30days':
      return 30;
    case '90days':
      return 90;
    case '1year':
      return 365;
    case 'indefinite':
      return Infinity;
  }
}

/**
 * Get retention period label
 */
export function getRetentionPeriodLabel(period: DataRetentionPeriod): string {
  switch (period) {
    case '30days':
      return '30 Days';
    case '90days':
      return '90 Days';
    case '1year':
      return '1 Year';
    case 'indefinite':
      return 'Indefinite';
  }
}

/**
 * Calculate data deletion date
 */
export function calculateDeletionDate(
  createdAt: string,
  retentionPeriod: DataRetentionPeriod
): string | null {
  const days = getRetentionPeriodDays(retentionPeriod);
  if (days === Infinity) return null;

  const createdDate = new Date(createdAt);
  const deletionDate = new Date(createdDate.getTime() + days * 24 * 60 * 60 * 1000);
  return deletionDate.toISOString();
}

/**
 * Check if data should be deleted
 */
export function shouldDataBeDeleted(
  createdAt: string,
  retentionPeriod: DataRetentionPeriod
): boolean {
  const deletionDate = calculateDeletionDate(createdAt, retentionPeriod);
  if (!deletionDate) return false;

  const now = new Date();
  return now > new Date(deletionDate);
}

/**
 * Create data export request
 */
export function createDataExportRequest(
  format: 'json' | 'csv' | 'pdf',
  dataTypes: string[]
): DataExportRequest {
  return {
    id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    requested_at: new Date().toISOString(),
    export_format: format,
    data_types: dataTypes,
    status: 'pending',
  };
}

/**
 * Create data deletion request
 */
export function createDataDeletionRequest(
  dataTypes: string[],
  reason?: string
): DataDeletionRequest {
  return {
    id: `delete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    requested_at: new Date().toISOString(),
    data_types: dataTypes,
    reason,
    status: 'pending',
  };
}

/**
 * Log data access
 */
export function logDataAccess(
  accessorId: string,
  accessorName: string,
  accessorRole: 'guardian' | 'therapist' | 'teacher' | 'system',
  accessType: 'view' | 'export' | 'delete' | 'modify',
  dataType: string,
  ipAddress?: string
): AccessLog {
  return {
    id: `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    accessor_id: accessorId,
    accessor_name: accessorName,
    accessor_role: accessorRole,
    access_type: accessType,
    data_type: dataType,
    timestamp: new Date().toISOString(),
    ip_address: ipAddress,
  };
}

/**
 * Get access logs for a specific time period
 */
export function getAccessLogsForPeriod(
  logs: AccessLog[],
  days: number
): AccessLog[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return logs.filter((log) => new Date(log.timestamp) >= cutoffDate);
}

/**
 * Get access logs by accessor role
 */
export function getAccessLogsByRole(
  logs: AccessLog[],
  role: 'guardian' | 'therapist' | 'teacher' | 'system'
): AccessLog[] {
  return logs.filter((log) => log.accessor_role === role);
}

/**
 * Get access logs by access type
 */
export function getAccessLogsByType(
  logs: AccessLog[],
  accessType: 'view' | 'export' | 'delete' | 'modify'
): AccessLog[] {
  return logs.filter((log) => log.access_type === accessType);
}

/**
 * Calculate total data size
 */
export function calculateTotalDataSize(
  sensorDataPoints: number,
  medicationLogs: number,
  appointmentRecords: number,
  medicalFiles: number
): number {
  // Rough estimates in bytes
  const sensorDataSize = sensorDataPoints * 200; // ~200 bytes per data point
  const medicationSize = medicationLogs * 100; // ~100 bytes per log
  const appointmentSize = appointmentRecords * 500; // ~500 bytes per record
  const medicalFileSize = medicalFiles * 1024 * 1024; // ~1MB per file

  return (sensorDataSize + medicationSize + appointmentSize + medicalFileSize) / (1024 * 1024); // Convert to MB
}

/**
 * Get privacy summary
 */
export function getPrivacySummary(dashboard: PrivacyDashboard): string {
  const enabledFeatures = [];
  if (dashboard.privacy_settings.ai_access_enabled) enabledFeatures.push('AI Analysis');
  if (dashboard.privacy_settings.guardian_access_enabled) enabledFeatures.push('Guardian Access');
  if (dashboard.privacy_settings.therapist_access_enabled) enabledFeatures.push('Therapist Access');
  if (dashboard.privacy_settings.analytics_enabled) enabledFeatures.push('Analytics');
  if (dashboard.privacy_settings.research_participation_enabled) enabledFeatures.push('Research');

  const retentionLabel = getRetentionPeriodLabel(
    dashboard.privacy_settings.data_retention.retention_period
  );

  return `Your data is retained for ${retentionLabel}. Currently enabled: ${enabledFeatures.join(', ') || 'None'}. Total data size: ${dashboard.total_data_size_mb.toFixed(2)}MB.`;
}

/**
 * Validate privacy settings
 */
export function validatePrivacySettings(settings: PrivacySettings): string[] {
  const errors: string[] = [];

  if (!settings.data_retention) {
    errors.push('Data retention settings are required');
  }

  if (
    settings.ai_access_enabled &&
    !settings.analytics_enabled
  ) {
    errors.push('Analytics must be enabled for AI access');
  }

  return errors;
}
