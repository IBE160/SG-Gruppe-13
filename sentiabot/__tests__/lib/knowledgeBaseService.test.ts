import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateEmbedding } from '@/lib/embeddings';
import { semanticSearch, KnowledgeBaseEntry } from '@/lib/knowledgeBaseService';
import { embeddingModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

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

    // Import the actual implementation for its own tests
    actualGenerateEmbedding = (await vi.importActual<typeof import('@/lib/embeddings')>('@/lib/embeddings')).generateEmbedding;

    // Default mock for Gemini's embedding model
    (embeddingModel.embedContent as vi.Mock).mockResolvedValue({ embedding: { values: mockQueryEmbedding } });
    
    // Default mock for our generateEmbedding wrapper (used by semanticSearch)
    (generateEmbedding as vi.Mock).mockResolvedValue(mockQueryEmbedding);

    // Default mock for Supabase RPC call
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: mockSearchResults, error: null });
  });

  describe('generateEmbedding (actual implementation)', () => {
    it('should generate an embedding for given text', async () => {
      const text = 'test query';
      const result = await actualGenerateEmbedding(text); 

      expect(embeddingModel.embedContent).toHaveBeenCalledWith(text);
      expect(result).toEqual(mockQueryEmbedding);
    });

    it('should throw an error if embedding generation fails', async () => {
      (embeddingModel.embedContent as vi.Mock).mockRejectedValueOnce(new Error('API error'));

      const text = 'test query';
      await expect(actualGenerateEmbedding(text)).rejects.toThrow('Failed to generate embedding.');
    });
  });

  describe('semanticSearch', () => {
    it('should perform semantic search without filters', async () => {
      const query = 'biology question';
      const result = await semanticSearch(query);

      expect(generateEmbedding).toHaveBeenCalledWith(query);
      expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
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

      expect(generateEmbedding).toHaveBeenCalledWith(query);
      expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
        query_embedding: mockQueryEmbedding,
        match_threshold: 0.78,
        match_count: 2,
        p_subject: 'Biology',
      });
    });

    it('should perform semantic search with gradeLevel filter', async () => {
      const query = 'math question';
      const options = { gradeLevel: '6' };
      await semanticSearch(query, options);

      expect(generateEmbedding).toHaveBeenCalledWith(query);
      expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
        query_embedding: mockQueryEmbedding,
        match_threshold: 0.78,
        match_count: 5,
        p_grade_level: '6',
      });
    });

    it('should perform semantic search with all filters', async () => {
        const query = 'advanced biology';
        const options = { subject: 'Biology', gradeLevel: '12', limit: 10 };
        await semanticSearch(query, options);
  
        expect(generateEmbedding).toHaveBeenCalledWith(query);
        expect(supabase.rpc).toHaveBeenCalledWith('match_documents', {
          query_embedding: mockQueryEmbedding,
          match_threshold: 0.78,
          match_count: 10,
          p_subject: 'Biology',
          p_grade_level: '12',
        });
      });

    it('should throw an error if RPC call fails', async () => {
      (supabase.rpc as vi.Mock).mockResolvedValue({ data: null, error: { message: 'DB error' } });

      const query = 'failing query';
      await expect(semanticSearch(query)).rejects.toThrow('Failed to perform semantic search.');
    });

    it('should re-throw an error from generateEmbedding', async () => {
        (generateEmbedding as vi.Mock).mockRejectedValueOnce(new Error('Embedding failed'));
  
        const query = 'another failing query';
        await expect(semanticSearch(query)).rejects.toThrow('An unexpected error occurred during semantic search.');
      });
  });
});
