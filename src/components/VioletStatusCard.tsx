'use client';

import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';

interface VioletStatusCardProps {
  status: 'calm' | 'rising' | 'overload';
  stressScore: number;
  heartRate: number;
  lastUpdate: string;
  stressChange?: 'rising' | 'stable' | 'falling';
  heartRateChange?: 'rising' | 'stable' | 'falling';
  onActivateEmergency?: () => void;
}

export function VioletStatusCard({
  status,
  stressScore,
  heartRate,
  lastUpdate,
  stressChange = 'stable',
  heartRateChange = 'stable',
  onActivateEmergency,
}: VioletStatusCardProps) {
  const isHighStress = stressScore > 50;
  
  const statusConfig = {
    calm: { color: 'text-green-400', bg: 'bg-green-900', label: 'Stable', description: 'All vital indicators within normal parameters' },
    rising: { color: 'text-yellow-400', bg: 'bg-yellow-900', label: 'Action Required', description: 'Vital indicators showing upward trend', suggestion: 'Consider checking in with Violet or implementing calming strategies' },
    overload: { color: 'text-red-400', bg: 'bg-red-900', label: 'Critical', description: 'Vital indicators critically elevated', suggestion: 'Immediate intervention recommended - activate emergency protocols' },
  };

  const config = statusConfig[status];

  const getTrendIcon = (trend: 'rising' | 'stable' | 'falling') => {
    if (trend === 'rising') return '↑';
    if (trend === 'falling') return '↓';
    return '→';
  };

  const getTrendColor = (trend: 'rising' | 'stable' | 'falling') => {
    if (trend === 'rising') return 'text-red-400';
    if (trend === 'falling') return 'text-green-400';
    return 'text-gray-400';
  };

  const getDetailedStatus = () => {
    if (status === 'rising') {
      const reasons = [];
      if (stressChange === 'rising') reasons.push('cortisol elevation');
      if (heartRateChange === 'rising') reasons.push('tachycardia');
      if (reasons.length > 0) {
        return `${config.description} (${reasons.join(', ')})`;
      }
    }
    return config.description;
  };

  // Calculate additional medical parameters
  // Note: Cortisol value is a derived metric calculated from stress indicators,
  // not a direct measurement. EEG biomarkers indicate stress levels which correlate with cortisol.
  const cortisol = 10 + (stressScore / 10);

  return (
    <div
      className={`bg-black/20 rounded-lg p-6 relative ${
        isHighStress 
          ? 'border-2 border-red-500 animate-urgent-flash' 
          : 'border border-teal-600/30'
      }`}
    >
      {isHighStress && (
        <div className="mb-3 flex items-center gap-2 bg-red-900/50 border border-red-500 rounded p-2">
          <AlertCircle size={16} className="text-red-400 animate-pulse" />
          <p className="text-red-400 text-xs font-bold">CRITICAL: Stress parameters exceed safe threshold</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-white text-lg font-semibold mb-1">Physiological Status</h2>
          <p className="text-gray-400 text-sm text-justify">{getDetailedStatus()}</p>
        </div>
        <div className={`${config.color} text-2xl`}>
          {status === 'calm' && '✓'}
          {status === 'rising' && '⚠'}
          {status === 'overload' && '!'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Heart Rate */}
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs font-semibold">Heart Rate (HR)</p>
            <span className={`text-sm font-bold ${getTrendColor(heartRateChange)}`}>
              {getTrendIcon(heartRateChange)}
            </span>
          </div>
          <p className="text-white font-bold text-2xl mb-1">{heartRate} bpm</p>
          <p className="text-gray-500 text-xs">
            {heartRateChange === 'rising' && 'Elevated HR - Monitor closely'}
            {heartRateChange === 'falling' && 'Normalizing - HR decreasing'}
            {heartRateChange === 'stable' && 'Normal range - 60-100 bpm'}
          </p>
          <p className="text-gray-600 text-xs mt-2 italic">Neurobud / Neuroband</p>
        </div>

        {/* Cortisol Level */}
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs font-semibold">Cortisol (μg/dL)</p>
            <span className={`text-sm font-bold ${getTrendColor(stressChange)}`}>
              {getTrendIcon(stressChange)}
            </span>
          </div>
          <p className="text-white font-bold text-2xl mb-1">{cortisol.toFixed(1)}</p>
          <p className="text-gray-500 text-xs">
            {stressChange === 'rising' && 'Elevated - Stress hormone increase'}
            {stressChange === 'falling' && 'Decreasing - Stress hormone decline'}
            {stressChange === 'stable' && 'Normal - 10-20 μg/dL range'}
          </p>
          <p className="text-gray-600 text-xs mt-2 italic">Neurobud EEG biomarkers</p>
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="bg-cyan-900 border border-cyan-600 rounded-lg p-3 mb-3">
        <p className="text-cyan-400 text-xs font-semibold mb-2">Clinical Recommendation</p>
        <p className="text-gray-300 text-xs text-justify">
          {status === 'calm' && 'Sympathetic nervous system activity within normal parameters. Continue routine monitoring protocol.'}
          {status === 'rising' && 'Elevated sympathetic activation detected. Recommend parasympathetic intervention and continued biometric surveillance.'}
          {status === 'overload' && 'Acute sympathetic dysregulation. Immediate therapeutic intervention and emergency protocols indicated.'}
        </p>
      </div>

      {/* Initiate Calming Button */}
      {onActivateEmergency && (
        <button
          onClick={onActivateEmergency}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors mb-3"
        >
          Initiate Calming
        </button>
      )}

      {/* Detection Basis Disclaimer */}
      <p className="text-gray-500 text-xs">Last updated: {lastUpdate}</p>
    </div>
  );
}
