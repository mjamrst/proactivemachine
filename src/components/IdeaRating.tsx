'use client';

import { useState, useEffect } from 'react';
import type { IdeaRating as IdeaRatingType, IdeaRatingValue } from '@/types/database';

interface IdeaRatingProps {
  ideaId: string;
}

const RATING_LABELS: Record<IdeaRatingValue, { label: string; description: string; color: string }> = {
  1: {
    label: 'No Way',
    description: 'We would never bring this to a client',
    color: 'text-red-500',
  },
  2: {
    label: 'With Tweaks',
    description: 'Could work with some modifications',
    color: 'text-yellow-500',
  },
  3: {
    label: 'Client Ready',
    description: 'This is an idea we could present',
    color: 'text-green-500',
  },
};

export function IdeaRating({ ideaId }: IdeaRatingProps) {
  const [rating, setRating] = useState<IdeaRatingValue | null>(null);
  const [hoverRating, setHoverRating] = useState<IdeaRatingValue | null>(null);
  const [comment, setComment] = useState('');
  const [savedComment, setSavedComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  // Fetch existing rating on mount
  useEffect(() => {
    fetch(`/api/ideas/${ideaId}/rating`)
      .then((res) => res.json())
      .then((data) => {
        if (data.rating) {
          setRating(data.rating.rating);
          setComment(data.rating.comment || '');
          setSavedComment(data.rating.comment || '');
          if (data.rating.comment) {
            setShowCommentInput(true);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [ideaId]);

  const handleRatingClick = async (newRating: IdeaRatingValue) => {
    setIsSaving(true);
    const previousRating = rating;
    setRating(newRating);

    try {
      const response = await fetch(`/api/ideas/${ideaId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, comment: comment || null }),
      });

      if (!response.ok) {
        throw new Error('Failed to save rating');
      }

      setShowCommentInput(true);
    } catch (error) {
      console.error('Error saving rating:', error);
      setRating(previousRating);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommentSave = async () => {
    if (!rating) return;
    if (comment === savedComment) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/ideas/${ideaId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: comment || null }),
      });

      if (!response.ok) {
        throw new Error('Failed to save comment');
      }

      setSavedComment(comment);
    } catch (error) {
      console.error('Error saving comment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayRating = hoverRating || rating;

  if (isLoading) {
    return (
      <div className="border-t border-card-border pt-4 mt-4">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-8 w-8 bg-card-border rounded-full" />
          <div className="h-8 w-8 bg-card-border rounded-full" />
          <div className="h-8 w-8 bg-card-border rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-card-border pt-4 mt-4">
      <div className="space-y-3">
        {/* Rating Label */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Rate this idea</span>
          {displayRating && (
            <span className={`text-sm font-medium ${RATING_LABELS[displayRating].color}`}>
              {RATING_LABELS[displayRating].label}
            </span>
          )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {([1, 2, 3] as IdeaRatingValue[]).map((starValue) => {
            const isActive = displayRating ? displayRating >= starValue : false;
            const starConfig = RATING_LABELS[starValue];

            return (
              <button
                key={starValue}
                type="button"
                onClick={() => handleRatingClick(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(null)}
                disabled={isSaving}
                className={`p-1 transition-all disabled:opacity-50 ${
                  isSaving ? 'cursor-wait' : 'cursor-pointer'
                }`}
                title={`${starConfig.label}: ${starConfig.description}`}
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    isActive
                      ? starValue === 1
                        ? 'text-red-500'
                        : starValue === 2
                        ? 'text-yellow-500'
                        : 'text-green-500'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Rating Description */}
        {displayRating && (
          <p className="text-xs text-muted">
            {RATING_LABELS[displayRating].description}
          </p>
        )}

        {/* Comment Section */}
        {(showCommentInput || rating) && (
          <div className="space-y-2 mt-3">
            <label className="text-sm text-muted">
              Add a comment {savedComment ? '(saved)' : '(optional)'}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onBlur={handleCommentSave}
              placeholder="What specifically did you like or dislike about this idea?"
              className="w-full px-3 py-2 bg-background border border-card-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              rows={2}
              disabled={isSaving}
            />
            {comment !== savedComment && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCommentSave}
                  disabled={isSaving}
                  className="text-xs text-accent hover:underline disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save comment'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
