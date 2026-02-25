import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    // Fetch full user data including avatar_url from database
    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, display_name, role, avatar_url')
      .eq('id', authUser.id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { user: null },
      { status: 500 }
    );
  }
}
