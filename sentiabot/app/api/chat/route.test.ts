import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as route from './route'; 
import { geminiModel } from '@/lib/gemini';
import { semanticSearch } from '@/lib/knowledgeBaseService';
import { supabase } from '@/lib/supabase'; // Import supabase client to mock it

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn((tableName: string) => {
      if (tableName === 'chat_sessions') {
        return {
          insert: vi.fn(() => Promise.resolve({ error: null })),
          update: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null })),
          })),
        };
      } else if (tableName === 'chat_messages') {
        return {
          insert: vi.fn(() => Promise.resolve({ error: null })),
        };
      }
      return {};
    }),
    rpc: vi.fn(), // Mock rpc for semanticSearch, not directly used here but good to have
  },
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid'),
}));

// Use vi.mock for reliable hoisting
vi.mock('@/lib/gemini', () => ({
  geminiModel: {
    generateContent: vi.fn(),
  },
  embeddingModel: {
    embedContent: vi.fn(),
  },
}));

vi.mock('@/lib/knowledgeBaseService', () => ({
  semanticSearch: vi.fn(),
}));

describe('POST /api/chat', () => {
  const mockSemanticSearchResults = [{ id: 1, title: 'Test Doc', content: 'Test content.', source_url: 'http://test.com' }];

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'mock_key';

    // Use vi.mocked() for type-safe mock interactions
    vi.mocked(geminiModel.generateContent).mockResolvedValue({
      response: { text: () => 'This is a mocked AI response.' },
    });
    vi.mocked(semanticSearch).mockResolvedValue(mockSemanticSearchResults);
    // Ensure supabase mocks are reset and returning success
    vi.mocked(supabase.from).mockImplementation((tableName: string) => {
        if (tableName === 'chat_sessions') {
            return {
                insert: vi.fn(() => Promise.resolve({ error: null })),
                update: vi.fn(() => ({
                    eq: vi.fn(() => Promise.resolve({ error: null })),
                })),
            } as any;
        } else if (tableName === 'chat_messages') {
            return {
                insert: vi.fn(() => Promise.resolve({ error: null })),
            } as any;
        }
        return {} as any;
    });
  });

  it('should return an AI response on success', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await route.POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.aiResponse).toBe('This is a mocked AI response.');
    expect(vi.mocked(geminiModel.generateContent)).toHaveBeenCalledWith(expect.any(String));
  });

  it('should include knowledge base context in the prompt to Gemini', async () => {
    const specificMockResult = [
      { id: 1, title: 'Biology Basics', content: 'Mitochondria is the powerhouse of the cell.', source_url: 'http://biology.test/1' }
    ];
    vi.mocked(semanticSearch).mockResolvedValue(specificMockResult);

    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'What is mitochondria?' }),
    });

    await route.POST(request);

    expect(vi.mocked(geminiModel.generateContent)).toHaveBeenCalledOnce();
    const prompt = vi.mocked(geminiModel.generateContent).mock.calls[0][0];
    expect(prompt).toContain('Mitochondria is the powerhouse of the cell.');
    expect(prompt).toContain('Context from Knowledge Base:');
  });

  it('should return 400 if message is missing or empty', async () => {
    // Test empty string
    let request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: '' }),
      });
    let response = await route.POST(request);
    let body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain('non-empty string');
    expect(vi.mocked(geminiModel.generateContent)).not.toHaveBeenCalled();

    // Test missing message
    request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    response = await route.POST(request);
    body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain('non-empty string');
    expect(vi.mocked(geminiModel.generateContent)).not.toHaveBeenCalled();
  });

  it('should return 400 if message exceeds max length', async () => {
    const longMessage = 'a'.repeat(2001); // Assuming MAX_MESSAGE_LENGTH is 2000
    const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: longMessage }),
      });

    const response = await route.POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('exceeds the maximum length');
    expect(vi.mocked(geminiModel.generateContent)).not.toHaveBeenCalled();
  });

  it('should return 500 if the AI call fails', async () => {
    vi.mocked(geminiModel.generateContent).mockRejectedValue(new Error('AI go boom'));

    const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });

    const response = await route.POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Failed to get response from AI');
  });
});
