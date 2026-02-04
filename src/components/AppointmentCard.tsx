'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, Check } from 'lucide-react';
import {
  formatAppointmentTime,
  getAppointmentStatus,
  getTimeUntilAppointment,
  generateDefaultSensoryPrep,
  calculatePrepCompletion,
  updatePrepItemCompletion,
  type Appointment,
  type SensoryPrepItem,
} from '@/utils/appointments';

interface AppointmentCardProps {
  appointment: Appointment;
  isExpanded?: boolean;
  onToggleExpand?: (appointmentId: string) => void;
  onUpdatePrep?: (appointmentId: string, prepItems: SensoryPrepItem[]) => Promise<void>;
  isReadOnly?: boolean;
}

export function AppointmentCard({
  appointment,
  isExpanded = false,
  onToggleExpand,
  onUpdatePrep,
  isReadOnly = false,
}: AppointmentCardProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isLoading, setIsLoading] = useState(false);
  const [prepItems, setPrepItems] = useState<SensoryPrepItem[]>(
    Object.values(appointment.sensory_prep || {}).length > 0
      ? Object.values(appointment.sensory_prep)
      : generateDefaultSensoryPrep()
  );

  const status = getAppointmentStatus(appointment.scheduled_time);
  const timeInfo = getTimeUntilAppointment(appointment.scheduled_time);
  const prepCompletion = calculatePrepCompletion(prepItems);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
    onToggleExpand?.(appointment.id);
  };

  const handleTogglePrepItem = async (itemId: string) => {
    if (isReadOnly) return;

    const updatedItems = updatePrepItemCompletion(
      prepItems,
      itemId,
      !prepItems.find((item) => item.id === itemId)?.completed
    );

    setPrepItems(updatedItems);

    if (onUpdatePrep) {
      try {
        setIsLoading(true);
        await onUpdatePrep(appointment.id, updatedItems);
      } catch (error) {
        console.error('Failed to update prep items:', error);
        // Revert on error
        setPrepItems(prepItems);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'today':
        return 'border-yellow-500/50 bg-yellow-500/5';
      case 'upcoming':
        return 'border-teal-500/50 bg-teal-500/5';
      case 'past':
        return 'border-neutral-600/50 bg-neutral-800/50';
      default:
        return 'border-neutral-700';
    }
  };

  const getStatusBadgeColor = () => {
    switch (status) {
      case 'today':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'upcoming':
        return 'bg-teal-500/20 text-teal-300';
      case 'past':
        return 'bg-neutral-700 text-neutral-400';
      default:
        return 'bg-neutral-700 text-neutral-400';
    }
  };

  const getTimeDisplay = () => {
    if (status === 'past') {
      return 'Completed';
    }
    if (timeInfo.days > 0) {
      return `${timeInfo.days}d ${timeInfo.hours}h away`;
    }
    if (timeInfo.hours > 0) {
      return `${timeInfo.hours}h ${timeInfo.minutes}m away`;
    }
    return `${timeInfo.minutes}m away`;
  };

  return (
    <div
      className={`rounded-lg border transition-all ${getStatusColor()} ${
        expanded ? 'ring-1 ring-teal-500/30' : ''
      }`}
    >
      {/* Header */}
      <button type="button"
        onClick={handleToggleExpand}
        className="w-full p-4 flex items-start justify-between hover:bg-neutral-700/20 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-neutral-100">{appointment.title}</h3>
            <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor()}`}>{status}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatAppointmentTime(appointment.scheduled_time)}</span>
            </div>

            {appointment.duration_minutes && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{appointment.duration_minutes} min</span>
              </div>
            )}

            {appointment.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{appointment.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center gap-2">
          {status !== 'past' && (
            <div className="text-right">
              <p className="text-xs text-neutral-500">Prep</p>
              <p className="text-sm font-semibold text-teal-400">{prepCompletion}%</p>
            </div>
          )}
          {expanded ? (
            <ChevronDown size={20} className="text-neutral-400 rotate-180" />
          ) : (
            <ChevronDown size={20} className="text-neutral-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-neutral-700 p-4 space-y-4">
          {/* Notes */}
          {appointment.notes && (
            <div>
              <p className="text-sm font-semibold text-neutral-300 mb-2">Notes</p>
              <p className="text-sm text-neutral-400">{appointment.notes}</p>
            </div>
          )}

          {/* Sensory Prep Checklist */}
          {status !== 'past' && (
            <div>
              <p className="text-sm font-semibold text-neutral-300 mb-3">Sensory Prep Checklist</p>

              <div className="space-y-2">
                {prepItems.map((item) => (
                  <button type="button"
                    key={item.id}
                    onClick={() => handleTogglePrepItem(item.id)}
                    disabled={isReadOnly || isLoading}
                    className="w-full flex items-start gap-3 p-2 rounded hover:bg-neutral-700/30 transition-colors disabled:opacity-50 text-left"
                  >
                    <div
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        item.completed
                          ? 'bg-teal-500 border-teal-500'
                          : 'border-neutral-600 hover:border-teal-500'
                      }`}
                    >
                      {item.completed && <Check size={16} className="text-neutral-900" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          item.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-500">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Prep Progress Bar */}
              <div className="mt-4 p-2 bg-neutral-700/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-neutral-400">Preparation Progress</p>
                  <p className="text-xs font-semibold text-neutral-300">{prepCompletion}%</p>
                </div>
                <div className="w-full bg-neutral-600 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${prepCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Time Until Appointment */}
          {status !== 'past' && (
            <div className="p-3 bg-neutral-700/30 rounded">
              <p className="text-sm text-neutral-300">
                <span className="font-semibold">{getTimeDisplay()}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

