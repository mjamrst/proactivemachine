-- Authentication and User Management Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Index for username lookups
CREATE INDEX idx_users_username ON users(username);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users table (allow all for now since we use custom auth)
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- ADD USER_ID TO IDEA_SESSIONS
-- ============================================

ALTER TABLE idea_sessions ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX idx_idea_sessions_user_id ON idea_sessions(user_id);

-- ============================================
-- UPDATE IDEA_SESSIONS_WITH_DETAILS VIEW
-- ============================================

-- Drop old view and recreate with user info
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
  s.content_style,
  s.num_ideas,
  s.user_id,
  u.username,
  u.display_name AS user_display_name,
  s.created_at,
  (SELECT COUNT(*) FROM ideas WHERE session_id = s.id) AS ideas_count
FROM idea_sessions s
JOIN clients c ON s.client_id = c.id
LEFT JOIN users u ON s.user_id = u.id;

-- ============================================
-- USAGE STATS VIEW
-- ============================================

CREATE VIEW user_usage_stats AS
SELECT
  u.id as user_id,
  u.username,
  u.display_name,
  u.role,
  u.created_at,
  u.last_login_at,
  COUNT(DISTINCT s.id) as total_sessions,
  COALESCE(SUM((SELECT COUNT(*) FROM ideas WHERE session_id = s.id)), 0) as total_ideas_generated,
  MAX(s.created_at) as last_activity
FROM users u
LEFT JOIN idea_sessions s ON s.user_id = u.id
GROUP BY u.id, u.username, u.display_name, u.role, u.created_at, u.last_login_at;

-- ============================================
-- INITIAL ADMIN USER
-- ============================================
-- The password hash below is for: admin123
-- IMPORTANT: Change this password immediately after first login!
--
-- To generate a new hash, run this Node.js code:
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('your-password', 10).then(console.log);

INSERT INTO users (username, password_hash, display_name, role) VALUES (
  'admin',
  '$2b$10$9eX65hS.iGjpZBppc//FR.g/xNMVpZF.iDU/5nKGQacD6gu8wr2j6',
  'Administrator',
  'admin'
);

-- IMPORTANT: The password for 'admin' is 'admin123'
-- Change this password immediately after first login via the admin panel!
