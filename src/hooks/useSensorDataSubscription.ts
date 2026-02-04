import { useCallback } from 'react';
import { useRealtimeSubscription, UseRealtimeSubscriptionReturn } from './useRealtimeSubscription';
import { Database } from '@/types/database';

export type SensorDataPayload = {
  new?: Database['public']['Tables']['sensor_data']['Row'];
  old?: Database['public']['Tables']['sensor_data']['Row'];
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export interface UseSensorDataSubscriptionOptions {
  patientId: string;
  onSensorData?: (payload: SensorDataPayload) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook for subscribing to sensor data updates for a specific patient
 * Automatically filters to the patient's sensor_data table
 * Handles INSERT, UPDATE, and DELETE events
 *
 * @param options - Configuration for the subscription
 * @returns Subscription status and control methods
 *
 * @example
 * const { isConnected, error } = useSensorDataSubscription({
 *   patientId: 'patient-123',
 *   onSensorData: (payload) => {
 *     console.log('New sensor data:', payload.new);
 *   },
 * });
 */
export function useSensorDataSubscription(
  options: UseSensorDataSubscriptionOptions
): UseRealtimeSubscriptionReturn {
  const { patientId, onSensorData, onError, enabled = true } = options;

  const handleData = useCallback(
    (payload: any) => {
      if (onSensorData) {
        onSensorData({
          new: payload.new,
          old: payload.old,
          eventType: payload.eventType,
        });
      }
    },
    [onSensorData]
  );

  return useRealtimeSubscription({
    tableName: 'sensor_data',
    filter: `patient_id=eq.${patientId}`,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    onData: handleData,
    onError,
    enabled,
  });
}
