'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  Lock,
  Mic,
  AlertCircle,
  Shield,
  Users,
  Activity,
  Heart,
  Zap,
  ArrowLeft,
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'health' | 'location' | 'communication' | 'device' | 'privacy';
  enabled: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  lastModified: string;
  modifiedBy: string;
}

export default function PermissionsPage() {
  const [selectedGuardian, setSelectedGuardian] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: '1',
      name: 'View Health Data',
      description: 'Access to heart rate, stress levels, sleep quality, and other health metrics',
      category: 'health',
      enabled: true,
      riskLevel: 'low',
      lastModified: 'Jan 15, 2024',
      modifiedBy: 'Avery Gray',
    },
    {
      id: '2',
      name: 'View Location',
      description: 'Real-time GPS location tracking and location history',
      category: 'location',
      enabled: true,
      riskLevel: 'high',
      lastModified: 'Jan 10, 2024',
      modifiedBy: 'Violet Azer',
    },
    {
      id: '3',
      name: 'Microphone Access',
      description: 'Permission to use microphone for voice calls and recordings',
      category: 'communication',
      enabled: false,
      riskLevel: 'high',
      lastModified: 'Jan 5, 2024',
      modifiedBy: 'Violet Azer',
    },
    {
      id: '4',
      name: 'Camera Access',
      description: 'Permission to use camera for video calls and photo capture',
      category: 'communication',
      enabled: false,
      riskLevel: 'high',
      lastModified: 'Jan 5, 2024',
      modifiedBy: 'Violet Azer',
    },
    {
      id: '5',
      name: 'View Medical Files',
      description: 'Access to diagnosis reports, therapy notes, and medical documents',
      category: 'privacy',
      enabled: true,
      riskLevel: 'high',
      lastModified: 'Jan 12, 2024',
      modifiedBy: 'Avery Gray',
    },
    {
      id: '6',
      name: 'View Medication Logs',
      description: 'Access to medication adherence and dosage information',
      category: 'health',
      enabled: true,
      riskLevel: 'medium',
      lastModified: 'Jan 14, 2024',
      modifiedBy: 'Avery Gray',
    },
    {
      id: '7',
      name: 'Device Control',
      description: 'Ability to control device settings and calibration',
      category: 'device',
      enabled: true,
      riskLevel: 'medium',
      lastModified: 'Jan 8, 2024',
      modifiedBy: 'Avery Gray',
    },
    {
      id: '8',
      name: 'View Activity Logs',
      description: 'Access to app usage history and activity tracking',
      category: 'privacy',
      enabled: false,
      riskLevel: 'medium',
      lastModified: 'Jan 3, 2024',
      modifiedBy: 'Violet Azer',
    },
  ]);

  const guardians = [
    { id: '1', name: 'Avery Gray', relationship: 'Mother (Primary)', status: 'online' },
    { id: '2', name: 'Kai Azer', relationship: 'Father', status: 'away' },
    { id: '3', name: 'Sophie Falcone', relationship: 'Therapist', status: 'offline' },
  ];

  const handlePermissionToggle = (id: string) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled, lastModified: 'Now', modifiedBy: 'You' } : p
    ));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart size={18} />;
      case 'location': return <Activity size={18} />;
      case 'communication': return <Mic size={18} />;
      case 'device': return <Zap size={18} />;
      case 'privacy': return <Lock size={18} />;
      default: return <Shield size={18} />;
    }
  };

  if (selectedGuardian) {
    return (
      <GuardianLayout>
        <div className="max-w-6xl mx-auto pb-20">
          <button
            type="button"
            onClick={() => setSelectedGuardian(null)}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Permissions
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              {guardians.find(g => g.id === selectedGuardian)?.name}&apos;s Permissions
            </h1>
            <p className="text-gray-400">
              {guardians.find(g => g.id === selectedGuardian)?.relationship}
            </p>
          </div>

          {/* Permission Categories */}
          <div className="space-y-6">
            {['health', 'location', 'communication', 'device', 'privacy'].map((category) => {
              const categoryPermissions = permissions.filter(p => p.category === category);
              const categoryNames: Record<string, string> = {
                health: 'Health & Wellness',
                location: 'Location & Tracking',
                communication: 'Communication',
                device: 'Device Control',
                privacy: 'Privacy & Data',
              };

              return (
                <div key={category} className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {categoryNames[category]}
                  </h2>

                  <div className="space-y-4">
                    {categoryPermissions.map((perm) => (
                      <div key={perm.id} className="bg-black/50 rounded-lg p-4 border border-teal-600/20">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-semibold">{perm.name}</p>
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${getRiskColor(perm.riskLevel)} bg-black/50`}>
                                {perm.riskLevel.toUpperCase()} RISK
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">{perm.description}</p>
                            <p className="text-gray-500 text-xs mt-2">
                              Last modified: {perm.lastModified} by {perm.modifiedBy}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePermissionToggle(perm.id)}
                            className={`ml-4 px-4 py-2 rounded font-semibold transition-colors ${
                              perm.enabled
                                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                : 'bg-red-600/20 text-red-400 border border-red-600/30'
                            }`}
                          >
                            {perm.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>

                        {/* Privacy Notice */}
                        {perm.riskLevel === 'high' && (
                          <div className="mt-3 p-3 bg-red-900/20 border border-red-600/30 rounded flex items-start gap-2">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-300 text-xs">
                              This is a high-risk permission. Violet has control over this setting and can disable it at any time.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy & Safety Notice */}
          <div className="mt-8 bg-teal-900/20 border border-teal-600/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-400 mb-3 flex items-center gap-2">
              <Shield size={20} />
              Privacy & Safety First
            </h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>
                • Violet maintains full control over all permissions and can revoke access at any time
              </p>
              <p>
                • High-risk permissions (camera, microphone, location) require explicit consent from Violet
              </p>
              <p>
                • All permission changes are logged and can be audited for security purposes
              </p>
              <p>
                • Permissions are reviewed quarterly to ensure they remain appropriate
              </p>
              <p>
                • Emergency access protocols are in place for critical health situations
              </p>
            </div>
          </div>
        </div>
      </GuardianLayout>
    );
  }

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Permission Management</h1>
            <p className="text-xs text-gray-400">
              Manage access permissions for guardians. Privacy and safety are our top priority.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Go back"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Guardians</p>
            <p className="text-white text-3xl font-bold">{guardians.length}</p>
          </div>
          <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Active Permissions</p>
            <p className="text-white text-3xl font-bold">{permissions.filter(p => p.enabled).length}</p>
          </div>
          <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">High-Risk Permissions</p>
            <p className="text-red-400 text-3xl font-bold">{permissions.filter(p => p.riskLevel === 'high' && p.enabled).length}</p>
          </div>
        </div>

        {/* Guardians List */}
        <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={24} />
            Care Circle Members
          </h2>

          <div className="space-y-3">
            {guardians.map((guardian) => {
              const guardianPermissions = permissions.filter(p => p.enabled);
              return (
                <button
                  type="button"
                  key={guardian.id}
                  onClick={() => setSelectedGuardian(guardian.id)}
                  className="w-full bg-black/50 rounded-lg p-4 hover:border-teal-400 border border-teal-600/20 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold">{guardian.name}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          guardian.status === 'online' ? 'bg-green-900/30 text-green-400' :
                          guardian.status === 'away' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-gray-900/30 text-gray-400'
                        }`}>
                          {guardian.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{guardian.relationship}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {guardianPermissions.length} permissions granted
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-teal-400 text-sm font-semibold">Manage →</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permission Summary */}
        <div className="mt-8 bg-navy-900 border border-teal-600/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Permission Summary</h2>

          <div className="space-y-4">
            {['health', 'location', 'communication', 'device', 'privacy'].map((category) => {
              const categoryPermissions = permissions.filter(p => p.category === category);
              const enabledCount = categoryPermissions.filter(p => p.enabled).length;
              const categoryNames: Record<string, string> = {
                health: 'Health & Wellness',
                location: 'Location & Tracking',
                communication: 'Communication',
                device: 'Device Control',
                privacy: 'Privacy & Data',
              };

              return (
                <div key={category} className="bg-black/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {categoryNames[category]}
                    </p>
                    <p className="text-teal-400 text-sm">
                      {enabledCount}/{categoryPermissions.length} enabled
                    </p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-teal-500 transition-all"
                      style={{ width: `${(enabledCount / categoryPermissions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="mt-8 bg-teal-900/20 border border-teal-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-teal-400 mb-3 flex items-center gap-2">
            <Shield size={20} />
            Our Privacy Commitment
          </h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              <span className="text-teal-400 font-semibold">Patient Control:</span> Violet has ultimate control over all permissions and can revoke access at any time without explanation.
            </p>
            <p>
              <span className="text-teal-400 font-semibold">Transparency:</span> All permission changes are logged with timestamps and are available for audit.
            </p>
            <p>
              <span className="text-teal-400 font-semibold">Minimal Access:</span> We follow the principle of least privilege - guardians only get access to what they need.
            </p>
            <p>
              <span className="text-teal-400 font-semibold">Regular Review:</span> Permissions are reviewed quarterly and adjusted based on changing needs.
            </p>
            <p>
              <span className="text-teal-400 font-semibold">Emergency Protocols:</span> In critical health situations, emergency access can be granted temporarily with full notification.
            </p>
          </div>
        </div>
      </div>
    </GuardianLayout>
  );
}
