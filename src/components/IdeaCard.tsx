'use client';

import { useState } from 'react';
import type { Idea } from '@/types/database';

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

export function IdeaCard({ idea, index }: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden transition-all hover:border-muted">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
              {index + 1}
            </span>
            <h3 className="text-xl font-bold text-foreground">{idea.title}</h3>
          </div>
          {idea.figma_frame_id && (
            <a
              href={`#figma-${idea.figma_frame_id}`}
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
        <p className="mt-3 text-muted leading-relaxed">{idea.overview}</p>
      </div>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[800px]' : 'max-h-0'}`}>
        <div className="px-6 pb-6 space-y-6">
          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              Key Features
            </h4>
            <ul className="space-y-2">
              {idea.features.map((feature, i) => (
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
          </div>

          {/* Brand Fit */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              Why It Works
            </h4>
            <p className="text-foreground">{idea.brand_fit}</p>
          </div>

          {/* Image Prompt */}
          <div className="bg-card-border/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
              Image Prompt
            </h4>
            <p className="text-sm text-muted italic">{idea.image_prompt}</p>
          </div>
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
