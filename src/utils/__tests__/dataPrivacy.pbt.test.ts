/**
 * Property-based tests for data privacy utilities
 * **Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6**
 */

import fc from 'fast-check';
import {
  getRetentionPeriodDays,
  calculateDeletionDate,
  shouldDataBeDeleted,
  createDataExportRequest,
  createDataDeletionRequest,
  logDataAccess,
  getAccessLogsForPeriod,
  getAccessLogsByRole,
  getAccessLogsByType,
  calculateTotalDataSize,
  validatePrivacySettings,
} from '../dataPrivacy';

describe('Data Privacy Property-Based Tests', () => {
  describe('Property 18: Data Privacy and Access Control', () => {
    it('should calculate retention period days correctly for any valid period', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('30days'),
            fc.constant('90days'),
            fc.constant('1year'),
            fc.constant('indefinite')
          ),
          (period) => {
            const days = getRetentionPeriodDays(period as any);

            // Days should be positive or Infinity
            expect(days).toBeGreaterThan(0);

            // Specific values should match
            if (period === '30days') expect(days).toBe(30);
            if (period === '90days') expect(days).toBe(90);
            if (period === '1year') expect(days).toBe(365);
            if (period === 'indefinite') expect(days).toBe(Infinity);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate deletion date correctly for any valid creation date and retention period', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2020-01-01'), max: new Date() }),
          fc.oneof(
            fc.constant('30days'),
            fc.constant('90days'),
            fc.constant('1year'),
            fc.constant('indefinite')
          ),
          (createdDate, period) => {
            const createdAt = createdDate.toISOString();
            const deletionDate = calculateDeletionDate(createdAt, period as any);

            if (period === 'indefinite') {
              expect(deletionDate).toBeNull();
            } else {
              expect(deletionDate).toBeDefined();
              expect(new Date(deletionDate!).getTime()).toBeGreaterThan(
                new Date(createdAt).getTime()
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly determine if data should be deleted for any date and retention period', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2020-01-01'), max: new Date() }),
          fc.oneof(
            fc.constant('30days'),
            fc.constant('90days'),
            fc.constant('1year'),
            fc.constant('indefinite')
          ),
          (createdDate, period) => {
            const createdAt = createdDate.toISOString();
            const shouldDelete = shouldDataBeDeleted(createdAt, period as any);

            // Should be a boolean
            expect(typeof shouldDelete).toBe('boolean');

            // If indefinite, should never delete
            if (period === 'indefinite') {
              expect(shouldDelete).toBe(false);
            }

            // If recent data, should not delete
            const now = new Date();
            if (new Date(createdAt).getTime() > now.getTime() - 24 * 60 * 60 * 1000) {
              expect(shouldDelete).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should create valid export requests for any format and data types', () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant('json'), fc.constant('csv'), fc.constant('pdf')),
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
          (format, dataTypes) => {
            const request = createDataExportRequest(format as any, dataTypes);

            // All required fields should be present
            expect(request.id).toBeDefined();
            expect(request.requested_at).toBeDefined();
            expect(request.export_format).toBe(format);
            expect(request.data_types).toEqual(dataTypes);
            expect(request.status).toBe('pending');

            // ID should be unique
            const request2 = createDataExportRequest(format as any, dataTypes);
            expect(request.id).not.toBe(request2.id);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should create valid deletion requests for any data types and reason', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
          fc.oneof(fc.constant(undefined), fc.string({ minLength: 1, maxLength: 100 })),
          (dataTypes, reason) => {
            const request = createDataDeletionRequest(dataTypes, reason);

            // All required fields should be present
            expect(request.id).toBeDefined();
            expect(request.requested_at).toBeDefined();
            expect(request.data_types).toEqual(dataTypes);
            expect(request.reason).toBe(reason);
            expect(request.status).toBe('pending');

            // ID should be unique
            const request2 = createDataDeletionRequest(dataTypes, reason);
            expect(request.id).not.toBe(request2.id);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should create valid access logs for any accessor and access type', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.oneof(
            fc.constant('guardian'),
            fc.constant('therapist'),
            fc.constant('teacher'),
            fc.constant('system')
          ),
          fc.oneof(
            fc.constant('view'),
            fc.constant('export'),
            fc.constant('delete'),
            fc.constant('modify')
          ),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.oneof(fc.constant(undefined), fc.string({ minLength: 7, maxLength: 15 })),
          (accessorId, accessorName, role, accessType, dataType, ipAddress) => {
            const log = logDataAccess(
              accessorId,
              accessorName,
              role as any,
              accessType as any,
              dataType,
              ipAddress
            );

            // All required fields should be present
            expect(log.id).toBeDefined();
            expect(log.accessor_id).toBe(accessorId);
            expect(log.accessor_name).toBe(accessorName);
            expect(log.accessor_role).toBe(role);
            expect(log.access_type).toBe(accessType);
            expect(log.data_type).toBe(dataType);
            expect(log.timestamp).toBeDefined();
            expect(log.ip_address).toBe(ipAddress);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should filter access logs correctly for any time period', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              accessor_id: fc.uuid(),
              accessor_name: fc.string({ minLength: 1, maxLength: 50 }),
              accessor_role: fc.oneof(
                fc.constant('guardian'),
                fc.constant('therapist'),
                fc.constant('teacher'),
                fc.constant('system')
              ),
              access_type: fc.oneof(
                fc.constant('view'),
                fc.constant('export'),
                fc.constant('delete'),
                fc.constant('modify')
              ),
              data_type: fc.string({ minLength: 1, maxLength: 50 }),
              timestamp: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map((d) =>
                d.toISOString()
              ),
            }),
            { minLength: 0, maxLength: 100 }
          ),
          fc.integer({ min: 1, max: 30 }),
          (logs, days) => {
            const result = getAccessLogsForPeriod(logs, days);

            // Result should be a subset of input
            expect(result.length).toBeLessThanOrEqual(logs.length);

            // All returned logs should be within the time period
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            for (const log of result) {
              expect(new Date(log.timestamp).getTime()).toBeGreaterThanOrEqual(
                cutoffDate.getTime()
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should filter access logs by role correctly for any role', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              accessor_id: fc.uuid(),
              accessor_name: fc.string({ minLength: 1, maxLength: 50 }),
              accessor_role: fc.oneof(
                fc.constant('guardian'),
                fc.constant('therapist'),
                fc.constant('teacher'),
                fc.constant('system')
              ),
              access_type: fc.oneof(
                fc.constant('view'),
                fc.constant('export'),
                fc.constant('delete'),
                fc.constant('modify')
              ),
              data_type: fc.string({ minLength: 1, maxLength: 50 }),
              timestamp: fc.date().map((d) => d.toISOString()),
            }),
            { minLength: 0, maxLength: 100 }
          ),
          fc.oneof(
            fc.constant('guardian'),
            fc.constant('therapist'),
            fc.constant('teacher'),
            fc.constant('system')
          ),
          (logs, role) => {
            const result = getAccessLogsByRole(logs, role as any);

            // All returned logs should have the specified role
            for (const log of result) {
              expect(log.accessor_role).toBe(role);
            }

            // Result should be a subset of input
            expect(result.length).toBeLessThanOrEqual(logs.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should filter access logs by type correctly for any access type', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              accessor_id: fc.uuid(),
              accessor_name: fc.string({ minLength: 1, maxLength: 50 }),
              accessor_role: fc.oneof(
                fc.constant('guardian'),
                fc.constant('therapist'),
                fc.constant('teacher'),
                fc.constant('system')
              ),
              access_type: fc.oneof(
                fc.constant('view'),
                fc.constant('export'),
                fc.constant('delete'),
                fc.constant('modify')
              ),
              data_type: fc.string({ minLength: 1, maxLength: 50 }),
              timestamp: fc.date().map((d) => d.toISOString()),
            }),
            { minLength: 0, maxLength: 100 }
          ),
          fc.oneof(
            fc.constant('view'),
            fc.constant('export'),
            fc.constant('delete'),
            fc.constant('modify')
          ),
          (logs, accessType) => {
            const result = getAccessLogsByType(logs, accessType as any);

            // All returned logs should have the specified access type
            for (const log of result) {
              expect(log.access_type).toBe(accessType);
            }

            // Result should be a subset of input
            expect(result.length).toBeLessThanOrEqual(logs.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate total data size correctly for any data quantities', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100000 }),
          fc.integer({ min: 0, max: 10000 }),
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 100 }),
          (sensorPoints, medLogs, appointments, files) => {
            const result = calculateTotalDataSize(sensorPoints, medLogs, appointments, files);

            // Result should be non-negative
            expect(result).toBeGreaterThanOrEqual(0);

            // Result should be a number
            expect(typeof result).toBe('number');

            // More data should result in larger size
            const result2 = calculateTotalDataSize(
              sensorPoints + 1000,
              medLogs,
              appointments,
              files
            );
            expect(result2).toBeGreaterThanOrEqual(result);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate privacy settings correctly for any settings', () => {
      fc.assert(
        fc.property(
          fc.record({
            data_retention: fc.record({
              retention_period: fc.oneof(
                fc.constant('30days'),
                fc.constant('90days'),
                fc.constant('1year'),
                fc.constant('indefinite')
              ),
              auto_delete_enabled: fc.boolean(),
              last_updated: fc.date().map((d) => d.toISOString()),
            }),
            ai_access_enabled: fc.boolean(),
            guardian_access_enabled: fc.boolean(),
            therapist_access_enabled: fc.boolean(),
            analytics_enabled: fc.boolean(),
            marketing_emails_enabled: fc.boolean(),
            research_participation_enabled: fc.boolean(),
          }),
          (settings) => {
            const errors = validatePrivacySettings(settings as any);

            // Errors should be an array
            expect(Array.isArray(errors)).toBe(true);

            // If AI access is enabled, analytics must be enabled
            if (settings.ai_access_enabled && !settings.analytics_enabled) {
              expect(errors.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
