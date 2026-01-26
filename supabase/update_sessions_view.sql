-- Update idea_sessions_with_details view to include all columns
-- Run this in Supabase SQL Editor

DROP VIEW IF EXISTS idea_sessions_with_details;

CREATE VIEW idea_sessions_with_details AS
SELECT
  s.id,
  s.client_id,
  c.name AS client_name,
  c.domain AS client_domain,
  s.property_ids,
  s.idea_lane,
  s.tech_modifiers,
  s.audience_modifier,
  s.platform_modifier,
  s.budget_tier,
  s.content_style,
  s.ai_model,
  s.num_ideas,
  s.user_id,
  s.name,
  u.username,
  u.display_name AS user_display_name,
  s.created_at,
  (SELECT COUNT(*) FROM ideas WHERE session_id = s.id) AS ideas_count
FROM idea_sessions s
JOIN clients c ON s.client_id = c.id
LEFT JOIN users u ON s.user_id = u.id;
