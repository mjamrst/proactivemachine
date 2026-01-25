-- Add ai_model column to idea_sessions table
-- This allows tracking which AI model was used to generate ideas

ALTER TABLE idea_sessions
ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'claude';

-- Add a comment to document the column
COMMENT ON COLUMN idea_sessions.ai_model IS 'The AI model used to generate ideas: claude or palmyra-creative';
