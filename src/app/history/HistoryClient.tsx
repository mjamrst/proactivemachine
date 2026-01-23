'use client';

import { useState } from 'react';
import type { IdeaSessionWithDetails } from '@/types/database';

interface HistoryClientProps {
  sessions: IdeaSessionWithDetails[];
}

export function HistoryClient({ sessions }: HistoryClientProps) {
  const [filter, setFilter] = useState<string>('all');

  const laneLabels: Record<string, string> = {
    live_experience: 'Live Experience',
    digital: 'Digital',
    content: 'Content',
  };

  const filteredSessions = filter === 'all'
    ? sessions
    : sessions.filter(s => s.idea_lane === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-card-bg border border-card-border rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card-border flex items-center justify-center">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No sessions yet</h3>
        <p className="text-muted mb-6">
          Generate your first batch of ideas to see them here
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Ideas
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-accent text-white'
              : 'bg-card-bg border border-card-border text-muted hover:text-foreground'
          }`}
        >
          All ({sessions.length})
        </button>
        {['live_experience', 'digital', 'content'].map((lane) => {
          const count = sessions.filter(s => s.idea_lane === lane).length;
          if (count === 0) return null;
          return (
            <button
              key={lane}
              onClick={() => setFilter(lane)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === lane
                  ? 'bg-accent text-white'
                  : 'bg-card-bg border border-card-border text-muted hover:text-foreground'
              }`}
            >
              {laneLabels[lane]} ({count})
            </button>
          );
        })}
      </div>

      {/* Sessions List */}
      <div className="grid gap-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="bg-card-bg border border-card-border rounded-xl p-6 hover:border-muted transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {session.client_name}
                  </h3>
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
                    {laneLabels[session.idea_lane]}
                  </span>
                  {session.tech_modifiers && session.tech_modifiers.length > 0 && (
                    <span className="px-2 py-0.5 bg-card-border text-muted text-xs rounded">
                      {session.tech_modifiers.join(', ')}
                    </span>
                  )}
                </div>
                <p className="text-muted text-sm mb-2">
                  {session.ideas_count} idea{session.ideas_count !== 1 ? 's' : ''} generated
                </p>
                <p className="text-muted text-xs">
                  {formatDate(session.created_at)}
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/session/${session.id}`}
                  className="px-4 py-2 bg-card-border text-foreground rounded-lg text-sm font-medium hover:bg-muted/20 transition-colors"
                >
                  View Ideas
                </a>
                <a
                  href={`/presentation/${session.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Presentation
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
