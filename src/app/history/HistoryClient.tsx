'use client';

import { useState, useEffect, useCallback } from 'react';
import type { IdeaSessionWithDetails } from '@/types/database';

interface SearchResult {
  idea_id: string;
  session_id: string;
  title: string;
  snippet: string;
  client_name: string;
  idea_lane: string;
  tech_modifiers: string[] | null;
  created_at: string;
}

interface HistoryClientProps {
  sessions: IdeaSessionWithDetails[];
}

interface SessionsByClient {
  [clientName: string]: IdeaSessionWithDetails[];
}

export function HistoryClient({ sessions: initialSessions }: HistoryClientProps) {
  const [sessions, setSessions] = useState<IdeaSessionWithDetails[]>(initialSessions);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Debounced search
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const laneLabels: Record<string, string> = {
    live_experience: 'Live Experience',
    digital: 'Digital',
    content: 'Content',
  };

  const filteredSessions = filter === 'all'
    ? sessions
    : sessions.filter(s => s.idea_lane === filter);

  // Group sessions by client
  const sessionsByClient: SessionsByClient = filteredSessions.reduce((acc, session) => {
    const clientName = session.client_name;
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(session);
    return acc;
  }, {} as SessionsByClient);

  // Sort clients alphabetically
  const sortedClients = Object.keys(sessionsByClient).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  // Initialize all clients as expanded on first render
  useEffect(() => {
    if (expandedClients.size === 0 && sortedClients.length > 0) {
      setExpandedClients(new Set(sortedClients));
    }
  }, [sortedClients, expandedClients.size]);

  const toggleClient = (clientName: string) => {
    setExpandedClients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clientName)) {
        newSet.delete(clientName);
      } else {
        newSet.add(clientName);
      }
      return newSet;
    });
  };

  const handleSaveSessionName = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName }),
      });

      if (response.ok) {
        const { session: updatedSession } = await response.json();
        setSessions(prev =>
          prev.map(s => s.id === sessionId ? { ...s, name: updatedSession.name } : s)
        );
      }
    } catch (error) {
      console.error('Failed to update session name:', error);
    } finally {
      setEditingSessionId(null);
      setEditingName('');
    }
  };

  const startEditing = (session: IdeaSessionWithDetails) => {
    setEditingSessionId(session.id);
    setEditingName(session.name || '');
  };

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

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search ideas by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card-bg border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent" />
            </div>
          )}
          {searchQuery && !isSearching && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Search Results ({searchResults.length})
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowResults(false);
              }}
              className="text-sm text-muted hover:text-foreground"
            >
              Clear search
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-card-bg border border-card-border rounded-xl p-8 text-center">
              <p className="text-muted">No ideas found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {searchResults.map((result) => (
                <a
                  key={result.idea_id}
                  href={`/session/${result.session_id}`}
                  className="block bg-card-bg border border-card-border rounded-xl p-5 hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {highlightText(result.title, searchQuery)}
                        </h4>
                        <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
                          {laneLabels[result.idea_lane]}
                        </span>
                      </div>
                      <p className="text-sm text-muted mb-2 line-clamp-2">
                        {highlightText(result.snippet, searchQuery)}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span>{result.client_name}</span>
                        <span>•</span>
                        <span>{formatDate(result.created_at)}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters and Sessions List - only show when not searching */}
      {!showResults && (
        <>
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

          {/* Sessions List - Grouped by Client */}
          <div className="space-y-6">
            {sortedClients.map((clientName) => (
              <div key={clientName} className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
                {/* Client Header - Collapsible */}
                <button
                  onClick={() => toggleClient(clientName)}
                  className="w-full flex items-center justify-between p-4 hover:bg-card-border/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 text-muted transition-transform ${
                        expandedClients.has(clientName) ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <h3 className="text-lg font-semibold text-foreground">{clientName}</h3>
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
                      {sessionsByClient[clientName].length} session{sessionsByClient[clientName].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </button>

                {/* Sessions for this client */}
                {expandedClients.has(clientName) && (
                  <div className="border-t border-card-border divide-y divide-card-border">
                    {sessionsByClient[clientName].map((session) => (
                      <div
                        key={session.id}
                        className="p-4 hover:bg-card-border/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            {/* Session Name - Editable */}
                            <div className="flex items-center gap-2 mb-2">
                              {editingSessionId === session.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    placeholder="Enter session name..."
                                    className="px-2 py-1 bg-background border border-card-border rounded text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveSessionName(session.id);
                                      if (e.key === 'Escape') {
                                        setEditingSessionId(null);
                                        setEditingName('');
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleSaveSessionName(session.id)}
                                    className="p-1 text-accent hover:text-accent-hover"
                                    title="Save"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingSessionId(null);
                                      setEditingName('');
                                    }}
                                    className="p-1 text-muted hover:text-foreground"
                                    title="Cancel"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">
                                    {session.name || 'Untitled Session'}
                                  </span>
                                  <button
                                    onClick={() => startEditing(session)}
                                    className="p-1 text-muted hover:text-foreground"
                                    title="Edit name"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
                                {laneLabels[session.idea_lane]}
                              </span>
                              {session.tech_modifiers && session.tech_modifiers.length > 0 && (
                                <span className="px-2 py-0.5 bg-card-border text-muted text-xs rounded">
                                  {session.tech_modifiers.join(', ')}
                                </span>
                              )}
                              <span className="text-muted text-xs">
                                {session.ideas_count} idea{session.ideas_count !== 1 ? 's' : ''}
                              </span>
                            </div>
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
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
