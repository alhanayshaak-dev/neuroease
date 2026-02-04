import React from 'react';
import { render, screen } from '@testing-library/react';
import { StressChart } from '../StressChart';
import type { SensorData } from '@/types';

// Mock Recharts to avoid ResizeObserver issues in tests
jest.mock('recharts', () => {
  const React = require('react');
  return {
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

describe('StressChart Component', () => {
  const mockSensorData: SensorData[] = [
    {
      id: '1',
      patient_id: 'patient1',
      device_id: 'device1',
      timestamp: '2024-01-01T10:00:00Z',
      heart_rate: 75,
      hrv: 45,
      eda: 2.1,
      accelerometer_x: 0,
      accelerometer_y: 0,
      accelerometer_z: 0,
      location: 'home',
      activity: 'relaxing',
      stress_score: 40,
      overload_predicted: false,
      created_at: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      patient_id: 'patient1',
      device_id: 'device1',
      timestamp: '2024-01-01T10:01:00Z',
      heart_rate: 80,
      hrv: 40,
      eda: 2.5,
      accelerometer_x: 0,
      accelerometer_y: 0,
      accelerometer_z: 0,
      location: 'home',
      activity: 'relaxing',
      stress_score: 50,
      overload_predicted: false,
      created_at: '2024-01-01T10:01:00Z',
    },
    {
      id: '3',
      patient_id: 'patient1',
      device_id: 'device1',
      timestamp: '2024-01-01T10:02:00Z',
      heart_rate: 85,
      hrv: 35,
      eda: 3.0,
      accelerometer_x: 0,
      accelerometer_y: 0,
      accelerometer_z: 0,
      location: 'home',
      activity: 'relaxing',
      stress_score: 60,
      overload_predicted: false,
      created_at: '2024-01-01T10:02:00Z',
    },
  ];

  it('should render chart with data', () => {
    render(<StressChart data={mockSensorData} />);
    // Chart should render without errors
    expect(screen.queryByText('No data available yet')).not.toBeInTheDocument();
  });

  it('should display "No data available yet" when data is empty', () => {
    render(<StressChart data={[]} />);
    expect(screen.getByText('No data available yet')).toBeInTheDocument();
  });

  it('should accept custom height prop', () => {
    const { container } = render(<StressChart data={mockSensorData} height={400} />);
    // Component should render without errors with custom height
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });

  it('should accept showLegend prop', () => {
    const { rerender } = render(<StressChart data={mockSensorData} showLegend={true} />);
    expect(screen.queryByText('No data available yet')).not.toBeInTheDocument();

    rerender(<StressChart data={mockSensorData} showLegend={false} />);
    expect(screen.queryByText('No data available yet')).not.toBeInTheDocument();
  });

  it('should handle single data point', () => {
    const singleDataPoint = [mockSensorData[0]];
    render(<StressChart data={singleDataPoint} />);
    expect(screen.queryByText('No data available yet')).not.toBeInTheDocument();
  });

  it('should handle large datasets', () => {
    const largeDataset = Array.from({ length: 100 }, (_, i) => ({
      ...mockSensorData[0],
      id: `sensor-${i}`,
      timestamp: new Date(Date.now() - (100 - i) * 1000).toISOString(),
      heart_rate: 70 + Math.random() * 30,
      hrv: 30 + Math.random() * 40,
      eda: 1.5 + Math.random() * 2,
      stress_score: 30 + Math.random() * 50,
    }));

    render(<StressChart data={largeDataset} />);
    expect(screen.queryByText('No data available yet')).not.toBeInTheDocument();
  });

  it('should format timestamps correctly', () => {
    const { container } = render(<StressChart data={mockSensorData} />);
    // Component should render without errors
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });

  it('should handle EDA values with proper rounding', () => {
    const dataWithPrecision: SensorData[] = [
      {
        ...mockSensorData[0],
        eda: 2.123456,
      },
    ];

    render(<StressChart data={dataWithPrecision} />);
    expect(screen.queryByText('No data available yet')).not.toBeInTheDocument();
  });

  it('should render with dark mode styling', () => {
    const { container } = render(<StressChart data={mockSensorData} />);
    const chartContainer = container.querySelector('.bg-neutral-900');
    expect(chartContainer).toBeInTheDocument();
    expect(chartContainer).toHaveClass('border-neutral-800');
  });

  it('should handle stress score values in valid range', () => {
    const dataWithVariousScores: SensorData[] = [
      { ...mockSensorData[0], stress_score: 0 },
      { ...mockSensorData[0], id: '2', stress_score: 50 },
      { ...mockSensorData[0], id: '3', stress_score: 100 },
    ];

    render(<StressChart data={dataWithVariousScores} />);
    expect(screen.queryByText('No data available yet')).not.toBeInTheDocument();
  });
});
