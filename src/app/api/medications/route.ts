import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
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

    // Get all medications for the patient
    const { data: medications, error: medicationError } = await supabase
      .from('medication_tracker')
      .select('*')
      .eq('patient_id', patientData.id)
      .order('created_at', { ascending: false });

    if (medicationError) {
      return NextResponse.json({ error: 'Failed to fetch medications' }, { status: 500 });
    }

    return NextResponse.json(medications, { status: 200 });
  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { medication_name, dosage, frequency, start_date, end_date } = await request.json();

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
    if (!medication_name || !dosage || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields: medication_name, dosage, frequency' },
        { status: 400 }
      );
    }

    // Create new medication record
    const { data: newMedication, error: createError } = await supabase
      .from('medication_tracker')
      .insert({
        patient_id: patientData.id,
        medication_name,
        dosage,
        frequency,
        start_date,
        end_date,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 });
    }

    return NextResponse.json(newMedication, { status: 201 });
  } catch (error) {
    console.error('Error creating medication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
