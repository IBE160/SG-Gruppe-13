import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateEmbedding } from '@/lib/embeddings';
import { semanticSearch, KnowledgeBaseEntry } from '@/lib/knowledgeBaseService';
import { embeddingModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

type Mock = ReturnType<typeof vi.fn>; // Define Mock type

// Mock external dependencies
vi.mock('@/lib/gemini', () => ({
  embeddingModel: {
    embedContent: vi.fn(),
  },
}));

vi.mock('@/lib/embeddings', () => ({
  generateEmbedding: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

describe('Embedding and Knowledge Base Service', () => {
  const mockQueryEmbedding = [0.1, 0.2, 0.3];
  const mockSearchResults: KnowledgeBaseEntry[] = [{ id: 1, title: 'Doc 1', content: '...', source_url: 'http://example.com/doc1' }];

  let actualGenerateEmbedding: typeof generateEmbedding;

  beforeEach(async () => {
    vi.clearAllMocks();

    actualGenerateEmbedding = (await vi.importActual<typeof import('@/lib/embeddings')>('@/lib/embeddings')).generateEmbedding;

    // Default mock for Gemini's embedding model
    vi.mocked(embeddingModel.embedContent as Mock).mockResolvedValue({ embedding: { values: mockQueryEmbedding } });
    
    // Default mock for our generateEmbedding wrapper (used by semanticSearch)
    vi.mocked(generateEmbedding as Mock).mockResolvedValue(mockQueryEmbedding);

    // Default mock for Supabase RPC call
    vi.mocked(supabase.rpc as Mock).mockResolvedValue({ data: mockSearchResults, error: null });
  });

  describe('generateEmbedding (actual implementation)', () => {
    it('should generate an embedding for given text', async () => {
      const text = 'test query';
      const result = await actualGenerateEmbedding(text); 

      expect(vi.mocked(embeddingModel.embedContent as Mock)).toHaveBeenCalledWith(text);
      expect(result).toEqual(mockQueryEmbedding);
    });

    it('should throw an error if embedding generation fails', async () => {
      vi.mocked(embeddingModel.embedContent as Mock).mockRejectedValueOnce(new Error('API error'));

      const text = 'test query';
      await expect(actualGenerateEmbedding(text)).rejects.toThrow('Failed to generate embedding.');
    });
  });

  describe('semanticSearch', () => {
    it('should perform semantic search without filters', async () => {
      const query = 'biology question';
      const result = await semanticSearch(query);

      expect(vi.mocked(generateEmbedding as Mock)).toHaveBeenCalledWith(query);
      expect(vi.mocked(supabase.rpc as Mock)).toHaveBeenCalledWith('match_documents', {
        query_embedding: mockQueryEmbedding,
        match_threshold: 0.78,
        match_count: 5,
      });
      expect(result).toEqual(mockSearchResults);
    });

    it('should perform semantic search with subject filter', async () => {
      const query = 'biology question';
      const options = { subject: 'Biology', limit: 2 };
      await semanticSearch(query, options);

      expect(vi.mocked(generateEmbedding as Mock)).toHaveBeenCalledWith(query);
      expect(vi.mocked(supabase.rpc as Mock)).toHaveBeenCalledWith('match_documents', {
        query_embedding: mockQueryEmbedding,
        match_threshold: 0.78,
        match_count: 2,
        p_subject: 'Biology',
      });
    });

    it('should perform semantic search with gradeLevel filter', async () => {
      const query = 'math question';
      const options = { gradeLevel: '5' };
      await semanticSearch(query, options);

      expect(vi.mocked(generateEmbedding as Mock)).toHaveBeenCalledWith(query);
      expect(vi.mocked(supabase.rpc as Mock)).toHaveBeenCalledWith('match_documents', {
        query_embedding: mockQueryEmbedding,
        match_threshold: 0.78,
        match_count: 5,
        p_grade_level: '5',
      });
    });

    it('should apply both subject and gradeLevel filters when provided', async () => {
        const query = 'advanced biology';
        const options = { subject: 'Biology', gradeLevel: '12', limit: 10 };
        await semanticSearch(query, options);
  
        expect(vi.mocked(generateEmbedding as Mock)).toHaveBeenCalledWith(query);
        expect(vi.mocked(supabase.rpc as Mock)).toHaveBeenCalledWith('match_documents', {
          query_embedding: mockQueryEmbedding,
          match_threshold: 0.78,
          match_count: 10,
          p_subject: 'Biology',
          p_grade_level: '12',
        });
      });

    it('should return search results', async () => {
      const query = 'test query';
      const results = await semanticSearch(query);
      expect(results).toEqual(mockSearchResults);
    });

    it('should throw an error if embedding generation fails', async () => {
      vi.mocked(generateEmbedding as Mock).mockRejectedValue(new Error('Embedding error'));
      await expect(semanticSearch('query')).rejects.toThrow('An unexpected error occurred during semantic search.');
    });

    it('should throw an error if supabase rpc call fails', async () => {
      vi.mocked(supabase.rpc as Mock).mockResolvedValue({ data: null, error: { message: 'RPC error' } });
      await expect(semanticSearch('query')).rejects.toThrow('Failed to perform semantic search.');
    });
  });
});