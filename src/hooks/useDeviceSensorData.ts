'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

type SensorData = Database['public']['Tables']['sensor_data']['Row'];

interface SensorDataPoint {
  timestamp: string;
  heart_rate: number;
  hrv: number;
  eda: number;
}

export function useDeviceSensorData(deviceId: string, limit: number = 100) {
  const [data, setData] = useState<SensorDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: sensorData, error: fetchError } = await supabase
          .from('sensor_data')
          .select('timestamp, heart_rate, hrv, eda')
          .eq('device_id', deviceId)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        // Reverse to get chronological order
        const sortedData = (sensorData || []).reverse();
        setData(sortedData as SensorDataPoint[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`sensor_data:device_id=eq.${deviceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data',
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => {
          const newData = payload.new as SensorData;
          setData((prev) => [
            ...prev.slice(-(limit - 1)),
            {
              timestamp: newData.timestamp,
              heart_rate: newData.heart_rate,
              hrv: newData.hrv,
              eda: newData.eda,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [deviceId, limit]);

  return { data, loading, error };
}
