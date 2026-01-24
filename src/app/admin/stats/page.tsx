'use client';

import { useState, useEffect } from 'react';

interface UserStats {
  user_id: string;
  username: string;
  display_name: string;
  role: string;
  created_at: string;
  last_login_at: string | null;
  total_sessions: number;
  total_ideas_generated: number;
  last_activity: string | null;
}

interface RecentActivity {
  id: string;
  created_at: string;
  num_ideas: number;
  idea_lane: string;
  user_id: string | null;
  client: { name: string } | null;
  user: { username: string; display_name: string } | null;
}

interface StatsData {
  summary: {
    totalUsers: number;
    totalSessions: number;
    totalIdeas: number;
  };
  userStats: UserStats[];
  recentActivity: RecentActivity[];
  sessionsByDay: Record<string, number>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Failed to load stats');
        }
      } catch {
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.summary.totalUsers}</p>
              <p className="text-sm text-muted">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.summary.totalSessions}</p>
              <p className="text-sm text-muted">Total Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.summary.totalIdeas}</p>
              <p className="text-sm text-muted">Ideas Generated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Stats Table */}
        <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-card-border">
            <h3 className="font-medium text-foreground">Usage by User</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border bg-card-border/30">
                <th className="text-left px-4 py-2 text-sm font-medium text-muted">User</th>
                <th className="text-right px-4 py-2 text-sm font-medium text-muted">Sessions</th>
                <th className="text-right px-4 py-2 text-sm font-medium text-muted">Ideas</th>
              </tr>
            </thead>
            <tbody>
              {stats.userStats.map((user) => (
                <tr key={user.user_id} className="border-b border-card-border last:border-0">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-medium">
                        {user.display_name[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-foreground">{user.display_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-muted">
                    {user.total_sessions}
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-muted">
                    {user.total_ideas_generated}
                  </td>
                </tr>
              ))}
              {stats.userStats.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted">
                    No usage data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-card-border">
            <h3 className="font-medium text-foreground">Recent Activity</h3>
          </div>
          <div className="divide-y divide-card-border max-h-96 overflow-y-auto">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">
                        {activity.user?.display_name || 'Unknown User'}
                      </span>
                      {' generated '}
                      <span className="font-medium">{activity.num_ideas} idea{activity.num_ideas !== 1 ? 's' : ''}</span>
                      {activity.client && (
                        <>
                          {' for '}
                          <span className="text-accent">{activity.client.name}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {activity.idea_lane.replace('_', ' ')} lane
                    </p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {formatRelativeTime(activity.created_at)}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <div className="px-4 py-8 text-center text-muted">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sessions by Day - Simple list for now */}
      {Object.keys(stats.sessionsByDay).length > 0 && (
        <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-card-border">
            <h3 className="font-medium text-foreground">Sessions (Last 30 Days)</h3>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.sessionsByDay)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 14)
                .map(([date, count]) => (
                  <div
                    key={date}
                    className="px-3 py-1.5 bg-card-border rounded text-sm"
                  >
                    <span className="text-muted">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:</span>
                    <span className="text-foreground font-medium ml-1">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
