'use client';

import type { AIModel } from '@/types/database';

interface ModelSelectorProps {
  value: AIModel;
  onChange: (model: AIModel) => void;
}

interface ModelConfig {
  id: AIModel;
  name: string;
  provider: string;
  description: string;
  badge?: string;
}

const MODELS: ModelConfig[] = [
  {
    id: 'claude',
    name: 'Claude Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance for structured, detailed ideas',
    badge: 'Default',
  },
  {
    id: 'palmyra-creative',
    name: 'Palmyra Creative',
    provider: 'Writer',
    description: 'Optimized for creative brainstorming and fresh concepts',
    badge: 'Creative',
  },
  {
    id: 'gemini',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Fast, versatile model with strong reasoning capabilities',
    badge: 'New',
  },
];

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">AI Model</h3>
      <p className="text-sm text-muted">Choose which AI generates your ideas</p>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mt-3">
        {MODELS.map((model) => {
          const isSelected = value === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onChange(model.id)}
              className={`relative flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-accent bg-accent/5 shadow-lg'
                  : 'border-card-border bg-background hover:border-muted'
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Badge */}
              {model.badge && (
                <span className={`inline-flex self-start px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${
                  isSelected
                    ? 'bg-accent text-white'
                    : 'bg-card-border text-muted'
                }`}>
                  {model.badge}
                </span>
              )}

              {/* Model Name & Provider */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                  {model.name}
                </span>
              </div>
              <span className="text-xs text-muted mb-2">by {model.provider}</span>

              {/* Description */}
              <p className="text-sm text-muted">
                {model.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
