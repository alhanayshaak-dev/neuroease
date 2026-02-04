import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(_request: any, { params }: { params: { id: string } }) {
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

    // Verify the guardian belongs to this patient
    const { data: guardianData, error: guardianError } = await supabase
      .from('guardians')
      .select('*')
      .eq('id', params.id)
      .eq('patient_id', patientData.id)
      .single();

    if (guardianError || !guardianData) {
      return NextResponse.json({ error: 'Guardian not found or unauthorized' }, { status: 404 });
    }

    // Delete the guardian
    const { error: deleteError } = await supabase.from('guardians').delete().eq('id', params.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete guardian' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting guardian:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
