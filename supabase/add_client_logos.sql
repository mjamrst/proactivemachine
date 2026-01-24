-- Migration: Add domain field to clients for logo lookup
-- Run this in your Supabase SQL Editor

-- 1. Add domain column to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS domain TEXT;

-- 2. Update existing clients with their domains
UPDATE clients SET domain = 'nike.com' WHERE name = 'Nike';
UPDATE clients SET domain = 'apple.com' WHERE name = 'Apple';
UPDATE clients SET domain = 'coca-cola.com' WHERE name = 'Coca-Cola';
UPDATE clients SET domain = 'pepsi.com' WHERE name = 'PepsiCo';
UPDATE clients SET domain = 'mcdonalds.com' WHERE name = 'McDonald''s';
UPDATE clients SET domain = 'budweiser.com' WHERE name = 'Anheuser-Busch';
UPDATE clients SET domain = 'verizon.com' WHERE name = 'Verizon';
UPDATE clients SET domain = 'att.com' WHERE name = 'AT&T';
UPDATE clients SET domain = 'statefarm.com' WHERE name = 'State Farm';
UPDATE clients SET domain = 'geico.com' WHERE name = 'GEICO';
