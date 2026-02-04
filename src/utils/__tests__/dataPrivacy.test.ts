/**
 * Unit tests for data privacy utilities
 */

import {
  getRetentionPeriodDays,
  getRetentionPeriodLabel,
  calculateDeletionDate,
  shouldDataBeDeleted,
  createDataExportRequest,
  createDataDeletionRequest,
  logDataAccess,
  getAccessLogsForPeriod,
  getAccessLogsByRole,
  getAccessLogsByType,
  calculateTotalDataSize,
  getPrivacySummary,
  validatePrivacySettings,
} from '../dataPrivacy';

describe('Data Privacy Utilities', () => {
  describe('getRetentionPeriodDays', () => {
    it('should return correct days for 30days', () => {
      expect(getRetentionPeriodDays('30days')).toBe(30);
    });

    it('should return correct days for 90days', () => {
      expect(getRetentionPeriodDays('90days')).toBe(90);
    });

    it('should return correct days for 1year', () => {
      expect(getRetentionPeriodDays('1year')).toBe(365);
    });

    it('should return Infinity for indefinite', () => {
      expect(getRetentionPeriodDays('indefinite')).toBe(Infinity);
    });
  });

  describe('getRetentionPeriodLabel', () => {
    it('should return correct label for 30days', () => {
      expect(getRetentionPeriodLabel('30days')).toBe('30 Days');
    });

    it('should return correct label for 90days', () => {
      expect(getRetentionPeriodLabel('90days')).toBe('90 Days');
    });

    it('should return correct label for 1year', () => {
      expect(getRetentionPeriodLabel('1year')).toBe('1 Year');
    });

    it('should return correct label for indefinite', () => {
      expect(getRetentionPeriodLabel('indefinite')).toBe('Indefinite');
    });
  });

  describe('calculateDeletionDate', () => {
    it('should calculate deletion date for 30days', () => {
      const createdAt = '2024-01-01T00:00:00Z';
      const result = calculateDeletionDate(createdAt, '30days');
      expect(result).toMatch(/2024-01-31T00:00:00/);
    });

    it('should return null for indefinite retention', () => {
      const createdAt = '2024-01-01T00:00:00Z';
      const result = calculateDeletionDate(createdAt, 'indefinite');
      expect(result).toBeNull();
    });

    it('should calculate deletion date for 90days', () => {
      const createdAt = '2024-01-01T00:00:00Z';
      const result = calculateDeletionDate(createdAt, '90days');
      expect(result).toMatch(/2024-03-31T00:00:00/);
    });
  });

  describe('shouldDataBeDeleted', () => {
    it('should return false for recent data', () => {
      const now = new Date();
      const createdAt = now.toISOString();
      const result = shouldDataBeDeleted(createdAt, '30days');
      expect(result).toBe(false);
    });

    it('should return true for old data', () => {
      const old = new Date();
      old.setDate(old.getDate() - 40);
      const createdAt = old.toISOString();
      const result = shouldDataBeDeleted(createdAt, '30days');
      expect(result).toBe(true);
    });

    it('should return false for indefinite retention', () => {
      const old = new Date();
      old.setDate(old.getDate() - 400);
      const createdAt = old.toISOString();
      const result = shouldDataBeDeleted(createdAt, 'indefinite');
      expect(result).toBe(false);
    });
  });

  describe('createDataExportRequest', () => {
    it('should create export request with correct properties', () => {
      const result = createDataExportRequest('json', ['sensor_data', 'medications']);

      expect(result.id).toBeDefined();
      expect(result.export_format).toBe('json');
      expect(result.data_types).toEqual(['sensor_data', 'medications']);
      expect(result.status).toBe('pending');
      expect(result.requested_at).toBeDefined();
    });

    it('should create unique IDs', () => {
      const result1 = createDataExportRequest('json', []);
      const result2 = createDataExportRequest('json', []);

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('createDataDeletionRequest', () => {
    it('should create deletion request with correct properties', () => {
      const result = createDataDeletionRequest(['sensor_data'], 'User requested');

      expect(result.id).toBeDefined();
      expect(result.data_types).toEqual(['sensor_data']);
      expect(result.reason).toBe('User requested');
      expect(result.status).toBe('pending');
      expect(result.requested_at).toBeDefined();
    });

    it('should create deletion request without reason', () => {
      const result = createDataDeletionRequest(['sensor_data']);

      expect(result.reason).toBeUndefined();
    });
  });

  describe('logDataAccess', () => {
    it('should create access log with correct properties', () => {
      const result = logDataAccess(
        'user_1',
        'John Doe',
        'guardian',
        'view',
        'sensor_data',
        '192.168.1.1'
      );

      expect(result.id).toBeDefined();
      expect(result.accessor_id).toBe('user_1');
      expect(result.accessor_name).toBe('John Doe');
      expect(result.accessor_role).toBe('guardian');
      expect(result.access_type).toBe('view');
      expect(result.data_type).toBe('sensor_data');
      expect(result.ip_address).toBe('192.168.1.1');
      expect(result.timestamp).toBeDefined();
    });

    it('should create access log without IP address', () => {
      const result = logDataAccess('user_1', 'John Doe', 'therapist', 'export', 'medications');

      expect(result.ip_address).toBeUndefined();
    });
  });

  describe('getAccessLogsForPeriod', () => {
    it('should return logs from the last N days', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const logs = [
        {
          id: '1',
          accessor_id: 'user_1',
          accessor_name: 'John',
          accessor_role: 'guardian' as const,
          access_type: 'view' as const,
          data_type: 'sensor_data',
          timestamp: now.toISOString(),
        },
        {
          id: '2',
          accessor_id: 'user_2',
          accessor_name: 'Jane',
          accessor_role: 'therapist' as const,
          access_type: 'export' as const,
          data_type: 'medications',
          timestamp: yesterday.toISOString(),
        },
        {
          id: '3',
          accessor_id: 'user_3',
          accessor_name: 'Bob',
          accessor_role: 'teacher' as const,
          access_type: 'view' as const,
          data_type: 'appointments',
          timestamp: weekAgo.toISOString(),
        },
      ];

      const result = getAccessLogsForPeriod(logs, 3);
      expect(result.length).toBe(2);
    });
  });

  describe('getAccessLogsByRole', () => {
    it('should filter logs by role', () => {
      const logs = [
        {
          id: '1',
          accessor_id: 'user_1',
          accessor_name: 'John',
          accessor_role: 'guardian' as const,
          access_type: 'view' as const,
          data_type: 'sensor_data',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          accessor_id: 'user_2',
          accessor_name: 'Jane',
          accessor_role: 'therapist' as const,
          access_type: 'export' as const,
          data_type: 'medications',
          timestamp: new Date().toISOString(),
        },
      ];

      const result = getAccessLogsByRole(logs, 'guardian');
      expect(result.length).toBe(1);
      expect(result[0].accessor_role).toBe('guardian');
    });
  });

  describe('getAccessLogsByType', () => {
    it('should filter logs by access type', () => {
      const logs = [
        {
          id: '1',
          accessor_id: 'user_1',
          accessor_name: 'John',
          accessor_role: 'guardian' as const,
          access_type: 'view' as const,
          data_type: 'sensor_data',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          accessor_id: 'user_2',
          accessor_name: 'Jane',
          accessor_role: 'therapist' as const,
          access_type: 'export' as const,
          data_type: 'medications',
          timestamp: new Date().toISOString(),
        },
      ];

      const result = getAccessLogsByType(logs, 'export');
      expect(result.length).toBe(1);
      expect(result[0].access_type).toBe('export');
    });
  });

  describe('calculateTotalDataSize', () => {
    it('should calculate total data size in MB', () => {
      const result = calculateTotalDataSize(1000, 100, 50, 5);
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for no data', () => {
      const result = calculateTotalDataSize(0, 0, 0, 0);
      expect(result).toBe(0);
    });

    it('should account for medical files', () => {
      const result1 = calculateTotalDataSize(1000, 100, 50, 0);
      const result2 = calculateTotalDataSize(1000, 100, 50, 10);
      expect(result2).toBeGreaterThan(result1);
    });
  });

  describe('getPrivacySummary', () => {
    it('should generate privacy summary', () => {
      const dashboard = {
        privacy_settings: {
          data_retention: {
            retention_period: '30days' as const,
            auto_delete_enabled: true,
            last_updated: new Date().toISOString(),
          },
          ai_access_enabled: true,
          guardian_access_enabled: true,
          therapist_access_enabled: false,
          analytics_enabled: true,
          marketing_emails_enabled: false,
          research_participation_enabled: false,
        },
        access_logs: [],
        data_export_requests: [],
        data_deletion_requests: [],
        total_data_size_mb: 50,
        last_access: new Date().toISOString(),
        last_export: new Date().toISOString(),
        last_deletion: new Date().toISOString(),
      };

      const result = getPrivacySummary(dashboard);
      expect(result).toContain('30 Days');
      expect(result).toContain('AI Analysis');
      expect(result).toContain('50.00MB');
    });
  });

  describe('validatePrivacySettings', () => {
    it('should validate correct settings', () => {
      const settings = {
        data_retention: {
          retention_period: '30days' as const,
          auto_delete_enabled: true,
          last_updated: new Date().toISOString(),
        },
        ai_access_enabled: false,
        guardian_access_enabled: true,
        therapist_access_enabled: false,
        analytics_enabled: true,
        marketing_emails_enabled: false,
        research_participation_enabled: false,
      };

      const result = validatePrivacySettings(settings);
      expect(result.length).toBe(0);
    });

    it('should detect missing data retention', () => {
      const settings = {
        data_retention: null as any,
        ai_access_enabled: false,
        guardian_access_enabled: true,
        therapist_access_enabled: false,
        analytics_enabled: true,
        marketing_emails_enabled: false,
        research_participation_enabled: false,
      };

      const result = validatePrivacySettings(settings);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should detect AI access without analytics', () => {
      const settings = {
        data_retention: {
          retention_period: '30days' as const,
          auto_delete_enabled: true,
          last_updated: new Date().toISOString(),
        },
        ai_access_enabled: true,
        guardian_access_enabled: true,
        therapist_access_enabled: false,
        analytics_enabled: false,
        marketing_emails_enabled: false,
        research_participation_enabled: false,
      };

      const result = validatePrivacySettings(settings);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
