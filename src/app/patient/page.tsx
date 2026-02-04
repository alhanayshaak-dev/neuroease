'use client';

import { AppLayout } from '@/components/AppLayout';
import { MedicalFileManager } from '@/components/MedicalFileManager';
import { useEffect, useState } from 'react';
import { Database } from '@/types/database';

type Patient = Database['public']['Tables']['patients']['Row'];

interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export default function PatientPage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalFiles, setMedicalFiles] = useState<MedicalFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Patient>>({});

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/patient/profile');
      if (response.ok) {
        const data = await response.json();
        setPatient(data);
        setEditData(data);
        // Load medical files
        loadMedicalFiles();
      }
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMedicalFiles = async () => {
    try {
      const response = await fetch('/api/patient/medical-files');
      if (response.ok) {
        const data = await response.json();
        setMedicalFiles(data);
      }
    } catch (error) {
      console.error('Failed to load medical files:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/patient/medical-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await loadMedicalFiles();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/patient/medical-files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadMedicalFiles();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  if (isLoading && !patient) {
    return (
      <AppLayout headerProps={{ userName: 'Violet', supportLevel: 1 }}>
        <div className="text-neutral-400">Loading patient profile...</div>
      </AppLayout>
    );
  }

  if (!patient) {
    return (
      <AppLayout headerProps={{ userName: 'Violet', supportLevel: 1 }}>
        <div className="text-neutral-400">Patient profile not found.</div>
      </AppLayout>
    );
  }

  const supportLevelLabels: Record<number, string> = {
    1: 'Level 1 - Requiring Support',
    2: 'Level 2 - Requiring Substantial Support',
    3: 'Level 3 - Requiring Very Substantial Support',
  };

  return (
    <AppLayout headerProps={{ userName: 'Violet', supportLevel: patient.support_level }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Patient Profile</h1>
          <p className="text-neutral-400">View and manage your medical information.</p>
        </div>

        {/* Basic Information */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-100">Basic Information</h2>
            {!isEditing && (
              <button type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Diagnosis</label>
                <input
                  type="text"
                  value={editData.diagnosis || ''}
                  onChange={(e) => setEditData({ ...editData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Support Level
                </label>
                <select
                  value={editData.support_level || 1}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      support_level: parseInt(e.target.value) as 1 | 2 | 3,
                    })
                  }
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-teal-500"
                >
                  <option value={1}>Level 1 - Requiring Support</option>
                  <option value={2}>Level 2 - Requiring Substantial Support</option>
                  <option value={3}>Level 3 - Requiring Very Substantial Support</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-200 mb-2">
                    Baseline Heart Rate
                  </label>
                  <input
                    type="number"
                    value={editData.baseline_hr || 0}
                    onChange={(e) =>
                      setEditData({ ...editData, baseline_hr: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-200 mb-2">
                    Baseline HRV
                  </label>
                  <input
                    type="number"
                    value={editData.baseline_hrv || 0}
                    onChange={(e) =>
                      setEditData({ ...editData, baseline_hrv: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-200 mb-2">
                    Baseline EDA
                  </label>
                  <input
                    type="number"
                    value={editData.baseline_eda || 0}
                    onChange={(e) =>
                      setEditData({ ...editData, baseline_eda: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Save
                </button>
                <button type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(patient);
                  }}
                  className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Diagnosis</p>
                <p className="text-lg font-semibold text-neutral-100">{patient.diagnosis}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-400 mb-1">Support Level</p>
                <p className="text-lg font-semibold text-neutral-100">
                  {supportLevelLabels[patient.support_level]}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-400 mb-1">Baseline Heart Rate</p>
                <p className="text-lg font-semibold text-neutral-100">{patient.baseline_hr} bpm</p>
              </div>

              <div>
                <p className="text-sm text-neutral-400 mb-1">Baseline HRV</p>
                <p className="text-lg font-semibold text-neutral-100">{patient.baseline_hrv} ms</p>
              </div>

              <div>
                <p className="text-sm text-neutral-400 mb-1">Baseline EDA</p>
                <p className="text-lg font-semibold text-neutral-100">{patient.baseline_eda} µS</p>
              </div>
            </div>
          )}
        </div>

        {/* Medical Files */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-100 mb-4">Medical Files</h2>
          <MedicalFileManager
            patientId={patient.id}
            files={medicalFiles}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
          />
        </div>
      </div>
    </AppLayout>
  );
}

