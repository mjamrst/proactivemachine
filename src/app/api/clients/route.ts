import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthUser } from '@/lib/auth';

// GET /api/clients - List all clients with session counts
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

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

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, domain } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: client, error } = await supabase
      .from('clients')
      .insert({ name: name.trim(), domain: domain || null })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
