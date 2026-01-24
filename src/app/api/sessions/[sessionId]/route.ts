import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

// PUT /api/sessions/[sessionId] - Update session (e.g., name)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await params;
    const { name } = await request.json();

    const supabase = await createClient();

    // Check if user owns this session (or is admin)
    const { data: session, error: fetchError } = await supabase
      .from('idea_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Only allow owner or admin to update
    if (session.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the session
    const { data: updatedSession, error: updateError } = await supabase
      .from('idea_sessions')
      .update({ name: name?.trim() || null })
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
