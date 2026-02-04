'use client';

import React, { useState } from 'react';
import { FileText, Shield, Calendar } from 'lucide-react';

export function SettingsComplianceTab() {
  const [showHIPAA, setShowHIPAA] = useState(false);
  const [showGDPR, setShowGDPR] = useState(false);
  const [showAuditTrails, setShowAuditTrails] = useState(false);
  const [showDataRetention, setShowDataRetention] = useState(false);

  const auditTrails = [
    { action: 'Login', user: 'Avery Gray', timestamp: 'Today 2:30 PM', ip: '192.168.1.100' },
    { action: 'Data Export', user: 'Avery Gray', timestamp: 'Today 1:15 PM', ip: '192.168.1.100' },
    { action: 'Settings Changed', user: 'Avery Gray', timestamp: 'Yesterday 10:45 AM', ip: '192.168.1.101' },
    { action: 'Backup Created', user: 'System', timestamp: 'Yesterday 2:30 AM', ip: 'System' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">Compliance & Legal</h2>

        <div className="space-y-6">
          {/* HIPAA Compliance */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Shield size={18} /> HIPAA Compliance
                </label>
                <p className="text-gray-500 text-sm mt-1">Health Insurance Portability and Accountability Act</p>
              </div>
              <button type="button"
                onClick={() => setShowHIPAA(!showHIPAA)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showHIPAA ? 'Hide' : 'View'}
              </button>
            </div>

            {showHIPAA && (
              <div className="mt-4 bg-black/50 border border-teal-600/30 rounded p-4 text-sm">
                <p className="text-gray-300 mb-2">HIPAA Compliance Status: <span className="text-green-400 font-semibold">Compliant</span></p>
                <p className="text-gray-400">Your data is encrypted and stored in HIPAA-compliant facilities. All access is logged and monitored.</p>
                <button type="button" className="mt-3 text-teal-400 hover:text-teal-300 font-semibold text-sm">
                  View Full Report
                </button>
              </div>
            )}
          </div>

          {/* GDPR Compliance */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <FileText size={18} /> GDPR Compliance
                </label>
                <p className="text-gray-500 text-sm mt-1">General Data Protection Regulation</p>
              </div>
              <button type="button"
                onClick={() => setShowGDPR(!showGDPR)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showGDPR ? 'Hide' : 'View'}
              </button>
            </div>

            {showGDPR && (
              <div className="mt-4 bg-black/50 border border-teal-600/30 rounded p-4 text-sm">
                <p className="text-gray-300 mb-2">GDPR Compliance Status: <span className="text-green-400 font-semibold">Compliant</span></p>
                <p className="text-gray-400">We comply with all GDPR requirements including data protection, privacy rights, and consent management.</p>
                <button type="button" className="mt-3 text-teal-400 hover:text-teal-300 font-semibold text-sm">
                  View Full Report
                </button>
              </div>
            )}
          </div>

          {/* Audit Trails */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-300 font-semibold flex items-center gap-2">
                <Shield size={18} /> Audit Trails
              </label>
              <button type="button"
                onClick={() => setShowAuditTrails(!showAuditTrails)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showAuditTrails ? 'Hide' : 'View'}
              </button>
            </div>

            {showAuditTrails && (
              <div className="space-y-2">
                {auditTrails.map((trail, idx) => (
                  <div key={idx} className="bg-black/50 rounded p-3 text-sm">
                    <p className="text-gray-300 font-semibold">{trail.action}</p>
                    <p className="text-gray-500">{trail.user} • {trail.timestamp}</p>
                    <p className="text-gray-600 text-xs mt-1">IP: {trail.ip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Retention */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-300 font-semibold flex items-center gap-2">
                  <Calendar size={18} /> Data Retention Policy
                </label>
                <p className="text-gray-500 text-sm mt-1">How long we keep your data</p>
              </div>
              <button type="button"
                onClick={() => setShowDataRetention(!showDataRetention)}
                className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
              >
                {showDataRetention ? 'Hide' : 'View'}
              </button>
            </div>

            {showDataRetention && (
              <div className="mt-4 space-y-3">
                <div className="bg-black/50 border border-teal-600/30 rounded p-3 text-sm">
                  <p className="text-gray-300 font-semibold">Active Account Data</p>
                  <p className="text-gray-500">Retained for the duration of your account</p>
                </div>
                <div className="bg-black/50 border border-teal-600/30 rounded p-3 text-sm">
                  <p className="text-gray-300 font-semibold">Backup Data</p>
                  <p className="text-gray-500">Retained for 90 days after deletion</p>
                </div>
                <div className="bg-black/50 border border-teal-600/30 rounded p-3 text-sm">
                  <p className="text-gray-300 font-semibold">Audit Logs</p>
                  <p className="text-gray-500">Retained for 1 year for compliance</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
