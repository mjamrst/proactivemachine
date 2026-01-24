'use client';

import type { IdeaLane, TechModifier, ContentStyle } from '@/types/database';

interface IdeaLaneSelectorProps {
  selectedLane: IdeaLane | null;
  onLaneChange: (lane: IdeaLane) => void;
  techModifiers: TechModifier[];
  onTechModifiersChange: (modifiers: TechModifier[]) => void;
  contentStyle: ContentStyle | null;
  onContentStyleChange: (style: ContentStyle) => void;
}

const IDEA_LANES: { value: IdeaLane; label: string; description: string }[] = [
  {
    value: 'live_experience',
    label: 'Live Experience',
    description: 'On-site activations, fan zones, experiential marketing',
  },
  {
    value: 'digital',
    label: 'Digital',
    description: 'Apps, social media campaigns, interactive experiences',
  },
  {
    value: 'content',
    label: 'Content',
    description: 'Video series, podcasts, branded entertainment',
  },
  {
    value: 'social_impact',
    label: 'Social Impact',
    description: 'Corporate responsibility, sustainability, community engagement',
  },
];

const TECH_MODIFIERS: { value: TechModifier; label: string }[] = [
  { value: 'AI', label: 'AI' },
  { value: 'VR', label: 'VR' },
  { value: 'AR', label: 'AR' },
];

const CONTENT_STYLES: { value: ContentStyle; label: string; description: string }[] = [
  {
    value: 'creator_led',
    label: 'Creator-Led',
    description: 'Content featuring influencers and digital creators',
  },
  {
    value: 'talent_led',
    label: 'Talent-Led',
    description: 'Content featuring athletes or celebrities',
  },
  {
    value: 'branded_content',
    label: 'Branded Content',
    description: 'Brand-produced editorial or documentary content',
  },
];

export function IdeaLaneSelector({
  selectedLane,
  onLaneChange,
  techModifiers,
  onTechModifiersChange,
  contentStyle,
  onContentStyleChange,
}: IdeaLaneSelectorProps) {
  const showTechModifiers = selectedLane === 'live_experience' || selectedLane === 'digital' || selectedLane === 'social_impact';
  const showContentStyle = selectedLane === 'content';

  const toggleTechModifier = (modifier: TechModifier) => {
    if (techModifiers.includes(modifier)) {
      onTechModifiersChange(techModifiers.filter((m) => m !== modifier));
    } else {
      onTechModifiersChange([...techModifiers, modifier]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Idea Lane Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Idea Lane
        </label>
        <div className="grid gap-3">
          {IDEA_LANES.map((lane) => (
            <label
              key={lane.value}
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${
                selectedLane === lane.value
                  ? 'border-accent bg-accent/5'
                  : 'border-card-border bg-card-bg hover:border-muted'
              }`}
            >
              <input
                type="radio"
                name="idea-lane"
                value={lane.value}
                checked={selectedLane === lane.value}
                onChange={() => onLaneChange(lane.value)}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    selectedLane === lane.value
                      ? 'border-accent'
                      : 'border-muted'
                  }`}
                >
                  {selectedLane === lane.value && (
                    <div className="h-2 w-2 rounded-full bg-accent" />
                  )}
                </div>
                <div>
                  <span className="block text-sm font-medium text-foreground">
                    {lane.label}
                  </span>
                  <span className="block text-xs text-muted mt-0.5">
                    {lane.description}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Tech Modifiers - shown for Live Experience and Digital */}
      {showTechModifiers && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-foreground">
            Technology Focus <span className="text-muted">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TECH_MODIFIERS.map((modifier) => (
              <button
                key={modifier.value}
                type="button"
                onClick={() => toggleTechModifier(modifier.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  techModifiers.includes(modifier.value)
                    ? 'bg-accent text-white'
                    : 'bg-card-bg border border-card-border text-foreground hover:border-muted'
                }`}
              >
                {modifier.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Style - shown for Content */}
      {showContentStyle && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-foreground">
            Content Style
          </label>
          <div className="grid gap-2">
            {CONTENT_STYLES.map((style) => (
              <label
                key={style.value}
                className={`relative flex cursor-pointer rounded-lg border p-3 transition-colors ${
                  contentStyle === style.value
                    ? 'border-accent bg-accent/5'
                    : 'border-card-border bg-card-bg hover:border-muted'
                }`}
              >
                <input
                  type="radio"
                  name="content-style"
                  value={style.value}
                  checked={contentStyle === style.value}
                  onChange={() => onContentStyleChange(style.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      contentStyle === style.value
                        ? 'border-accent'
                        : 'border-muted'
                    }`}
                  >
                    {contentStyle === style.value && (
                      <div className="h-2 w-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {style.label}
                    </span>
                    <span className="text-xs text-muted ml-2">
                      {style.description}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
