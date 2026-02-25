import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('List properties error:', error);
    return NextResponse.json(
      { error: 'Failed to list properties' },
      { status: 500 }
    );
  }
}
