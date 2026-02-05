/**
 * POST /api/sensor-data
 *
 * Receives sensor data from wearable devices, calculates stress score,
 * predicts overload, stores in database, and publishes via Supabase Realtime.
 *
 * **Validates: Requirements 1.1, 2.1, 3.1**
 * 
 * This endpoint processes incoming sensor metrics from connected wearable devices.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateStressScore } from '@/utils/stress';
import { predictOverload, shouldDisplayPrediction } from '@/lib/anthropic';
import type { Database } from '@/types/database';
import type { SensorMetrics, BaselineMetrics } from '@/utils/stress';

/**
 * Get Supabase client instance
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

/**
 * Request body validation schema
 */
interface SensorDataRequest {
  patient_id: string;
  device_id: string;
  timestamp: string;
  heart_rate: number;
  hrv: number;
  eda: number;
  accelerometer_x?: number;
  accelerometer_y?: number;
  accelerometer_z?: number;
  location?: string;
  activity?: string;
}

/**
 * Validate incoming sensor data
 */
function validateSensorData(data: unknown): data is SensorDataRequest {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const req = data as Record<string, unknown>;

  // Required fields
  if (
    typeof req.patient_id !== 'string' ||
    typeof req.device_id !== 'string' ||
    typeof req.timestamp !== 'string' ||
    typeof req.heart_rate !== 'number' ||
    typeof req.hrv !== 'number' ||
    typeof req.eda !== 'number'
  ) {
    return false;
  }

  // Validate ranges
  if (req.heart_rate < 0 || req.heart_rate > 300) {
    return false;
  }

  if (req.hrv < 0 || req.hrv > 500) {
    return false;
  }

  if (req.eda < 0 || req.eda > 100) {
    return false;
  }

  // Optional fields validation
  if (req.accelerometer_x !== undefined && typeof req.accelerometer_x !== 'number') {
    return false;
  }

  if (req.accelerometer_y !== undefined && typeof req.accelerometer_y !== 'number') {
    return false;
  }

  if (req.accelerometer_z !== undefined && typeof req.accelerometer_z !== 'number') {
    return false;
  }

  if (req.location !== undefined && typeof req.location !== 'string') {
    return false;
  }

  if (req.activity !== undefined && typeof req.activity !== 'string') {
    return false;
  }

  return true;
}

/**
 * Get patient baseline metrics from database
 */
async function getPatientBaseline(patientId: string): Promise<BaselineMetrics | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('patients')
      .select('baseline_hr, baseline_hrv, baseline_eda')
      .eq('id', patientId)
      .single();

    if (error) {
      return null;
    }

    if (!data) {
      return null;
    }

    const patientData = data as any;
    return {
      baseline_hr: patientData.baseline_hr || 70,
      baseline_hrv: patientData.baseline_hrv || 50,
      baseline_eda: patientData.baseline_eda || 10,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get recent sensor data for overload prediction
 */
async function getRecentSensorData(
  patientId: string,
  limit: number = 10
): Promise<Array<{ stress_score: number }>> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('sensor_data')
      .select('stress_score')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
}

/**
 * Store sensor data in database
 */
async function storeSensorData(
  data: SensorDataRequest,
  stressScore: number,
  overloadPredicted: boolean,
  overloadPredictedInMinutes?: number
): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: insertedData, error } = await ((supabase
      .from('sensor_data') as any)
      .insert({
        patient_id: data.patient_id,
        device_id: data.device_id,
        timestamp: data.timestamp,
        heart_rate: data.heart_rate,
        hrv: data.hrv,
        eda: data.eda,
        accelerometer_x: data.accelerometer_x || 0,
        accelerometer_y: data.accelerometer_y || 0,
        accelerometer_z: data.accelerometer_z || 0,
        location: data.location || 'unknown',
        activity: data.activity || 'unknown',
        stress_score: stressScore,
        overload_predicted: overloadPredicted,
        overload_predicted_in_minutes: overloadPredictedInMinutes || null,
      }) as any)
      .select('id')
      .single();

    if (error) {
      return null;
    }

    return insertedData?.id || null;
  } catch (error) {
    return null;
  }
}

/**
 * Publish sensor data via Supabase Realtime to connected clients
 */
async function publishSensorData(
  _patientId: string,
  _sensorDataId: string,
  _stressScore: number,
  _overloadPredicted: boolean
): Promise<void> {
  try {
    // Supabase Realtime automatically publishes changes to subscribed clients
    // when data is inserted/updated. This is handled by the database trigger.
    // We just need to ensure the data was stored successfully.
  } catch (error) {
    // Silently fail on publish errors
  }
}

/**
 * POST /api/sensor-data
 *
 * Handles incoming sensor data from wearable devices
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate sensor data
    if (!validateSensorData(body)) {
      return NextResponse.json(
        {
          error: 'Invalid sensor data',
          message:
            'Missing or invalid required fields: patient_id, device_id, timestamp, heart_rate, hrv, eda',
        },
        { status: 400 }
      );
    }

    const sensorDataRequest = body as SensorDataRequest;

    // Get patient baseline metrics
    const baseline = await getPatientBaseline(sensorDataRequest.patient_id);
    if (!baseline) {
      return NextResponse.json(
        {
          error: 'Patient not found',
          message: 'Unable to retrieve patient baseline metrics',
        },
        { status: 404 }
      );
    }

    // Calculate stress score
    const metrics: SensorMetrics = {
      heart_rate: sensorDataRequest.heart_rate,
      hrv: sensorDataRequest.hrv,
      eda: sensorDataRequest.eda,
    };

    const stressScore = calculateStressScore(metrics, baseline);

    // Get recent sensor data for overload prediction analysis
    const recentData = await getRecentSensorData(sensorDataRequest.patient_id);

    // Predict overload
    let overloadPredicted = false;
    let overloadPredictedInMinutes: number | undefined;

    try {
      const prediction = await predictOverload(
        [
          ...recentData.map((d, i) => ({
            stress_score: d.stress_score,
            timestamp: new Date(Date.now() - (recentData.length - i) * 60000).toISOString(),
          })),
          { stress_score: stressScore, timestamp: sensorDataRequest.timestamp },
        ] as any,
        {
          location: sensorDataRequest.location,
          activity: sensorDataRequest.activity,
        }
      );

      if (shouldDisplayPrediction(prediction)) {
        overloadPredicted = true;
        overloadPredictedInMinutes = prediction.timeToOverloadMinutes;
      }
    } catch (error) {
      // Continue without prediction if AI fails
    }

    // Store sensor data in database
    const sensorDataId = await storeSensorData(
      sensorDataRequest,
      stressScore,
      overloadPredicted,
      overloadPredictedInMinutes
    );

    if (!sensorDataId) {
      return NextResponse.json(
        {
          error: 'Failed to store sensor data',
          message: 'Unable to save sensor data to database',
        },
        { status: 500 }
      );
    }

    // Publish via Supabase Realtime
    await publishSensorData(
      sensorDataRequest.patient_id,
      sensorDataId,
      stressScore,
      overloadPredicted
    );

    // Return response
    return NextResponse.json(
      {
        data: {
          sensor_data_id: sensorDataId,
          stress_score: stressScore,
          overload_predicted: overloadPredicted,
          overload_predicted_in_minutes: overloadPredictedInMinutes,
        },
        message: 'Sensor data received and processed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing sensor data',
      },
      { status: 500 }
    );
  }
}
