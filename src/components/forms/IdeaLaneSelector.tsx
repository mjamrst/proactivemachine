'use client';

import Image from 'next/image';
import type { IdeaLane, TechModifier, AudienceModifier, PlatformModifier, BudgetTier } from '@/types/database';

interface IdeaLaneSelectorProps {
  selectedLane: IdeaLane | null;
  onLaneChange: (lane: IdeaLane) => void;
  techModifiers: TechModifier[];
  onTechModifiersChange: (modifiers: TechModifier[]) => void;
  audienceModifier: AudienceModifier | null;
  onAudienceModifierChange: (modifier: AudienceModifier | null) => void;
  platformModifier: PlatformModifier | null;
  onPlatformModifierChange: (modifier: PlatformModifier | null) => void;
  budgetTier: BudgetTier | null;
  onBudgetTierChange: (tier: BudgetTier | null) => void;
}

interface LaneConfig {
  value: IdeaLane;
  label: string;
  description: string;
  emoji: string;
  image?: string;
}

const IDEA_LANES: LaneConfig[] = [
  {
    value: 'live_experience',
    label: 'Live Experience',
    description: 'On-site activations, fan zones, experiential marketing',
    emoji: '🎪',
    image: '/lanes/live_experience.png',
  },
  {
    value: 'digital',
    label: 'Digital',
    description: 'Apps, social media campaigns, interactive experiences',
    emoji: '📱',
    image: '/lanes/digital.png',
  },
  {
    value: 'content',
    label: 'Content',
    description: 'Video series, podcasts, branded entertainment',
    emoji: '🎬',
    image: '/lanes/content.png',
  },
  {
    value: 'social_impact',
    label: 'Social Impact',
    description: 'Corporate responsibility, sustainability, community engagement',
    emoji: '🌍',
    image: '/lanes/social_impact.png',
  },
  {
    value: 'talent_athlete',
    label: 'Talent/Athlete',
    description: 'Ambassador programs, endorsements, athlete appearances, player-driven storytelling',
    emoji: '⭐',
    image: '/lanes/talent_athlete.png',
  },
  {
    value: 'gaming_esports',
    label: 'Gaming/Esports',
    description: 'In-game integrations, streaming partnerships, esports sponsorships, creator collaborations',
    emoji: '🎮',
    image: '/lanes/gaming_esports.png',
  },
  {
    value: 'hospitality_vip',
    label: 'Hospitality/VIP',
    description: 'Suite experiences, meet & greets, exclusive access, premium client entertainment',
    emoji: '👑',
    image: '/lanes/hospitality_vip.png',
  },
  {
    value: 'retail_product',
    label: 'Retail/Product',
    description: 'Co-branded merchandise, limited drops, licensing, retail activations',
    emoji: '🛍️',
    image: '/lanes/retail_product.png',
  },
];

const TECH_MODIFIERS: { value: TechModifier; label: string }[] = [
  { value: 'AI', label: 'AI' },
  { value: 'VR', label: 'VR' },
  { value: 'AR', label: 'AR' },
  { value: 'Web3', label: 'Web3' },
  { value: 'Wearables', label: 'Wearables' },
  { value: 'Voice', label: 'Voice' },
  { value: 'Drones', label: 'Drones' },
  { value: 'NFC/RFID', label: 'NFC/RFID' },
];

const AUDIENCE_MODIFIERS: { value: AudienceModifier; label: string }[] = [
  { value: 'gen_z', label: 'Gen Z' },
  { value: 'millennials', label: 'Millennials' },
  { value: 'families', label: 'Families' },
  { value: 'superfans', label: 'Superfans' },
  { value: 'casual_fans', label: 'Casual Fans' },
  { value: 'b2b_corporate', label: 'B2B/Corporate' },
];

const PLATFORM_MODIFIERS: { value: PlatformModifier; label: string }[] = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'x', label: 'X' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'discord', label: 'Discord' },
];

