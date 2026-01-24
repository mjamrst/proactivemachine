import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';

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

    // Get user stats from view
    const { data: userStats, error: statsError } = await supabase
      .from('user_usage_stats')
      .select('*')
      .order('total_sessions', { ascending: false });

    if (statsError) {
      throw statsError;
    }

    // Get total counts
    const [
      { count: totalUsers },
      { count: totalSessions },
      { count: totalIdeas },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('idea_sessions').select('*', { count: 'exact', head: true }),
      supabase.from('ideas').select('*', { count: 'exact', head: true }),
    ]);

    // Get recent activity (last 10 sessions with user info)
    const { data: recentActivity, error: activityError } = await supabase
      .from('idea_sessions')
      .select(`
        id,
        created_at,
        num_ideas,
        idea_lane,
        user_id,
        client:clients(name),
        user:users(username, display_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (activityError) {
      console.error('Activity error:', activityError);
    }

    // Get sessions per day for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: dailySessions, error: dailyError } = await supabase
      .from('idea_sessions')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (dailyError) {
      console.error('Daily sessions error:', dailyError);
    }

    // Group sessions by day
    const sessionsByDay: Record<string, number> = {};
    dailySessions?.forEach(session => {
      const date = new Date(session.created_at).toISOString().split('T')[0];
      sessionsByDay[date] = (sessionsByDay[date] || 0) + 1;
    });

    return NextResponse.json({
      summary: {
        totalUsers: totalUsers || 0,
        totalSessions: totalSessions || 0,
        totalIdeas: totalIdeas || 0,
      },
      userStats: userStats || [],
      recentActivity: recentActivity || [],
      sessionsByDay,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
