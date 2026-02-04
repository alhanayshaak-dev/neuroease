import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Get the current user (patient)
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

    // Get all guardians for this patient with their user info
    const { data: guardians, error: guardiansError } = await supabase
      .from('guardians')
      .select(
        `
        *,
        guardian_user:guardian_user_id(id, email, name, avatar_url, pronouns)
      `
      )
      .eq('patient_id', patientData.id);

    if (guardiansError) {
      return NextResponse.json({ error: 'Failed to fetch guardians' }, { status: 500 });
    }

    return NextResponse.json(guardians || [], { status: 200 });
  } catch (error) {
    console.error('Error fetching guardians:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
