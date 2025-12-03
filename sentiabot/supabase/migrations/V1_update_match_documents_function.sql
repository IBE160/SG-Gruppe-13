CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_subject text DEFAULT NULL,
  p_grade_level text DEFAULT NULL
)
RETURNS TABLE (
  id uuid, -- Corrected to uuid based on knowledge_base_entries.id type
  content text,
  metadata jsonb,
  embedding vector(1536),
  similarity float,
  source_url text,
  subject text,
  grade_level text
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    content,
    metadata,
    embedding,
    1 - (knowledge_base_entries.embedding <=> query_embedding) AS similarity,
    source_url,
    subject,
    grade_level
  FROM public.knowledge_base_entries
  WHERE (p_subject IS NULL OR knowledge_base_entries.subject = p_subject)
    AND (p_grade_level IS NULL OR knowledge_base_entries.grade_level = p_grade_level)
    AND 1 - (knowledge_base_entries.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base_entries.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
