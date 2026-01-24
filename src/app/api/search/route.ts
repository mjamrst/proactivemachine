import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const supabase = await createClient();

    // Search through ideas - title, overview, features, brand_fit
    // Use ilike for case-insensitive search
    const searchPattern = `%${query}%`;

    // Build the query to search ideas and join with sessions
    let ideasQuery = supabase
      .from('ideas')
      .select(`
        id,
        title,
        overview,
        features,
        brand_fit,
        session_id,
        idea_sessions!inner (
          id,
          client_id,
          idea_lane,
          tech_modifiers,
          created_at,
          user_id,
          clients!inner (
            name
          )
        )
      `)
      .or(`title.ilike.${searchPattern},overview.ilike.${searchPattern},brand_fit.ilike.${searchPattern}`);

    // Filter by user unless admin
    if (user.role !== 'admin') {
      ideasQuery = ideasQuery.eq('idea_sessions.user_id', user.id);
    }

    const { data: ideas, error } = await ideasQuery
      .order('created_at', { ascending: false, referencedTable: 'idea_sessions' })
      .limit(50);

    if (error) {
      console.error('Search error:', error);
      throw error;
    }

    // Also search in features array (need separate query since array search is different)
    let featuresQuery = supabase
      .from('ideas')
      .select(`
        id,
        title,
        overview,
        features,
        brand_fit,
        session_id,
        idea_sessions!inner (
          id,
          client_id,
          idea_lane,
          tech_modifiers,
          created_at,
          user_id,
          clients!inner (
            name
          )
        )
      `)
      .contains('features', [query]);

    if (user.role !== 'admin') {
      featuresQuery = featuresQuery.eq('idea_sessions.user_id', user.id);
    }

    const { data: featureIdeas } = await featuresQuery.limit(20);

    // Combine and deduplicate results
    const allIdeas = [...(ideas || [])];
    const seenIds = new Set(allIdeas.map(i => i.id));

    featureIdeas?.forEach(idea => {
      if (!seenIds.has(idea.id)) {
        allIdeas.push(idea);
        seenIds.add(idea.id);
      }
    });

    // Format results with highlights
    const results = allIdeas.map(idea => {
      // Supabase returns the joined relation - handle both array and object forms
      const sessionData = idea.idea_sessions;
      const session = Array.isArray(sessionData) ? sessionData[0] : sessionData;
      const clientData = session?.clients;
      const client = Array.isArray(clientData) ? clientData[0] : clientData;

      if (!session || !client) return null;

      // Create a snippet from the overview
      let snippet = idea.overview;
      if (snippet.length > 200) {
        // Try to find the query in the text and show context around it
        const lowerOverview = snippet.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerOverview.indexOf(lowerQuery);

        if (index > 0) {
          const start = Math.max(0, index - 50);
          const end = Math.min(snippet.length, index + query.length + 100);
          snippet = (start > 0 ? '...' : '') + snippet.slice(start, end) + (end < snippet.length ? '...' : '');
        } else {
          snippet = snippet.slice(0, 200) + '...';
        }
      }

      return {
        idea_id: idea.id,
        session_id: idea.session_id,
        title: idea.title,
        snippet,
        client_name: client.name,
        idea_lane: session.idea_lane,
        tech_modifiers: session.tech_modifiers,
        created_at: session.created_at,
      };
    }).filter(Boolean);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
