'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AppLayout } from '@/components/AppLayout';
import { DeviceTile } from '@/components/DeviceTile';
import { SensorDataCharts } from '@/components/SensorDataCharts';
import { useDeviceSensorData } from '@/hooks/useDeviceSensorData';
import { Device } from '@/types/database';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchDevices = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError('Not authenticated');
          return;
        }

        // Get patient ID
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (patientError || !patientData) {
          setError('Patient not found');
          return;
        }

        // Get devices
        const { data: devicesData, error: devicesError } = await supabase
          .from('devices')
          .select('*')
          .eq('patient_id', patientData.id)
          .order('created_at', { ascending: false });

        if (devicesError) {
          setError(devicesError.message);
          return;
        }

        setDevices(devicesData || []);
        if (devicesData && devicesData.length > 0) {
          setSelectedDeviceId(devicesData[0].id);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();

    // Subscribe to device updates
    const subscription = supabase
      .channel('devices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
        },
        () => {
          fetchDevices();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const { data: sensorData, loading: sensorLoading } = useDeviceSensorData(
    selectedDeviceId || '',
    100
  );

  return (
    <AppLayout headerProps={{ userName: 'Violet', supportLevel: 1 }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Devices</h1>
          <p className="text-neutral-400">Manage your wearable devices and view sensor data.</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-100">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
            <p className="text-neutral-400">Loading devices...</p>
          </div>
        ) : devices.length === 0 ? (
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
            <p className="text-neutral-400">No devices registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold text-neutral-100">Your Devices</h2>
              {devices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`cursor-pointer transition-all ${
                    selectedDeviceId === device.id
                      ? 'ring-2 ring-teal-500'
                      : 'hover:ring-1 hover:ring-neutral-600'
                  }`}
                >
                  <DeviceTile device={device} />
                </div>
              ))}
            </div>

            {/* Sensor Data Charts */}
            <div className="lg:col-span-2">
              {selectedDevice ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-neutral-100">
                    {selectedDevice.device_name} - Sensor Data
                  </h2>
                  <SensorDataCharts data={sensorData} loading={sensorLoading} />
                </div>
              ) : (
                <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                  <p className="text-neutral-400">Select a device to view sensor data</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
