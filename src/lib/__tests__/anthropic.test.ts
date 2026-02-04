import {
  predictOverload,
  suggestStrategies,
  shouldDisplayPrediction,
  OverloadPrediction,
} from '../anthropic';
import type { SensorData, CopingStrategy } from '../../types';

// Mock the fetch function
global.fetch = jest.fn();

// Set API key before tests run
process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = 'test-key';

describe('Anthropic AI Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = 'test-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('predictOverload', () => {
    it('should return no prediction when sensor data is empty', async () => {
      const result = await predictOverload([], {});
      expect(result.predicted).toBe(false);
      expect(result.confidence).toBe(0);
      expect(result.reason).toBe('No sensor data available');
    });

    it('should call Claude API with sensor data and context', async () => {
      const mockResponse = {
        content: [
          {
            text: JSON.stringify({
              predicted: true,
              confidence: 75,
              timeToOverloadMinutes: 7,
              reason: 'Stress increasing rapidly',
              triggers: ['loud noise', 'crowded space'],
            }),
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const sensorData: SensorData[] = [
        {
          id: '1',
          patient_id: 'patient1',
          device_id: 'device1',
          timestamp: '2024-01-01T10:00:00Z',
          heart_rate: 80,
          hrv: 40,
          eda: 2.5,
          accelerometer_x: 0,
          accelerometer_y: 0,
          accelerometer_z: 0,
          location: 'school',
          activity: 'class',
          stress_score: 60,
          overload_predicted: false,
          created_at: '2024-01-01T10:00:00Z',
        },
        {
          id: '2',
          patient_id: 'patient1',
          device_id: 'device1',
          timestamp: '2024-01-01T10:01:00Z',
          heart_rate: 95,
          hrv: 30,
          eda: 3.5,
          accelerometer_x: 0,
          accelerometer_y: 0,
          accelerometer_z: 0,
          location: 'school',
          activity: 'class',
          stress_score: 75,
          overload_predicted: false,
          created_at: '2024-01-01T10:01:00Z',
        },
      ];

      const result = await predictOverload(sensorData, {
        location: 'school',
        activity: 'class',
      });

      expect(result.predicted).toBe(true);
      expect(result.confidence).toBe(75);
      expect(result.timeToOverloadMinutes).toBe(7);
      expect(result.triggers).toContain('loud noise');
    });

    it('should clamp confidence to 0-100 range', async () => {
      const mockResponse = {
        content: [
          {
            text: JSON.stringify({
              predicted: true,
              confidence: 150, // Invalid value
              timeToOverloadMinutes: 7,
              reason: 'Test',
              triggers: [],
            }),
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const sensorData: SensorData[] = [
        {
          id: '1',
          patient_id: 'patient1',
          device_id: 'device1',
          timestamp: '2024-01-01T10:00:00Z',
          heart_rate: 80,
          hrv: 40,
          eda: 2.5,
          accelerometer_x: 0,
          accelerometer_y: 0,
          accelerometer_z: 0,
          location: 'school',
          activity: 'class',
          stress_score: 60,
          overload_predicted: false,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];

      const result = await predictOverload(sensorData, {});
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should clamp timeToOverloadMinutes to 5-10 range', async () => {
      const mockResponse = {
        content: [
          {
            text: JSON.stringify({
              predicted: true,
              confidence: 75,
              timeToOverloadMinutes: 20, // Invalid value
              reason: 'Test',
              triggers: [],
            }),
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const sensorData: SensorData[] = [
        {
          id: '1',
          patient_id: 'patient1',
          device_id: 'device1',
          timestamp: '2024-01-01T10:00:00Z',
          heart_rate: 80,
          hrv: 40,
          eda: 2.5,
          accelerometer_x: 0,
          accelerometer_y: 0,
          accelerometer_z: 0,
          location: 'school',
          activity: 'class',
          stress_score: 60,
          overload_predicted: false,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];

      const result = await predictOverload(sensorData, {});
      expect(result.timeToOverloadMinutes).toBeLessThanOrEqual(10);
      expect(result.timeToOverloadMinutes).toBeGreaterThanOrEqual(5);
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      const sensorData: SensorData[] = [
        {
          id: '1',
          patient_id: 'patient1',
          device_id: 'device1',
          timestamp: '2024-01-01T10:00:00Z',
          heart_rate: 80,
          hrv: 40,
          eda: 2.5,
          accelerometer_x: 0,
          accelerometer_y: 0,
          accelerometer_z: 0,
          location: 'school',
          activity: 'class',
          stress_score: 60,
          overload_predicted: false,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];

      const result = await predictOverload(sensorData, {});
      expect(result.predicted).toBe(false);
      expect(result.confidence).toBe(0);
    });

    it('should handle malformed JSON response', async () => {
      const mockResponse = {
        content: [
          {
            text: 'This is not JSON',
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const sensorData: SensorData[] = [
        {
          id: '1',
          patient_id: 'patient1',
          device_id: 'device1',
          timestamp: '2024-01-01T10:00:00Z',
          heart_rate: 80,
          hrv: 40,
          eda: 2.5,
          accelerometer_x: 0,
          accelerometer_y: 0,
          accelerometer_z: 0,
          location: 'school',
          activity: 'class',
          stress_score: 60,
          overload_predicted: false,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];

      const result = await predictOverload(sensorData, {});
      expect(result.predicted).toBe(false);
      expect(result.confidence).toBe(0);
    });
  });

  describe('suggestStrategies', () => {
    const mockStrategies: CopingStrategy[] = [
      {
        id: 'strategy1',
        patient_id: 'patient1',
        name: 'Deep Breathing',
        category: 'breathwork',
        description: 'Take slow, deep breaths',
        duration_minutes: 5,
        success_rate: 0.8,
        times_used: 10,
        created_by: 'user',
        created_at: '2024-01-01T10:00:00Z',
      },
      {
        id: 'strategy2',
        patient_id: 'patient1',
        name: 'Grounding Exercise',
        category: 'grounding',
        description: '5-4-3-2-1 technique',
        duration_minutes: 3,
        success_rate: 0.7,
        times_used: 8,
        created_by: 'user',
        created_at: '2024-01-01T10:00:00Z',
      },
      {
        id: 'strategy3',
        patient_id: 'patient1',
        name: 'Fidget Toy',
        category: 'sensory',
        description: 'Use fidget toy',
        duration_minutes: 2,
        success_rate: 0.6,
        times_used: 5,
        created_by: 'user',
        created_at: '2024-01-01T10:00:00Z',
      },
    ];

    it('should return empty suggestions when no strategies available', async () => {
      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 75,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      const result = await suggestStrategies(prediction, []);
      expect(result.strategies).toHaveLength(0);
      expect(result.reasoning).toBe('No strategies available');
    });

    it('should suggest top 3 strategies based on Claude response', async () => {
      const mockResponse = {
        content: [
          {
            text: JSON.stringify({
              strategyIds: ['strategy1', 'strategy2', 'strategy3'],
              reasoning: 'These strategies are most effective for this situation',
            }),
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 75,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      const result = await suggestStrategies(prediction, mockStrategies);
      expect(result.strategies).toHaveLength(3);
      expect(result.strategies[0].id).toBe('strategy1');
      expect(result.strategies[1].id).toBe('strategy2');
      expect(result.strategies[2].id).toBe('strategy3');
    });

    it('should limit suggestions to top 3 even if more are returned', async () => {
      const mockResponse = {
        content: [
          {
            text: JSON.stringify({
              strategyIds: ['strategy1', 'strategy2', 'strategy3', 'strategy1'],
              reasoning: 'Test',
            }),
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 75,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      const result = await suggestStrategies(prediction, mockStrategies);
      expect(result.strategies).toHaveLength(3);
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 75,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      const result = await suggestStrategies(prediction, mockStrategies);
      expect(result.strategies).toHaveLength(0);
      expect(result.reasoning).toContain('Error');
    });

    it('should handle malformed JSON response', async () => {
      const mockResponse = {
        content: [
          {
            text: 'This is not JSON',
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 75,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      const result = await suggestStrategies(prediction, mockStrategies);
      expect(result.strategies).toHaveLength(0);
    });
  });

  describe('shouldDisplayPrediction', () => {
    it('should return true when prediction is true and confidence > 60', () => {
      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 75,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      expect(shouldDisplayPrediction(prediction)).toBe(true);
    });

    it('should return false when prediction is false', () => {
      const prediction: OverloadPrediction = {
        predicted: false,
        confidence: 0,
        reason: 'Test',
        triggers: [],
      };

      expect(shouldDisplayPrediction(prediction)).toBe(false);
    });

    it('should return false when confidence is 60 or less', () => {
      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 60,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      expect(shouldDisplayPrediction(prediction)).toBe(false);
    });

    it('should return false when confidence is exactly 60', () => {
      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 60,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      expect(shouldDisplayPrediction(prediction)).toBe(false);
    });

    it('should return true when confidence is just above 60', () => {
      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 61,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      expect(shouldDisplayPrediction(prediction)).toBe(true);
    });

    it('should return true when confidence is 100', () => {
      const prediction: OverloadPrediction = {
        predicted: true,
        confidence: 100,
        timeToOverloadMinutes: 7,
        reason: 'Test',
        triggers: [],
      };

      expect(shouldDisplayPrediction(prediction)).toBe(true);
    });
  });
});
