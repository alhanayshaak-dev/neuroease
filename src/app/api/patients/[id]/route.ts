import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// API route for fetching patient data by ID
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(_request: any, { params }: { params: { id: string } }) {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the patient or a guardian with permission
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', params.id)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Verify access: either the patient themselves or a guardian with see_status permission
    const isPatient = patientData.user_id === user.id;

    if (!isPatient) {
      // Check if user is a guardian with permission
      const { data: guardianData } = await supabase
        .from('guardians')
        .select('permissions')
        .eq('patient_id', params.id)
        .eq('guardian_user_id', user.id)
        .single();

      if (!guardianData || !guardianData.permissions.see_status) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    return NextResponse.json(patientData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
