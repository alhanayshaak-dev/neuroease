/**
 * GET /api/analytics/trends
 * Returns analytics trends for the authenticated patient
 * Query parameters:
 *   - timePeriod: 'day' | 'week' | 'month' (default: 'week')
 *   - startDate: ISO date string (optional)
 *   - endDate: ISO date string (optional)
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  calculateAnalyticsTrends,
  filterSensorDataByDateRange,
  getSensorDataForLastDays,
} from '@/utils/analytics';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timePeriod = (searchParams.get('timePeriod') as 'day' | 'week' | 'month') || 'week';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Get patient ID
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get sensor data
    let { data: sensorData, error: sensorError } = await supabase
      .from('sensor_data')
      .select('*')
      .eq('patient_id', patientData.id)
      .order('timestamp', { ascending: false });

    if (sensorError) {
      return NextResponse.json({ error: 'Failed to fetch sensor data' }, { status: 500 });
    }

    if (!sensorData || sensorData.length === 0) {
      return NextResponse.json(
        {
          time_period: timePeriod,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          total_data_points: 0,
          average_stress: 0,
          peak_stress: 0,
          min_stress: 0,
          stress_trend: [],
          stress_by_location: [],
          hardest_times: [],
          trigger_frequencies: [],
          coping_effectiveness: [],
          trend_direction: 'stable',
          trend_percentage_change: 0,
        },
        { status: 200 }
      );
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      sensorData = filterSensorDataByDateRange(sensorData, startDate, endDate);
    } else {
      // Default to last 7 days for week, 30 days for month, 1 day for day
      const days = timePeriod === 'day' ? 1 : timePeriod === 'week' ? 7 : 30;
      sensorData = getSensorDataForLastDays(sensorData, days);
    }

    // Calculate trends
    const trends = calculateAnalyticsTrends(sensorData, timePeriod);

    return NextResponse.json(trends, { status: 200 });
  } catch (error) {
    console.error('Analytics trends error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
