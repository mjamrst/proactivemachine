// Database types for Primer

export type PropertyCategory =
  | 'league'
  | 'team'
  | 'music_festival'
  | 'entertainment'
  | 'cultural_moment';

export type IdeaLane =
  | 'live_experience'
  | 'digital'
  | 'content'
  | 'social_impact'
  | 'talent_athlete'
  | 'gaming_esports'
  | 'hospitality_vip'
  | 'retail_product';

export type TechModifier =
  | 'AI'
  | 'VR'
  | 'AR'
  | 'Web3'
  | 'Wearables'
  | 'Voice'
  | 'Drones'
  | 'NFC/RFID';

export type AudienceModifier =
  | 'gen_z'
  | 'millennials'
  | 'families'
  | 'superfans'
  | 'casual_fans'
  | 'b2b_corporate';

export type PlatformModifier =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'twitch'
  | 'x'
  | 'snapchat'
  | 'discord';

export type BudgetTier =
  | 'scrappy'
  | 'mid_tier'
  | 'flagship';

export type ContentStyle =
  | 'creator_led'
  | 'talent_led'
  | 'branded_content';

export type OutputStyleType =
  | 'generic'
  | 'techbro'
  | 'creative_strategist'
  | 'gen_z'
  | 'sports_expert'
  | 'world_traveler'
  | 'data_nerd';

export interface OutputStyle {
  type: OutputStyleType;
  intensity: number; // 1-5
}

export type AIModel = 'claude' | 'palmyra-creative' | 'gemini';

// Database row types
export interface Client {
  id: string;
  name: string;
  domain: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  name: string;
  category: PropertyCategory;
  parent_id: string | null;
  created_at: string;
}

export interface PropertyWithParent extends Property {
  parent_name: string | null;
}

export interface IdeaSession {
  id: string;
  client_id: string;
  property_ids: string[];
  idea_lane: IdeaLane;
  tech_modifiers: TechModifier[] | null;
  audience_modifier: AudienceModifier | null;
  platform_modifier: PlatformModifier | null;
  budget_tier: BudgetTier | null;
  content_style: ContentStyle | null;
  ai_model: AIModel | null;
  num_ideas: number;
  user_id: string | null;
  name: string | null;
  created_at: string;
}

export interface IdeaSessionWithDetails extends IdeaSession {
  client_name: string;
  client_domain?: string | null;
  username?: string | null;
  user_display_name?: string | null;
  ideas_count: number;
}

export interface Idea {
  id: string;
  session_id: string;
  title: string;
  overview: string;
  features: string[];
  brand_fit: string;
  image_prompt: string;
  image_url: string | null;
  figma_frame_id: string | null;
  created_at: string;
}

export interface ClientDocument {
  id: string;
  client_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface SessionDocument {
  id: string;
  session_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

// Insert types (without auto-generated fields)
export interface ClientInsert {
  name: string;
  domain?: string | null;
}

export interface PropertyInsert {
  name: string;
  category: PropertyCategory;
  parent_id?: string | null;
}

export interface IdeaSessionInsert {
  client_id: string;
  property_ids: string[];
  idea_lane: IdeaLane;
  tech_modifiers?: TechModifier[] | null;
  audience_modifier?: AudienceModifier | null;
  platform_modifier?: PlatformModifier | null;
  budget_tier?: BudgetTier | null;
  content_style?: ContentStyle | null;
  ai_model?: AIModel | null;
  num_ideas: number;
  user_id?: string | null;
  name?: string | null;
}

export interface IdeaInsert {
  session_id: string;
  title: string;
  overview: string;
  features: string[];
  brand_fit: string;
  image_prompt: string;
  figma_frame_id?: string | null;
}

// Grouped properties for UI
export interface PropertiesByCategory {
  leagues: Property[];
  teams: Property[];
  music_festivals: Property[];
  entertainment: Property[];
  cultural_moments: Property[];
}

// API Response types
export interface GenerateIdeasRequest {
  client_id: string;
  property_ids: string[];
  idea_lane: IdeaLane;
  tech_modifiers?: TechModifier[];
  audience_modifier?: AudienceModifier;
  platform_modifier?: PlatformModifier;
  budget_tier?: BudgetTier;
  content_style?: ContentStyle;
  num_ideas: number;
  session_documents?: File[];
}

export interface GeneratedIdea {
  title: string;
  overview: string;
  features: string[];
  brand_fit: string;
  image_prompt: string;
}

export interface GenerateIdeasResponse {
  session_id: string;
  ideas: Idea[];
}

// Idea Ratings
export type IdeaRatingValue = 1 | 2 | 3;

export interface IdeaRating {
  id: string;
  idea_id: string;
  user_id: string;
  rating: IdeaRatingValue;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface IdeaRatingInsert {
  idea_id: string;
  rating: IdeaRatingValue;
  comment?: string | null;
}

export interface IdeaRatingWithUser extends IdeaRating {
  user_display_name: string;
  username: string;
}

// Rating Analytics Types
export interface RatingSummary {
  total_ratings: number;
  one_star_count: number;
  two_star_count: number;
  three_star_count: number;
  average_rating: number;
}

export interface RatingByLane extends RatingSummary {
  idea_lane: IdeaLane;
}

export interface RatingByOutputStyle extends RatingSummary {
  output_style: OutputStyleType | null;
}

export interface RatingAnalytics {
  summary: RatingSummary;
  byLane: RatingByLane[];
  byOutputStyle: RatingByOutputStyle[];
  recentRatings: IdeaRatingWithDetails[];
}

export interface IdeaRatingWithDetails {
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
