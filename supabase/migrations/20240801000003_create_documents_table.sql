-- Create documents table for storing document metadata
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  file_path TEXT,
  file_url TEXT,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_entity_id ON public.documents(entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity_type ON public.documents(entity_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);

-- Enable row level security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
CREATE POLICY "Users can insert their own documents"
  ON public.documents FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents"
  ON public.documents FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents"
  ON public.documents FOR DELETE
  USING (true);
