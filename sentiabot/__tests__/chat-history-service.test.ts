// sentiabot/__tests__/chat-history-service.test.ts
import { describe, it, expect } from 'vitest';
import { formatChatHistoryAsText, ChatMessage } from '@/lib/chat-history-service';

describe('chat-history-service', () => {
  describe('formatChatHistoryAsText', () => {
    it('should format a single user message correctly', () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          sender: 'user',
          text: 'Hello there!',
          timestamp: '2025-01-15T10:30:00.000Z',
        },
      ];
      // Note: toLocaleString output varies by locale and timezone.
      // For a robust test, consider mocking Date.now or using a fixed locale/timezone for testing.
      // For simplicity here, we'll use a regex that is flexible enough.
      // Expected output for 'en-US' locale in PST (example, may vary): [1/15/2025, 2:30:00 AM] USER: Hello there!
      const expectedRegex = /\d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2}:\d{2}\] USER: Hello there!/;
      const formattedText = formatChatHistoryAsText(messages);
      expect(formattedText).toMatch(expectedRegex);
      expect(formattedText).toContain("USER: Hello there!");
    });

    it('should format a single bot message with source correctly', () => {
      const messages: ChatMessage[] = [
        {
          id: '2',
          sender: 'bot',
          text: 'The answer is 42.',
          timestamp: '2025-01-15T10:35:00.000Z',
          source: { label: 'Deep Thought', url: 'http://example.com/42' },
        },
      ];
      const expectedRegex = /\d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2}:\d{2}\] BOT: The answer is 42.\n  Source: Deep Thought \(http:\/\/example.com\/42\)/;
      const formattedText = formatChatHistoryAsText(messages);
      expect(formattedText).toMatch(expectedRegex);
      expect(formattedText).toContain("BOT: The answer is 42.");
      expect(formattedText).toContain("Source: Deep Thought (http://example.com/42)");
    });

    it('should format multiple messages correctly, alternating sender', () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          sender: 'user',
          text: 'First message.',
          timestamp: '2025-01-15T11:00:00.000Z',
        },
        {
          id: '2',
          sender: 'bot',
          text: 'Second message with no source.',
          timestamp: '2025-01-15T11:01:00.000Z',
        },
        {
          id: '3',
          sender: 'user',
          text: 'Third message.',
          timestamp: '2025-01-15T11:02:00.000Z',
        },
      ];

      const formattedText = formatChatHistoryAsText(messages);
      expect(formattedText).toContain("USER: First message.");
      expect(formattedText).toContain("BOT: Second message with no source.");
      expect(formattedText).toContain("USER: Third message.");
      // Verify order
      expect(formattedText.indexOf("USER: First message.")).toBeLessThan(formattedText.indexOf("BOT: Second message with no source."));
      expect(formattedText.indexOf("BOT: Second message with no source.")).toBeLessThan(formattedText.indexOf("USER: Third message."));
    });

    it('should handle empty message array', () => {
      const messages: ChatMessage[] = [];
      expect(formatChatHistoryAsText(messages)).toBe('');
    });
  });
});
