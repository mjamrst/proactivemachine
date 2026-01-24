-- Migration: Add document upload support for briefs and brand guidelines
-- Run this in your Supabase SQL Editor

-- 1. Create client_documents table (for brand guidelines, evergreen docs)
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create session_documents table (for campaign-specific briefs)
CREATE TABLE IF NOT EXISTS session_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES idea_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_session_documents_session_id ON session_documents(session_id);

-- 4. Enable RLS
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_documents ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies (allow all for internal tool)
CREATE POLICY "Allow all operations on client_documents"
ON client_documents FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on session_documents"
ON session_documents FOR ALL USING (true) WITH CHECK (true);

-- 6. Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies for documents bucket
CREATE POLICY "Public read access for documents"
ON storage.objects FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow document uploads"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow document updates"
ON storage.objects FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Allow document deletion"
ON storage.objects FOR DELETE USING (bucket_id = 'documents');
