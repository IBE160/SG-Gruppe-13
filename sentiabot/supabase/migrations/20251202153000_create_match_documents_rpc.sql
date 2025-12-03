CREATE OR REPLACE FUNCTION match_documents (
  query_embedding extensions.vector(768),
  match_threshold FLOAT,
  match_count INT
) RETURNS TABLE (
  id uuid,
  title text,
  content text,
  source_url text,
  similarity FLOAT
) LANGUAGE plpgsql AS $$
#variable_conflict use_column
BEGIN
  RETURN query
  SELECT
    id,
    title,
    content,
    source_url,
    1 - (knowledge_base_entries.embedding <=> query_embedding) AS similarity
  FROM knowledge_base_entries
  WHERE 1 - (knowledge_base_entries.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;