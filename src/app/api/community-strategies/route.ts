import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { filterStrategies, sortStrategiesByRating } from '@/utils/communityStrategies';
import { CommunityStrategy, AgeGroup, StrategyCategory } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * GET /api/community-strategies
 * Search and filter community strategies
 * Query parameters:
 * - ageGroup: 'child' | 'teen' | 'adult' | 'all'
 * - category: strategy category
 * - search: search term
 * - minRating: minimum rating (0-5)
 * - therapistVerified: boolean
 * - sortBy: 'rating' | 'popularity' | 'recent'
 * - limit: number of results (default 20)
 * - offset: pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ageGroup = (searchParams.get('ageGroup') as AgeGroup) || 'all';
    const category = searchParams.get('category') as StrategyCategory | null;
    const search = searchParams.get('search') || '';
    const minRating = searchParams.get('minRating')
      ? parseFloat(searchParams.get('minRating')!)
      : undefined;
    const therapistVerified = searchParams.get('therapistVerified') === 'true';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch all strategies (in production, this would be paginated at the DB level)
    const { data: strategies, error } = await supabase
      .from('community_strategies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!strategies) {
      return NextResponse.json({ data: [], total: 0, page: 1, limit, offset });
    }

    // Apply filters
    let filtered = filterStrategies(strategies as CommunityStrategy[], {
      ageGroup,
      category: category || undefined,
      searchTerm: search || undefined,
      minRating,
      isTherapistVerified: therapistVerified || undefined,
    });

    // Apply sorting
    if (sortBy === 'rating') {
      filtered = sortStrategiesByRating(filtered);
    } else if (sortBy === 'popularity') {
      filtered = filtered.sort((a, b) => b.times_used - a.times_used);
    }
    // 'recent' is already sorted by created_at from the query

    // Apply pagination
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
    });
  } catch (error) {
    console.error('Error fetching community strategies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/community-strategies
 * Create a new community strategy
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, duration_minutes, age_group, contributed_by } = body;

    // Validate required fields
    if (!name || !description || !category || !duration_minutes || !age_group || !contributed_by) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new strategy
    const { data: strategy, error } = await supabase
      .from('community_strategies')
      .insert([
        {
          name,
          description,
          category,
          duration_minutes,
          age_group,
          contributed_by,
          is_therapist_verified: false,
          rating: 0,
          rating_count: 0,
          times_used: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: strategy }, { status: 201 });
  } catch (error) {
    console.error('Error creating community strategy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
