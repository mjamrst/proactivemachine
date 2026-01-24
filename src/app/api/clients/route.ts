import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

// GET /api/clients - List all clients with session counts
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all clients with their session counts
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        *,
        idea_sessions(count)
      `)
      .order('name');

    if (error) {
      throw error;
    }

    // Format the response
    const formattedClients = clients.map(client => ({
      ...client,
      session_count: client.idea_sessions?.[0]?.count || 0,
      idea_sessions: undefined,
    }));

    return NextResponse.json({ clients: formattedClients });
  } catch (error) {
    console.error('List clients error:', error);
    return NextResponse.json(
      { error: 'Failed to list clients' },
      { status: 500 }
    );
  }
}
