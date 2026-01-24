-- Add new idea lanes to the idea_lane enum type
-- Run this migration in your Supabase SQL Editor

-- Add the four new idea lanes
ALTER TYPE idea_lane ADD VALUE 'talent_athlete';
ALTER TYPE idea_lane ADD VALUE 'gaming_esports';
ALTER TYPE idea_lane ADD VALUE 'hospitality_vip';
ALTER TYPE idea_lane ADD VALUE 'retail_product';
