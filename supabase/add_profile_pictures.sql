-- Add profile picture support to users
-- Run this in Supabase SQL Editor

-- Add avatar_url column to users table
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to profile images
CREATE POLICY "Public read access for profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Allow authenticated uploads to profile images (using service role)
CREATE POLICY "Allow uploads to profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images');

-- Allow updates to profile images
CREATE POLICY "Allow updates to profile images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images');

-- Allow deletes from profile images
CREATE POLICY "Allow deletes from profile images"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images');
