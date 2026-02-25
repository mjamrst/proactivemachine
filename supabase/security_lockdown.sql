-- ============================================
-- SECURITY LOCKDOWN: RLS Policy Migration
-- ============================================
-- Run this AFTER deploying the code changes that switch
-- all API routes to use the service role key (createAdminClient).
--
-- The service role key bypasses RLS, so server-side API routes
-- will continue to work. These policies deny all access via the
-- public anon key, preventing direct database queries from browsers.
-- ============================================

-- ============================================
-- DROP ALL PERMISSIVE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow all operations on clients" ON clients;
DROP POLICY IF EXISTS "Allow all operations on properties" ON properties;
DROP POLICY IF EXISTS "Allow all operations on idea_sessions" ON idea_sessions;
DROP POLICY IF EXISTS "Allow all operations on ideas" ON ideas;
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on client_documents" ON client_documents;
DROP POLICY IF EXISTS "Allow all operations on idea_ratings" ON idea_ratings;
DROP POLICY IF EXISTS "Allow all operations on session_documents" ON session_documents;

-- ============================================
-- CREATE DENY-ALL POLICIES FOR ANON KEY
-- ============================================
-- These prevent any operations via the anon key.
-- The service role key used by API routes bypasses RLS entirely.

CREATE POLICY "Deny all for anon" ON clients
  FOR ALL USING (false) WITH CHECK (false);

CREATE POLICY "Deny all for anon" ON properties
  FOR ALL USING (false) WITH CHECK (false);

CREATE POLICY "Deny all for anon" ON idea_sessions
  FOR ALL USING (false) WITH CHECK (false);

CREATE POLICY "Deny all for anon" ON ideas
  FOR ALL USING (false) WITH CHECK (false);

CREATE POLICY "Deny all for anon" ON users
  FOR ALL USING (false) WITH CHECK (false);

-- Only add policies for tables that exist (these may not exist in all environments)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_documents') THEN
    EXECUTE 'CREATE POLICY "Deny all for anon" ON client_documents FOR ALL USING (false) WITH CHECK (false)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'idea_ratings') THEN
    EXECUTE 'CREATE POLICY "Deny all for anon" ON idea_ratings FOR ALL USING (false) WITH CHECK (false)';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'session_documents') THEN
    EXECUTE 'CREATE POLICY "Deny all for anon" ON session_documents FOR ALL USING (false) WITH CHECK (false)';
  END IF;
END $$;

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================
-- Keep public READ access on storage buckets so images render in browser.
-- Remove write policies - service role key handles uploads.

-- idea-images bucket: allow public read, deny anon write
DROP POLICY IF EXISTS "Allow public read idea-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on idea-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to idea-images" ON storage.objects;

CREATE POLICY "Allow public read idea-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'idea-images');

-- profile-images bucket: allow public read, deny anon write
DROP POLICY IF EXISTS "Allow public read profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to profile-images" ON storage.objects;

CREATE POLICY "Allow public read profile-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

-- documents bucket: allow public read, deny anon write
DROP POLICY IF EXISTS "Allow public read documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to documents" ON storage.objects;

CREATE POLICY "Allow public read documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');
