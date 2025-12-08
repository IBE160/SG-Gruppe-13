import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route'; 
import { geminiModel } from '@/lib/gemini';
import { semanticSearch } from '@/lib/knowledgeBaseService';
import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { GenerateContentResult, EnhancedGenerateContentResponse, FunctionCall } from '@google/generative-ai'; // Import FunctionCall

type Mock = ReturnType<typeof vi.fn>; // Define Mock type

// Define mock types for Supabase methods
interface MockQueryBuilder {
  eq: Mock;
  single: Mock;
  insert: Mock;
  update: Mock;
  select: Mock;
}

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn((tableName: string) => {
      const mockMethods: MockQueryBuilder = {
        eq: vi.fn(() => mockMethods), // Chainable
        single: vi.fn(),
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
        update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) })),
        select: vi.fn(() => mockMethods), // Chainable
      };

      if (tableName === 'profiles') {
        mockMethods.single = vi.fn(() => Promise.resolve({ data: { role: 'admin' }, error: null }));
      }
      return mockMethods;
    }),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
    auth: {
      signInWithPassword: vi.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user-id' }}}, error: null })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    }
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

    // Correctly type the mock return for generateContent
    vi.mocked(geminiModel.generateContent as Mock).mockResolvedValue({
      response: { 
        text: () => 'This is a mocked AI response.',
        functionCall: () => undefined as FunctionCall | undefined, // Corrected mock
        functionCalls: () => undefined as FunctionCall[] | undefined, // Corrected mock
        // Add other properties of EnhancedGenerateContentResponse as undefined or mocks if needed
      } as EnhancedGenerateContentResponse, // Cast to the correct type
    } as GenerateContentResult); // Cast the whole object

    vi.mocked(semanticSearch as Mock).mockResolvedValue(mockSemanticSearchResults);
    
    // Reset supabase.from mock implementation for each test
    vi.mocked(supabase.from as Mock).mockImplementation((tableName: string) => {
        const mockMethods: MockQueryBuilder = {
          eq: vi.fn(() => mockMethods),
          single: vi.fn(),
          insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
          update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) })),
          select: vi.fn(() => mockMethods),
        };

        if (tableName === 'profiles') {
          mockMethods.single = vi.fn(() => Promise.resolve({ data: { role: 'admin' }, error: null }));
        }
        return mockMethods;
    });
  });

  it('should return an AI response on success', async () => {
    const request = new NextRequest('http://localhost/api/chat', { // Use NextRequest
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.aiResponse).toBe('This is a mocked AI response.');
    expect(vi.mocked(geminiModel.generateContent as Mock)).toHaveBeenCalledWith(expect.any(String));
  });

  it('should include knowledge base context in the prompt to Gemini', async () => {
    const specificMockResult = [
      { id: 1, title: 'Biology Basics', content: 'Mitochondria is the powerhouse of the cell.', source_url: 'http://biology.test/1' }
    ];
    vi.mocked(semanticSearch as Mock).mockResolvedValue(specificMockResult);

    const request = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'What is mitochondria?' }),
    });

    await POST(request);

    expect(vi.mocked(geminiModel.generateContent as Mock)).toHaveBeenCalledOnce();
    const prompt = vi.mocked(geminiModel.generateContent as Mock).mock.calls[0][0];
    expect(prompt).toContain('Mitochondria is the powerhouse of the cell.');
    expect(prompt).toContain('Context from Knowledge Base:');
  });

  it('should return 400 if message is missing or empty', async () => {
    // Test empty string
    let request = new NextRequest('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: '' }),
      });
    let response = await POST(request);
    let body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain('non-empty string');
    expect(vi.mocked(geminiModel.generateContent as Mock)).not.toHaveBeenCalled();

    // Test missing message
    request = new NextRequest('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    response = await POST(request);
    body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain('non-empty string');
    expect(vi.mocked(geminiModel.generateContent as Mock)).not.toHaveBeenCalled();
  });

  it('should return 400 if message exceeds max length', async () => {
    const longMessage = 'a'.repeat(2001); // Assuming MAX_MESSAGE_LENGTH is 2000
    const request = new NextRequest('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: longMessage }),
      });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('exceeds the maximum length');
    expect(vi.mocked(geminiModel.generateContent as Mock)).not.toHaveBeenCalled();
  });

  it('should return 500 if the AI call fails', async () => {
    vi.mocked(geminiModel.generateContent as Mock).mockRejectedValue(new Error('AI go boom'));

    const request = new NextRequest('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Failed to get response from AI');
  });
});