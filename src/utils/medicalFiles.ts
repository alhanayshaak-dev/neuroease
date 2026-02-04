/**
 * Medical File Utilities
 * Handles medical file operations including upload, retrieval, and serialization
 */

export interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
  patientId?: string;
  content?: ArrayBuffer | string;
}

export interface MedicalFileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

/**
 * Serialize a medical file to a storable format
 * Converts file data to a JSON-serializable object
 */
export function serializeMedicalFile(file: MedicalFile): string {
  const serializable = {
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: file.uploadedAt,
    url: file.url,
    patientId: file.patientId,
    // Content is not serialized as it's typically stored separately
  };
  return JSON.stringify(serializable);
}

/**
 * Deserialize a medical file from stored format
 * Reconstructs file object from JSON
 */
export function deserializeMedicalFile(serialized: string): MedicalFile {
  const data = JSON.parse(serialized);
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    size: data.size,
    uploadedAt: data.uploadedAt,
    url: data.url,
    patientId: data.patientId,
  };
}

/**
 * Validate medical file metadata
 * Ensures all required fields are present and valid
 */
export function validateMedicalFile(file: MedicalFile): boolean {
  if (!file.id || typeof file.id !== 'string') return false;
  if (!file.name || typeof file.name !== 'string') return false;
  if (!file.type || typeof file.type !== 'string') return false;
  if (typeof file.size !== 'number' || file.size < 0) return false;
  if (!file.uploadedAt || typeof file.uploadedAt !== 'string') return false;
  if (!file.url || typeof file.url !== 'string') return false;

  // Validate date format
  try {
    new Date(file.uploadedAt);
  } catch {
    return false;
  }

  return true;
}

/**
 * Extract file metadata without content
 */
export function extractMetadata(file: MedicalFile): MedicalFileMetadata {
  return {
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: file.uploadedAt,
  };
}

/**
 * Check if two medical files are equivalent
 * Compares all fields except content
 */
export function areMedicalFilesEquivalent(file1: MedicalFile, file2: MedicalFile): boolean {
  return (
    file1.id === file2.id &&
    file1.name === file2.name &&
    file1.type === file2.type &&
    file1.size === file2.size &&
    file1.uploadedAt === file2.uploadedAt &&
    file1.url === file2.url &&
    file1.patientId === file2.patientId
  );
}

/**
 * Validate file type is allowed
 */
export function isAllowedFileType(type: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowedTypes.includes(type);
}

/**
 * Validate file size is within limits
 */
export function isValidFileSize(size: number): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return size > 0 && size <= maxSize;
}

/**
 * Create a medical file object from raw data
 */
export function createMedicalFile(
  id: string,
  name: string,
  type: string,
  size: number,
  uploadedAt: string,
  url: string,
  patientId?: string
): MedicalFile {
  return {
    id,
    name,
    type,
    size,
    uploadedAt,
    url,
    patientId,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date for display
 */
export function formatUploadDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

/**
 * Get file icon based on type
 */
export function getFileIcon(type: string): string {
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  if (type.includes('word') || type.includes('document')) return '📝';
  return '📎';
}
