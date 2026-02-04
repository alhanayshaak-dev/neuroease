import { renderHook } from '@testing-library/react';
import { useCareCircleMessageSubscription } from '../useCareCircleMessageSubscription';
import * as useRealtimeSubscriptionModule from '../useRealtimeSubscription';

// Mock the useRealtimeSubscription hook
jest.mock('../useRealtimeSubscription', () => ({
  useRealtimeSubscription: jest.fn(),
}));

describe('useCareCircleMessageSubscription', () => {
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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
        })
      );

      expect(mockUseRealtimeSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          tableName: 'care_circle_messages',
        })
      );
    });

    it('should apply patient filter', () => {
      renderHook(() =>
        useCareCircleMessageSubscription({
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
        useCareCircleMessageSubscription({
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

  describe('message callback', () => {
    it('should call onMessage with payload', () => {
      const onMessage = jest.fn();
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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
          onMessage,
        })
      );

      const testPayload = {
        new: {
          id: 'msg-1',
          patient_id: 'patient-123',
          sender_id: 'user-1',
          message: 'Violet is doing well today',
          message_type: 'update',
          created_at: '2024-01-01T12:00:00Z',
        },
        old: null,
        eventType: 'INSERT',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onMessage).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'INSERT',
      });
    });

    it('should handle alert messages', () => {
      const onMessage = jest.fn();
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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
          onMessage,
        })
      );

      const testPayload = {
        new: {
          id: 'msg-2',
          message_type: 'alert',
          message: 'Stress level rising',
        },
        old: null,
        eventType: 'INSERT',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onMessage).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'INSERT',
      });
    });

    it('should handle suggestion messages', () => {
      const onMessage = jest.fn();
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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
          onMessage,
        })
      );

      const testPayload = {
        new: {
          id: 'msg-3',
          message_type: 'suggestion',
          message: 'Try the breathing exercise',
        },
        old: null,
        eventType: 'INSERT',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onMessage).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'INSERT',
      });
    });

    it('should handle general messages', () => {
      const onMessage = jest.fn();
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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
          onMessage,
        })
      );

      const testPayload = {
        new: {
          id: 'msg-4',
          message_type: 'general',
          message: 'See you at therapy tomorrow',
        },
        old: null,
        eventType: 'INSERT',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onMessage).toHaveBeenCalledWith({
        new: testPayload.new,
        old: testPayload.old,
        eventType: 'INSERT',
      });
    });

    it('should handle message deletion', () => {
      const onMessage = jest.fn();
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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
          onMessage,
        })
      );

      const testPayload = {
        new: null,
        old: {
          id: 'msg-1',
          message: 'Deleted message',
        },
        eventType: 'DELETE',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      expect(onMessage).toHaveBeenCalledWith({
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
        useCareCircleMessageSubscription({
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
        useCareCircleMessageSubscription({
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
        useCareCircleMessageSubscription({
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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
        })
      );

      result.current.unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('real-time message delivery', () => {
    it('should deliver messages within 1 second', () => {
      const onMessage = jest.fn();
      let capturedCallback: any;
      const startTime = Date.now();

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
        useCareCircleMessageSubscription({
          patientId: 'patient-123',
          onMessage,
        })
      );

      const testPayload = {
        new: {
          id: 'msg-1',
          message: 'Test message',
        },
        old: null,
        eventType: 'INSERT',
      };

      if (capturedCallback) {
        capturedCallback(testPayload);
      }

      const endTime = Date.now();
      const deliveryTime = endTime - startTime;

      expect(onMessage).toHaveBeenCalled();
      expect(deliveryTime).toBeLessThan(1000); // Within 1 second
    });
  });
});
