'use client';

import { useState } from 'react';
import type { OutputStyleType, OutputStyle } from '@/types/database';

interface OutputStyleSelectorProps {
  value: OutputStyle | null;
  onChange: (style: OutputStyle | null) => void;
}

interface StyleProfile {
  type: OutputStyleType;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

const STYLE_PROFILES: StyleProfile[] = [
  {
    type: 'techbro',
    name: 'Techbro',
    emoji: '🚀',
    description: 'Tech-forward language, startup vibes, disruption-focused',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    type: 'creative_strategist',
    name: 'Creative Strategist',
    emoji: '✨',
    description: 'Inspirational, creative wordplay, big-picture thinking',
    color: 'from-purple-500 to-pink-500',
  },
  {
    type: 'gen_z',
    name: 'Gen Z Coded',
    emoji: '💅',
    description: 'Casual slang, no cap, very much giving main character energy',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    type: 'sports_expert',
    name: 'Sports Expert',
    emoji: '🏆',
    description: 'Athlete references, team history, sports metaphors galore',
    color: 'from-green-500 to-emerald-500',
  },
  {
    type: 'world_traveler',
    name: 'World Traveler',
    emoji: '🌍',
    description: 'Global perspective, cultural insights, international appeal',
    color: 'from-indigo-500 to-violet-500',
  },
];

const INTENSITY_LABELS = [
  { value: 1, label: 'Subtle' },
  { value: 2, label: 'Light' },
  { value: 3, label: 'Balanced' },
  { value: 4, label: 'Strong' },
  { value: 5, label: 'Maximum' },
];

export function OutputStyleSelector({ value, onChange }: OutputStyleSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectStyle = (type: OutputStyleType) => {
    if (value?.type === type) {
      // Deselect if clicking the same one
      onChange(null);
    } else {
      onChange({ type, intensity: value?.intensity || 3 });
    }
  };

  const handleIntensityChange = (intensity: number) => {
    if (value) {
      onChange({ ...value, intensity });
    }
  };

  const selectedProfile = value ? STYLE_PROFILES.find(p => p.type === value.type) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Output Style</h3>
          <p className="text-sm text-muted">Choose a personality for your ideas</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Style Cards */}
      <div className={`grid gap-3 ${isExpanded ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}`}>
        {STYLE_PROFILES.map((profile) => {
          const isSelected = value?.type === profile.type;
          return (
            <button
              key={profile.type}
              type="button"
              onClick={() => handleSelectStyle(profile.type)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-lg scale-[1.02]'
                  : 'border-card-border bg-card-bg hover:border-muted hover:bg-card-border/50'
              }`}
            >
              {/* Gradient accent bar when selected */}
              {isSelected && (
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r ${profile.color}`} />
              )}

              <div className="flex items-start gap-3">
                <span className="text-2xl">{profile.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold truncate ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                    {profile.name}
                  </h4>
                  {isExpanded && (
                    <p className="text-xs text-muted mt-1 line-clamp-2">
                      {profile.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Intensity Slider - Only show when a style is selected */}
      {value && selectedProfile && (
        <div className="mt-6 p-4 bg-card-border/30 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedProfile.emoji}</span>
              <span className="font-medium text-foreground">{selectedProfile.name} Intensity</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${selectedProfile.color} text-white`}>
              {INTENSITY_LABELS.find(l => l.value === value.intensity)?.label}
            </span>
          </div>

          {/* Custom Slider */}
          <div className="relative pt-2">
            {/* Track background */}
            <div className="h-2 bg-card-border rounded-full overflow-hidden">
              {/* Filled track */}
              <div
                className={`h-full bg-gradient-to-r ${selectedProfile.color} transition-all duration-200`}
                style={{ width: `${((value.intensity - 1) / 4) * 100}%` }}
              />
            </div>

            {/* Slider input */}
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={value.intensity}
              onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            />

            {/* Tick marks */}
            <div className="flex justify-between mt-2">
              {INTENSITY_LABELS.map((label) => (
                <button
                  key={label.value}
                  type="button"
                  onClick={() => handleIntensityChange(label.value)}
                  className={`flex flex-col items-center transition-colors ${
                    value.intensity === label.value ? 'text-accent' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                    value.intensity >= label.value
                      ? `bg-gradient-to-r ${selectedProfile.color} border-transparent`
                      : 'bg-card-bg border-card-border'
                  }`} />
                  <span className="text-xs mt-1 hidden sm:block">{label.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity description */}
          <p className="text-xs text-muted text-center">
            {value.intensity === 1 && 'A subtle hint of the style - professional with light flavor'}
            {value.intensity === 2 && 'Noticeable style influence while staying grounded'}
            {value.intensity === 3 && 'A balanced blend of style and substance'}
            {value.intensity === 4 && 'Strong style presence throughout the ideas'}
            {value.intensity === 5 && 'Full-on personality mode - expect maximum flavor!'}
          </p>
        </div>
      )}
    </div>
  );
}
