import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { deviceType, deviceName, macAddress, firmwareVersion } = await request.json();

    // Validate required fields
    if (!deviceType || !deviceName || !macAddress || !firmwareVersion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate device type
    const validDeviceTypes = ['neuroband', 'neurobud', 'neurolens'];
    if (!validDeviceTypes.includes(deviceType)) {
      return NextResponse.json({ error: 'Invalid device type' }, { status: 400 });
    }

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get patient ID from user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Check if device with same MAC address already exists
    const { data: existingDevice } = await supabase
      .from('devices')
      .select('id')
      .eq('mac_address', macAddress)
      .eq('patient_id', patientData.id)
      .single();

    if (existingDevice) {
      return NextResponse.json({ error: 'Device already registered' }, { status: 409 });
    }

    // Register new device
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .insert({
        patient_id: patientData.id,
        device_type: deviceType,
        device_name: deviceName,
        mac_address: macAddress,
        firmware_version: firmwareVersion,
        battery_level: 100,
        is_connected: false,
        last_sync: new Date().toISOString(),
        damage_state: {},
      })
      .select()
      .single();

    if (deviceError) {
      return NextResponse.json({ error: 'Failed to register device' }, { status: 500 });
    }

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('Device registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
