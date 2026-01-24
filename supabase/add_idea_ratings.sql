-- Idea Ratings table for tracking idea quality
-- Run this migration in Supabase SQL Editor

CREATE TABLE idea_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 3),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can only rate an idea once
  UNIQUE(idea_id, user_id)
);

-- Index for querying ratings by idea
CREATE INDEX idx_idea_ratings_idea_id ON idea_ratings(idea_id);

-- Index for querying ratings by user
CREATE INDEX idx_idea_ratings_user_id ON idea_ratings(user_id);

-- Index for analytics queries
CREATE INDEX idx_idea_ratings_rating ON idea_ratings(rating);
CREATE INDEX idx_idea_ratings_created_at ON idea_ratings(created_at);

-- View for analytics - ratings with session and idea details
CREATE OR REPLACE VIEW idea_ratings_analytics AS
SELECT
  ir.id as rating_id,
  ir.rating,
  ir.comment,
  ir.created_at as rated_at,
  i.id as idea_id,
  i.title as idea_title,
  s.id as session_id,
  s.idea_lane,
  s.tech_modifiers,
  s.audience_modifier,
  s.platform_modifier,
  s.budget_tier,
  c.id as client_id,
  c.name as client_name,
  u.id as rater_id,
  u.username as rater_username,
  u.display_name as rater_display_name
FROM idea_ratings ir
JOIN ideas i ON i.id = ir.idea_id
JOIN idea_sessions s ON s.id = i.session_id
JOIN clients c ON c.id = s.client_id
JOIN users u ON u.id = ir.user_id;

-- Aggregated stats view
CREATE OR REPLACE VIEW idea_ratings_summary AS
SELECT
  COUNT(*) as total_ratings,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  ROUND(AVG(rating)::numeric, 2) as average_rating
FROM idea_ratings;

-- Stats by idea lane
CREATE OR REPLACE VIEW idea_ratings_by_lane AS
SELECT
  s.idea_lane,
  COUNT(*) as total_ratings,
  COUNT(CASE WHEN ir.rating = 1 THEN 1 END) as one_star_count,
  COUNT(CASE WHEN ir.rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN ir.rating = 3 THEN 1 END) as three_star_count,
  ROUND(AVG(ir.rating)::numeric, 2) as average_rating
FROM idea_ratings ir
JOIN ideas i ON i.id = ir.idea_id
JOIN idea_sessions s ON s.id = i.session_id
GROUP BY s.idea_lane
ORDER BY average_rating DESC;
