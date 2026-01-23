'use client';

import { IdeaCard } from './IdeaCard';
import { Button } from '@/components/ui';
import type { Idea, Client, Property } from '@/types/database';

interface IdeasDisplayProps {
  ideas: Idea[];
  client: Client | null;
  properties: Property[];
  onReset: () => void;
  onExportToFigma?: () => void;
  isExporting?: boolean;
}

export function IdeasDisplay({
  ideas,
  client,
  properties,
  onReset,
  onExportToFigma,
  isExporting = false,
}: IdeasDisplayProps) {
  if (ideas.length === 0) return null;

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
          {onExportToFigma && (
            <Button onClick={onExportToFigma} isLoading={isExporting}>
              {isExporting ? 'Exporting...' : 'Export to Figma'}
            </Button>
          )}
        </div>
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
