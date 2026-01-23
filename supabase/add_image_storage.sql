-- Migration: Add image storage support
-- Run this in your Supabase SQL Editor

-- 1. Add image_url column to ideas table
ALTER TABLE ideas
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create storage bucket for idea images
INSERT INTO storage.buckets (id, name, public)
VALUES ('idea-images', 'idea-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up storage policies for the idea-images bucket

-- Allow public read access to images
CREATE POLICY "Public read access for idea images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'idea-images');

-- Allow authenticated and anonymous users to upload images
-- (since this is an internal tool without auth)
CREATE POLICY "Allow image uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'idea-images');

-- Allow updates to images
CREATE POLICY "Allow image updates"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'idea-images');

-- Allow deletion of images
CREATE POLICY "Allow image deletion"
ON storage.objects
FOR DELETE
USING (bucket_id = 'idea-images');
