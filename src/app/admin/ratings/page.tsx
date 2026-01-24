'use client';

import { useState, useEffect } from 'react';
import type { IdeaLane, IdeaRatingValue } from '@/types/database';

interface RatingSummary {
  total_ratings: number;
  one_star_count: number;
  two_star_count: number;
  three_star_count: number;
  average_rating: number;
}

interface RatingByLane extends RatingSummary {
  idea_lane: string;
}

interface RecentRating {
  rating_id: string;
  rating: IdeaRatingValue;
  comment: string | null;
  rated_at: string;
  idea_id: string;
  idea_title: string;
  session_id: string;
  idea_lane: IdeaLane;
  client_name: string;
  rater_display_name: string;
}

interface RatingsData {
  summary: RatingSummary;
  byLane: RatingByLane[];
  recentRatings: RecentRating[];
}

const LANE_LABELS: Record<string, string> = {
  live_experience: 'Live Experience',
  digital: 'Digital',
  content: 'Content',
  social_impact: 'Social Impact',
  talent_athlete: 'Talent/Athlete',
  gaming_esports: 'Gaming/Esports',
  hospitality_vip: 'Hospitality/VIP',
  retail_product: 'Retail/Product',
};

const RATING_LABELS: Record<IdeaRatingValue, { label: string; color: string; bgColor: string }> = {
  1: { label: 'No Way', color: 'text-red-500', bgColor: 'bg-red-500' },
  2: { label: 'With Tweaks', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  3: { label: 'Client Ready', color: 'text-green-500', bgColor: 'bg-green-500' },
};

export default function RatingsPage() {
  const [data, setData] = useState<RatingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await fetch('/api/admin/ratings');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setError('Failed to load ratings analytics');
        }
      } catch {
        setError('Failed to load ratings analytics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRatings();
  }, []);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { summary, byLane, recentRatings } = data;

  // Calculate percentages for the bar chart
  const totalRatings = summary.total_ratings || 1;
  const oneStarPct = Math.round((summary.one_star_count / totalRatings) * 100);
  const twoStarPct = Math.round((summary.two_star_count / totalRatings) * 100);
  const threeStarPct = Math.round((summary.three_star_count / totalRatings) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Idea Quality Analytics</h1>
        <p className="text-muted mt-1">
          Track how well AI-generated ideas are performing across your team
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.total_ratings}</p>
              <p className="text-sm text-muted">Total Ratings</p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <span className="text-green-500 text-xl">★★★</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{summary.three_star_count}</p>
              <p className="text-sm text-muted">Client Ready</p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <span className="text-yellow-500 text-xl">★★</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{summary.two_star_count}</p>
              <p className="text-sm text-muted">With Tweaks</p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-red-500 text-xl">★</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{summary.one_star_count}</p>
              <p className="text-sm text-muted">No Way</p>
            </div>
          </div>
        </div>
      </div>

      {/* Average Rating & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-bg border border-card-border rounded-lg p-6">
          <h3 className="font-medium text-foreground mb-4">Overall Quality Score</h3>
          <div className="flex items-center gap-6">
            <div className="text-5xl font-bold text-foreground">
              {summary.average_rating.toFixed(1)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="w-24 text-muted">3 stars</span>
                <div className="flex-1 h-4 bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${threeStarPct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-muted">{threeStarPct}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="w-24 text-muted">2 stars</span>
                <div className="flex-1 h-4 bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${twoStarPct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-muted">{twoStarPct}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-24 text-muted">1 star</span>
                <div className="flex-1 h-4 bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${oneStarPct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-muted">{oneStarPct}%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted mt-4">
            {summary.total_ratings > 0
              ? `Based on ${summary.total_ratings} rating${summary.total_ratings !== 1 ? 's' : ''} from your team`
              : 'No ratings yet. Have your team rate generated ideas to see analytics.'}
          </p>
        </div>

        {/* Ratings by Lane */}
        <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-card-border">
            <h3 className="font-medium text-foreground">Quality by Idea Lane</h3>
          </div>
          <div className="divide-y divide-card-border">
            {byLane.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted">
                No ratings by lane yet
              </div>
            ) : (
              byLane.map((lane) => (
                <div key={lane.idea_lane} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {LANE_LABELS[lane.idea_lane] || lane.idea_lane}
                      </p>
                      <p className="text-xs text-muted">
                        {lane.total_ratings} rating{lane.total_ratings !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              lane.average_rating >= star
                                ? lane.average_rating >= 2.5
                                  ? 'text-green-500'
                                  : lane.average_rating >= 1.5
                                  ? 'text-yellow-500'
                                  : 'text-red-500'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-foreground w-8">
                        {lane.average_rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-card-border">
          <h3 className="font-medium text-foreground">Recent Ratings</h3>
        </div>
        <div className="divide-y divide-card-border max-h-96 overflow-y-auto">
          {recentRatings.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted">
              No ratings yet. Have your team start rating ideas!
            </div>
          ) : (
            recentRatings.map((rating) => (
              <div key={rating.rating_id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${RATING_LABELS[rating.rating].color}`}>
                        {'★'.repeat(rating.rating)}
                        {'☆'.repeat(3 - rating.rating)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${RATING_LABELS[rating.rating].bgColor} text-white`}>
                        {RATING_LABELS[rating.rating].label}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{rating.rater_display_name}</span>
                      {' rated '}
                      <span className="font-medium">&ldquo;{rating.idea_title}&rdquo;</span>
                    </p>
                    <p className="text-xs text-muted">
                      {rating.client_name} • {LANE_LABELS[rating.idea_lane] || rating.idea_lane}
                    </p>
                    {rating.comment && (
                      <p className="text-sm text-muted mt-2 italic">
                        &ldquo;{rating.comment}&rdquo;
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {formatRelativeTime(rating.rated_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
