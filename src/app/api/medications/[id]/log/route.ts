import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { taken_at } = await request.json();

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

    // Get the medication record
    const { data: medication, error: medicationError } = await supabase
      .from('medication_tracker')
      .select('*')
      .eq('id', params.id)
      .eq('patient_id', patientData.id)
      .single();

    if (medicationError || !medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    // Parse the taken_at time or use current time
    const timeToLog = taken_at
      ? new Date(taken_at).toTimeString().split(' ')[0]
      : new Date().toTimeString().split(' ')[0];

    // Update medication record with new taken time
    const existingTimes = medication.taken_times || [];
    const updatedTimes = [...existingTimes, timeToLog];

    const { data: updatedMedication, error: updateError } = await supabase
      .from('medication_tracker')
      .update({
        taken_times: updatedTimes,
        taken_today: true,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to log medication' }, { status: 500 });
    }

    return NextResponse.json(updatedMedication, { status: 200 });
  } catch (error) {
    console.error('Error logging medication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
