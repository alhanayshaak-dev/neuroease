import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the patient record for the current user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Get all appointments for the patient
    const { data: appointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientData.id)
      .order('scheduled_time', { ascending: true });

    if (appointmentError) {
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      appointment_type,
      title,
      scheduled_time,
      duration_minutes,
      location,
      sensory_prep,
      notes,
    } = await request.json();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the patient record for the current user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Validate required fields
    if (!title || !scheduled_time) {
      return NextResponse.json(
        { error: 'Missing required fields: title, scheduled_time' },
        { status: 400 }
      );
    }

    // Create new appointment record
    const { data: newAppointment, error: createError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientData.id,
        appointment_type,
        title,
        scheduled_time,
        duration_minutes,
        location,
        sensory_prep: sensory_prep || {},
        notes,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
