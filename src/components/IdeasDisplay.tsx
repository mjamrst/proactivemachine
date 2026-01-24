'use client';

import { IdeaCard } from './IdeaCard';
import { Button } from '@/components/ui';
import type { Idea, Client, Property } from '@/types/database';

interface IdeasDisplayProps {
  ideas: Idea[];
  client: Client | null;
  properties: Property[];
  sessionId: string | null;
  onReset: () => void;
  onUpdateIdea?: (updatedIdea: Idea) => void;
}

export function IdeasDisplay({
  ideas,
  client,
  properties,
  sessionId,
  onReset,
  onUpdateIdea,
}: IdeasDisplayProps) {
  if (ideas.length === 0) return null;

  const handleExportPresentation = () => {
    if (sessionId) {
      window.open(`/presentation/${sessionId}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Generated Ideas
          </h2>
          <p className="text-muted mt-1">
            {ideas.length} idea{ideas.length !== 1 ? 's' : ''} for{' '}
            <span className="text-accent">{client?.name}</span>
            {properties.length > 0 && (
              <>
                {' '}
                &times;{' '}
                <span className="text-foreground">
                  {properties.map((p) => p.name).join(', ')}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onReset}>
            New Session
          </Button>
          {sessionId && (
            <Button onClick={handleExportPresentation}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Export Presentation
            </Button>
          )}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {ideas.map((idea, index) => (
          <IdeaCard key={idea.id} idea={idea} index={index} onUpdate={onUpdateIdea} />
        ))}
      </div>
    </div>
  );
}