const BUDGET_TIERS: { value: BudgetTier; label: string; description: string }[] = [
  { value: 'scrappy', label: 'Scrappy', description: 'Under $50K' },
  { value: 'mid_tier', label: 'Mid-Tier', description: '$50K–$500K' },
  { value: 'flagship', label: 'Flagship', description: '$500K+' },
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
  audienceModifier,
  onAudienceModifierChange,
  platformModifier,
  onPlatformModifierChange,
  budgetTier,
  onBudgetTierChange,
}: IdeaLaneSelectorProps) {
  const showTechModifiers = selectedLane && LANES_WITH_TECH_MODIFIERS.includes(selectedLane);

  const toggleTechModifier = (modifier: TechModifier) => {
    if (techModifiers.includes(modifier)) {
      onTechModifiersChange(techModifiers.filter((m) => m !== modifier));
    } else {
      onTechModifiersChange([...techModifiers, modifier]);
    }
  };

  const toggleAudienceModifier = (modifier: AudienceModifier) => {
    if (audienceModifier === modifier) {
      onAudienceModifierChange(null);
    } else {
      onAudienceModifierChange(modifier);
    }
  };

  const togglePlatformModifier = (modifier: PlatformModifier) => {
    if (platformModifier === modifier) {
      onPlatformModifierChange(null);
    } else {
      onPlatformModifierChange(modifier);
    }
  };

  const toggleBudgetTier = (tier: BudgetTier) => {
    if (budgetTier === tier) {
      onBudgetTierChange(null);
    } else {
      onBudgetTierChange(tier);
    }
  };

  return (
    <div className="space-y-6">
      {/* Idea Lane Selection */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Idea Lane</h3>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {IDEA_LANES.map((lane) => {
            const isSelected = selectedLane === lane.value;
            return (
              <label
                key={lane.value}
                className={`relative flex flex-col items-center text-center cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/5 shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-[#f7f7f5] hover:border-gray-300 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="idea-lane"
                  value={lane.value}
                  checked={isSelected}
                  onChange={() => onLaneChange(lane.value)}
                  className="sr-only"
                />

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Emoji or Image */}
                <div className="w-16 h-16 flex items-center justify-center mb-3">
                  {lane.image ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={lane.image}
                        alt={lane.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-4xl">{lane.emoji}</span>
                  )}
                </div>

                {/* Label and Description */}
                <span className={`block text-sm font-semibold mb-1 ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                  {lane.label}
                </span>
                <span className="block text-xs text-muted line-clamp-2">
                  {lane.description}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Modifiers - shown when a lane is selected */}
      {selectedLane && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Tech Modifiers - multi-select, not shown for content */}
          {showTechModifiers && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Technology <span className="text-muted font-normal text-sm">(optional, select multiple)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {TECH_MODIFIERS.map((modifier) => (
                  <button
                    key={modifier.value}
                    type="button"
                    onClick={() => toggleTechModifier(modifier.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      techModifiers.includes(modifier.value)
                        ? 'bg-accent text-white'
                        : 'bg-[#f7f7f5] border border-gray-200 text-foreground hover:border-gray-300'
                    }`}
                  >
                    {modifier.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Audience Modifier - single select */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Audience <span className="text-muted font-normal text-sm">(optional)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_MODIFIERS.map((modifier) => (
                <button
                  key={modifier.value}
                  type="button"
                  onClick={() => toggleAudienceModifier(modifier.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    audienceModifier === modifier.value
                      ? 'bg-accent text-white'
                      : 'bg-[#f7f7f5] border border-gray-200 text-foreground hover:border-gray-300'
                  }`}
                >
                  {modifier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Modifier - single select */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Platform <span className="text-muted font-normal text-sm">(optional)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_MODIFIERS.map((modifier) => (
                <button
                  key={modifier.value}
                  type="button"
                  onClick={() => togglePlatformModifier(modifier.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    platformModifier === modifier.value
                      ? 'bg-accent text-white'
                      : 'bg-[#f7f7f5] border border-gray-200 text-foreground hover:border-gray-300'
                  }`}
                >
                  {modifier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Tier - single select */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Budget <span className="text-muted font-normal text-sm">(optional)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => toggleBudgetTier(tier.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    budgetTier === tier.value
                      ? 'bg-accent text-white'
                      : 'bg-[#f7f7f5] border border-gray-200 text-foreground hover:border-gray-300'
                  }`}
                >
                  {tier.label} <span className="opacity-70">({tier.description})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
