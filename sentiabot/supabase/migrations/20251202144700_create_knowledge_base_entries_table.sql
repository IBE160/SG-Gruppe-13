CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

CREATE TABLE public.knowledge_base_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    embedding extensions.vector(1536),
    subject text,
    grade_level text,
    source_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.knowledge_base_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.knowledge_base_entries
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.knowledge_base_entries
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.knowledge_base_entries
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.knowledge_base_entries
FOR DELETE USING (auth.role() = 'authenticated');