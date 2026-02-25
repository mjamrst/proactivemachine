import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthUser } from '@/lib/auth';
import type { IdeaRatingValue } from '@/types/database';

interface RouteParams {
  params: Promise<{ ideaId: string }>;
}

// GET - Get current user's rating for an idea
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { ideaId } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('idea_ratings')
      .select('*')
      .eq('idea_id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ rating: data || null });
  } catch (error) {
    console.error('Error fetching rating:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rating' },
      { status: 500 }
    );
  }
}

// POST - Create or update a rating
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { ideaId } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, comment } = body as { rating: IdeaRatingValue; comment?: string };

    if (!rating || rating < 1 || rating > 3) {
      return NextResponse.json(
        { error: 'Rating must be 1, 2, or 3' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Upsert the rating (insert or update if exists)
    const { data, error } = await supabase
      .from('idea_ratings')
      .upsert(
        {
          idea_id: ideaId,
          user_id: user.id,
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'idea_id,user_id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ rating: data });
  } catch (error) {
    console.error('Error saving rating:', error);
    return NextResponse.json(
      { error: 'Failed to save rating' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a rating
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { ideaId } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('idea_ratings')
      .delete()
      .eq('idea_id', ideaId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { error: 'Failed to delete rating' },
      { status: 500 }
    );
  }
}
