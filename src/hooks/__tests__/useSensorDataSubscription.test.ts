import { renderHook, waitFor } from '@testing-library/react';
import { useSensorDataSubscription } from '../useSensorDataSubscription';
import * as useRealtimeSubscriptionModule from '../useRealtimeSubscription';

// Mock the useRealtimeSubscription hook
jest.mock('../useRealtimeSubscription', () => ({
  useRealtimeSubscription: jest.fn(),
}));

describe('useSensorDataSubscription', () => {
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
        useSensorDataSubscription({
          patientId: 'patient-123',
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          tableName: 'sensor_data',
        })
      );
    });

    it('should apply patient filter', () => {
      renderHook(() =>
        useSensorDataSubscription({
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
        useSensorDataSubscription({
          patientId: 'patient-123',
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          events: ['INSERT', 'UPDATE', 'DELETE'],
        })
      );
    });

    it('should be enabled by default', () => {
      renderHook(() =>
        useSensorDataSubscription({
          patientId: 'patient-123',
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
        })
      );
    });

    it('should respect enabled option', () => {
      renderHook(() =>
        useSensorDataSubscription({
          patientId: 'patient-123',
          enabled: false,
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        })
      );
    });
  });

  describe('sensor data callback', () => {
    it('should call onSensorData with payload', async () => {
      const onSensorData = jest.fn();
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
        useSensorDataSubscription({
          patientId: 'patient-123',
          onSensorData,
        })
      );

      const testPayload = {
        new: {
          id: 'sensor-1',
          patient_id: 'patient-123',
          stress_score: 50,
          heart_rate: 80,
          hrv: 40,
          eda: 2.5,
        },
        old: null,
        eventType: 'INSERT',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onSensorData).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'INSERT',
      });
    });

    it('should handle UPDATE events', async () => {
      const onSensorData = jest.fn();
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
        useSensorDataSubscription({
          patientId: 'patient-123',
          onSensorData,
        })
      );

      const testPayload = {
        new: {
          id: 'sensor-1',
          stress_score: 60,
        },
        old: {
          id: 'sensor-1',
          stress_score: 50,
        },
        eventType: 'UPDATE',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onSensorData).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'UPDATE',
      });
    });

    it('should handle DELETE events', async () => {
      const onSensorData = jest.fn();
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
        useSensorDataSubscription({
          patientId: 'patient-123',
          onSensorData,
        })
      );

      const testPayload = {
        new: null,
        old: {
          id: 'sensor-1',
          stress_score: 50,
        },
        eventType: 'DELETE',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onSensorData).toHaveBeenCalledWith({
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
        useSensorDataSubscription({
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

    it('should return error state from useRealtimeSubscription', () => {
      const testError = new Error('Connection failed');

      mockUseRealtimeSubscription.mockReturnValue({
        isLoading: false,
        isConnected: false,
        error: testError,
        unsubscribe: jest.fn(),
      });

      const { result } = renderHook(() =>
        useSensorDataSubscription({
          patientId: 'patient-123',
        })
      );

      expect(result.current.error).toBe(testError);
    });
  });

  describe('subscription status', () => {
    it('should return loading state', () => {
      mockUseRealtimeSubscription.mockReturnValue({
        isLoading: true,
        isConnected: false,
        error: null,
        unsubscribe: jest.fn(),
      });

      const { result } = renderHook(() =>
        useSensorDataSubscription({
          patientId: 'patient-123',
        })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return connected state', () => {
      mockUseRealtimeSubscription.mockReturnValue({
        isLoading: false,
        isConnected: true,
        error: null,
        unsubscribe: jest.fn(),
      });

      const { result } = renderHook(() =>
        useSensorDataSubscription({
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
        useSensorDataSubscription({
          patientId: 'patient-123',
        })
      );

      result.current.unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('different patient IDs', () => {
    it('should update filter when patient ID changes', () => {
      const { rerender } = renderHook(
        ({ patientId }) =>
          useSensorDataSubscription({
            patientId,
          }),
        {
          initialProps: { patientId: 'patient-1' },
        }
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: 'patient_id=eq.patient-1',
        })
      );

      rerender({ patientId: 'patient-2' });

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: 'patient_id=eq.patient-2',
        })
      );
    });
  });
});
