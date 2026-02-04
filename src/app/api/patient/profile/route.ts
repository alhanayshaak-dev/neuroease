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
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    return NextResponse.json(patientData, { status: 200 });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { diagnosis, support_level, baseline_hr, baseline_hrv, baseline_eda } =
      await request.json();

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

    // Update the patient record
    const { data: updatedPatient, error: updateError } = await supabase
      .from('patients')
      .update({
        diagnosis,
        support_level,
        baseline_hr,
        baseline_hrv,
        baseline_eda,
      })
      .eq('id', patientData.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update patient profile' }, { status: 500 });
    }

    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
