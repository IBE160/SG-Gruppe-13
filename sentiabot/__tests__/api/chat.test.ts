import { POST } from '@/app/api/chat/route';
import { supabase } from '@/lib/supabase';
import { geminiModel } from '@/lib/gemini';
import { semanticSearch } from '@/lib/knowledgeBaseService';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies
const mockEq = vi.fn(() => ({
  data: [],
  error: null,
}));
const mockUpdate = vi.fn(() => ({
  eq: mockEq,
}));
const mockInsert = vi.fn(() => ({
  data: [],
  error: null,
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
      update: mockUpdate,
    })),
  },
}));

vi.mock('@/lib/gemini', () => ({
  geminiModel: {
    generateContent: vi.fn(() => ({
      response: {
        text: vi.fn(() => 'Mocked AI response'),
      },
    })),
  },
}));

vi.mock('@/lib/knowledgeBaseService', () => ({
  semanticSearch: vi.fn(() => ([])), // Mock to return empty array by default
}));

describe('Chat API Integration - Grade Level Storage (AC: 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEq.mockClear();
    mockUpdate.mockClear();
    mockInsert.mockClear();
  });

  it('should store gradeLevel in chat_sessions when a new session is created', async () => {
    const mockRequest = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello',
        context: { subject: 'biology', gradeLevel: '3' },
        sessionId: null, // Simulate new session
      }),
    });

    await POST(mockRequest);

    // Expect chat_sessions.insert to be called with correct grade_level
    expect(supabase.from).toHaveBeenCalledWith('chat_sessions');
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        user_id: null,
        subject: 'biology',
        grade_level: '3',
      }),
    ]);
  });

  it('should update gradeLevel in chat_sessions when an existing session is used', async () => {
    const existingSessionId = 'existing-session-123';
    const mockRequest = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Another message',
        context: { subject: 'geology', gradeLevel: '5' },
        sessionId: existingSessionId, // Simulate existing session
      }),
    });

    await POST(mockRequest);

    // Expect chat_sessions.update to be called with correct grade_level
    expect(supabase.from).toHaveBeenCalledWith('chat_sessions');
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'geology',
        grade_level: '5',
      })
    );
    expect(mockEq).toHaveBeenCalledWith('id', existingSessionId);
  });

  it('should not update gradeLevel in chat_sessions if it\'s not provided in context', async () => {
    const existingSessionId = 'existing-session-456';
    const mockRequest = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Message without gradeLevel',
        context: { subject: 'history' }, // No gradeLevel provided
        sessionId: existingSessionId,
      }),
    });

    await POST(mockRequest);

    expect(supabase.from).toHaveBeenCalledWith('chat_sessions');
    expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
            subject: 'history',
            grade_level: undefined, // Expect grade_level to be undefined
        })
    );
    expect(mockEq).toHaveBeenCalledWith('id', existingSessionId);

    // For a new session without gradeLevel
    const mockRequestNewSession = new NextRequest('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'New session without gradeLevel',
            context: { subject: 'math' }, // No gradeLevel provided
            sessionId: null,
        }),
    });

    await POST(mockRequestNewSession);

    expect(supabase.from).toHaveBeenCalledWith('chat_sessions');
    expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
            user_id: null,
            subject: 'math',
            grade_level: undefined, // Expect grade_level to be undefined
        }),
    ]);
  });

  it('should include gradeLevel and subject in the Gemini prompt', async () => {
    const mockRequest = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is photosynthesis?',
        context: { subject: 'biology', gradeLevel: '4' },
        sessionId: 'test-session-id',
      }),
    });

    await POST(mockRequest);

    expect(geminiModel.generateContent).toHaveBeenCalledTimes(1);
    const generatedPrompt = (geminiModel.generateContent as Mock).mock.calls[0][0];

    expect(generatedPrompt).toContain('Your responses should be tailored for a student in Grade 4');
    expect(generatedPrompt).toContain('focus on the subject of biology.');
    expect(generatedPrompt).toContain('User\'s Question: What is photosynthesis?');
  });
});