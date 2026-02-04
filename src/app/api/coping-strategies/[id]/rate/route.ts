import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { effectiveness_rating } = await request.json();

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

    // Get the strategy record
    const { data: strategy, error: strategyError } = await supabase
      .from('coping_strategies')
      .select('*')
      .eq('id', params.id)
      .eq('patient_id', patientData.id)
      .single();

    if (strategyError || !strategy) {
      return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
    }

    // Validate effectiveness rating (0-1)
    if (
      typeof effectiveness_rating !== 'number' ||
      effectiveness_rating < 0 ||
      effectiveness_rating > 1
    ) {
      return NextResponse.json(
        { error: 'Effectiveness rating must be between 0 and 1' },
        { status: 400 }
      );
    }

    // Calculate new success rate using weighted average
    const currentSuccessRate = strategy.success_rate || 0;
    const timesUsed = strategy.times_used || 0;
    const newTimesUsed = timesUsed + 1;

    // Weighted average: (old_rate * old_count + new_rating) / new_count
    const newSuccessRate = (currentSuccessRate * timesUsed + effectiveness_rating) / newTimesUsed;

    // Update strategy record
    const { data: updatedStrategy, error: updateError } = await supabase
      .from('coping_strategies')
      .update({
        success_rate: newSuccessRate,
        times_used: newTimesUsed,
        last_used: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to rate strategy' }, { status: 500 });
    }

    return NextResponse.json(updatedStrategy, { status: 200 });
  } catch (error) {
    console.error('Error rating strategy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
