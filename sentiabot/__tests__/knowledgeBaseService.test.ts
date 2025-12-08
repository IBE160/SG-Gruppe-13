import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateEmbedding } from '@/lib/embeddings';
import { semanticSearch, KnowledgeBaseEntry } from '@/lib/knowledgeBaseService';
import { embeddingModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

type Mock = ReturnType<typeof vi.fn>;

// Mock external dependencies at the module level
vi.mock('@/lib/gemini', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    embeddingModel: {
      embedContent: vi.fn(), // Mock only embedContent
    },
  };
});

// Mock generateEmbedding globally. This will be restored for 'actual implementation' tests.
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

  beforeEach(() => {
    vi.clearAllMocks(); // Clears all mock history and reset spy behavior

    // Common mocks for all tests (unless specifically unmocked/overridden)
    vi.mocked(embeddingModel.embedContent as Mock).mockResolvedValue({ embedding: { values: mockQueryEmbedding } });
    vi.mocked(generateEmbedding as Mock).mockResolvedValue(mockQueryEmbedding); // Mock generateEmbedding globally for semanticSearch
    vi.mocked(supabase.rpc as Mock).mockResolvedValue({ data: mockSearchResults, error: null });
  });

  describe('generateEmbedding (actual implementation)', () => {
    // This block tests the actual implementation of generateEmbedding
    // We need to unmock generateEmbedding for this suite to test its real code.
    beforeEach(() => {
        vi.restoreAllMocks(); // Unmock all globally defined mocks, including generateEmbedding
        vi.clearAllMocks(); // Clear history after restoring

        // Re-mock dependencies that the actual generateEmbedding relies on
        vi.mocked(embeddingModel.embedContent as Mock).mockResolvedValue({ embedding: { values: mockQueryEmbedding } });
    });

    it('should generate an embedding for given text', async () => {
      const text = 'test query';
      const result = await generateEmbedding(text); // This is the actual function now

      expect(vi.mocked(embeddingModel.embedContent as Mock)).toHaveBeenCalledWith(text);
      expect(result).toEqual(mockQueryEmbedding);
    });

    it('should throw an error if embedding generation fails', async () => {
      vi.mocked(embeddingModel.embedContent as Mock).mockRejectedValueOnce(new Error('API error'));

      const text = 'test query';
      await expect(generateEmbedding(text)).rejects.toThrow('Failed to generate embedding.');
    });
  });

  describe('semanticSearch', () => {
    // For semanticSearch, generateEmbedding is globally mocked by vi.mock at the top
    // The mockResolvedValue is set in the top-level beforeEach
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