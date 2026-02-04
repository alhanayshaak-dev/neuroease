import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeviceTile } from '../DeviceTile';
import { Device } from '@/types/database';

describe('DeviceTile Component', () => {
  const mockDevice: Device = {
    id: '1',
    patient_id: '1',
    device_type: 'neuroband',
    device_name: 'My Neuroband',
    mac_address: '00:11:22:33:44:55',
    battery_level: 80,
    is_connected: true,
    firmware_version: '1.0.0',
    last_sync: new Date().toISOString(),
    damage_state: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('should render device name and type', () => {
    render(<DeviceTile device={mockDevice} />);
    expect(screen.getByText('My Neuroband')).toBeInTheDocument();
    expect(screen.getByText('Neuroband')).toBeInTheDocument();
  });

  it('should display battery level', () => {
    render(<DeviceTile device={mockDevice} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('should display connection status as connected', () => {
    render(<DeviceTile device={mockDevice} />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('should display connection status as disconnected', () => {
    const disconnectedDevice = { ...mockDevice, is_connected: false };
    render(<DeviceTile device={disconnectedDevice} />);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('should display firmware version', () => {
    render(<DeviceTile device={mockDevice} />);
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  it('should display last sync time', () => {
    render(<DeviceTile device={mockDevice} />);
    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  it('should display damage state when present', () => {
    const damagedDevice = {
      ...mockDevice,
      damage_state: { screen: 'cracked', battery: 'swollen' },
    };
    render(<DeviceTile device={damagedDevice} />);
    expect(screen.getByText(/screen: cracked/)).toBeInTheDocument();
    expect(screen.getByText(/battery: swollen/)).toBeInTheDocument();
  });

  it('should not display damage section when no damage', () => {
    render(<DeviceTile device={mockDevice} />);
    expect(screen.queryByText('Damage Report')).not.toBeInTheDocument();
  });

  it('should render settings button when onSettings provided', () => {
    const mockSettings = jest.fn();
    render(<DeviceTile device={mockDevice} onSettings={mockSettings} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render remove button when onRemove provided', () => {
    const mockRemove = jest.fn();
    render(<DeviceTile device={mockDevice} onRemove={mockRemove} />);
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('should display correct device type for neurobud', () => {
    const neurobudDevice = { ...mockDevice, device_type: 'neurobud' as const };
    render(<DeviceTile device={neurobudDevice} />);
    expect(screen.getByText('Neurobud')).toBeInTheDocument();
  });

  it('should display correct device type for neurolens', () => {
    const neurolensDevice = { ...mockDevice, device_type: 'neurolens' as const };
    render(<DeviceTile device={neurolensDevice} />);
    expect(screen.getByText('NeuroLens')).toBeInTheDocument();
  });

  it('should display low battery warning for battery below 20%', () => {
    const lowBatteryDevice = { ...mockDevice, battery_level: 15 };
    render(<DeviceTile device={lowBatteryDevice} />);
    expect(screen.getByText('15%')).toBeInTheDocument();
  });

  it('should display full battery for battery above 80%', () => {
    const fullBatteryDevice = { ...mockDevice, battery_level: 95 };
    render(<DeviceTile device={fullBatteryDevice} />);
    expect(screen.getByText('95%')).toBeInTheDocument();
  });
});
