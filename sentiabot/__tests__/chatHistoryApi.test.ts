import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/chat/history/[sessionId]/route'; 
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase'; // Import Database type

type Mock = ReturnType<typeof vi.fn>; // Define Mock type

// Mock Supabase
const mockSelect: Mock = vi.fn();
const mockEq: Mock = vi.fn(() => ({
  order: vi.fn(() => ({
    data: [], // Default to empty array, will be overridden in tests
    error: null,
  })),
}));
const mockOrder: Mock = vi.fn(() => ({
    data: [], // Default to empty array, will be overridden in tests
    error: null,
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect.mockReturnThis(), // Allow chaining .select()
      eq: mockEq.mockReturnThis(),         // Allow chaining .eq()
      order: mockOrder,                    // Allow chaining .order()
    })),
  },
}));

describe('GET /api/chat/history/[sessionId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnThis(); // Reset mocks for chaining
    mockEq.mockReturnThis();
    mockOrder.mockReturnThis().mockResolvedValue({ data: [], error: null }); // Reset default resolved value
  });

  it('should return 400 if sessionId is missing', async () => {
    const request = new Request('http://localhost/api/chat/history', {
      method: 'GET',
    });

    const response = await GET(request, { params: { sessionId: '' } });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.message).toBe('Session ID is required');
  });

  it('should fetch chat messages from Supabase and return them', async () => {
    const sessionId = 'test-session-id';
    // Use Database types for mock data
    type ChatMessageRow = Database['public']['Tables']['chat_messages']['Row'];
    const mockSupabaseData: ChatMessageRow[] = [
      {
        id: 'msg1',
        session_id: sessionId,
        sender: 'user', // "user" string matches the defined type in supabase.ts
        content: 'Hi there',
        timestamp: '2025-01-01T10:00:00Z',
        source_references: null,
      },
      {
        id: 'msg2',
        session_id: sessionId,
        sender: 'bot', // "bot" string matches the defined type in supabase.ts
        content: 'Hello!',
        timestamp: '2025-01-01T10:01:00Z',
        source_references: ['http://example.com/source1'],
      },
    ];

    mockOrder.mockResolvedValue({ data: mockSupabaseData, error: null }); // Mock Supabase response

    const request = new Request(`http://localhost/api/chat/history/${sessionId}`, {
      method: 'GET',
    });

    const response = await GET(request, { params: { sessionId } });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(supabase.from).toHaveBeenCalledWith('chat_messages');
    expect(mockSelect).toHaveBeenCalledWith('id, session_id, sender, content, timestamp, source_references');
    expect(mockEq).toHaveBeenCalledWith('session_id', sessionId);
    expect(mockOrder).toHaveBeenCalledWith('timestamp', { ascending: true });

    // Ensure the JSON structure matches the expected output of the API route
    expect(json).toEqual([
      {
        id: 'msg1',
        sender: 'user',
        text: 'Hi there',
        timestamp: '2025-01-01T10:00:00Z',
        source: undefined, // Assuming the API transforms source_references
      },
      {
        id: 'msg2',
        sender: 'bot',
        text: 'Hello!',
        timestamp: '2025-01-01T10:01:00Z',
        source: { label: 'Source', url: 'http://example.com/source1' }, // Assuming API transforms
      },
    ]);
  });

  it('should return 500 if Supabase query fails', async () => {
    const sessionId = 'test-session-id';
    const mockError = { message: 'Database error' };
    mockOrder.mockResolvedValue({ data: null, error: mockError }); // Mock Supabase error

    const request = new Request(`http://localhost/api/chat/history/${sessionId}`, {
      method: 'GET',
    });

    const response = await GET(request, { params: { sessionId } });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.message).toBe('Failed to fetch chat history');
    expect(json.error).toBe(mockError.message);
  });
});