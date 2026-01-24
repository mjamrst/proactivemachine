-- Add new modifier columns to idea_sessions table
-- Run this migration in Supabase SQL Editor

-- Create ENUM types for new modifiers
DO $$ BEGIN
  CREATE TYPE audience_modifier AS ENUM (
    'gen_z',
    'millennials',
    'families',
    'superfans',
    'casual_fans',
    'b2b_corporate'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE platform_modifier AS ENUM (
    'tiktok',
    'instagram',
    'youtube',
    'twitch',
    'x',
    'snapchat',
    'discord'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE budget_tier AS ENUM (
    'scrappy',
    'mid_tier',
    'flagship'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add new columns to idea_sessions table
ALTER TABLE idea_sessions
ADD COLUMN IF NOT EXISTS audience_modifier audience_modifier,
ADD COLUMN IF NOT EXISTS platform_modifier platform_modifier,
ADD COLUMN IF NOT EXISTS budget_tier budget_tier;

-- Add new tech modifiers to the existing tech_modifier ENUM
-- Note: Adding values to existing ENUM types
DO $$ BEGIN
  ALTER TYPE tech_modifier ADD VALUE IF NOT EXISTS 'Web3';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE tech_modifier ADD VALUE IF NOT EXISTS 'Wearables';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE tech_modifier ADD VALUE IF NOT EXISTS 'Voice';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE tech_modifier ADD VALUE IF NOT EXISTS 'Drones';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE tech_modifier ADD VALUE IF NOT EXISTS 'NFC/RFID';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
