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

    // Get all coping strategies for the patient
    const { data: strategies, error: strategiesError } = await supabase
      .from('coping_strategies')
      .select('*')
      .eq('patient_id', patientData.id)
      .order('success_rate', { ascending: false });

    if (strategiesError) {
      return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 });
    }

    return NextResponse.json(strategies, { status: 200 });
  } catch (error) {
    console.error('Error fetching coping strategies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, description, duration_minutes, created_by } = await request.json();

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
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category' },
        { status: 400 }
      );
    }

    // Create new coping strategy record
    const { data: newStrategy, error: createError } = await supabase
      .from('coping_strategies')
      .insert({
        patient_id: patientData.id,
        name,
        category,
        description,
        duration_minutes,
        created_by: created_by || 'user',
        success_rate: 0,
        times_used: 0,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: 'Failed to create strategy' }, { status: 500 });
    }

    return NextResponse.json(newStrategy, { status: 201 });
  } catch (error) {
    console.error('Error creating coping strategy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
