'use client';

import type { IdeaLane, TechModifier } from '@/types/database';

interface IdeaLaneSelectorProps {
  selectedLane: IdeaLane | null;
  onLaneChange: (lane: IdeaLane) => void;
  techModifiers: TechModifier[];
  onTechModifiersChange: (modifiers: TechModifier[]) => void;
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
  {
    value: 'talent_athlete',
    label: 'Talent/Athlete',
    description: 'Ambassador programs, endorsements, athlete appearances, player-driven storytelling',
  },
  {
    value: 'gaming_esports',
    label: 'Gaming/Esports',
    description: 'In-game integrations, streaming partnerships, esports sponsorships, creator collaborations',
  },
  {
    value: 'hospitality_vip',
    label: 'Hospitality/VIP',
    description: 'Suite experiences, meet & greets, exclusive access, premium client entertainment',
  },
  {
    value: 'retail_product',
    label: 'Retail/Product',
    description: 'Co-branded merchandise, limited drops, licensing, retail activations',
  },
];

const TECH_MODIFIERS: { value: TechModifier; label: string }[] = [
  { value: 'AI', label: 'AI' },
  { value: 'VR', label: 'VR' },
  { value: 'AR', label: 'AR' },
];

// Tech modifiers available for all lanes except content
const LANES_WITH_TECH_MODIFIERS: IdeaLane[] = [
  'live_experience',
  'digital',
  'social_impact',
  'talent_athlete',
  'gaming_esports',
  'hospitality_vip',
  'retail_product',
];

export function IdeaLaneSelector({
  selectedLane,
  onLaneChange,
  techModifiers,
  onTechModifiersChange,
}: IdeaLaneSelectorProps) {
  const showTechModifiers = selectedLane && LANES_WITH_TECH_MODIFIERS.includes(selectedLane);

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
        <div className="grid gap-3 sm:grid-cols-2">
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

      {/* Tech Modifiers - shown for all lanes except content */}
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
    </div>
  );
}
