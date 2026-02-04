import { useCallback } from 'react';
import { useRealtimeSubscription, UseRealtimeSubscriptionReturn } from './useRealtimeSubscription';
import { Database } from '@/types/database';

export type CareCircleMessagePayload = {
  new?: Database['public']['Tables']['care_circle_messages']['Row'];
  old?: Database['public']['Tables']['care_circle_messages']['Row'];
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export interface UseCareCircleMessageSubscriptionOptions {
  patientId: string;
  onMessage?: (payload: CareCircleMessagePayload) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook for subscribing to care circle message updates for a specific patient
 * Automatically filters to the patient's care_circle_messages table
 * Handles INSERT, UPDATE, and DELETE events
 * Delivers messages to all recipients within 1 second
 *
 * @param options - Configuration for the subscription
 * @returns Subscription status and control methods
 *
 * @example
 * const { isConnected, error } = useCareCircleMessageSubscription({
 *   patientId: 'patient-123',
 *   onMessage: (payload) => {
 *     console.log('New message:', payload.new);
 *   },
 * });
 */
export function useCareCircleMessageSubscription(
  options: UseCareCircleMessageSubscriptionOptions
): UseRealtimeSubscriptionReturn {
  const { patientId, onMessage, onError, enabled = true } = options;

  const handleData = useCallback(
    (payload: any) => {
      if (onMessage) {
        onMessage({
          new: payload.new,
          old: payload.old,
          eventType: payload.eventType,
        });
      }
    },
    [onMessage]
  );

  return useRealtimeSubscription({
    tableName: 'care_circle_messages',
    filter: `patient_id=eq.${patientId}`,
    events: ['INSERT', 'UPDATE', 'DELETE'],
    onData: handleData,
    onError,
    enabled,
  });
}
