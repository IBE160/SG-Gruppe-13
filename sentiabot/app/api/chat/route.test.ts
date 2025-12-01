import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Use `let` to declare, then initialize inside vi.doMock factory
let mockGenerateContent: ReturnType<typeof vi.fn>;

// Use vi.doMock for hoisting, ensuring the mock is ready before module import
vi.doMock('@/lib/gemini', () => {
  mockGenerateContent = vi.fn(); // Initialize mockGenerateContent here
  return {
    geminiModel: {
      generateContent: mockGenerateContent,
    },
  };
});

describe('POST /api/chat', () => {
  beforeEach(() => {
    // Clear mocks for each test
    vi.clearAllMocks();
  });

  it('should return an AI response on success', async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => 'This is a mocked response.' },
    });

    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.aiResponse).toBe('This is a mocked response.');
    expect(mockGenerateContent).toHaveBeenCalledWith('Hello');
  });

  it('should return 400 if message is missing or empty', async () => {
    // Test empty string
    let request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: '' }),
      });
    let response = await POST(request);
    let body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain('non-empty string');
    expect(mockGenerateContent).not.toHaveBeenCalled();

    // Test missing message
    request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    response = await POST(request);
    body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain('non-empty string');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('should return 400 if message exceeds max length', async () => {
    const longMessage = 'a'.repeat(2001); // Assuming MAX_MESSAGE_LENGTH is 2000
    const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: longMessage }),
      });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('exceeds the maximum length');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('should return 500 if the AI call fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('AI go boom'));

    const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Failed to get response from AI');
  });
});
