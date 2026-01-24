import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, hashPassword } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

// PUT /api/admin/users/[userId] - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { userId } = await params;
    const { display_name, first_name, last_name, office, role, password } = await request.json();

    const supabase = await createClient();

    // Build update object
    const updates: Record<string, string | null> = {};

    if (display_name !== undefined) {
      updates.display_name = display_name.trim();
    }

    if (first_name !== undefined) {
      updates.first_name = first_name?.trim() || null;
    }

    if (last_name !== undefined) {
      updates.last_name = last_name?.trim() || null;
    }

    if (office !== undefined) {
      const validOffices = ['LA', 'New York', 'Munich', 'UK', 'Singapore', 'Washington DC', 'Dallas'];
      if (office && !validOffices.includes(office)) {
        return NextResponse.json(
          { error: 'Invalid office location' },
          { status: 400 }
        );
      }
      updates.office = office || null;
    }

    if (role && (role === 'admin' || role === 'user')) {
      // Prevent admin from demoting themselves
      if (userId === user.id && role !== 'admin') {
        return NextResponse.json(
          { error: 'Cannot change your own role' },
          { status: 400 }
        );
      }
      updates.role = role;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      updates.password_hash = await hashPassword(password);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, username, display_name, first_name, last_name, office, role, avatar_url, created_at, last_login_at')
      .single();

    if (error) {
      throw error;
    }

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[userId] - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { userId } = await params;

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
