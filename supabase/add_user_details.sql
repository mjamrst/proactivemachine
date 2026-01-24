-- Add user detail fields
-- Run this in Supabase SQL Editor

-- Add first_name, last_name, and office columns
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN office TEXT CHECK (office IN ('LA', 'New York', 'Munich', 'UK', 'Singapore', 'Washington DC', 'Dallas'));

-- Update existing admin user with placeholder values (optional)
-- UPDATE users SET first_name = 'Admin', last_name = 'User' WHERE username = 'admin';
