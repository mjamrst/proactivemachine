import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ clientId: string }>;
}

// DELETE /api/clients/[clientId] - Delete a client (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete clients
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { clientId } = await params;
    const supabase = await createClient();

    // Check if client has any sessions
    const { count: sessionCount } = await supabase
      .from('idea_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    if (sessionCount && sessionCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete client with ${sessionCount} existing session(s). Delete sessions first.` },
        { status: 400 }
      );
    }

    // Delete client documents first (if any)
    const { data: documents } = await supabase
      .from('client_documents')
      .select('file_url')
      .eq('client_id', clientId);

    if (documents && documents.length > 0) {
      // Delete files from storage
      const filePaths = documents.map(doc => {
        const url = new URL(doc.file_url);
        const pathParts = url.pathname.split('/');
        return pathParts.slice(-2).join('/'); // Get bucket/filename
      });

      await supabase.storage.from('client-documents').remove(filePaths);

      // Delete document records
      await supabase
        .from('client_documents')
        .delete()
        .eq('client_id', clientId);
    }

    // Delete the client
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

// GET /api/clients/[clientId] - Get a single client
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientId } = await params;
    const supabase = await createClient();

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json(
      { error: 'Failed to get client' },
      { status: 500 }
    );
  }
}
