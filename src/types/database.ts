// Database types for Idea Machine

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
  | 'social_impact';

export type TechModifier = 'AI' | 'VR' | 'AR';

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
  content_style: ContentStyle | null;
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
  content_style?: ContentStyle | null;
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
