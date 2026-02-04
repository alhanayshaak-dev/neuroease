import { renderHook } from '@testing-library/react';
import { useDeviceStatusSubscription } from '../useDeviceStatusSubscription';
import * as useRealtimeSubscriptionModule from '../useRealtimeSubscription';

// Mock the useRealtimeSubscription hook
jest.mock('../useRealtimeSubscription', () => ({
  useRealtimeSubscription: jest.fn(),
}));

describe('useDeviceStatusSubscription', () => {
  const mockUseRealtimeSubscription =
    useRealtimeSubscriptionModule.useRealtimeSubscription as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRealtimeSubscription.mockReturnValue({
      isLoading: false,
      isConnected: true,
      error: null,
      unsubscribe: jest.fn(),
    });
  });

  describe('initialization', () => {
    it('should initialize with correct table name', () => {
      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          tableName: 'devices',
        })
      );
    });

    it('should apply patient filter', () => {
      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: 'patient_id=eq.patient-123',
        })
      );
    });

    it('should subscribe to all event types', () => {
      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          events: ['INSERT', 'UPDATE', 'DELETE'],
        })
      );
    });
  });

  describe('device status callback', () => {
    it('should call onDeviceStatus with payload', () => {
      const onDeviceStatus = jest.fn();
      let capturedCallback: any;

      mockUseRealtimeSubscription.mockImplementation((options: any) => {
        capturedCallback = options.onData;
        return {
          isLoading: false,
          isConnected: true,
          error: null,
          unsubscribe: jest.fn(),
        };
      });

      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
          onDeviceStatus,
        })
      );

      const testPayload = {
        new: {
          id: 'device-1',
          device_type: 'neuroband',
          battery_level: 85,
          is_connected: true,
          last_sync: '2024-01-01T12:00:00Z',
        },
        old: null,
        eventType: 'INSERT',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onDeviceStatus).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'INSERT',
      });
    });

    it('should handle battery level updates', () => {
      const onDeviceStatus = jest.fn();
      let capturedCallback: any;

      mockUseRealtimeSubscription.mockImplementation((options: any) => {
        capturedCallback = options.onData;
        return {
          isLoading: false,
          isConnected: true,
          error: null,
          unsubscribe: jest.fn(),
        };
      });

      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
          onDeviceStatus,
        })
      );

      const testPayload = {
        new: {
          id: 'device-1',
          battery_level: 15,
        },
        old: {
          id: 'device-1',
          battery_level: 20,
        },
        eventType: 'UPDATE',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onDeviceStatus).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'UPDATE',
      });
    });

    it('should handle connection status changes', () => {
      const onDeviceStatus = jest.fn();
      let capturedCallback: any;

      mockUseRealtimeSubscription.mockImplementation((options: any) => {
        capturedCallback = options.onData;
        return {
          isLoading: false,
          isConnected: true,
          error: null,
          unsubscribe: jest.fn(),
        };
      });

      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
          onDeviceStatus,
        })
      );

      const testPayload = {
        new: {
          id: 'device-1',
          is_connected: false,
        },
        old: {
          id: 'device-1',
          is_connected: true,
        },
        eventType: 'UPDATE',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onDeviceStatus).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'UPDATE',
      });
    });

    it('should handle device deletion', () => {
      const onDeviceStatus = jest.fn();
      let capturedCallback: any;

      mockUseRealtimeSubscription.mockImplementation((options: any) => {
        capturedCallback = options.onData;
        return {
          isLoading: false,
          isConnected: true,
          error: null,
          unsubscribe: jest.fn(),
        };
      });

      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
          onDeviceStatus,
        })
      );

      const testPayload = {
        new: null,
        old: {
          id: 'device-1',
          device_type: 'neuroband',
        },
        eventType: 'DELETE',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onDeviceStatus).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'DELETE',
      });
    });
  });

  describe('error handling', () => {
    it('should pass onError to useRealtimeSubscription', () => {
      const onError = jest.fn();

      renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
          onError,
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          onError,
        })
      );
    });

    it('should return error state', () => {
      const testError = new Error('Connection failed');

      mockUseRealtimeSubscription.mockReturnValue({
        isLoading: false,
        isConnected: false,
        error: testError,
        unsubscribe: jest.fn(),
      });

      const { result } = renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
        })
      );

      expect(result.current.error).toBe(testError);
    });
  });

  describe('subscription status', () => {
    it('should return connection status', () => {
      mockUseRealtimeSubscription.mockReturnValue({
        isLoading: false,
        isConnected: true,
        error: null,
        unsubscribe: jest.fn(),
      });

      const { result } = renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
        })
      );

      expect(result.current.isConnected).toBe(true);
    });

    it('should provide unsubscribe method', () => {
      const mockUnsubscribe = jest.fn();

      mockUseRealtimeSubscription.mockReturnValue({
        isLoading: false,
        isConnected: true,
        error: null,
        unsubscribe: mockUnsubscribe,
      });

      const { result } = renderHook(() =>
        useDeviceStatusSubscription({
          patientId: 'patient-123',
        })
      );

      result.current.unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
