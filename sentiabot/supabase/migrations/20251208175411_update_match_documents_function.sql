-- Function to perform vector similarity search on knowledge_base_entries,
-- optionally filtered by subject and grade_level, for RAG systems.
CREATE OR REPLACE FUNCTION public.match_documents(
    query_embedding extensions.vector(768),
    match_threshold float,
    match_count int,
    p_subject text DEFAULT NULL,
    p_grade_level text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    metadata jsonb,
    embedding extensions.vector(768),
    similarity float,
    source_url text,
    subject text,
    grade_level text
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
    -- Return relevant documents from the knowledge base.
    RETURN QUERY
    SELECT
        kbe.id,
        kbe.title,
        kbe.content,
        kbe.metadata,
        kbe.embedding,
        -- Calculate cosine similarity: 1 - (cosine distance operator)
        1 - (kbe.embedding <=> query_embedding) AS similarity,
        kbe.source_url,
        kbe.subject,
        kbe.grade_level
    FROM public.knowledge_base_entries kbe
    WHERE
        -- Optional filter by subject
        (p_subject IS NULL OR kbe.subject = p_subject)
        -- Optional filter by grade level
        AND (p_grade_level IS NULL OR kbe.grade_level = p_grade_level)
        -- Filter by similarity threshold (1 - distance > threshold)
        AND 1 - (kbe.embedding <=> query_embedding) > match_threshold
    -- Order by cosine distance (nearest neighbors first)
    ORDER BY kbe.embedding <=> query_embedding
    -- Limit the number of matched documents
    LIMIT match_count;
END;
$$;