import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { guardianEmail, relationship, permissions } = await request.json();

    // Validate input
    if (!guardianEmail || !relationship) {
      return NextResponse.json(
        { error: 'Missing required fields: guardianEmail, relationship' },
        { status: 400 }
      );
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

    // Find the guardian user by email
    const { data: guardianUserData, error: guardianUserError } = await supabase
      .from('users')
      .select('id')
      .eq('email', guardianEmail)
      .single();

    if (guardianUserError || !guardianUserData) {
      return NextResponse.json({ error: 'Guardian user not found' }, { status: 404 });
    }

    // Create the guardian record with default permissions if not provided
    const defaultPermissions = {
      see_status: true,
      see_alerts: true,
      see_trends: false,
      see_medical: false,
      trigger_emergency: false,
      suggest_strategies: false,
      access_mic: false,
      access_camera: false,
    };

    const { data: guardianRecord, error: createError } = await supabase
      .from('guardians')
      .insert({
        patient_id: patientData.id,
        guardian_user_id: guardianUserData.id,
        relationship,
        permissions: permissions || defaultPermissions,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: 'Failed to create guardian record' }, { status: 500 });
    }

    return NextResponse.json(guardianRecord, { status: 201 });
  } catch (error) {
    console.error('Error inviting guardian:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
