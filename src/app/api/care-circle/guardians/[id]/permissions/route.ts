import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Validate permissions object
function validatePermissions(permissions: any): boolean {
  if (!permissions || typeof permissions !== 'object') {
    return false;
  }

  const requiredKeys = [
    'see_status',
    'see_alerts',
    'see_trends',
    'see_medical',
    'trigger_emergency',
    'suggest_strategies',
    'access_mic',
    'access_camera',
  ];

  return requiredKeys.every((key) => typeof permissions[key] === 'boolean');
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { permissions } = await request.json();

    // Validate permissions
    if (!validatePermissions(permissions)) {
      return NextResponse.json({ error: 'Invalid permissions object' }, { status: 400 });
    }

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

    // Update the permissions
    const { data: updatedGuardian, error: updateError } = await supabase
      .from('guardians')
      .update({ permissions })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
    }

    return NextResponse.json(updatedGuardian, { status: 200 });
  } catch (error) {
    console.error('Error updating guardian permissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
