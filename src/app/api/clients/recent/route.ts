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

    // Get the 5 most recently used clients from sessions across all users
    // Using a subquery to get distinct clients ordered by most recent session
    const { data, error } = await supabase
      .from('idea_sessions')
      .select('client_id, created_at, clients(id, name, domain)')
      .order('created_at', { ascending: false })
      .limit(50); // Get more to ensure we have enough unique clients

    if (error) throw error;

    // Extract unique clients, maintaining order by most recent use
    const seenClientIds = new Set<string>();
    const recentClients: Array<{ id: string; name: string; domain: string | null }> = [];

    for (const session of data || []) {
      const clientData = session.clients as unknown as { id: string; name: string; domain: string | null } | null;
      if (clientData && !seenClientIds.has(session.client_id)) {
        seenClientIds.add(session.client_id);
        recentClients.push({
          id: clientData.id,
          name: clientData.name,
          domain: clientData.domain,
        });
        if (recentClients.length >= 5) break;
      }
    }

    return NextResponse.json({ clients: recentClients });
  } catch (error) {
    console.error('Error fetching recent clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent clients' },
      { status: 500 }
    );
  }
}
