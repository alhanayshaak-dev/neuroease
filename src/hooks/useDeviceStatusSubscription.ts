import { useCallback } from 'react';
import { useRealtimeSubscription, UseRealtimeSubscriptionReturn } from './useRealtimeSubscription';
import { Database } from '@/types/database';

export type DeviceStatusPayload = {
  new?: Database['public']['Tables']['devices']['Row'];
  old?: Database['public']['Tables']['devices']['Row'];
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export interface UseDeviceStatusSubscriptionOptions {
  patientId: string;
  onDeviceStatus?: (payload: DeviceStatusPayload) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook for subscribing to device status updates for a specific patient
 * Automatically filters to the patient's devices table
 * Handles INSERT, UPDATE, and DELETE events
 * Tracks battery level, connection status, and last sync time
 *
 * @param options - Configuration for the subscription
 * @returns Subscription status and control methods
 *
 * @example
 * const { isConnected, error } = useDeviceStatusSubscription({
 *   patientId: 'patient-123',
 *   onDeviceStatus: (payload) => {
 *     console.log('Device status updated:', payload.new);
 *   },
 * });
 */
export function useDeviceStatusSubscription(
  options: UseDeviceStatusSubscriptionOptions
): UseRealtimeSubscriptionReturn {
  const { patientId, onDeviceStatus, onError, enabled = true } = options;

  const handleData = useCallback(
    (payload: any) => {
      if (onDeviceStatus) {
        onDeviceStatus({
          new: payload.new,
          old: payload.old,
          eventType: payload.eventType,
        });
      }
    },
    [onDeviceStatus]
  );

  return useRealtimeSubscription({
    tableName: 'devices',
    filter: `patient_id=eq.${patientId}`,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    onData: handleData,
    onError,
    enabled,
  });
}
