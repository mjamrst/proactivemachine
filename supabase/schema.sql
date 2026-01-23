-- Idea Machine Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

-- Property category enum
CREATE TYPE property_category AS ENUM (
  'league',
  'team',
  'music_festival',
  'entertainment',
  'cultural_moment'
);

-- Idea lane enum
CREATE TYPE idea_lane AS ENUM (
  'live_experience',
  'digital',
  'content'
);

-- Tech modifier enum
CREATE TYPE tech_modifier AS ENUM (
  'AI',
  'VR',
  'AR'
);

-- Content style enum
CREATE TYPE content_style AS ENUM (
  'creator_led',
  'talent_led',
  'branded_content'
);

-- ============================================
-- TABLES
-- ============================================

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Properties table (sports leagues, teams, festivals, etc.)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category property_category NOT NULL,
  parent_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster parent lookups
CREATE INDEX idx_properties_parent_id ON properties(parent_id);
CREATE INDEX idx_properties_category ON properties(category);

-- Idea sessions table
CREATE TABLE idea_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_ids UUID[] NOT NULL,
  idea_lane idea_lane NOT NULL,
  tech_modifiers tech_modifier[] DEFAULT NULL,
  content_style content_style DEFAULT NULL,
  num_ideas INTEGER NOT NULL CHECK (num_ideas >= 1 AND num_ideas <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for client lookups
CREATE INDEX idx_idea_sessions_client_id ON idea_sessions(client_id);
CREATE INDEX idx_idea_sessions_created_at ON idea_sessions(created_at DESC);

-- Ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES idea_sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  overview TEXT NOT NULL,
  features TEXT[] NOT NULL,
  brand_fit TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  figma_frame_id TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for session lookups
CREATE INDEX idx_ideas_session_id ON ideas(session_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for internal tool)
-- In production, you'd want proper auth policies

CREATE POLICY "Allow all operations on clients" ON clients
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on properties" ON properties
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on idea_sessions" ON idea_sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on ideas" ON ideas
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View for properties with their parent names
CREATE VIEW properties_with_parents AS
SELECT
  p.id,
  p.name,
  p.category,
  p.parent_id,
  parent.name AS parent_name,
  p.created_at
FROM properties p
LEFT JOIN properties parent ON p.parent_id = parent.id;

-- View for idea sessions with client names
CREATE VIEW idea_sessions_with_details AS
SELECT
  s.id,
  s.client_id,
  c.name AS client_name,
  s.property_ids,
  s.idea_lane,
  s.tech_modifiers,
  s.content_style,
  s.num_ideas,
  s.created_at,
  (SELECT COUNT(*) FROM ideas WHERE session_id = s.id) AS ideas_count
FROM idea_sessions s
JOIN clients c ON s.client_id = c.id;
