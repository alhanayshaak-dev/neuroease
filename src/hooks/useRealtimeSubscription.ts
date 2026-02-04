import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface UseRealtimeSubscriptionOptions {
  tableName: string;
  filter?: string;
  events?: RealtimeEvent[];
  onData?: (payload: any) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export interface UseRealtimeSubscriptionReturn {
  isLoading: boolean;
  isConnected: boolean;
  error: Error | null;
  unsubscribe: () => void;
}

/**
 * Hook for subscribing to real-time updates from Supabase
 * Handles subscription lifecycle (connect, disconnect, cleanup)
 * Supports multiple subscriptions simultaneously
 * Handles connection errors gracefully
 * Provides loading and error states
 *
 * @param options - Configuration for the subscription
 * @returns Subscription status and control methods
 *
 * @example
 * const { isConnected, error } = useRealtimeSubscription({
 *   tableName: 'sensor_data',
 *   filter: `patient_id=eq.${patientId}`,
 *   events: ['INSERT', 'UPDATE'],
 *   onData: (payload) => console.log('New data:', payload),
 *   onError: (error) => console.error('Subscription error:', error),
 * });
 */
export function useRealtimeSubscription(
  options: UseRealtimeSubscriptionOptions
): UseRealtimeSubscriptionReturn {
  const { tableName, filter, events, onData, onError, enabled = true } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscriptionRef = useRef<any>(null);
  const onDataRef = useRef(onData);
  const onErrorRef = useRef(onError);
  const isMountedRef = useRef(true);

  // Update refs when callbacks change
  useEffect(() => {
    onDataRef.current = onData;
    onErrorRef.current = onError;
  }, [onData, onError]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      subscriptionRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    isMountedRef.current = true;
    let setupComplete = false;

    // Create a unique channel name
    const channelName = `${tableName}:${filter || 'all'}:${Date.now()}`;

    // Create the channel
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: '' },
      },
    });

    // Subscribe to events
    const stableEvents = events || ['*'];
    const eventFilter = stableEvents.includes('*') ? '*' : stableEvents.join(',');

    channel
      .on(
        'postgres_changes',
        {
          event: eventFilter as any,
          schema: 'public',
          table: tableName,
          filter: filter,
        },
        (payload) => {
          if (isMountedRef.current && onDataRef.current) {
            onDataRef.current(payload);
          }
        }
      )
      .on('system', { event: 'join' }, () => {
        if (isMountedRef.current) {
          setIsConnected(true);
        }
      })
      .on('system', { event: 'leave' }, () => {
        if (isMountedRef.current) {
          setIsConnected(false);
        }
      })
      .subscribe(async (status) => {
        if (!isMountedRef.current) return;

        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          if (!setupComplete) {
            setIsLoading(false);
            setupComplete = true;
          }
        } else if (status === 'CHANNEL_ERROR') {
          const err = new Error(`Failed to subscribe to ${tableName} real-time updates`);
          setError(err);
          if (!setupComplete) {
            setIsLoading(false);
            setupComplete = true;
          }
          if (onErrorRef.current) {
            onErrorRef.current(err);
          }
        } else if (status === 'CLOSED') {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;
    subscriptionRef.current = channel;

    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscriptionRef.current = null;
      }
    };
  }, [tableName, filter, events, enabled]);

  return {
    isLoading,
    isConnected,
    error,
    unsubscribe,
  };
}
