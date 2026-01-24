'use client';

import { IdeaCard } from '@/components/IdeaCard';
import { ClientLogo } from '@/components/ClientLogo';
import { Button } from '@/components/ui';
import type { IdeaSession, Idea, Client, Property } from '@/types/database';

interface SessionDetailClientProps {
  session: IdeaSession;
  ideas: Idea[];
  client: Client;
  properties: Property[];
}

export function SessionDetailClient({
  session,
  ideas,
  client,
  properties,
}: SessionDetailClientProps) {
  const laneLabels: Record<string, string> = {
    live_experience: 'Live Experience',
    digital: 'Digital',
    content: 'Content',
    social_impact: 'Social Impact',
    talent_athlete: 'Talent/Athlete',
    gaming_esports: 'Gaming/Esports',
    hospitality_vip: 'Hospitality/VIP',
    retail_product: 'Retail/Product',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <a
        href="/history"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to History
      </a>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ClientLogo name={client.name} domain={client.domain} size="lg" />
            <h1 className="text-3xl font-bold text-foreground">
              {client.name}
            </h1>
          </div>
          <p className="text-muted mb-3">
            {properties.map((p) => p.name).join(' + ')}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
              {laneLabels[session.idea_lane]}
            </span>
            {session.tech_modifiers && session.tech_modifiers.length > 0 && (
              <span className="px-3 py-1 bg-card-border text-muted text-sm rounded-full">
                {session.tech_modifiers.join(' + ')}
              </span>
            )}
            {session.content_style && (
              <span className="px-3 py-1 bg-card-border text-muted text-sm rounded-full">
                {session.content_style.replace('_', ' ')}
              </span>
            )}
          </div>
          <p className="text-muted text-sm mt-3">
            Generated on {formatDate(session.created_at)}
          </p>
        </div>

        <div className="flex gap-3">
          <a href="/">
            <Button variant="secondary">New Session</Button>
          </a>
          <a href={`/presentation/${session.id}`} target="_blank" rel="noopener noreferrer">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Export Presentation
            </Button>
          </a>
        </div>
      </div>

      {/* Ideas Count */}
      <div className="text-muted">
        {ideas.length} idea{ideas.length !== 1 ? 's' : ''} generated
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {ideas.map((idea, index) => (
          <IdeaCard key={idea.id} idea={idea} index={index} />
        ))}
      </div>
    </div>
  );
}
