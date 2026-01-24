import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, hashPassword } from '@/lib/auth';

// GET /api/admin/users - List all users
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, display_name, role, created_at, last_login_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { username, password, display_name, role } = await request.json();

    if (!username || !password || !display_name) {
      return NextResponse.json(
        { error: 'Username, password, and display name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const userRole = role === 'admin' ? 'admin' : 'user';
    const passwordHash = await hashPassword(password);

    const supabase = await createClient();

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase().trim())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username: username.toLowerCase().trim(),
        password_hash: passwordHash,
        display_name: display_name.trim(),
        role: userRole,
      })
      .select('id, username, display_name, role, created_at')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
