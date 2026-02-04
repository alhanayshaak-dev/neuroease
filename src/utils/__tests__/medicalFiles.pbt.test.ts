import fc from 'fast-check';
import {
  serializeMedicalFile,
  deserializeMedicalFile,
  validateMedicalFile,
  areMedicalFilesEquivalent,
  extractMetadata,
  isAllowedFileType,
  isValidFileSize,
  createMedicalFile,
  type MedicalFile,
} from '../medicalFiles';

/**
 * Property 8: Medical File Round-Trip
 * **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**
 *
 * For any uploaded medical file, serializing then deserializing SHALL produce
 * equivalent file content and metadata.
 */
describe('Property 8: Medical File Round-Trip', () => {
  // Generator for medical file objects
  const medicalFileGen = fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => !s.includes('\0')),
    type: fc.constantFrom(
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ),
    size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
    uploadedAt: fc
      .date({ min: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), max: new Date() })
      .map((d) => d.toISOString()),
    url: fc.webUrl(),
    patientId: fc.option(fc.uuid()),
  });

  it('should serialize and deserialize medical files without data loss', () => {
    fc.assert(
      fc.property(medicalFileGen, (fileData) => {
        const file = fileData as MedicalFile;
        const serialized = serializeMedicalFile(file);
        const deserialized = deserializeMedicalFile(serialized);

        return areMedicalFilesEquivalent(file, deserialized);
      }),
      { numRuns: 100 }
    );
  });

  it('should produce valid JSON when serializing', () => {
    fc.assert(
      fc.property(medicalFileGen, (fileData) => {
        const file = fileData as MedicalFile;
        const serialized = serializeMedicalFile(file);

        try {
          JSON.parse(serialized);
          return true;
        } catch {
          return false;
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve all metadata fields through round-trip', () => {
    fc.assert(
      fc.property(medicalFileGen, (fileData) => {
        const file = fileData as MedicalFile;
        const serialized = serializeMedicalFile(file);
        const deserialized = deserializeMedicalFile(serialized);

        return (
          file.id === deserialized.id &&
          file.name === deserialized.name &&
          file.type === deserialized.type &&
          file.size === deserialized.size &&
          file.uploadedAt === deserialized.uploadedAt &&
          file.url === deserialized.url &&
          file.patientId === deserialized.patientId
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should validate files after deserialization', () => {
    fc.assert(
      fc.property(medicalFileGen, (fileData) => {
        const file = fileData as MedicalFile;
        const serialized = serializeMedicalFile(file);
        const deserialized = deserializeMedicalFile(serialized);

        return validateMedicalFile(deserialized);
      }),
      { numRuns: 100 }
    );
  });

  it('should extract metadata consistently', () => {
    fc.assert(
      fc.property(medicalFileGen, (fileData) => {
        const file = fileData as MedicalFile;
        const metadata1 = extractMetadata(file);
        const metadata2 = extractMetadata(file);

        return (
          metadata1.id === metadata2.id &&
          metadata1.name === metadata2.name &&
          metadata1.type === metadata2.type &&
          metadata1.size === metadata2.size &&
          metadata1.uploadedAt === metadata2.uploadedAt
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should handle files with special characters in names', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          type: fc.constantFrom('application/pdf', 'image/jpeg'),
          size: fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
          uploadedAt: fc.date().map((d) => d.toISOString()),
          url: fc.webUrl(),
          patientId: fc.option(fc.uuid()),
        }),
        (fileData) => {
          const file = fileData as MedicalFile;
          const serialized = serializeMedicalFile(file);
          const deserialized = deserializeMedicalFile(serialized);

          return file.name === deserialized.name;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate allowed file types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ),
        (type) => {
          return isAllowedFileType(type);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject disallowed file types', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.char()).filter(
          (s) =>
            ![
              'application/pdf',
              'image/jpeg',
              'image/png',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ].includes(s) && s.length > 0
        ),
        (type) => {
          return !isAllowedFileType(type);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate file sizes within limits', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 * 1024 * 1024 }), (size) => {
        return isValidFileSize(size);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject files exceeding size limit', () => {
    fc.assert(
      fc.property(fc.integer({ min: 10 * 1024 * 1024 + 1, max: 100 * 1024 * 1024 }), (size) => {
        return !isValidFileSize(size);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject zero-sized files', () => {
    expect(isValidFileSize(0)).toBe(false);
  });

  it('should create valid medical files', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom('application/pdf', 'image/jpeg'),
        fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
        fc.date().map((d) => d.toISOString()),
        fc.webUrl(),
        fc.option(fc.uuid()),
        (id, name, type, size, uploadedAt, url, patientId) => {
          const file = createMedicalFile(id, name, type, size, uploadedAt, url, patientId);
          return validateMedicalFile(file);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle round-trip with optional patientId', () => {
    fc.assert(
      fc.property(
        medicalFileGen,
        fc.option(fc.uuid()),
        (fileData, patientId) => {
          const file = { ...fileData, patientId } as MedicalFile;
          const serialized = serializeMedicalFile(file);
          const deserialized = deserializeMedicalFile(serialized);

          return file.patientId === deserialized.patientId;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain file equivalence after multiple round-trips', () => {
    fc.assert(
      fc.property(medicalFileGen, (fileData) => {
        const file = fileData as MedicalFile;

        // First round-trip
        let serialized = serializeMedicalFile(file);
        let deserialized = deserializeMedicalFile(serialized);

        // Second round-trip
        serialized = serializeMedicalFile(deserialized);
        deserialized = deserializeMedicalFile(serialized);

        // Third round-trip
        serialized = serializeMedicalFile(deserialized);
        deserialized = deserializeMedicalFile(serialized);

        return areMedicalFilesEquivalent(file, deserialized);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle files with maximum allowed size', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          type: fc.constantFrom('application/pdf', 'image/jpeg'),
          size: fc.constant(10 * 1024 * 1024), // Max size
          uploadedAt: fc.date().map((d) => d.toISOString()),
          url: fc.webUrl(),
          patientId: fc.option(fc.uuid()),
        }),
        (fileData) => {
          const file = fileData as MedicalFile;
          const serialized = serializeMedicalFile(file);
          const deserialized = deserializeMedicalFile(serialized);

          return areMedicalFilesEquivalent(file, deserialized) && isValidFileSize(deserialized.size);
        }
      ),
      { numRuns: 100 }
    );
  });
});
