import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ ideaId: string }>;
}

// PUT /api/ideas/[ideaId] - Update an idea
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaId } = await params;
    const body = await request.json();
    const { title, overview, features, brand_fit, image_prompt } = body;

    const supabase = await createClient();

    // Get the idea and its session to check ownership
    const { data: idea, error: fetchError } = await supabase
      .from('ideas')
      .select(`
        id,
        session_id,
        idea_sessions!inner (
          user_id
        )
      `)
      .eq('id', ideaId)
      .single();

    if (fetchError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Check if user owns this idea's session (or is admin)
    const session = Array.isArray(idea.idea_sessions) ? idea.idea_sessions[0] : idea.idea_sessions;
    if (session.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (overview !== undefined) updateData.overview = overview;
    if (features !== undefined) updateData.features = features;
    if (brand_fit !== undefined) updateData.brand_fit = brand_fit;
    if (image_prompt !== undefined) updateData.image_prompt = image_prompt;

    // Update the idea
    const { data: updatedIdea, error: updateError } = await supabase
      .from('ideas')
      .update(updateData)
      .eq('id', ideaId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ idea: updatedIdea });
  } catch (error) {
    console.error('Update idea error:', error);
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}
