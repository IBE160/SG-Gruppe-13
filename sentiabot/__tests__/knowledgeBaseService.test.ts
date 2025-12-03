// sentiabot/__tests__/knowledgeBaseService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { semanticSearch } from '../lib/knowledgeBaseService';
import { supabase } from '../lib/supabase';
import { generateEmbedding } from '../lib/embeddings';

// Mock supabase and generateEmbedding
vi.mock('../lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

vi.mock('../lib/embeddings', () => ({
  generateEmbedding: vi.fn(),
}));

describe('semanticSearch', () => {
  const mockEmbedding = [0.1, 0.2, 0.3];
  const mockSearchResults = [
    { id: 1, title: 'Doc 1', content: 'Content 1', source_url: 'url1' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (generateEmbedding as vi.Mock).mockResolvedValue(mockEmbedding);
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: mockSearchResults, error: null });
  });

  it('should call generateEmbedding and supabase.rpc with correct parameters', async () => {
    const query = 'test query';
    await semanticSearch(query);

    expect(generateEmbedding).toHaveBeenCalledWith(query);
    expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
      query_embedding: mockEmbedding,
      match_threshold: 0.78,
      match_count: 5,
    });
  });

  it('should apply subject filter when provided', async () => {
    const query = 'test query';
    const subject = 'biology';
    await semanticSearch(query, { subject });

    expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
      query_embedding: mockEmbedding,
      match_threshold: 0.78,
      match_count: 5,
      p_subject: subject,
    });
  });

  it('should apply gradeLevel filter when provided', async () => {
    const query = 'test query';
    const gradeLevel = '5';
    await semanticSearch(query, { gradeLevel });

    expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
      query_embedding: mockEmbedding,
      match_threshold: 0.78,
      match_count: 5,
      p_grade_level: gradeLevel,
    });
  });

  it('should apply both subject and gradeLevel filters when provided', async () => {
    const query = 'test query';
    const subject = 'geology';
    const gradeLevel = '6';
    await semanticSearch(query, { subject, gradeLevel });

    expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
      query_embedding: mockEmbedding,
      match_threshold: 0.78,
      match_count: 5,
      p_subject: subject,
      p_grade_level: gradeLevel,
    });
  });

  it('should return search results', async () => {
    const query = 'test query';
    const results = await semanticSearch(query);
    expect(results).toEqual(mockSearchResults);
  });

  it('should throw an error if embedding generation fails', async () => {
    (generateEmbedding as vi.Mock).mockRejectedValue(new Error('Embedding error'));
    await expect(semanticSearch('query')).rejects.toThrow('An unexpected error occurred during semantic search.');
  });

  it('should throw an error if supabase rpc call fails', async () => {
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: null, error: { message: 'RPC error' } });
    await expect(semanticSearch('query')).rejects.toThrow('Failed to perform semantic search.');
  });
});
