'use client';

import { useState, useEffect } from 'react';
import type { Idea } from '@/types/database';
import { IdeaRating } from './IdeaRating';

interface IdeaCardProps {
  idea: Idea;
  index: number;
  onUpdate?: (updatedIdea: Idea) => void;
}

export function IdeaCard({ idea, index, onUpdate }: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local display state (synced with prop)
  const [displayIdea, setDisplayIdea] = useState(idea);

  // Edit state
  const [editTitle, setEditTitle] = useState(idea.title);
  const [editOverview, setEditOverview] = useState(idea.overview);
  const [editFeatures, setEditFeatures] = useState(idea.features);
  const [editBrandFit, setEditBrandFit] = useState(idea.brand_fit);
  const [editImagePrompt, setEditImagePrompt] = useState(idea.image_prompt);

  // Sync display state when prop changes
  useEffect(() => {
    setDisplayIdea(idea);
  }, [idea]);

  const handleStartEdit = () => {
    setEditTitle(idea.title);
    setEditOverview(idea.overview);
    setEditFeatures([...idea.features]);
    setEditBrandFit(idea.brand_fit);
    setEditImagePrompt(idea.image_prompt);
    setIsEditing(true);
    setIsExpanded(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/ideas/${idea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          overview: editOverview,
          features: editFeatures.filter(f => f.trim() !== ''),
          brand_fit: editBrandFit,
          image_prompt: editImagePrompt,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      const { idea: updatedIdea } = await response.json();

      // Update local display state immediately
      setDisplayIdea(updatedIdea);

      if (onUpdate) {
        onUpdate(updatedIdea);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...editFeatures];
    newFeatures[index] = value;
    setEditFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    setEditFeatures([...editFeatures, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setEditFeatures(editFeatures.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden transition-all hover:border-muted">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                {index + 1}
              </span>
              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="p-1 text-muted hover:text-foreground transition-colors"
                  title="Edit idea"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl font-bold text-foreground bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ) : (
              <h3 className="text-xl font-bold text-foreground">{displayIdea.title}</h3>
            )}
          </div>
          {displayIdea.figma_frame_id && !isEditing && (
            <a
              href={`#figma-${displayIdea.figma_frame_id}`}
              className="flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.5 3C4.119 3 3 4.119 3 5.5V10.5C3 11.881 4.119 13 5.5 13H8V5.5C8 4.119 6.881 3 5.5 3ZM5.5 3H10.5C11.881 3 13 4.119 13 5.5V10.5C13 11.881 11.881 13 10.5 13H5.5C4.119 13 3 11.881 3 10.5V5.5C3 4.119 4.119 3 5.5 3ZM13 5.5V10.5C13 11.881 14.119 13 15.5 13H18.5C19.881 13 21 11.881 21 10.5V5.5C21 4.119 19.881 3 18.5 3H15.5C14.119 3 13 4.119 13 5.5ZM5.5 13C4.119 13 3 14.119 3 15.5V18.5C3 19.881 4.119 21 5.5 21H10.5C11.881 21 13 19.881 13 18.5V15.5C13 14.119 11.881 13 10.5 13H5.5ZM15.5 13C14.119 13 13 14.119 13 15.5V18.5C13 19.881 14.119 21 15.5 21C16.881 21 18 19.881 18 18.5V15.5C18 14.119 16.881 13 15.5 13Z" />
              </svg>
              View in Figma
            </a>
          )}
        </div>

        {/* Overview */}
        {isEditing ? (
          <textarea
            value={editOverview}
            onChange={(e) => setEditOverview(e.target.value)}
            rows={3}
            className="mt-3 w-full text-muted bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        ) : (
          <p className="mt-3 text-muted leading-relaxed">{displayIdea.overview}</p>
        )}
      </div>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[1200px]' : 'max-h-0'}`}>
        <div className="px-6 pb-6 space-y-6">
          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              Key Features
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                {editFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(i, e.target.value)}
                      className="flex-1 text-muted bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Enter feature..."
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="p-2 text-muted hover:text-error transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  + Add feature
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {displayIdea.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted">
                    <svg
                      className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Brand Fit */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              Why It Works
            </h4>
            {isEditing ? (
              <textarea
                value={editBrandFit}
                onChange={(e) => setEditBrandFit(e.target.value)}
                rows={2}
                className="w-full text-foreground bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            ) : (
              <p className="text-foreground">{displayIdea.brand_fit}</p>
            )}
          </div>

          {/* Image Prompt */}
          <div className="bg-card-border/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
              Image Prompt
            </h4>
            {isEditing ? (
              <textarea
                value={editImagePrompt}
                onChange={(e) => setEditImagePrompt(e.target.value)}
                rows={3}
                className="w-full text-sm text-muted bg-background border border-card-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            ) : (
              <p className="text-sm text-muted italic">{displayIdea.image_prompt}</p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Edit actions */}
          {isEditing && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 text-sm text-muted hover:text-foreground border border-card-border rounded-lg hover:bg-card-border/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Idea Rating */}
          {!isEditing && (
            <IdeaRating ideaId={idea.id} />
          )}
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-3 border-t border-card-border text-sm text-muted hover:text-foreground hover:bg-card-border/30 transition-colors flex items-center justify-center gap-1"
      >
        {isExpanded ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Show Less
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Show More
          </>
        )}
      </button>
    </div>
  );
}
