'use client';

import { useState, useMemo } from 'react';
import type { Property } from '@/types/database';
import { PropertyLogo } from '@/components/PropertyLogo';

interface PropertySelectorProps {
  properties: Property[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

interface CategoryConfig {
  key: string;
  label: string;
  category: Property['category'] | Property['category'][];
  isExpandable?: boolean;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'leagues', label: 'Leagues', category: 'league', isExpandable: true },
  { key: 'music_festivals', label: 'Music Festivals', category: 'music_festival' },
  { key: 'entertainment', label: 'Entertainment', category: 'entertainment' },
  { key: 'cultural_moments', label: 'Cultural Moments', category: 'cultural_moment' },
];

export function PropertySelector({
  properties,
  selectedIds,
  onChange,
}: PropertySelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['leagues'])
  );
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(new Set());

  // Group properties by category
  const groupedProperties = useMemo(() => {
    const leagues = properties.filter((p) => p.category === 'league');
    const teams = properties.filter((p) => p.category === 'team');
    const musicFestivals = properties.filter((p) => p.category === 'music_festival');
    const entertainment = properties.filter((p) => p.category === 'entertainment');
    const culturalMoments = properties.filter((p) => p.category === 'cultural_moment');

    // Group teams by their parent league
    const teamsByLeague: Record<string, Property[]> = {};
    teams.forEach((team) => {
      if (team.parent_id) {
        if (!teamsByLeague[team.parent_id]) {
          teamsByLeague[team.parent_id] = [];
        }
        teamsByLeague[team.parent_id].push(team);
      }
    });

    return {
      leagues,
      teamsByLeague,
      music_festivals: musicFestivals,
      entertainment,
      cultural_moments: culturalMoments,
    };
  }, [properties]);

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  const toggleLeague = (leagueId: string) => {
    setExpandedLeagues((prev) => {
      const next = new Set(prev);
      if (next.has(leagueId)) {
        next.delete(leagueId);
      } else {
        next.add(leagueId);
      }
      return next;
    });
  };

  const toggleProperty = (propertyId: string) => {
    if (selectedIds.includes(propertyId)) {
      onChange(selectedIds.filter((id) => id !== propertyId));
    } else {
      onChange([...selectedIds, propertyId]);
    }
  };

  const getPropertiesForCategory = (config: CategoryConfig): Property[] => {
    if (config.key === 'leagues') return groupedProperties.leagues;
    if (config.key === 'music_festivals') return groupedProperties.music_festivals;
    if (config.key === 'entertainment') return groupedProperties.entertainment;
    if (config.key === 'cultural_moments') return groupedProperties.cultural_moments;
    return [];
  };

  const selectedCount = selectedIds.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Properties / Partners
        </h3>
        {selectedCount > 0 && (
          <span className="text-xs text-accent">{selectedCount} selected</span>
        )}
      </div>

      <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
        {CATEGORIES.map((config) => {
          const categoryProperties = getPropertiesForCategory(config);
          const isExpanded = expandedCategories.has(config.key);

          return (
            <div key={config.key} className="border-b border-card-border last:border-b-0">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(config.key)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-card-border/50 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{config.label}</span>
                <svg
                  className={`w-4 h-4 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Category Content */}
              {isExpanded && (
                <div className="px-4 pb-3">
                  {config.key === 'leagues' ? (
                    // Leagues with expandable teams
                    <div className="space-y-1">
                      {groupedProperties.leagues.map((league) => {
                        const teams = groupedProperties.teamsByLeague[league.id] || [];
                        const hasTeams = teams.length > 0;
                        const isLeagueExpanded = expandedLeagues.has(league.id);
                        const isLeagueSelected = selectedIds.includes(league.id);

                        return (
                          <div key={league.id}>
                            <div className="flex items-center gap-2">
                              {/* Expand button for leagues with teams */}
                              {hasTeams && (
                                <button
                                  type="button"
                                  onClick={() => toggleLeague(league.id)}
                                  className="p-1 hover:bg-card-border rounded transition-colors"
                                >
                                  <svg
                                    className={`w-3 h-3 text-muted transition-transform ${isLeagueExpanded ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                              {!hasTeams && <div className="w-5" />}

                              {/* League checkbox */}
                              <label className="flex items-center gap-2 cursor-pointer flex-1 py-1.5">
                                <input
                                  type="checkbox"
                                  checked={isLeagueSelected}
                                  onChange={() => toggleProperty(league.id)}
                                  className="w-4 h-4 rounded border-card-border bg-background text-accent focus:ring-accent focus:ring-offset-background"
                                />
                                <PropertyLogo name={league.name} size="sm" />
                                <span className="text-sm text-foreground">{league.name}</span>
                              </label>
                            </div>

                            {/* Teams */}
                            {isLeagueExpanded && hasTeams && (
                              <div className="ml-8 mt-1 space-y-0.5 max-h-48 overflow-y-auto">
                                {teams.map((team) => (
                                  <label
                                    key={team.id}
                                    className="flex items-center gap-2 cursor-pointer py-1 px-2 hover:bg-card-border/50 rounded transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedIds.includes(team.id)}
                                      onChange={() => toggleProperty(team.id)}
                                      className="w-4 h-4 rounded border-card-border bg-background text-accent focus:ring-accent focus:ring-offset-background"
                                    />
                                    <PropertyLogo name={team.name} size="sm" />
                                    <span className="text-sm text-muted">{team.name}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Regular flat list for other categories
                    <div className="grid grid-cols-2 gap-1">
                      {categoryProperties.map((property) => (
                        <label
                          key={property.id}
                          className="flex items-center gap-2 cursor-pointer py-1.5 px-2 hover:bg-card-border/50 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(property.id)}
                            onChange={() => toggleProperty(property.id)}
                            className="w-4 h-4 rounded border-card-border bg-background text-accent focus:ring-accent focus:ring-offset-background"
                          />
                          <PropertyLogo name={property.name} size="sm" />
                          <span className="text-sm text-foreground truncate">{property.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Properties Tags */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedIds.map((id) => {
            const property = properties.find((p) => p.id === id);
            if (!property) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
              >
                <PropertyLogo name={property.name} size="sm" className="w-4 h-4" />
                {property.name}
                <button
                  type="button"
                  onClick={() => toggleProperty(id)}
                  className="hover:bg-accent/20 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
