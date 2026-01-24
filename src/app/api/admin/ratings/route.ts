import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get overall summary
    const { data: summaryData, error: summaryError } = await supabase
      .from('idea_ratings')
      .select('rating');

    if (summaryError) throw summaryError;

    const summary = {
      total_ratings: summaryData?.length || 0,
      one_star_count: summaryData?.filter(r => r.rating === 1).length || 0,
      two_star_count: summaryData?.filter(r => r.rating === 2).length || 0,
      three_star_count: summaryData?.filter(r => r.rating === 3).length || 0,
      average_rating: summaryData?.length
        ? Math.round((summaryData.reduce((sum, r) => sum + r.rating, 0) / summaryData.length) * 100) / 100
        : 0,
    };

    // Get ratings by lane
    const { data: byLaneData, error: byLaneError } = await supabase
      .from('idea_ratings')
      .select(`
        rating,
        ideas!inner(
          session_id,
          idea_sessions!inner(idea_lane)
        )
      `);

    if (byLaneError) throw byLaneError;

    // Process by lane
    const laneMap = new Map<string, { ratings: number[] }>();
    for (const item of byLaneData || []) {
      const ideas = item.ideas as unknown as { idea_sessions: { idea_lane: string } };
      const lane = ideas?.idea_sessions?.idea_lane;
      if (lane) {
        if (!laneMap.has(lane)) {
          laneMap.set(lane, { ratings: [] });
        }
        laneMap.get(lane)!.ratings.push(item.rating);
      }
    }

    const byLane = Array.from(laneMap.entries()).map(([idea_lane, data]) => ({
      idea_lane,
      total_ratings: data.ratings.length,
      one_star_count: data.ratings.filter(r => r === 1).length,
      two_star_count: data.ratings.filter(r => r === 2).length,
      three_star_count: data.ratings.filter(r => r === 3).length,
      average_rating: Math.round((data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length) * 100) / 100,
    })).sort((a, b) => b.average_rating - a.average_rating);

    // Get recent ratings with details
    const { data: recentData, error: recentError } = await supabase
      .from('idea_ratings')
      .select(`
        id,
        rating,
        comment,
        created_at,
        ideas!inner(
          id,
          title,
          session_id,
          idea_sessions!inner(
            idea_lane,
            clients!inner(name)
          )
        ),
        users!inner(display_name)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (recentError) throw recentError;

    const recentRatings = (recentData || []).map(item => {
      const ideas = item.ideas as unknown as {
        id: string;
        title: string;
        session_id: string;
        idea_sessions: {
          idea_lane: string;
          clients: { name: string };
        };
      };
      const users = item.users as unknown as { display_name: string };

      return {
        rating_id: item.id,
        rating: item.rating,
        comment: item.comment,
        rated_at: item.created_at,
        idea_id: ideas?.id,
        idea_title: ideas?.title,
        session_id: ideas?.session_id,
        idea_lane: ideas?.idea_sessions?.idea_lane,
        client_name: ideas?.idea_sessions?.clients?.name,
        rater_display_name: users?.display_name,
      };
    });

    // Get ratings by output style (if we stored it - for now we'll skip this)
    // This would require storing output_style on idea_sessions

    return NextResponse.json({
      summary,
      byLane,
      recentRatings,
    });
  } catch (error) {
    console.error('Error fetching rating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rating analytics' },
      { status: 500 }
    );
  }
}
