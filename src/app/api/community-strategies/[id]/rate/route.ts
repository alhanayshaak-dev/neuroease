import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * POST /api/community-strategies/[id]/rate
 * Rate a community strategy
 * Body:
 * - rating: number (1-5)
 * - feedback: string (optional)
 * - patient_id: string
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { rating, feedback, patient_id } = body;
    const strategyId = params.id;

    // Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    if (!patient_id) {
      return NextResponse.json({ error: 'patient_id is required' }, { status: 400 });
    }

    // Create rating record
    const { data: ratingRecord, error: ratingError } = await supabase
      .from('community_strategy_ratings')
      .insert([
        {
          strategy_id: strategyId,
          patient_id,
          rating,
          feedback: feedback || null,
        },
      ])
      .select()
      .single();

    if (ratingError) {
      return NextResponse.json({ error: ratingError.message }, { status: 500 });
    }

    // Get all ratings for this strategy
    const { data: allRatings, error: fetchError } = await supabase
      .from('community_strategy_ratings')
      .select('rating')
      .eq('strategy_id', strategyId);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Calculate new average rating
    const ratings = (allRatings || []).map((r: any) => r.rating);
    const averageRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) /
          10
        : 0;

    // Update strategy with new rating
    const { data: updatedStrategy, error: updateError } = await supabase
      .from('community_strategies')
      .update({
        rating: averageRating,
        rating_count: ratings.length,
      })
      .eq('id', strategyId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(
      { data: { rating: ratingRecord, strategy: updatedStrategy } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error rating community strategy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
