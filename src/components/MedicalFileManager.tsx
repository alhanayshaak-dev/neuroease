'use client';

import { useState } from 'react';

interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

interface MedicalFileManagerProps {
  patientId: string;
  files?: MedicalFile[];
  onFileUpload?: (file: File) => Promise<void>;
  onFileDelete?: (fileId: string) => Promise<void>;
  isReadOnly?: boolean;
}

export function MedicalFileManager({
  patientId: _patientId,
  files = [],
  onFileUpload,
  onFileDelete,
  isReadOnly = false,
}: MedicalFileManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileUpload) return;

    setUploadError('');

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File must be under 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError('File type not supported. Please upload PDF, image, or document files.');
      return;
    }

    try {
      setIsUploading(true);
      await onFileUpload(file);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <div className="border-2 border-dashed border-neutral-700 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <p className="text-neutral-300 font-medium">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-neutral-500 mt-1">PDF, images, or documents up to 10MB</p>
          </label>
        </div>
      )}

      {uploadError && (
        <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{uploadError}</div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-8 text-neutral-400">
          <p>No medical files uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl">{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-teal-400 hover:text-teal-300 truncate block"
                  >
                    {file.name}
                  </a>
                  <p className="text-xs text-neutral-500">
                    {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                  </p>
                </div>
              </div>

              {!isReadOnly && onFileDelete && (
                <button type="button"
                  onClick={() => onFileDelete(file.id)}
                  className="ml-2 px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

