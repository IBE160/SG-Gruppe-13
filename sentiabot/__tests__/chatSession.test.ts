// sentiabot/__tests__/chatSession.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/chat/route';
import { supabase } from '../lib/supabase';
import { geminiModel } from '../lib/gemini';
import { generateEmbedding } from '../lib/embeddings'; // For mocking semanticSearch dependency

// Mocks for supabase chainable methods
const mockEqChatSessions = vi.fn(() => Promise.resolve({ error: null }));
const mockUpdateChatSessions = vi.fn(() => ({
  eq: mockEqChatSessions,
}));
const mockInsertChatSessions = vi.fn(() => Promise.resolve({ error: null }));
const mockInsertChatMessages = vi.fn(() => Promise.resolve({ error: null }));

// Mock supabase and geminiModel
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn((tableName: string) => {
      if (tableName === 'chat_sessions') {
        return {
          insert: mockInsertChatSessions,
          update: mockUpdateChatSessions,
        };
      } else if (tableName === 'chat_messages') {
        return {
          insert: mockInsertChatMessages,
        };
      }
      return {};
    }),
    rpc: vi.fn(), // Mock rpc for semanticSearch
  },
}));

vi.mock('../lib/gemini', () => ({
  geminiModel: {
    generateContent: vi.fn(),
  },
}));

vi.mock('../lib/embeddings', () => ({
  generateEmbedding: vi.fn(),
}));

describe('Chat API - Session Management', () => {
  const mockMessage = 'Hello, Sentiabot!';
  const mockSubject = 'biology';
  const mockGradeLevel = '3';
  const mockAiResponse = 'Hi there!';
  const mockEmbedding = [0.1, 0.2, 0.3];
  const mockSemanticSearchResults = [{ id: 'doc1', content: 'bio content', source_url: 'url1' }];

  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mocks registered by vi.mock
    // Clear individual mocks that are part of the `vi.mock` factory function
    mockInsertChatMessages.mockClear();
    mockEqChatSessions.mockClear();
    mockUpdateChatSessions.mockClear();
    mockInsertChatSessions.mockClear();
    (supabase.from as vi.Mock).mockClear(); // Clear spy on from
    (supabase.rpc as vi.Mock).mockClear(); // Clear spy on rpc

    (geminiModel.generateContent as vi.Mock).mockResolvedValue({
      response: {
        text: () => mockAiResponse,
      },
    });
    (generateEmbedding as vi.Mock).mockResolvedValue(mockEmbedding);
    (supabase.rpc as vi.Mock).mockResolvedValue({ data: mockSemanticSearchResults, error: null });

  });

  it('should create a new chat session if no sessionId is provided', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: mockMessage,
        context: { subject: mockSubject, gradeLevel: mockGradeLevel },
      }),
    });

    await POST(request);

    expect(supabase.from).toHaveBeenCalledWith('chat_sessions');
    expect(mockInsertChatSessions).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: 'anonymous',
          subject: mockSubject,
          grade_level: mockGradeLevel,
        }),
      ])
    );
    expect(mockUpdateChatSessions).not.toHaveBeenCalled(); // No update for new session
  });

  it('should update an existing chat session if sessionId is provided', async () => {
    const existingSessionId = 'some-existing-session-id';
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: mockMessage,
        context: { subject: mockSubject, gradeLevel: mockGradeLevel },
        sessionId: existingSessionId,
      }),
    });

    await POST(request);

    expect(supabase.from).toHaveBeenCalledWith('chat_sessions');
    expect(mockUpdateChatSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: mockSubject,
        grade_level: mockGradeLevel,
        ended_at: null,
      })
    );
    expect(mockEqChatSessions).toHaveBeenCalledWith('id', existingSessionId);
    expect(mockInsertChatSessions).not.toHaveBeenCalled(); // No insert for existing session
  });

  it('should save user and AI messages to chat_messages table', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: mockMessage,
        context: { subject: mockSubject, gradeLevel: mockGradeLevel },
      }),
    });

    await POST(request);

    expect(supabase.from).toHaveBeenCalledWith('chat_messages');
    expect(mockInsertChatMessages).toHaveBeenCalledTimes(2);

    expect(mockInsertChatMessages).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sender: 'user',
          content: mockMessage,
        }),
      ])
    );
    expect(mockInsertChatMessages).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sender: 'ai',
          content: mockAiResponse,
          source_references: expect.any(Array),
        }),
      ])
    );
  });

  it('should return the sessionId in the response', async () => {
    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: mockMessage,
        context: { subject: mockSubject, gradeLevel: mockGradeLevel },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty('sessionId');
    expect(typeof data.sessionId).toBe('string');
  });
});
