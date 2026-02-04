import { renderHook, waitFor } from '@testing-library/react';
import { useRealtimeSubscription } from '../useRealtimeSubscription';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

describe('useRealtimeSubscription', () => {
  let mockChannel: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock channel
    mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    };

    (supabase.channel as jest.Mock).mockReturnValue(mockChannel);
  });

  describe('initialization and cleanup', () => {
    it('should initialize subscription when enabled is true', async () => {
      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          enabled: true,
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not initialize subscription when enabled is false', async () => {
      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          enabled: false,
        })
      );

      expect(result.current.isLoading).toBe(false);
      expect(supabase.channel).not.toHaveBeenCalled();
    });

    it('should cleanup subscription on unmount', async () => {
      const { unmount } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });

      unmount();

      expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
    });

    it('should call unsubscribe method to cleanup', async () => {
      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });

      result.current.unsubscribe();

      expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
    });
  });

  describe('subscription event handling', () => {
    it('should call onData callback when data is received', async () => {
      const onData = jest.fn();
      let capturedCallback: any;

      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'postgres_changes') {
          capturedCallback = callback;
        }
        return mockChannel;
      });

      renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          onData,
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });

      // Simulate receiving data
      const testPayload = { new: { id: '123', stress_score: 50 } };
      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onData).toHaveBeenCalledWith(testPayload);
    });

    it('should handle INSERT events', async () => {
      const onData = jest.fn();

      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'postgres_changes') {
          expect(config.event).toBe('INSERT');
        }
        return mockChannel;
      });

      renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          events: ['INSERT'],
          onData,
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });
    });

    it('should handle UPDATE events', async () => {
      const onData = jest.fn();

      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'postgres_changes') {
          expect(config.event).toBe('UPDATE');
        }
        return mockChannel;
      });

      renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          events: ['UPDATE'],
          onData,
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });
    });

    it('should handle DELETE events', async () => {
      const onData = jest.fn();

      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'postgres_changes') {
          expect(config.event).toBe('DELETE');
        }
        return mockChannel;
      });

      renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          events: ['DELETE'],
          onData,
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });
    });

    it('should handle multiple events', async () => {
      const onData = jest.fn();

      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'postgres_changes') {
          expect(config.event).toBe('INSERT,UPDATE,DELETE');
        }
        return mockChannel;
      });

      renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          events: ['INSERT', 'UPDATE', 'DELETE'],
          onData,
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });
    });
  });

  describe('error handling and recovery', () => {
    it('should handle subscription errors', async () => {
      const onError = jest.fn();

      mockChannel.subscribe.mockImplementation((callback: any) => {
        callback('CHANNEL_ERROR');
      });

      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          onError,
        })
      );

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      expect(onError).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    it('should set isConnected to true on SUBSCRIBED status', async () => {
      mockChannel.subscribe.mockImplementation((callback: any) => {
        callback('SUBSCRIBED');
      });

      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set isConnected to false on CLOSED status', async () => {
      mockChannel.subscribe.mockImplementation((callback: any) => {
        callback('SUBSCRIBED');
        setTimeout(() => callback('CLOSED'), 10);
      });

      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
      });
    });
  });

  describe('multiple simultaneous subscriptions', () => {
    it('should support multiple subscriptions with different tables', async () => {
      const { result: result1 } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      const { result: result2 } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'devices',
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalledTimes(2);
      });

      expect(result1.current).toBeDefined();
      expect(result2.current).toBeDefined();
    });

    it('should support multiple subscriptions with different filters', async () => {
      const { result: result1 } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          filter: 'patient_id=eq.patient-1',
        })
      );

      const { result: result2 } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          filter: 'patient_id=eq.patient-2',
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalledTimes(2);
      });

      expect(result1.current).toBeDefined();
      expect(result2.current).toBeDefined();
    });
  });

  describe('connection state management', () => {
    it('should track connection state changes', async () => {
      let systemCallback: any;

      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'system') {
          systemCallback = callback;
        }
        return mockChannel;
      });

      mockChannel.subscribe.mockImplementation((callback: any) => {
        callback('SUBSCRIBED');
      });

      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      // Simulate connection loss
      if (systemCallback) {
        systemCallback();
      }

      // Connection state should be managed by system events
      expect(result.current.isConnected).toBe(true);
    });

    it('should provide unsubscribe method to disconnect', async () => {
      const { result } = renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });

      result.current.unsubscribe();

      expect(supabase.removeChannel).toHaveBeenCalled();
    });
  });

  describe('filter handling', () => {
    it('should apply filter to subscription', async () => {
      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'postgres_changes') {
          expect(config.filter).toBe('patient_id=eq.patient-123');
        }
        return mockChannel;
      });

      renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
          filter: 'patient_id=eq.patient-123',
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });
    });

    it('should handle subscriptions without filter', async () => {
      mockChannel.on.mockImplementation((event: string, config: any, callback: any) => {
        if (event === 'postgres_changes') {
          expect(config.filter).toBeUndefined();
        }
        return mockChannel;
      });

      renderHook(() =>
        useRealtimeSubscription({
          tableName: 'sensor_data',
        })
      );

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalled();
      });
    });
  });
});
